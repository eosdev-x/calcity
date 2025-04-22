import { stripe } from './config';
import { supabase } from '../../lib/supabase';

export interface SetDefaultPaymentMethodRequest {
  paymentMethodId: string;
}

export async function setDefaultPaymentMethod(req: SetDefaultPaymentMethodRequest, userId: string) {
  try {
    // Validate required fields
    if (!req.paymentMethodId) {
      return {
        error: {
          message: 'Missing required field: paymentMethodId',
        },
      };
    }

    // Verify the payment method belongs to the user
    const { data: paymentMethodData, error: paymentMethodError } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('stripe_payment_method_id', req.paymentMethodId)
      .eq('user_id', userId)
      .single();

    if (paymentMethodError) {
      console.error('Error fetching payment method:', paymentMethodError);
      return {
        error: {
          message: 'Failed to fetch payment method information',
        },
      };
    }

    if (!paymentMethodData) {
      return {
        error: {
          message: 'Payment method not found or does not belong to the user',
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

    // Set the payment method as default in Stripe
    await stripe.customers.update(customerData.stripe_customer_id, {
      invoice_settings: {
        default_payment_method: req.paymentMethodId,
      },
    });

    // Update all payment methods to not be default
    await supabase
      .from('payment_methods')
      .update({
        is_default: false,
      })
      .eq('user_id', userId);

    // Set the specified payment method as default
    const { error: updateError } = await supabase
      .from('payment_methods')
      .update({
        is_default: true,
      })
      .eq('stripe_payment_method_id', req.paymentMethodId)
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating payment method in database:', updateError);
      // Continue anyway, as the payment method was set as default in Stripe
    }

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Error setting default payment method:', error);
    return {
      error: {
        message: error.message || 'Failed to set default payment method',
      },
    };
  }
}
