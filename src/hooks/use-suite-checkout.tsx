import { useState } from 'react';

// Lien de paiement Stripe direct pour AMZing FBA Suite (1499,99€)
const SUITE_PAYMENT_LINK = "https://pay.amzingfba.com/b/28E7sLa1TdaoebF1np00001";

export const useSuiteCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);

  const startCheckout = async () => {
    setIsLoading(true);
    
    // Redirection directe vers le lien de paiement Stripe
    window.location.href = SUITE_PAYMENT_LINK;
  };

  return {
    startCheckout,
    isLoading,
  };
};
