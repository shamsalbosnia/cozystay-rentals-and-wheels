const BRAND_COLOR = '#B8972A';
const BG_COLOR = '#FAF7F2';
const DARK = '#1a1a1a';

function baseLayout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CozyStay Rentals & Wheels</title>
</head>
<body style="margin:0;padding:0;background:#f0ede8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ede8;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:${BRAND_COLOR};padding:28px 40px;text-align:center;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#fff;letter-spacing:1px;">CozyStay Rentals & Wheels</p>
            <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.8);">Your Travel Partner in Bosnia & Herzegovina</p>
          </td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="padding:40px;background:${BG_COLOR};">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#2a2a2a;padding:24px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#aaa;">© ${new Date().getFullYear()} CozyStay Rentals & Wheels. All rights reserved.</p>
            <p style="margin:6px 0 0;font-size:12px;color:#888;">Bosnia & Herzegovina · info@shamsalbosnia.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function thankYouHeader(name: string): string {
  return `
    <h1 style="margin:0 0 8px;font-size:26px;color:${DARK};font-weight:700;">Thank you, ${name}! 🎉</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#666;">We have received your request and will get back to you within <strong style="color:${BRAND_COLOR};">24 hours</strong>.</p>
    <hr style="border:none;border-top:1px solid #e8e0d0;margin:0 0 24px;" />
  `;
}

function detailsTable(rows: { label: string; value: string }[]): string {
  const rowsHtml = rows.map(r => `
    <tr>
      <td style="padding:10px 16px;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;width:140px;">${r.label}</td>
      <td style="padding:10px 16px;font-size:14px;color:${DARK};font-weight:500;">${r.value}</td>
    </tr>
  `).join('');

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;border:1px solid #e8e0d0;margin-bottom:24px;">
      ${rowsHtml}
    </table>
  `;
}

function nextStepsNote(): string {
  return `
    <div style="background:#fff8e8;border-left:4px solid ${BRAND_COLOR};padding:16px 20px;border-radius:4px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:${DARK};">
        Our team will review your request and contact you via email or phone to confirm the details and finalize your booking.
      </p>
    </div>
    <p style="margin:0;font-size:13px;color:#888;">If you have any questions, feel free to reach us at <a href="mailto:info@shamsalbosnia.com" style="color:${BRAND_COLOR};">info@shamsalbosnia.com</a></p>
  `;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── Approved / Rejected ──────────────────────────────────────────────────────

export function reservationApprovedEmail(data: {
  customer_name: string;
  item_name: string;
  start_date: string;
  end_date: string;
  payment_link?: string;
}): { subject: string; html: string } {
  const paymentLink = data.payment_link || 'https://pay.shamsalbosnia.com';
  const content = `
    <h1 style="margin:0 0 8px;font-size:26px;color:${DARK};font-weight:700;">Your booking is confirmed! ✅</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#666;">Great news, <strong>${data.customer_name}</strong>! We are pleased to confirm your reservation.</p>
    <hr style="border:none;border-top:1px solid #e8e0d0;margin:0 0 24px;" />
    ${detailsTable([
      { label: 'Booking', value: data.item_name },
      { label: 'Check-in', value: formatDate(data.start_date) },
      { label: 'Check-out', value: formatDate(data.end_date) },
    ])}
    <p style="margin:0 0 16px;font-size:15px;color:${DARK};">To complete your reservation, please proceed with the payment:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td align="center">
        <a href="${paymentLink}" style="display:inline-block;background:${BRAND_COLOR};color:#fff;text-decoration:none;font-size:16px;font-weight:700;padding:14px 36px;border-radius:8px;letter-spacing:0.5px;">
          Complete Payment →
        </a>
      </td></tr>
    </table>
    <p style="margin:0;font-size:13px;color:#888;">If you have any questions, contact us at <a href="mailto:info@shamsalbosnia.com" style="color:${BRAND_COLOR};">info@shamsalbosnia.com</a></p>
  `;
  return {
    subject: `✅ Booking Confirmed – ${data.item_name}`,
    html: baseLayout(content),
  };
}

export function reservationRejectedEmail(data: {
  customer_name: string;
  item_name: string;
  start_date: string;
  end_date: string;
}): { subject: string; html: string } {
  const content = `
    <h1 style="margin:0 0 8px;font-size:26px;color:${DARK};font-weight:700;">Booking Update</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#666;">Dear <strong>${data.customer_name}</strong>, unfortunately we were unable to confirm your reservation.</p>
    <hr style="border:none;border-top:1px solid #e8e0d0;margin:0 0 24px;" />
    ${detailsTable([
      { label: 'Booking', value: data.item_name },
      { label: 'Check-in', value: formatDate(data.start_date) },
      { label: 'Check-out', value: formatDate(data.end_date) },
    ])}
    <div style="background:#fff3f3;border-left:4px solid #e05252;padding:16px 20px;border-radius:4px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:${DARK};">
        <strong>Reason:</strong> The selected dates are no longer available. Another booking was confirmed for this period.
      </p>
    </div>
    <p style="margin:0 0 16px;font-size:14px;color:#666;">We apologize for the inconvenience. Please feel free to submit a new request with alternative dates — we would love to host you!</p>
    <p style="margin:0;font-size:13px;color:#888;">For assistance, contact us at <a href="mailto:info@shamsalbosnia.com" style="color:${BRAND_COLOR};">info@shamsalbosnia.com</a></p>
  `;
  return {
    subject: `❌ Booking Update – ${data.item_name}`,
    html: baseLayout(content),
  };
}

// ─── Templates ────────────────────────────────────────────────────────────────

export function carReservationEmail(data: {
  customer_name: string;
  car_name: string;
  start_date: string;
  end_date: string;
  customer_phone?: string;
}): { subject: string; html: string } {
  const content = `
    ${thankYouHeader(data.customer_name)}
    <p style="margin:0 0 16px;font-size:15px;color:${DARK};">Here is a summary of your <strong>car rental request</strong>:</p>
    ${detailsTable([
      { label: 'Vehicle', value: data.car_name },
      { label: 'Pick-up Date', value: formatDate(data.start_date) },
      { label: 'Return Date', value: formatDate(data.end_date) },
      ...(data.customer_phone ? [{ label: 'Phone', value: data.customer_phone }] : []),
    ])}
    ${nextStepsNote()}
  `;
  return {
    subject: `🚗 Car Rental Request Received – ${data.car_name}`,
    html: baseLayout(content),
  };
}

export function bundleReservationEmail(data: {
  customer_name: string;
  bundle_title: string;
  start_date: string;
  end_date: string;
  persons: number;
  customer_phone?: string;
}): { subject: string; html: string } {
  const content = `
    ${thankYouHeader(data.customer_name)}
    <p style="margin:0 0 16px;font-size:15px;color:${DARK};">Here is a summary of your <strong>bundle reservation request</strong>:</p>
    ${detailsTable([
      { label: 'Bundle', value: data.bundle_title },
      { label: 'Check-in', value: formatDate(data.start_date) },
      { label: 'Check-out', value: formatDate(data.end_date) },
      { label: 'Guests', value: `${data.persons} person${data.persons > 1 ? 's' : ''}` },
      ...(data.customer_phone ? [{ label: 'Phone', value: data.customer_phone }] : []),
    ])}
    ${nextStepsNote()}
  `;
  return {
    subject: `📦 Bundle Request Received – ${data.bundle_title}`,
    html: baseLayout(content),
  };
}

export function customBundleRequestEmail(data: {
  customer_name: string;
  start_date: string;
  end_date: string;
  persons: number;
  customer_phone?: string;
  wizard_data?: Record<string, unknown>;
}): { subject: string; html: string } {
  const hotel = (data.wizard_data?.selectedHotel as { name?: string } | undefined)?.name;
  const adventures = Array.isArray(data.wizard_data?.selectedAdventures)
    ? (data.wizard_data.selectedAdventures as { name?: string }[]).map(a => a?.name).filter(Boolean).join(', ')
    : null;

  const content = `
    ${thankYouHeader(data.customer_name)}
    <p style="margin:0 0 16px;font-size:15px;color:${DARK};">Here is a summary of your <strong>custom bundle request</strong>:</p>
    ${detailsTable([
      { label: 'Travel Dates', value: `${formatDate(data.start_date)} → ${formatDate(data.end_date)}` },
      { label: 'Guests', value: `${data.persons} person${data.persons > 1 ? 's' : ''}` },
      ...(hotel ? [{ label: 'Hotel', value: hotel }] : []),
      ...(adventures ? [{ label: 'Adventures', value: adventures }] : []),
      ...(data.customer_phone ? [{ label: 'Phone', value: data.customer_phone }] : []),
    ])}
    ${nextStepsNote()}
  `;
  return {
    subject: `🧩 Custom Bundle Request Received`,
    html: baseLayout(content),
  };
}

export function accommodationReservationEmail(data: {
  customer_name: string;
  property_name: string;
  property_type: 'Hotel' | 'Villa' | 'Apartment';
  start_date: string;
  end_date: string;
  customer_phone?: string;
}): { subject: string; html: string } {
  const icons: Record<string, string> = { Hotel: '🏨', Villa: '🏡', Apartment: '🏢' };
  const icon = icons[data.property_type] ?? '🏠';

  const content = `
    ${thankYouHeader(data.customer_name)}
    <p style="margin:0 0 16px;font-size:15px;color:${DARK};">Here is a summary of your <strong>${data.property_type.toLowerCase()} reservation request</strong>:</p>
    ${detailsTable([
      { label: data.property_type, value: data.property_name },
      { label: 'Check-in', value: formatDate(data.start_date) },
      { label: 'Check-out', value: formatDate(data.end_date) },
      ...(data.customer_phone ? [{ label: 'Phone', value: data.customer_phone }] : []),
    ])}
    ${nextStepsNote()}
  `;
  return {
    subject: `${icon} ${data.property_type} Request Received – ${data.property_name}`,
    html: baseLayout(content),
  };
}
