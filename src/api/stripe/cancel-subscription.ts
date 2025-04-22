import { stripe } from './config';
import { supabase } from '../../lib/supabase';

export interface CancelSubscriptionRequest {
  subscriptionId: string;
}

export async function cancelSubscription(req: CancelSubscriptionRequest, userId: string) {
  try {
    // Validate required fields
    if (!req.subscriptionId) {
      return {
        error: {
          message: 'Missing required field: subscriptionId',
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

    // Cancel the subscription in Stripe (at the end of the current period)
    const updatedSubscription = await stripe.subscriptions.update(req.subscriptionId, {
      cancel_at_period_end: true,
    });

    // Update the subscription in the database
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: true,
      })
      .eq('stripe_subscription_id', req.subscriptionId)
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating subscription in database:', updateError);
      // Continue anyway, as the subscription was updated in Stripe
    }

    return {
      success: true,
      subscription: {
        id: updatedSubscription.id,
        customerId: updatedSubscription.customer as string,
        status: updatedSubscription.status,
        planId: subscriptionData.plan_id,
        currentPeriodStart: updatedSubscription.current_period_start,
        currentPeriodEnd: updatedSubscription.current_period_end,
        cancelAtPeriodEnd: updatedSubscription.cancel_at_period_end,
      },
    };
  } catch (error: any) {
    console.error('Error canceling subscription:', error);
    return {
      error: {
        message: error.message || 'Failed to cancel subscription',
      },
    };
  }
}
