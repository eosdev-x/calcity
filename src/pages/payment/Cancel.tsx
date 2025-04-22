import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export function PaymentCancel() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to pricing page after 5 seconds
    const timer = setTimeout(() => {
      navigate('/pricing');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-desert-50 dark:bg-night-desert-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-night-desert-800 rounded-lg shadow-desert p-8 text-center">
          <div className="flex justify-center mb-6">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-desert-800 dark:text-desert-100 mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-desert-700 dark:text-desert-300 mb-6">
            Your payment process was cancelled. No charges have been made.
          </p>
          
          <p className="text-desert-600 dark:text-desert-400 mb-8">
            You will be redirected to the pricing page in a few seconds...
          </p>
          
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/pricing')}
              className="flex-1 py-2 px-4 bg-desert-100 hover:bg-desert-200 dark:bg-night-desert-700 dark:hover:bg-night-desert-600 text-desert-800 dark:text-desert-100 rounded transition-colors"
            >
              Back to Pricing
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-2 px-4 bg-desert-500 hover:bg-desert-600 dark:bg-desert-600 dark:hover:bg-desert-700 text-white rounded transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentCancel;
