import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { generateInvoicePDF } from '@/lib/generateInvoicePDF';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const supabase = createSupabaseServerClient();

  const { data: reservation, error } = await supabase
    .from('accommodation_reservations')
    .select('*')
    .eq('id', parseInt(id))
    .single();

  if (error || !reservation) {
    return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
  }

  const itemTypeMap: Record<string, 'Hotel' | 'Apartment' | 'Villa'> = {
    hotel: 'Hotel', apartment: 'Apartment', villa: 'Villa',
  };
  const itemType = itemTypeMap[reservation.type] ?? 'Hotel';
  const invoiceId = `SAB-${new Date().getFullYear()}-${id}`;
  const invoiceDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const pdfBuffer = await generateInvoicePDF({
    invoiceId,
    date: invoiceDate,
    customerName: reservation.customer_name,
    customerEmail: reservation.customer_email,
    customerPhone: reservation.customer_phone ?? undefined,
    itemName: reservation.item_name,
    itemType,
    startDate: reservation.start_date,
    endDate: reservation.end_date,
    persons: reservation.persons ?? undefined,
    basePrice: 0,
    paymentOptions: ['full'],
  });

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Invoice-${invoiceId}.pdf"`,
    },
  });
}
