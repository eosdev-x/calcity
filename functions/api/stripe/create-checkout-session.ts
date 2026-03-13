import { getBearerToken, getStripeClient, getSupabaseAdmin, getTierFromPriceId, jsonResponse, StripeEnv } from './_shared';

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
    const priceId = body?.priceId as string | undefined;
    const businessId = body?.businessId as string | undefined;

    if (!priceId || !businessId) {
      return jsonResponse({ error: 'Missing priceId or businessId' }, 400);
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

    const { data: customerRecord, error: customerError } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (customerError) {
      console.error('Failed to fetch customer record:', customerError);
      return jsonResponse({ error: 'Failed to fetch customer record' }, 500);
    }

    let stripeCustomerId = customerRecord?.stripe_customer_id || null;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
          userId: user.id,
        },
      }, { idempotencyKey: `customer-${user.id}` });

      stripeCustomerId = customer.id;

      const { error: upsertError } = await supabase
        .from('customers')
        .upsert({
          user_id: user.id,
          stripe_customer_id: stripeCustomerId,
        }, { onConflict: 'user_id' });

      if (upsertError) {
        console.error('Failed to store customer record:', upsertError);
        return jsonResponse({ error: 'Failed to store customer record' }, 500);
      }
    }

    const origin = new URL(request.url).origin;
    const tier = getTierFromPriceId(env, priceId);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        businessId,
        userId: user.id,
        tier,
      },
      subscription_data: {
        metadata: {
          businessId,
          userId: user.id,
          tier,
        },
      },
    });

    if (!session.url) {
      return jsonResponse({ error: 'Checkout session did not return a URL' }, 500);
    }

    return jsonResponse({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return jsonResponse({ error: 'Failed to create checkout session' }, 500);
  }
}
