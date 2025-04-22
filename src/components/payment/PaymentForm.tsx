import { useState, FormEvent } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, AlertCircle } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';
import { useAuth } from '../../context/AuthContext';

interface PaymentFormProps {
  amount: number;
  description: string;
  onSuccess?: (paymentIntentId: string) => void;
  onCancel?: () => void;
  metadata?: Record<string, string>;
}

export function PaymentForm({ 
  amount, 
  description, 
  onSuccess, 
  onCancel,
  metadata = {}
}: PaymentFormProps) {
  const { user } = useAuth();
  const { createPaymentIntent } = usePayment();
  const stripe = useStripe();
  const elements = useElements();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      setPaymentError('Card element not found');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Create payment intent if we don't have one yet
      if (!clientSecret) {
        const result = await createPaymentIntent(amount, {
          description,
          ...metadata
        });

        if ('error' in result) {
          throw new Error(result.error.message || 'Failed to create payment intent');
        }

        setClientSecret(result.clientSecret);
      }

      // Confirm card payment
      if (clientSecret) {
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              email: user?.email,
            },
          },
        });

        if (error) {
          throw new Error(error.message || 'Payment failed');
        }

        if (paymentIntent.status === 'succeeded') {
          setPaymentSuccess(true);
          if (onSuccess) {
            onSuccess(paymentIntent.id);
          }
        }
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setPaymentError(err.message || 'An error occurred during payment processing');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle cancellation
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Payment success message */}
      {paymentSuccess ? (
        <div className="p-6 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-800 rounded-lg">
          <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">Payment Successful!</h3>
          <p className="text-green-700 dark:text-green-300 mb-4">
            Your payment of ${amount.toFixed(2)} has been processed successfully.
          </p>
          {onSuccess && (
            <button
              onClick={() => onSuccess('')}
              className="w-full py-2 px-4 bg-desert-500 hover:bg-desert-600 text-white rounded transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-night-desert-900 p-6 rounded-lg shadow-desert">
            <h3 className="text-xl font-bold text-desert-800 dark:text-desert-100 mb-4">
              Payment Details
            </h3>
            
            {/* Payment amount */}
            <div className="mb-6">
              <div className="text-2xl font-bold text-desert-800 dark:text-desert-100">
                ${amount.toFixed(2)}
              </div>
              <div className="text-sm text-desert-600 dark:text-desert-400">
                {description}
              </div>
            </div>
            
            {/* Card element */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-desert-700 dark:text-desert-300 mb-2">
                Card Information
              </label>
              <div className="p-3 border border-desert-300 dark:border-night-desert-600 rounded-md bg-white dark:bg-night-desert-800">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#4B5563',
                        '::placeholder': {
                          color: '#9CA3AF',
                        },
                      },
                      invalid: {
                        color: '#EF4444',
                      },
                    },
                  }}
                />
              </div>
            </div>
            
            {/* Error message */}
            {paymentError && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-red-700 dark:text-red-300">
                  {paymentError}
                </span>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isProcessing}
                className="flex-1 py-2 px-4 border border-desert-300 dark:border-night-desert-600 rounded-md text-desert-700 dark:text-desert-300 hover:bg-desert-50 dark:hover:bg-night-desert-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing || !stripe || !elements}
                className="flex-1 py-2 px-4 bg-desert-500 hover:bg-desert-600 dark:bg-desert-600 dark:hover:bg-desert-700 text-white rounded-md transition-colors disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  'Pay Now'
                )}
              </button>
            </div>
          </div>
          
          {/* Secure payment notice */}
          <div className="text-center text-sm text-desert-600 dark:text-desert-400">
            <p>Payments are securely processed by Stripe.</p>
            <p>Your card details are never stored on our servers.</p>
          </div>
        </form>
      )}
    </div>
  );
}
