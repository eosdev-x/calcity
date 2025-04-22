import { stripe, STRIPE_PRICE_IDS } from './config';
import { supabase } from '../../lib/supabase';

export interface CreateCheckoutSessionRequest {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

export async function createCheckoutSession(req: CreateCheckoutSessionRequest, userId: string) {
  try {
    // Validate required fields
    if (!req.priceId || !req.successUrl || !req.cancelUrl) {
      return {
        error: {
          message: 'Missing required fields: priceId, successUrl, or cancelUrl',
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
      // Get user email if not provided
      let email = req.customerEmail;
      
      if (!email) {
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

        email = userData.email;
      }

      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        email,
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
          email,
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

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: req.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: req.successUrl,
      cancel_url: req.cancelUrl,
      metadata: {
        userId,
        ...req.metadata,
      },
    });

    return {
      id: session.id,
      url: session.url,
    };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return {
      error: {
        message: error.message || 'Failed to create checkout session',
      },
    };
  }
}
