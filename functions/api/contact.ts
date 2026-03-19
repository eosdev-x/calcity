import { jsonResponse } from './stripe/_shared';

type ContactEnv = {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
};

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  company_url?: string;
  turnstileToken?: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const rateLimitMap = new Map<string, number[]>();

const isRateLimited = (ip: string) => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = (rateLimitMap.get(ip) ?? []).filter((timestamp) => timestamp > windowStart);

  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitMap.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
};

export async function onRequestPost(context: { request: Request; env: ContactEnv }) {
  const { request, env } = context;

  if (!env.RESEND_API_KEY) {
    return jsonResponse({ error: 'Missing RESEND_API_KEY' }, 500);
  }

  if (!env.TURNSTILE_SECRET_KEY) {
    return jsonResponse({ error: 'Missing TURNSTILE_SECRET_KEY' }, 500);
  }

  const body = (await request.json().catch(() => ({}))) as ContactPayload;
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const companyUrl = typeof body.company_url === 'string' ? body.company_url.trim() : '';
  const turnstileToken = typeof body.turnstileToken === 'string' ? body.turnstileToken.trim() : '';

  if (companyUrl) {
    return jsonResponse({ success: true });
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  if (isRateLimited(ip)) {
    return jsonResponse({ error: 'Too many submissions. Please try again later.' }, 429);
  }

  if (!name || !email || !subject || !message) {
    return jsonResponse({ error: 'All fields are required.' }, 400);
  }

  if (!isValidEmail(email)) {
    return jsonResponse({ error: 'Please provide a valid email address.' }, 400);
  }

  if (!turnstileToken) {
    return jsonResponse({ error: 'Turnstile verification failed.' }, 403);
  }

  const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: turnstileToken,
    }),
  });

  const verification = (await verifyResponse.json().catch(() => null)) as { success?: boolean };

  if (!verifyResponse.ok || !verification?.success) {
    return jsonResponse({ error: 'Turnstile verification failed.' }, 403);
  }

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f1f1f;">
      <h2 style="margin: 0 0 16px;">New Contact Form Submission</h2>
      <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin: 0 0 16px;"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <div style="padding: 12px; border-radius: 8px; background: #f5f5f5;">
        ${escapeHtml(message).replace(/\n/g, '<br />')}
      </div>
    </div>
  `;

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'CalCity.info <noreply@calcity.info>',
        to: ['help@tux.st'],
        subject: `Contact Form: ${subject}`,
        reply_to: email,
        html,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text().catch(() => '');
      console.error('Resend error:', resendResponse.status, errorText);
      return jsonResponse({ error: 'Failed to send message.' }, 502);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Contact form error:', message);
    return jsonResponse({ error: 'Failed to send message.' }, 500);
  }
}
