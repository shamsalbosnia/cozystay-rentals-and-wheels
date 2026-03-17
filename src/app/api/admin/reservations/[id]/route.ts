import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { sendEmail } from '@/lib/email';
import { reservationApprovedEmail, reservationRejectedEmail } from '@/lib/emailTemplates';

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
    .update(body)
    .eq('id', parseInt(id))
    .select('*, car:cars(name)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send status email if status changed
  if (existing && body.status && body.status !== existing.status) {
    const itemName = (data.car as { name?: string } | null)?.name || `Car #${existing.car_id}`;

    if (body.status === 'confirmed') {
      const { subject, html } = reservationApprovedEmail({
        customer_name: existing.customer_name,
        item_name: itemName,
        start_date: existing.start_date,
        end_date: existing.end_date,
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
