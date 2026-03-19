const BASE_URL = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_CLIENT_SECRET!;

  const res = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientId}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status} ${text}`);
  return (JSON.parse(text)).access_token as string;
}

export async function createPayPalInvoiceLink(params: {
  customer_email: string;
  customer_name: string;
  item_name: string;
  amount: number;
  note?: string;
}): Promise<string | null> {
  try {
    const token = await getAccessToken();

    // 1. Create invoice
    const createRes = await fetch(`${BASE_URL}/v2/invoicing/invoices`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        detail: {
          currency_code: 'EUR',
          note: params.note,
          payment_term: { term_type: 'DUE_ON_RECEIPT' },
        },
        primary_recipients: [{
          billing_info: {
            email_address: params.customer_email,
            name: { given_name: params.customer_name },
          },
        }],
        items: [{
          name: params.item_name,
          quantity: '1',
          unit_amount: {
            currency_code: 'EUR',
            value: params.amount.toFixed(2),
          },
        }],
      }),
    });

    const createText = await createRes.text();
    if (!createRes.ok) {
      console.error('[PayPal] Create invoice failed:', createRes.status, createText);
      return null;
    }

    // PayPal v2 returns ID in Location header
    const locationHeader = createRes.headers.get('location');
    const invoiceIdFromHeader = locationHeader?.split('/').pop();
    let invoiceIdFromBody: string | undefined;
    try { invoiceIdFromBody = JSON.parse(createText).id; } catch { /* empty body */ }

    const invoiceId = invoiceIdFromBody || invoiceIdFromHeader;
    if (!invoiceId) {
      console.error('[PayPal] Could not get invoice ID');
      return null;
    }

    // 2. Send invoice — response body contains payer-view URL directly
    const sendRes = await fetch(`${BASE_URL}/v2/invoicing/invoices/${invoiceId}/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ send_to_invoicer: false, send_to_recipient: false }),
    });
    const sendText = await sendRes.text();

    // payer-view is returned directly in the send response body
    try {
      const sendData = JSON.parse(sendText);
      if (sendData.href && sendData.rel === 'payer-view') {
        return sendData.href as string;
      }
    } catch { /* not JSON */ }

    // Fallback: construct payer-view URL from invoice ID
    const isSandbox = BASE_URL.includes('sandbox');
    return `https://www.${isSandbox ? 'sandbox.' : ''}paypal.com/invoice/p/#${invoiceId}`;
  } catch (err) {
    console.error('[PayPal] Invoice error:', err);
    return null;
  }
}
