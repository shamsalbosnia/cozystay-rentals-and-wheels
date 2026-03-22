import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { sendEmail } from '@/lib/email';
import { contactReplyEmail } from '@/lib/emailTemplates';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { reply } = await req.json();

  if (!reply?.trim()) return NextResponse.json({ error: 'Reply is required' }, { status: 400 });

  const supabase = createSupabaseServerClient();

  const { data: request } = await supabase
    .from('contact_requests')
    .select('*')
    .eq('id', parseInt(id))
    .single();

  if (!request) return NextResponse.json({ error: 'Request not found' }, { status: 404 });

  const { error } = await supabase
    .from('contact_requests')
    .update({ status: 'replied', admin_reply: reply, replied_at: new Date().toISOString() })
    .eq('id', parseInt(id));

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { subject, html } = contactReplyEmail({
    customer_name: request.name,
    subject: request.subject,
    reply,
  });

  await sendEmail(request.email, subject, html);

  return NextResponse.json({ success: true });
}
