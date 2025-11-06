import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import 'cordova-plugin-purchase';

declare global {
  interface Window {
    CdvPurchase?: any;
  }
}

// ID du produit IAP (doit correspondre à App Store Connect)
const APPLE_SUBSCRIPTION_ID = 'com.amzing.vip.monthly';

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      initializeStore();
    }
  }, []);

  const initializeStore = async () => {
    try {
      console.log('🏪 [StoreProvider] Initializing Apple StoreKit...');
      console.log('🏪 [StoreProvider] Platform:', Capacitor.getPlatform());
      console.log('🏪 [StoreProvider] Is native:', Capacitor.isNativePlatform());
      
      // Attendre que le plugin soit disponible
      let attempts = 0;
      while (!window.CdvPurchase && attempts < 10) {
        console.log(`🏪 [StoreProvider] Waiting for CdvPurchase plugin... (attempt ${attempts + 1})`);
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }

      const { CdvPurchase } = window;
      if (!CdvPurchase) {
        console.error('❌ [StoreProvider] CdvPurchase plugin not available after waiting');
        return;
      }

      console.log('✅ [StoreProvider] CdvPurchase plugin loaded');
      const store = CdvPurchase.store;
      
      // Enregistrer le produit AVANT l'initialisation
      console.log('📦 [StoreProvider] Registering product:', APPLE_SUBSCRIPTION_ID);
      store.register([{
        id: APPLE_SUBSCRIPTION_ID,
        type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
        platform: CdvPurchase.Platform.APPLE_APPSTORE
      }]);

      // Écouter les mises à jour de produit
      store.when()
        .productUpdated((product: any) => {
          console.log('🔄 [StoreProvider] Product updated:', {
            id: product.id,
            title: product.title,
            canPurchase: product.canPurchase,
            state: product.state,
            owned: product.owned
          });
        });

      // Initialiser le store
      console.log('🚀 [StoreProvider] Initializing store...');
      await store.initialize([CdvPurchase.Platform.APPLE_APPSTORE]);
      console.log('✅ [StoreProvider] Store initialized');
      
      // Attendre que le produit soit chargé
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const product = store.get(APPLE_SUBSCRIPTION_ID);
      if (product) {
        console.log('✅ [StoreProvider] Product loaded successfully:', {
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.pricing?.price,
          canPurchase: product.canPurchase,
          state: product.state
        });
      } else {
        console.error('❌ [StoreProvider] Product NOT found:', APPLE_SUBSCRIPTION_ID);
        console.error('⚠️ [StoreProvider] Vérifications nécessaires:');
        console.error('  1. Bundle ID dans Xcode doit être: com.amzing.app');
        console.error('  2. Produit créé dans App Store Connect avec ID:', APPLE_SUBSCRIPTION_ID);
        console.error('  3. Certificats et provisioning profiles corrects');
        console.error('  4. Compte de test sandbox configuré sur l\'appareil');
      }
      
    } catch (error: any) {
      console.error('❌ [StoreProvider] Error initializing store:', error);
    }
  };

  return <>{children}</>;
};
