import React from 'react';
import { Check } from 'lucide-react';

export function Pricing() {
  const plans = [
    {
      name: "Basic Listing",
      price: "Free",
      features: [
        "Basic business profile",
        "Contact information",
        "Business hours",
        "Map location"
      ]
    },
    {
      name: "Premium",
      price: "$29/month",
      features: [
        "Everything in Basic",
        "Featured in search results",
        "Photo gallery",
        "Special offers section",
        "Customer reviews",
        "Social media links"
      ]
    },
    {
      name: "Enterprise",
      price: "$99/month",
      features: [
        "Everything in Premium",
        "Priority support",
        "Custom branding",
        "Analytics dashboard",
        "Email marketing integration",
        "Multiple locations"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-desert-50 dark:bg-night-desert-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-desert-800 dark:text-desert-100 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-desert-700 dark:text-desert-300 max-w-2xl mx-auto">
            Select the perfect plan for your business and start reaching more customers in California City
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className="card">
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-desert-800 dark:text-desert-100 mb-6">
                {plan.price}
              </p>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-desert-400" />
                    <span className="text-desert-700 dark:text-desert-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="btn-primary w-full">
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}