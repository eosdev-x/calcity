import { stripe } from './config';
import { supabase } from '../../lib/supabase';

export interface CreatePaymentIntentRequest {
  amount: number;
  metadata?: Record<string, string>;
}

export async function createPaymentIntent(req: CreatePaymentIntentRequest, userId: string) {
  try {
    // Validate required fields
    if (!req.amount || req.amount <= 0) {
      return {
        error: {
          message: 'Invalid amount. Amount must be greater than 0.',
        },
      };
    }

    // Get or create customer
    let customerId: string;
    
    // Check if customer already exists
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (customerError && customerError.code !== 'PGRST116') {
      console.error('Error fetching customer:', customerError);
      return {
        error: {
          message: 'Failed to fetch customer information',
        },
      };
    }

    if (customerData?.stripe_customer_id) {
      customerId = customerData.stripe_customer_id;
    } else {
      // Get user email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('Error fetching user email:', userError);
        return {
          error: {
            message: 'Failed to fetch user email',
          },
        };
      }

      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: {
          userId,
        },
      });

      customerId = customer.id;

      // Store the customer ID in the database
      const { error: insertError } = await supabase
        .from('customers')
        .insert({
          user_id: userId,
          stripe_customer_id: customerId,
          email: userData.email,
        });

      if (insertError) {
        console.error('Error storing customer ID:', insertError);
        return {
          error: {
            message: 'Failed to store customer information',
          },
        };
      }
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.amount * 100, // Convert to cents
      currency: 'usd',
      customer: customerId,
      metadata: {
        userId,
        ...req.metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Store payment intent in the database for tracking
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        stripe_payment_intent_id: paymentIntent.id,
        amount: req.amount,
        status: paymentIntent.status,
        type: 'one-time',
        description: req.metadata?.description || 'One-time payment',
      });

    if (paymentError) {
      console.error('Error storing payment intent:', paymentError);
      // Continue anyway, as the payment intent was created in Stripe
    }

    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return {
      error: {
        message: error.message || 'Failed to create payment intent',
      },
    };
  }
}
