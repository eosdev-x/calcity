import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { SubscriptionPlans } from '../components/payment/SubscriptionPlans';
import { PaymentMethods } from '../components/payment/PaymentMethods';
import { PaymentHistory } from '../components/payment/PaymentHistory';
import { useAuth } from '../context/AuthContext';
import { stripePromise } from '../lib/stripe';

export function Payment() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('subscriptions');
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate(`/auth/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-on-surface mb-8">
        Payment Management
      </h1>

      <Tabs
        defaultValue="subscriptions"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="subscriptions">Subscription Plans</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="payment-history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions">
          <SubscriptionPlans />
        </TabsContent>

        <TabsContent value="payment-methods">
          <Elements stripe={stripePromise}>
            <PaymentMethods />
          </Elements>
        </TabsContent>

        <TabsContent value="payment-history">
          <PaymentHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Payment;
