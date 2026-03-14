import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { SEO } from '../../components/SEO';

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
    <div className="min-h-screen bg-surface py-12">
      <SEO
        title={siteConfig.seo.pages.paymentCancelTitle}
        path="/payment/cancel"
        noindex
      />
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-surface-container-low rounded-xl shadow-sm p-8 text-center border border-outline-variant">
          <div className="flex justify-center mb-6">
            <XCircle className="w-16 h-16 text-error" />
          </div>
          
          <h1 className="text-2xl font-bold text-on-surface mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-on-surface-variant mb-6">
            Your payment process was cancelled. No charges have been made.
          </p>
          
          <p className="text-on-surface-variant mb-8">
            You will be redirected to the pricing page in a few seconds...
          </p>
          
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/pricing')}
              className="flex-1 py-2 px-4 bg-secondary-container text-on-secondary-container rounded-full hover:opacity-90 transition-colors duration-[var(--md-sys-motion-duration-short3)]"
            >
              Back to Pricing
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-2 px-4 bg-primary text-on-primary rounded-full hover:bg-primary/90 transition-colors duration-[var(--md-sys-motion-duration-short3)]"
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
