import { Resend } from 'resend';

const FROM = 'Shams Al Bosnia <info@shamsalbosnia.com>';

export interface EmailAttachment {
  filename: string;
  content: string; // base64
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  attachments?: EmailAttachment[]
): Promise<void> {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('[EMAIL] RESEND_API_KEY not set — skipping email to', to);
      return;
    }
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
      ...(attachments && attachments.length > 0 && { attachments }),
    });
  } catch (err) {
    // Never block the reservation on email failure — just log it
    console.error('[EMAIL] Failed to send email to', to, err);
  }
}
