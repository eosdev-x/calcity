import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, CreditCard, Trash2, CheckCircle2, PlusCircle } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';
import { PaymentMethod } from '../../types/payment';

export function PaymentMethods() {
  const { 
    paymentMethods, 
    addPaymentMethod, 
    removePaymentMethod, 
    setDefaultPaymentMethod,
    isLoading,
    error
  } = usePayment();
  
  const stripe = useStripe();
  const elements = useElements();
  
  const [showAddCard, setShowAddCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle adding a new payment method
  const handleAddPaymentMethod = async () => {
    if (!stripe || !elements) {
      setCardError('Stripe has not been initialized');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      setCardError('Card element not found');
      return;
    }

    setIsProcessing(true);
    setCardError(null);
    setSuccessMessage(null);

    try {
      // Create payment method with Stripe
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message || 'Failed to create payment method');
      }

      // Add payment method to account
      const result = await addPaymentMethod(paymentMethod.id);

      if ('error' in result) {
        throw new Error(result.error.message || 'Failed to add payment method');
      }

      // Clear the card input
      cardElement.clear();
      setShowAddCard(false);
      setSuccessMessage('Payment method added successfully');
    } catch (err: any) {
      console.error('Payment method error:', err);
      setCardError(err.message || 'An error occurred while adding your payment method');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle removing a payment method
  const handleRemovePaymentMethod = async (paymentMethodId: string) => {
    setSuccessMessage(null);

    try {
      const result = await removePaymentMethod(paymentMethodId);

      if ('error' in result) {
        throw new Error(result.error.message || 'Failed to remove payment method');
      }

      setSuccessMessage('Payment method removed successfully');
    } catch (err: any) {
      console.error('Remove payment method error:', err);
    }
  };

  // Handle setting a payment method as default
  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    setSuccessMessage(null);

    try {
      const result = await setDefaultPaymentMethod(paymentMethodId);

      if ('error' in result) {
        throw new Error(result.error.message || 'Failed to set default payment method');
      }

      setSuccessMessage('Default payment method updated successfully');
    } catch (err: any) {
      console.error('Set default payment method error:', err);
    }
  };

  // Format card expiration date
  const formatExpiry = (month?: number, year?: number) => {
    if (!month || !year) return 'N/A';
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };

  // Get card icon based on brand
  const getCardIcon = (brand?: string) => {
    // In a real application, you might want to use specific icons for each card brand
    return <CreditCard className="w-6 h-6" />;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-desert-800 dark:text-desert-100 mb-6">
        Payment Methods
      </h2>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-800 rounded-md">
          <p className="text-green-700 dark:text-green-300">{successMessage}</p>
        </div>
      )}

      {/* Payment methods list */}
      <div className="bg-white dark:bg-night-desert-900 rounded-lg shadow-desert overflow-hidden mb-6">
        {isLoading ? (
          <div className="p-6 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-desert-500" />
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="p-6 text-center text-desert-600 dark:text-desert-400">
            <p>You don't have any saved payment methods.</p>
          </div>
        ) : (
          <ul className="divide-y divide-desert-200 dark:divide-night-desert-700">
            {paymentMethods.map((method: PaymentMethod) => (
              <li key={method.id} className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 text-desert-700 dark:text-desert-300">
                      {getCardIcon(method.card?.brand)}
                    </div>
                    <div>
                      <div className="font-medium text-desert-800 dark:text-desert-100">
                        {method.card?.brand?.charAt(0).toUpperCase() + method.card?.brand?.slice(1) || 'Card'} •••• {method.card?.last4}
                      </div>
                      <div className="text-sm text-desert-600 dark:text-desert-400">
                        Expires {formatExpiry(method.card?.expMonth, method.card?.expYear)}
                      </div>
                      {method.isDefault && (
                        <div className="mt-1 flex items-center text-sm text-green-600 dark:text-green-400">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Default
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefaultPaymentMethod(method.id)}
                        className="p-2 text-desert-600 hover:text-desert-800 dark:text-desert-400 dark:hover:text-desert-200"
                        title="Set as default"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleRemovePaymentMethod(method.id)}
                      className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Remove payment method"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add new payment method */}
      <div className="bg-white dark:bg-night-desert-900 rounded-lg shadow-desert overflow-hidden">
        {showAddCard ? (
          <div className="p-6">
            <h3 className="text-lg font-medium text-desert-800 dark:text-desert-100 mb-4">
              Add New Payment Method
            </h3>
            
            {/* Card element */}
            <div className="mb-4">
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
            {cardError && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md">
                <p className="text-red-700 dark:text-red-300">{cardError}</p>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddCard(false);
                  setCardError(null);
                }}
                disabled={isProcessing}
                className="flex-1 py-2 px-4 border border-desert-300 dark:border-night-desert-600 rounded-md text-desert-700 dark:text-desert-300 hover:bg-desert-50 dark:hover:bg-night-desert-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddPaymentMethod}
                disabled={isProcessing || !stripe || !elements}
                className="flex-1 py-2 px-4 bg-desert-500 hover:bg-desert-600 dark:bg-desert-600 dark:hover:bg-desert-700 text-white rounded-md transition-colors disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  'Add Payment Method'
                )}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddCard(true)}
            className="w-full p-6 flex items-center justify-center text-desert-600 hover:text-desert-800 dark:text-desert-400 dark:hover:text-desert-200"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            <span>Add New Payment Method</span>
          </button>
        )}
      </div>
    </div>
  );
}
