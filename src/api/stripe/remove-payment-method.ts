import { stripe } from './config';
import { supabase } from '../../lib/supabase';

export interface RemovePaymentMethodRequest {
  paymentMethodId: string;
}

export async function removePaymentMethod(req: RemovePaymentMethodRequest, userId: string) {
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

    // Check if this is the default payment method
    if (paymentMethodData.is_default) {
      // Find another payment method to set as default
      const { data: otherMethods, error: methodsError } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userId)
        .neq('stripe_payment_method_id', req.paymentMethodId);

      if (methodsError) {
        console.error('Error fetching other payment methods:', methodsError);
      } else if (otherMethods && otherMethods.length > 0) {
        // Set another payment method as default
        await stripe.customers.update(customerData.stripe_customer_id, {
          invoice_settings: {
            default_payment_method: otherMethods[0].stripe_payment_method_id,
          },
        });

        // Update the payment method in the database
        await supabase
          .from('payment_methods')
          .update({
            is_default: true,
          })
          .eq('stripe_payment_method_id', otherMethods[0].stripe_payment_method_id)
          .eq('user_id', userId);
      }
    }

    // Detach the payment method from the customer
    await stripe.paymentMethods.detach(req.paymentMethodId);

    // Remove the payment method from the database
    const { error: deleteError } = await supabase
      .from('payment_methods')
      .delete()
      .eq('stripe_payment_method_id', req.paymentMethodId)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error removing payment method from database:', deleteError);
      // Continue anyway, as the payment method was detached in Stripe
    }

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Error removing payment method:', error);
    return {
      error: {
        message: error.message || 'Failed to remove payment method',
      },
    };
  }
}
