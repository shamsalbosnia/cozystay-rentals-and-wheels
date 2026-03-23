export const maxDuration = 30; // 30 seconds for PayPal API calls

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { sendEmail } from '@/lib/email';
import { reservationApprovedEmail, reservationRejectedEmail, adminInvoiceNotificationEmail } from '@/lib/emailTemplates';
import { createPayPalInvoiceLink } from '@/lib/paypal';
import { generateInvoicePDF } from '@/lib/generateInvoicePDF';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const supabase = createSupabaseServerClient();

  const { data: existing } = await supabase
    .from('accommodation_reservations')
    .select('*')
    .eq('id', parseInt(id))
    .single();

  const { data, error } = await supabase
    .from('accommodation_reservations')
    .update({ status: body.status, admin_notes: body.admin_notes })
    .eq('id', parseInt(id))
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (existing && body.status && body.status !== existing.status) {
    const itemName = existing.item_name;

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

      // Generate PDF invoice
      const invoiceId = `SAB-${new Date().getFullYear()}-${id}`;
      const invoiceDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const itemTypeMap: Record<string, 'Hotel' | 'Apartment' | 'Villa'> = {
        hotel: 'Hotel', apartment: 'Apartment', villa: 'Villa',
      };
      const pdfItemType = itemTypeMap[existing.type] ?? 'Hotel';
      let pdfAttachment: { filename: string; content: string } | undefined;
      try {
        const pdfBuffer = await generateInvoicePDF({
          invoiceId,
          date: invoiceDate,
          customerName: existing.customer_name,
          customerEmail: existing.customer_email,
          customerPhone: existing.customer_phone ?? undefined,
          itemName,
          itemType: pdfItemType,
          startDate: existing.start_date,
          endDate: existing.end_date,
          persons: existing.persons ?? undefined,
          basePrice,
          paymentOptions: options,
          fullAmount: fullAmount ? parseFloat(fullAmount) : undefined,
          depositAmount: depositAmount ? parseFloat(depositAmount) : undefined,
          remainderAmount: (options.includes('deposit') && basePrice > 0) ? parseFloat((basePrice * 0.90).toFixed(2)) : undefined,
        });
        pdfAttachment = { filename: `Invoice-${invoiceId}.pdf`, content: pdfBuffer.toString('base64') };
      } catch (pdfErr) {
        console.error('[PDF] Failed to generate invoice PDF', pdfErr);
      }

      const attachments = pdfAttachment ? [pdfAttachment] : undefined;

      // Send to customer
      void sendEmail(existing.customer_email, subject, html, attachments);

      // Send copy to admin
      const paymentSummary = options.includes('full') && options.includes('deposit')
        ? `Full: ${fullAmount} EUR / Deposit: ${depositAmount} EUR`
        : options.includes('full')
        ? `Full payment: ${fullAmount} EUR`
        : `Deposit: ${depositAmount} EUR`;
      const { subject: adminSubject, html: adminHtml } = adminInvoiceNotificationEmail({
        customer_name: existing.customer_name,
        customer_email: existing.customer_email,
        customer_phone: existing.customer_phone ?? undefined,
        item_name: itemName,
        item_type: pdfItemType,
        start_date: existing.start_date,
        end_date: existing.end_date,
        base_price: `${basePrice} EUR`,
        invoice_id: invoiceId,
        payment_summary: paymentSummary,
      });
      void sendEmail('info@shamsalbosnia.com', adminSubject, adminHtml, attachments);
    } else if (body.status === 'cancelled') {
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
  const { error } = await supabase.from('accommodation_reservations').delete().eq('id', parseInt(id));

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
