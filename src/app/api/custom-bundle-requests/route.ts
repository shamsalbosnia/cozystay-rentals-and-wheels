import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { sendEmail } from '@/lib/email';
import { customBundleRequestEmail } from '@/lib/emailTemplates';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('custom_bundle_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status } = await req.json();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('custom_bundle_requests')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customer_name, customer_email, customer_phone, start_date, end_date, persons, wizard_data } = body;

  if (!customer_name || !customer_email || !start_date || !end_date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('custom_bundle_requests')
    .insert({
      customer_name,
      customer_email,
      customer_phone: customer_phone || null,
      start_date,
      end_date,
      persons: persons || 1,
      wizard_data: wizard_data || null,
      status: 'pending',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send thank-you email (non-blocking)
  const { subject, html } = customBundleRequestEmail({
    customer_name,
    start_date,
    end_date,
    persons: persons || 1,
    customer_phone,
    wizard_data: wizard_data || {},
  });
  void sendEmail(customer_email, subject, html);

  return NextResponse.json(data, { status: 201 });
}
