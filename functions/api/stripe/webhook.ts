import type Stripe from 'stripe';
import { getStripeClient, getSupabaseAdmin, getTierFromPriceId, StripeEnv } from './_shared';

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

  const signature = request.headers.get('Stripe-Signature');
  if (!signature) {
    console.error('Missing Stripe signature header');
    return new Response('Missing Stripe signature', { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(payload, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return new Response('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string | null;
        const stripeCustomerId = session.customer as string | null;
        const metadata = session.metadata || {};
        const businessId = metadata.businessId;
        const userId = metadata.userId;

        if (!subscriptionId || !stripeCustomerId || !businessId || !userId) {
          console.error('Missing checkout session metadata or subscription identifiers');
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price?.id || '';
        const tier = getTierFromPriceId(env, priceId);

        const { error: customerUpsertError } = await supabase
          .from('customers')
          .upsert({
            user_id: userId,
            stripe_customer_id: stripeCustomerId,
          }, { onConflict: 'user_id' });

        if (customerUpsertError) {
          console.error('Failed to upsert customer from checkout session:', customerUpsertError);
        }

        const { error: subscriptionUpsertError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            business_id: businessId,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: stripeCustomerId,
            stripe_price_id: priceId,
            tier,
            status: subscription.status,
            current_period_start: formatTimestamp(subscription.current_period_start),
            current_period_end: formatTimestamp(subscription.current_period_end),
            cancel_at_period_end: subscription.cancel_at_period_end,
          }, { onConflict: 'stripe_subscription_id' });

        if (subscriptionUpsertError) {
          console.error('Failed to upsert subscription from checkout session:', subscriptionUpsertError);
        }

        const { error: businessUpdateError } = await supabase
          .from('businesses')
          .update({
            stripe_subscription_id: subscription.id,
            stripe_customer_id: stripeCustomerId,
            ...buildBusinessFlags(tier),
          })
          .eq('id', businessId);
        if (businessUpdateError) {
          console.error('Failed to update business from checkout session:', businessUpdateError);
        }
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price?.id || '';
        const tier = getTierFromPriceId(env, priceId);

        const { data: existing, error: existingError } = await supabase
          .from('subscriptions')
          .select('business_id,user_id')
          .eq('stripe_subscription_id', subscription.id)
          .maybeSingle();

        if (existingError) {
          console.error('Failed to fetch existing subscription mapping:', existingError);
        }

        const businessId = subscription.metadata?.businessId || existing?.business_id || null;
        const userId = subscription.metadata?.userId || existing?.user_id || null;

        if (userId) {
          const { error: subscriptionUpsertError } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              business_id: businessId,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              stripe_price_id: priceId,
              tier,
              status: subscription.status,
              current_period_start: formatTimestamp(subscription.current_period_start),
              current_period_end: formatTimestamp(subscription.current_period_end),
              cancel_at_period_end: subscription.cancel_at_period_end,
            }, { onConflict: 'stripe_subscription_id' });
          if (subscriptionUpsertError) {
            console.error('Failed to upsert subscription from update:', subscriptionUpsertError);
          }
        } else {
          const { error: subscriptionUpdateError } = await supabase
            .from('subscriptions')
            .update({
              business_id: businessId,
              stripe_customer_id: subscription.customer as string,
              stripe_price_id: priceId,
              tier,
              status: subscription.status,
              current_period_start: formatTimestamp(subscription.current_period_start),
              current_period_end: formatTimestamp(subscription.current_period_end),
              cancel_at_period_end: subscription.cancel_at_period_end,
            })
            .eq('stripe_subscription_id', subscription.id);
          if (subscriptionUpdateError) {
            console.error('Failed to update subscription from update:', subscriptionUpdateError);
          }
        }

        if (businessId) {
          const { error: businessUpdateError } = await supabase
            .from('businesses')
            .update({
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              ...buildBusinessFlags(tier),
            })
            .eq('id', businessId);
          if (businessUpdateError) {
            console.error('Failed to update business from subscription update:', businessUpdateError);
          }
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: existing, error: existingError } = await supabase
          .from('subscriptions')
          .select('business_id')
          .eq('stripe_subscription_id', subscription.id)
          .maybeSingle();

        if (existingError) {
          console.error('Failed to fetch existing subscription mapping:', existingError);
        }

        const businessId = subscription.metadata?.businessId || existing?.business_id || null;

        const { error: subscriptionUpdateError } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('stripe_subscription_id', subscription.id);
        if (subscriptionUpdateError) {
          console.error('Failed to update subscription from deletion:', subscriptionUpdateError);
        }

        if (businessId) {
          const { error: businessUpdateError } = await supabase
            .from('businesses')
            .update({
              subscription_tier: 'free',
              stripe_subscription_id: null,
              stripe_customer_id: null,
              is_featured: false,
              is_spotlight: false,
            })
            .eq('id', businessId);
          if (businessUpdateError) {
            console.error('Failed to clear business subscription from deletion:', businessUpdateError);
          }
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string | null;

        if (subscriptionId) {
          const { error: subscriptionUpdateError } = await supabase
            .from('subscriptions')
            .update({
              status: 'past_due',
            })
            .eq('stripe_subscription_id', subscriptionId);
          if (subscriptionUpdateError) {
            console.error('Failed to update subscription from payment failure:', subscriptionUpdateError);
          }
        }
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
  }

  return new Response('ok', { status: 200 });
}
