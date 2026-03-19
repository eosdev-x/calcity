import { getBearerToken, getStripeClient, getSupabaseAdmin, getTierFromPriceId, jsonResponse, StripeEnv } from './_shared';

const formatTimestamp = (timestamp: number | null | undefined) => {
  if (!timestamp) return null;
  return new Date(timestamp * 1000).toISOString();
};

const buildBusinessFlags = (tier: string) => ({
  subscription_tier: tier,
  is_featured: tier === 'premium' || tier === 'spotlight',
  is_spotlight: tier === 'spotlight',
});

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
    const newPriceId = body?.newPriceId as string | undefined;
    const businessId = body?.businessId as string | undefined;

    if (!newPriceId || !businessId) {
      return jsonResponse({ error: 'Missing newPriceId or businessId' }, 400);
    }

    const allowedPriceIds = [
      env.STRIPE_BASIC_PRICE_ID,
      env.STRIPE_PREMIUM_PRICE_ID,
      env.STRIPE_SPOTLIGHT_PRICE_ID,
    ];

    if (!allowedPriceIds.includes(newPriceId)) {
      return jsonResponse({ error: 'Invalid priceId' }, 400);
    }

    const { data: business, error: bizError } = await supabase
      .from('businesses')
      .select('id')
      .eq('id', businessId)
      .eq('owner_id', user.id)
      .maybeSingle();

    if (bizError || !business) {
      return jsonResponse({ error: 'Business not found or not owned by user' }, 403);
    }

    const { data: subscriptionRecord, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id,status')
      .eq('business_id', businessId)
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing', 'past_due', 'unpaid'])
      .order('current_period_end', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subscriptionError) {
      console.error('Failed to fetch subscription record:', subscriptionError.message);
      return jsonResponse({ error: 'Failed to fetch subscription record' }, 500);
    }

    const subscriptionId = subscriptionRecord?.stripe_subscription_id;

    if (!subscriptionId) {
      return jsonResponse({ error: 'Active subscription not found' }, 404);
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const subscriptionItemId = subscription.items.data[0]?.id;

    if (!subscriptionItemId) {
      return jsonResponse({ error: 'Subscription item not found' }, 404);
    }

    const updated = await stripe.subscriptions.update(subscriptionId, {
      items: [{ id: subscriptionItemId, price: newPriceId }],
      proration_behavior: 'create_prorations',
    });

    const tier = getTierFromPriceId(env, newPriceId);

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        stripe_price_id: newPriceId,
        tier,
        status: updated.status,
        current_period_start: formatTimestamp(updated.current_period_start),
        current_period_end: formatTimestamp(updated.current_period_end),
        cancel_at_period_end: updated.cancel_at_period_end,
      })
      .eq('stripe_subscription_id', updated.id);

    if (updateError) {
      console.error('Failed to update subscription record:', updateError.message);
      return jsonResponse({ error: 'Failed to update subscription record' }, 500);
    }

    const { error: businessUpdateError } = await supabase
      .from('businesses')
      .update(buildBusinessFlags(tier))
      .eq('id', businessId);

    if (businessUpdateError) {
      console.error('Failed to update business record:', businessUpdateError.message);
      return jsonResponse({ error: 'Failed to update business record' }, 500);
    }

    return jsonResponse({ success: true, tier });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error updating subscription:', message);
    return jsonResponse({ error: 'Failed to update subscription' }, 500);
  }
}
