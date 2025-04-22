import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [planName, setPlanName] = useState<string>('premium');
  
  useEffect(() => {
    // Get plan from URL query parameters
    const params = new URLSearchParams(location.search);
    const plan = params.get('plan');
    
    if (plan) {
      setPlanName(plan);
    }
    
    // Subscription data will be automatically refreshed when the user visits the payment page
    
    // Redirect to payment page after 5 seconds
    const timer = setTimeout(() => {
      navigate('/payment');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-desert-50 dark:bg-night-desert-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-night-desert-800 rounded-lg shadow-desert p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-desert-800 dark:text-desert-100 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-desert-700 dark:text-desert-300 mb-6">
            Thank you for your payment. Your {planName} subscription has been activated successfully.
          </p>
          
          <p className="text-desert-600 dark:text-desert-400 mb-8">
            You will be redirected to your payment dashboard in a few seconds...
          </p>
          
          <button
            onClick={() => navigate('/payment')}
            className="btn-primary w-full"
          >
            Go to Payment Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
