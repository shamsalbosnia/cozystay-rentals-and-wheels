import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { sendEmail } from '@/lib/email';
import { contactRequestAdminEmail } from '@/lib/emailTemplates';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, subject, message } = body;

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  const { error } = await supabase.from('contact_requests').insert({
    name, email, subject, message, status: 'new',
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify admin
  const { subject: emailSubject, html } = contactRequestAdminEmail({ name, email, subject, message });
  await sendEmail('info@shamsalbosnia.com', emailSubject, html);

  return NextResponse.json({ success: true });
}
