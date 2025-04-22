import { stripe, STRIPE_WEBHOOK_SECRET } from './config';
import { supabase } from '../../lib/supabase';
import { PaymentStatus } from '../../types/payment';

/**
 * Handles Stripe webhook events
 * This would be called by a serverless function endpoint that receives Stripe webhooks
 */
export async function handleStripeWebhook(
  payload: string,
  signature: string
) {
  try {
    // Verify webhook signature
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return {
        error: {
          message: `Webhook signature verification failed: ${err.message}`,
        },
      };
    }

    // Handle the event based on its type
    switch (event.type) {
      // Payment Intent events
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
        
      // Subscription events
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
        
      // Invoice events
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;
        
      // Customer events
      case 'customer.updated':
        await handleCustomerUpdated(event.data.object);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  } catch (err: any) {
    console.error(`Error handling webhook: ${err.message}`);
    return {
      error: {
        message: `Error handling webhook: ${err.message}`,
      },
    };
  }
}

// Handler for successful payment intents
async function handlePaymentIntentSucceeded(paymentIntent: any) {
  console.log('Payment intent succeeded:', paymentIntent.id);
  
  // Update payment record in database
  const { error } = await supabase
    .from('payments')
    .update({
      status: PaymentStatus.SUCCEEDED,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  if (error) {
    console.error('Error updating payment record:', error);
  }
  
  // If this payment was for a specific entity (e.g., event, business listing),
  // update that entity's payment status
  if (paymentIntent.metadata && paymentIntent.metadata.entityType && paymentIntent.metadata.entityId) {
    const { entityType, entityId } = paymentIntent.metadata;
    
    if (entityType === 'event') {
      await supabase
        .from('events')
        .update({
          payment_status: 'paid',
          is_published: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', entityId);
    } else if (entityType === 'business') {
      await supabase
        .from('businesses')
        .update({
          payment_status: 'paid',
          is_published: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', entityId);
    }
  }
}

// Handler for failed payment intents
async function handlePaymentIntentFailed(paymentIntent: any) {
  console.log('Payment intent failed:', paymentIntent.id);
  
  // Update payment record in database
  const { error } = await supabase
    .from('payments')
    .update({
      status: PaymentStatus.FAILED,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  if (error) {
    console.error('Error updating payment record:', error);
  }
}

// Handler for subscription creation
async function handleSubscriptionCreated(subscription: any) {
  console.log('Subscription created:', subscription.id);
  
  // Get user ID from customer metadata
  const customerResponse = await stripe.customers.retrieve(subscription.customer as string);
  
  // Check if customer is deleted
  if (customerResponse.deleted) {
    console.error('Customer has been deleted');
    return;
  }
  
  // Now we can safely access metadata on a non-deleted customer
  const userId = customerResponse.metadata?.userId;
  
  if (!userId) {
    console.error('No user ID found in customer metadata');
    return;
  }
  
  // Store subscription in database
  const { error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      plan_id: subscription.items.data[0].price.id,
      status: subscription.status,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error storing subscription:', error);
  }
  
  // Update user's subscription tier
  await supabase
    .from('users')
    .update({
      subscription_tier: getPlanTierFromPriceId(subscription.items.data[0].price.id),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
}

// Handler for subscription updates
async function handleSubscriptionUpdated(subscription: any) {
  console.log('Subscription updated:', subscription.id);
  
  // Update subscription in database
  const { error } = await supabase
    .from('subscriptions')
    .update({
      plan_id: subscription.items.data[0].price.id,
      status: subscription.status,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error updating subscription:', error);
    return;
  }
  
  // Get user ID from subscription
  const { data: subscriptionData, error: subscriptionError } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (subscriptionError) {
    console.error('Error fetching subscription user:', subscriptionError);
    return;
  }
  
  // Update user's subscription tier
  await supabase
    .from('users')
    .update({
      subscription_tier: getPlanTierFromPriceId(subscription.items.data[0].price.id),
      updated_at: new Date().toISOString(),
    })
    .eq('id', subscriptionData.user_id);
}

// Handler for subscription deletion
async function handleSubscriptionDeleted(subscription: any) {
  console.log('Subscription deleted:', subscription.id);
  
  // Get user ID from subscription before updating
  const { data: subscriptionData, error: subscriptionError } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (subscriptionError) {
    console.error('Error fetching subscription user:', subscriptionError);
    return;
  }
  
  // Update subscription in database
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      cancel_at_period_end: subscription.cancel_at_period_end,
      ended_at: subscription.ended_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error updating subscription:', error);
    return;
  }
  
  // Update user's subscription tier to free
  await supabase
    .from('users')
    .update({
      subscription_tier: 'free',
      updated_at: new Date().toISOString(),
    })
    .eq('id', subscriptionData.user_id);
}

// Handler for successful invoice payments
async function handleInvoicePaymentSucceeded(invoice: any) {
  console.log('Invoice payment succeeded:', invoice.id);
  
  // Store payment record
  const { error } = await supabase
    .from('payments')
    .insert({
      user_id: null, // Will be updated later
      stripe_payment_intent_id: invoice.payment_intent,
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_paid / 100, // Convert from cents
      status: PaymentStatus.SUCCEEDED,
      type: 'subscription',
      description: `Payment for ${invoice.lines.data[0]?.description || 'subscription'}`,
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error storing invoice payment:', error);
  }
  
  // If this is for a subscription, update the subscription record
  if (invoice.subscription) {
    // Get user ID from subscription
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', invoice.subscription)
      .single();

    if (subscriptionError) {
      console.error('Error fetching subscription user:', subscriptionError);
      return;
    }
    
    // Update the payment record with the user ID
    await supabase
      .from('payments')
      .update({
        user_id: subscriptionData.user_id,
      })
      .eq('stripe_invoice_id', invoice.id);
  }
}

// Handler for failed invoice payments
async function handleInvoicePaymentFailed(invoice: any) {
  console.log('Invoice payment failed:', invoice.id);
  
  // Store payment record
  const { error } = await supabase
    .from('payments')
    .insert({
      user_id: null, // Will be updated later
      stripe_payment_intent_id: invoice.payment_intent,
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_due / 100, // Convert from cents
      status: PaymentStatus.FAILED,
      type: 'subscription',
      description: `Failed payment for ${invoice.lines.data[0]?.description || 'subscription'}`,
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error storing invoice payment:', error);
  }
  
  // If this is for a subscription, update the subscription record
  if (invoice.subscription) {
    // Get user ID from subscription
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', invoice.subscription)
      .single();

    if (subscriptionError) {
      console.error('Error fetching subscription user:', subscriptionError);
      return;
    }
    
    // Update the payment record with the user ID
    await supabase
      .from('payments')
      .update({
        user_id: subscriptionData.user_id,
      })
      .eq('stripe_invoice_id', invoice.id);
    
    // Notify the user about the failed payment (in a real app, this would send an email)
    console.log(`Notifying user ${subscriptionData.user_id} about failed payment`);
  }
}

// Handler for customer updates
async function handleCustomerUpdated(customer: any) {
  console.log('Customer updated:', customer.id);
  
  // Update customer in database
  const { error } = await supabase
    .from('customers')
    .update({
      email: customer.email,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customer.id);

  if (error) {
    console.error('Error updating customer:', error);
  }
}

// Helper function to determine subscription tier from price ID
function getPlanTierFromPriceId(priceId: string): string {
  // This would map Stripe price IDs to your application's subscription tiers
  const priceTierMap: Record<string, string> = {
    'price_premium_monthly': 'premium',
    'price_enterprise_monthly': 'enterprise',
  };
  
  return priceTierMap[priceId] || 'free';
}
