export const maxDuration = 30; // 30 seconds for PayPal API calls

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { sendEmail } from '@/lib/email';
import { reservationApprovedEmail, reservationRejectedEmail } from '@/lib/emailTemplates';
import { createPayPalInvoiceLink } from '@/lib/paypal';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const supabase = createSupabaseServerClient();

  // Fetch current reservation before update (to get customer info)
  const { data: existing } = await supabase
    .from('car_reservations')
    .select('*')
    .eq('id', parseInt(id))
    .single();

  const { data, error } = await supabase
    .from('car_reservations')
    .update({
      status: body.status,
      ...(body.admin_notes !== undefined && { admin_notes: body.admin_notes }),
    })
    .eq('id', parseInt(id))
    .select('*, car:cars(name)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send status email if status changed
  if (existing && body.status && body.status !== existing.status) {
    const itemName = (data.car as { name?: string } | null)?.name || `Car #${existing.car_id}`;

    if (body.status === 'confirmed') {
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
          customer_email: existing.customer_email,
          customer_name: existing.customer_name,
          item_name: `${itemName} — Full Payment (5% discount)`,
          amount: amt,
          note: `Full payment for ${itemName}. Includes 5% discount. Reservation: ${existing.start_date} → ${existing.end_date}.`,
        }) ?? undefined;
      }
      if (options.includes('deposit') && basePrice > 0) {
        const amt = parseFloat((basePrice * 0.10).toFixed(2));
        depositAmount = `${amt} EUR`;
        depositLink = await createPayPalInvoiceLink({
          customer_email: existing.customer_email,
          customer_name: existing.customer_name,
          item_name: `${itemName} — 10% Deposit`,
          amount: amt,
          note: `10% deposit for ${itemName}. Remaining ${(basePrice * 0.90).toFixed(2)} EUR is due on arrival. Reservation: ${existing.start_date} → ${existing.end_date}.`,
        }) ?? undefined;
      }

      const { subject, html } = reservationApprovedEmail({
        customer_name: existing.customer_name,
        item_name: itemName,
        start_date: existing.start_date,
        end_date: existing.end_date,
        base_price: basePrice > 0 ? `${basePrice} EUR` : undefined,
        full_payment_link: fullLink,
        full_amount: fullAmount,
        deposit_link: depositLink,
        deposit_amount: depositAmount,
        remainder_amount: (options.includes('deposit') && basePrice > 0) ? `${(basePrice * 0.90).toFixed(2)} EUR` : undefined,
      });
      void sendEmail(existing.customer_email, subject, html);
    } else if (body.status === 'cancelled' || body.status === 'rejected') {
      const { subject, html } = reservationRejectedEmail({
        customer_name: existing.customer_name,
        item_name: itemName,
        start_date: existing.start_date,
        end_date: existing.end_date,
      });
      void sendEmail(existing.customer_email, subject, html);
    }
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('car_reservations').delete().eq('id', parseInt(id));

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
