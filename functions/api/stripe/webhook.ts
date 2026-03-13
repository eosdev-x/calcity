import type Stripe from 'stripe';
import { getStripeClient, getSupabaseAdmin, getTierFromPriceId, StripeEnv } from './_shared';

const formatTimestamp = (timestamp: number | null | undefined) => {
  if (!timestamp) return null;
  return new Date(timestamp * 1000).toISOString();
};

const buildBusinessFlags = (tier: string) => ({
  subscription_tier: tier,
  is_featured: tier !== 'basic',
  is_spotlight: tier === 'spotlight',
});

export async function onRequestPost(context: { request: Request; env: StripeEnv }) {
  const { request, env } = context;
  const stripe = getStripeClient(env);
  const supabase = getSupabaseAdmin(env);

  const signature = request.headers.get('Stripe-Signature');
  if (!signature) {
    console.error('Missing Stripe signature header');
    return new Response('Missing Stripe signature', { status: 200 });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return new Response('Invalid signature', { status: 200 });
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

        await supabase
          .from('customers')
          .upsert({
            user_id: userId,
            stripe_customer_id: stripeCustomerId,
          }, { onConflict: 'user_id' });

        await supabase
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

        await supabase
          .from('businesses')
          .update({
            stripe_subscription_id: subscription.id,
            stripe_customer_id: stripeCustomerId,
            ...buildBusinessFlags(tier),
          })
          .eq('id', businessId);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price?.id || '';
        const tier = getTierFromPriceId(env, priceId);

        const { data: existing } = await supabase
          .from('subscriptions')
          .select('business_id,user_id')
          .eq('stripe_subscription_id', subscription.id)
          .maybeSingle();

        const businessId = subscription.metadata?.businessId || existing?.business_id || null;
        const userId = subscription.metadata?.userId || existing?.user_id || null;

        if (userId) {
          await supabase
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
        } else {
          await supabase
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
        }

        if (businessId) {
          await supabase
            .from('businesses')
            .update({
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              ...buildBusinessFlags(tier),
            })
            .eq('id', businessId);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: existing } = await supabase
          .from('subscriptions')
          .select('business_id')
          .eq('stripe_subscription_id', subscription.id)
          .maybeSingle();

        const businessId = subscription.metadata?.businessId || existing?.business_id || null;

        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('stripe_subscription_id', subscription.id);

        if (businessId) {
          await supabase
            .from('businesses')
            .update({
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              ...buildBusinessFlags('basic'),
            })
            .eq('id', businessId);
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string | null;

        if (subscriptionId) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'past_due',
            })
            .eq('stripe_subscription_id', subscriptionId);
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
