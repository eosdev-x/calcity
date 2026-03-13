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
      <h2 className="text-2xl font-bold text-on-surface mb-6">
        Payment Methods
      </h2>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-error-container border border-error rounded-xl">
          <p className="text-on-error-container">{error}</p>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-tertiary-container border border-tertiary rounded-xl">
          <p className="text-on-tertiary-container">{successMessage}</p>
        </div>
      )}

      {/* Payment methods list */}
      <div className="bg-surface-container-low rounded-xl shadow-sm overflow-hidden mb-6 border border-outline-variant">
        {isLoading ? (
          <div className="p-6 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-on-surface-variant" />
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="p-6 text-center text-on-surface-variant">
            <p>You don't have any saved payment methods.</p>
          </div>
        ) : (
          <ul className="divide-y divide-outline-variant">
            {paymentMethods.map((method: PaymentMethod) => (
              <li key={method.id} className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4 text-on-surface-variant">
                      {getCardIcon(method.card?.brand)}
                    </div>
                    <div>
                      <div className="font-medium text-on-surface">
                        {method.card?.brand?.charAt(0).toUpperCase() + method.card?.brand?.slice(1) || 'Card'} •••• {method.card?.last4}
                      </div>
                      <div className="text-sm text-on-surface-variant">
                        Expires {formatExpiry(method.card?.expMonth, method.card?.expYear)}
                      </div>
                      {method.isDefault && (
                        <div className="mt-1 flex items-center text-sm text-tertiary">
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
                        className="p-2 text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                        title="Set as default"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleRemovePaymentMethod(method.id)}
                      className="p-2 text-error hover:text-error transition-colors duration-[var(--md-sys-motion-duration-short3)]"
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
      <div className="bg-surface-container-low rounded-xl shadow-sm overflow-hidden border border-outline-variant">
        {showAddCard ? (
          <div className="p-6">
            <h3 className="text-lg font-medium text-on-surface mb-4">
              Add New Payment Method
            </h3>
            
            {/* Card element */}
            <div className="mb-4">
              <div className="p-3 border border-outline rounded-xl bg-surface-container-high">
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
              <div className="mb-4 p-3 bg-error-container border border-error rounded-xl">
                <p className="text-on-error-container">{cardError}</p>
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
                className="flex-1 py-2 px-4 border border-outline rounded-full text-primary hover:bg-surface-container transition-colors duration-[var(--md-sys-motion-duration-short3)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddPaymentMethod}
                disabled={isProcessing || !stripe || !elements}
                className="flex-1 py-2 px-4 bg-primary hover:bg-primary/90 text-on-primary rounded-full transition-colors duration-[var(--md-sys-motion-duration-short3)] disabled:opacity-50"
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
            className="w-full p-6 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            <span>Add New Payment Method</span>
          </button>
        )}
      </div>
    </div>
  );
}
