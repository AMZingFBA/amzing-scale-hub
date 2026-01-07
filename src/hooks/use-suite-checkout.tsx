import { useState } from 'react';

// Lien de paiement systeme.io pour AMZing FBA Suite (700€/mois ou ~64€/mois x12)
const SUITE_PAYMENT_LINK = "https://amzingfba26.systeme.io/67172439";

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
