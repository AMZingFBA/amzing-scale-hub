import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

declare global {
  interface Window {
    CdvPurchase?: any;
  }
}

// ID du produit IAP (doit correspondre à App Store Connect)
const APPLE_SUBSCRIPTION_ID = 'com.amzing.vip.monthly';

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      initializeStore();
    }
  }, []);

  const initializeStore = async () => {
    try {
      console.log('🏪 Initializing Apple StoreKit...');
      
      const { CdvPurchase } = window;
      if (!CdvPurchase) {
        console.error('❌ CdvPurchase plugin not available');
        return;
      }

      const store = CdvPurchase.store;
      console.log('✅ CdvPurchase store object available');
      
      // Enregistrer le produit
      store.register([{
        id: APPLE_SUBSCRIPTION_ID,
        type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
        platform: CdvPurchase.Platform.APPLE_APPSTORE
      }]);

      console.log('📦 Product registered:', APPLE_SUBSCRIPTION_ID);

      // Écouter les mises à jour de produit
      store.when()
        .productUpdated((product: any) => {
          console.log('🔄 Product updated:', {
            id: product.id,
            title: product.title,
            canPurchase: product.canPurchase,
            state: product.state
          });
        });

      // Initialiser le store
      await store.initialize([CdvPurchase.Platform.APPLE_APPSTORE]);
      console.log('✅ Store initialized successfully');
      setIsInitialized(true);
      
      // Vérifier si le produit est disponible
      setTimeout(() => {
        const product = store.get(APPLE_SUBSCRIPTION_ID);
        if (product) {
          console.log('✅ Product loaded:', {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.pricing?.price,
            canPurchase: product.canPurchase
          });
        } else {
          console.warn('⚠️ Product not found after initialization. Check bundle ID and App Store Connect configuration.');
        }
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ Error initializing store:', error);
    }
  };

  return <>{children}</>;
};
