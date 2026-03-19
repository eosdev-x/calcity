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

    const body = await request.json().catch(() => ({}));
    const subscriptionId = body?.subscriptionId as string | undefined;

    if (!subscriptionId) {
      return jsonResponse({ error: 'Missing subscriptionId' }, 400);
    }

    const { data: subscriptionRecord, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('stripe_subscription_id', subscriptionId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (subscriptionError) {
      console.error('Failed to verify subscription ownership:', subscriptionError.message);
      return jsonResponse({ error: 'Failed to verify subscription ownership' }, 500);
    }

    if (!subscriptionRecord) {
      return jsonResponse({ error: 'Subscription not found' }, 404);
    }

    const updated = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: updated.cancel_at_period_end,
        status: updated.status,
      })
      .eq('stripe_subscription_id', subscriptionId);

    if (updateError) {
      console.error('Failed to update subscription record:', updateError.message);
      return jsonResponse({ error: 'Failed to update subscription record' }, 500);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error canceling subscription:', message);
    return jsonResponse({ error: 'Failed to cancel subscription' }, 500);
  }
}
