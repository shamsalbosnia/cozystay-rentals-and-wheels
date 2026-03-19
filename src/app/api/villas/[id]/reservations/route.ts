import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { sendEmail } from '@/lib/email';
import { accommodationReservationEmail } from '@/lib/emailTemplates';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { customer_name, customer_email, customer_phone, start_date, end_date, persons, item_name } = body;

  if (!customer_name || !customer_email || !start_date || !end_date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (new Date(end_date) <= new Date(start_date)) {
    return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('accommodation_reservations')
    .insert({
      type: 'villa',
      item_id: parseInt(id),
      item_name: item_name || `Villa #${id}`,
      customer_name,
      customer_email,
      customer_phone: customer_phone || null,
      start_date,
      end_date,
      persons: persons || 1,
      status: 'pending',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { subject, html } = accommodationReservationEmail({
    customer_name,
    property_name: item_name || `Villa #${id}`,
    property_type: 'Villa',
    start_date,
    end_date,
    customer_phone,
  });
  void sendEmail(customer_email, subject, html);

  return NextResponse.json(data, { status: 201 });
}
