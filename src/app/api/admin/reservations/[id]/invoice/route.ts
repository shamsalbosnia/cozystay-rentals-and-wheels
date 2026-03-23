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
    .from('car_reservations')
    .select('*, car:cars(name)')
    .eq('id', parseInt(id))
    .single();

  if (error || !reservation) {
    return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
  }

  const itemName = (reservation.car as { name?: string } | null)?.name || `Car #${reservation.car_id}`;
  const invoiceId = `SAB-${new Date().getFullYear()}-${id}`;
  const invoiceDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const basePrice = parseFloat(reservation.admin_notes?.match(/Price: ([\d.]+)/)?.[1] ?? '0') || 0;

  const pdfBuffer = await generateInvoicePDF({
    invoiceId,
    date: invoiceDate,
    customerName: reservation.customer_name,
    customerEmail: reservation.customer_email,
    customerPhone: reservation.customer_phone ?? undefined,
    itemName,
    itemType: 'Car',
    startDate: reservation.start_date,
    endDate: reservation.end_date,
    basePrice,
    paymentOptions: ['full'],
  });

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Invoice-${invoiceId}.pdf"`,
    },
  });
}
