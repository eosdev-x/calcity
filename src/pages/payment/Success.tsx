import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { SEO } from '../../components/SEO';

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
    <div className="min-h-screen bg-surface py-12">
      <SEO
        title={siteConfig.seo.pages.paymentSuccessTitle}
        path="/payment/success"
        noindex
      />
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-surface-container-low rounded-xl shadow-sm p-8 text-center border border-outline-variant">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-tertiary" />
          </div>
          
          <h1 className="text-2xl font-bold text-on-surface mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-on-surface-variant mb-6">
            Thank you for your payment. Your {planName} subscription has been activated successfully.
          </p>
          
          <p className="text-on-surface-variant mb-8">
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
