export const maxDuration = 30;

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { sendEmail } from '@/lib/email';
import { reservationApprovedEmail } from '@/lib/emailTemplates';
import { createPayPalInvoiceLink } from '@/lib/paypal';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const supabase = createSupabaseServerClient();

  const { data: reservation } = await supabase
    .from('car_reservations')
    .select('*, car:cars(name)')
    .eq('id', parseInt(id))
    .single();

  if (!reservation) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });

  const itemName = (reservation.car as { name?: string } | null)?.name || `Car #${reservation.car_id}`;
  const basePrice = parseFloat(body.price) || 0;
  const options = (body.payment_options as ('full' | 'deposit')[] | undefined) ?? [];

  let fullLink: string | undefined;
  let fullAmount: string | undefined;
  let depositLink: string | undefined;
  let depositAmount: string | undefined;

  if (options.includes('full') && basePrice > 0) {
    const amt = parseFloat((basePrice * 0.95).toFixed(2));
    fullAmount = `${amt} EUR`;
    fullLink = await createPayPalInvoiceLink({
      customer_email: reservation.customer_email,
      customer_name: reservation.customer_name,
      item_name: `${itemName} — Full Payment (5% discount)`,
      amount: amt,
      note: `Full payment for ${itemName}. Includes 5% discount. Reservation: ${reservation.start_date} → ${reservation.end_date}.`,
    }) ?? undefined;
  }
  if (options.includes('deposit') && basePrice > 0) {
    const amt = parseFloat((basePrice * 0.10).toFixed(2));
    depositAmount = `${amt} EUR`;
    depositLink = await createPayPalInvoiceLink({
      customer_email: reservation.customer_email,
      customer_name: reservation.customer_name,
      item_name: `${itemName} — 10% Deposit`,
      amount: amt,
      note: `10% deposit for ${itemName}. Remaining ${(basePrice * 0.90).toFixed(2)} EUR is due on arrival. Reservation: ${reservation.start_date} → ${reservation.end_date}.`,
    }) ?? undefined;
  }

  const { subject, html } = reservationApprovedEmail({
    customer_name: reservation.customer_name,
    item_name: itemName,
    start_date: reservation.start_date,
    end_date: reservation.end_date,
    base_price: basePrice > 0 ? `${basePrice} EUR` : undefined,
    full_payment_link: fullLink,
    full_amount: fullAmount,
    deposit_link: depositLink,
    deposit_amount: depositAmount,
    remainder_amount: (options.includes('deposit') && basePrice > 0) ? `${(basePrice * 0.90).toFixed(2)} EUR` : undefined,
  });

  await sendEmail(reservation.customer_email, subject, html);

  return NextResponse.json({ success: true });
}
