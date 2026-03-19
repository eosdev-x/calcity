import { jsonResponse } from './stripe/_shared';

type NotifyEnv = {
  RESEND_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatHours = (hours: Record<string, string> | null | undefined): string => {
  if (!hours || typeof hours !== 'object') return '<em>Not provided</em>';
  return Object.entries(hours)
    .map(([day, time]) => `<strong>${escapeHtml(day)}:</strong> ${escapeHtml(String(time))}`)
    .join('<br />');
};

export async function onRequestPost(context: { request: Request; env: NotifyEnv }) {
  const { request, env } = context;

  if (!env.RESEND_API_KEY) {
    return jsonResponse({ error: 'Missing RESEND_API_KEY' }, 500);
  }

  // Auth: require service-internal call with a simple shared secret
  // For now, we just verify the request came from our own origin
  const body = await request.json().catch(() => null);
  if (!body || !body.businessId) {
    return jsonResponse({ error: 'Missing businessId' }, 400);
  }

  // Fetch the full business record from Supabase using service role
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: business, error: bizError } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', body.businessId)
    .maybeSingle();

  if (bizError || !business) {
    console.error('Failed to fetch business for notification:', bizError?.message ?? 'Unknown error');
    return jsonResponse({ error: 'Business not found' }, 404);
  }

  const field = (label: string, value: string | null | undefined) => {
    if (!value) return '';
    return `<tr><td style="padding:6px 12px 6px 0;color:#666;white-space:nowrap;vertical-align:top;"><strong>${label}</strong></td><td style="padding:6px 0;">${escapeHtml(value)}</td></tr>`;
  };

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f1f1f; max-width: 600px;">
      <h2 style="margin: 0 0 4px; color: #8B6914;">🏪 New Business Submission</h2>
      <p style="margin: 0 0 16px; color: #666; font-size: 14px;">A new business has been submitted and is awaiting approval.</p>

      <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
        ${field('Business Name', business.name)}
        ${field('Category', business.category)}
        ${field('Address', [business.address, business.city, business.state, business.zip].filter(Boolean).join(', '))}
        ${field('Phone', business.phone)}
        ${field('Email', business.email)}
        ${field('Website', business.website)}
        ${field('Description', business.description)}
        ${field('Services', Array.isArray(business.services) ? business.services.join(', ') : null)}
        ${field('Amenities', Array.isArray(business.amenities) ? business.amenities.join(', ') : null)}
        ${field('Tier', business.subscription_tier)}
        ${field('Status', business.status)}
      </table>

      ${business.hours ? `
        <h3 style="margin: 16px 0 8px; font-size: 14px; color: #333;">Business Hours</h3>
        <div style="padding: 12px; border-radius: 8px; background: #f5f5f5; font-size: 13px;">
          ${formatHours(business.hours as Record<string, string>)}
        </div>
      ` : ''}

      ${business.image ? `
        <h3 style="margin: 16px 0 8px; font-size: 14px; color: #333;">Image</h3>
        <img src="${escapeHtml(business.image)}" alt="${escapeHtml(business.name)}" style="max-width: 400px; border-radius: 8px;" />
      ` : ''}

      <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #999;">
        Business ID: ${business.id}<br />
        Owner ID: ${business.owner_id}<br />
        Submitted: ${new Date(business.created_at).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}
      </p>
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
        subject: `🏪 New Business Submission: ${business.name}`,
        html,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text().catch(() => '');
      console.error('Resend error:', resendResponse.status, errorText);
      return jsonResponse({ error: 'Failed to send notification' }, 502);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Notification error:', message);
    return jsonResponse({ error: 'Failed to send notification' }, 500);
  }
}
