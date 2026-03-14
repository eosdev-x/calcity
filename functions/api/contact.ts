import { jsonResponse } from './stripe/_shared';

type ContactEnv = {
  RESEND_API_KEY: string;
};

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export async function onRequestPost(context: { request: Request; env: ContactEnv }) {
  const { request, env } = context;

  if (!env.RESEND_API_KEY) {
    return jsonResponse({ error: 'Missing RESEND_API_KEY' }, 500);
  }

  const body = (await request.json().catch(() => ({}))) as ContactPayload;
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!name || !email || !subject || !message) {
    return jsonResponse({ error: 'All fields are required.' }, 400);
  }

  if (!isValidEmail(email)) {
    return jsonResponse({ error: 'Please provide a valid email address.' }, 400);
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
    console.error('Contact form error:', error);
    return jsonResponse({ error: 'Failed to send message.' }, 500);
  }
}
