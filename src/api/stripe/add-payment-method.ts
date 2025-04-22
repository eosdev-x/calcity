import { stripe } from './config';
import { supabase } from '../../lib/supabase';

export interface AddPaymentMethodRequest {
  paymentMethodId: string;
}

export async function addPaymentMethod(req: AddPaymentMethodRequest, userId: string) {
  try {
    // Validate required fields
    if (!req.paymentMethodId) {
      return {
        error: {
          message: 'Missing required field: paymentMethodId',
        },
      };
    }

    // Get customer ID
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (customerError) {
      console.error('Error fetching customer:', customerError);
      return {
        error: {
          message: 'Failed to fetch customer information',
        },
      };
    }

    if (!customerData?.stripe_customer_id) {
      return {
        error: {
          message: 'Customer not found',
        },
      };
    }

    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(req.paymentMethodId, {
      customer: customerData.stripe_customer_id,
    });

    // Get payment method details
    const paymentMethod = await stripe.paymentMethods.retrieve(req.paymentMethodId);

    // Store payment method in the database
    const { error: insertError } = await supabase
      .from('payment_methods')
      .insert({
        user_id: userId,
        stripe_payment_method_id: paymentMethod.id,
        type: paymentMethod.type,
        card_details: paymentMethod.type === 'card' ? {
          brand: paymentMethod.card?.brand,
          last4: paymentMethod.card?.last4,
          exp_month: paymentMethod.card?.exp_month,
          exp_year: paymentMethod.card?.exp_year,
        } : null,
        is_default: false,
      });

    if (insertError) {
      console.error('Error storing payment method:', insertError);
      // Continue anyway, as the payment method was attached in Stripe
    }

    // If this is the first payment method, set it as default
    const { data: existingMethods, error: methodsError } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId);

    if (methodsError) {
      console.error('Error fetching payment methods:', methodsError);
    } else if (existingMethods.length === 1) {
      // This is the first payment method, set it as default
      await stripe.customers.update(customerData.stripe_customer_id, {
        invoice_settings: {
          default_payment_method: paymentMethod.id,
        },
      });

      // Update the payment method in the database
      await supabase
        .from('payment_methods')
        .update({
          is_default: true,
        })
        .eq('stripe_payment_method_id', paymentMethod.id)
        .eq('user_id', userId);
    }

    return {
      success: true,
      paymentMethod: {
        id: paymentMethod.id,
        type: paymentMethod.type,
        card: paymentMethod.type === 'card' ? {
          brand: paymentMethod.card?.brand || '',
          last4: paymentMethod.card?.last4 || '',
          expMonth: paymentMethod.card?.exp_month || 0,
          expYear: paymentMethod.card?.exp_year || 0,
        } : undefined,
      },
    };
  } catch (error: any) {
    console.error('Error adding payment method:', error);
    return {
      error: {
        message: error.message || 'Failed to add payment method',
      },
    };
  }
}
