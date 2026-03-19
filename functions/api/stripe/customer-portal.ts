import { getBearerToken, getStripeClient, getSupabaseAdmin, jsonResponse, StripeEnv } from './_shared';

export async function onRequestPost(context: { request: Request; env: StripeEnv }) {
  const { request, env } = context;
  const stripe = getStripeClient(env);
  const supabase = getSupabaseAdmin(env);

  try {
    const token = getBearerToken(request);
    if (!token) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const { data: customerRecord, error: customerError } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (customerError) {
      console.error('Failed to fetch customer record:', customerError.message);
      return jsonResponse({ error: 'Failed to fetch customer record' }, 500);
    }

    if (!customerRecord?.stripe_customer_id) {
      return jsonResponse({ error: 'Stripe customer not found' }, 404);
    }

    const origin = new URL(request.url).origin;
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerRecord.stripe_customer_id,
      return_url: `${origin}/payment`,
    });

    return jsonResponse({ url: portalSession.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error creating customer portal session:', message);
    return jsonResponse({ error: 'Failed to create customer portal session' }, 500);
  }
}
