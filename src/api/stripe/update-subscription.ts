import { stripe } from './config';
import { supabase } from '../../lib/supabase';

export interface UpdateSubscriptionRequest {
  subscriptionId: string;
  newPriceId: string;
}

export async function updateSubscription(req: UpdateSubscriptionRequest, userId: string) {
  try {
    // Validate required fields
    if (!req.subscriptionId || !req.newPriceId) {
      return {
        error: {
          message: 'Missing required fields: subscriptionId or newPriceId',
        },
      };
    }

    // Verify the subscription belongs to the user
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('stripe_subscription_id', req.subscriptionId)
      .eq('user_id', userId)
      .single();

    if (subscriptionError) {
      console.error('Error fetching subscription:', subscriptionError);
      return {
        error: {
          message: 'Failed to fetch subscription information',
        },
      };
    }

    if (!subscriptionData) {
      return {
        error: {
          message: 'Subscription not found or does not belong to the user',
        },
      };
    }

    // Update the subscription in Stripe
    const subscription = await stripe.subscriptions.retrieve(req.subscriptionId);
    
    // Update the subscription with the new price
    const updatedSubscription = await stripe.subscriptions.update(req.subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: req.newPriceId,
        },
      ],
      proration_behavior: 'create_prorations',
    });

    // Update the subscription in the database
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        plan_id: req.newPriceId,
        status: updatedSubscription.status,
        current_period_start: updatedSubscription.current_period_start,
        current_period_end: updatedSubscription.current_period_end,
        cancel_at_period_end: updatedSubscription.cancel_at_period_end,
      })
      .eq('stripe_subscription_id', req.subscriptionId)
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating subscription in database:', updateError);
      // Continue anyway, as the subscription was updated in Stripe
    }

    return {
      subscription: {
        id: updatedSubscription.id,
        customerId: updatedSubscription.customer as string,
        status: updatedSubscription.status,
        planId: req.newPriceId,
        currentPeriodStart: updatedSubscription.current_period_start,
        currentPeriodEnd: updatedSubscription.current_period_end,
        cancelAtPeriodEnd: updatedSubscription.cancel_at_period_end,
      },
    };
  } catch (error: any) {
    console.error('Error updating subscription:', error);
    return {
      error: {
        message: error.message || 'Failed to update subscription',
      },
    };
  }
}
