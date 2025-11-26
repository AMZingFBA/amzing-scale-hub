import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Capacitor } from '@capacitor/core';
import { useAuth } from '@/hooks/use-auth';

const AppInstallBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const { isVIP } = useAuth();

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    let detectedPlatform: 'ios' | 'android' | 'desktop' = 'desktop';
    
    // Check if iOS
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      detectedPlatform = 'ios';
    } 
    // Check if Android
    else if (/android/i.test(userAgent)) {
      detectedPlatform = 'android';
    }
    
    setPlatform(detectedPlatform);
    
    // Only show banner on mobile platforms (not desktop) and not to VIP users
    const isNativePlatform = Capacitor.isNativePlatform();
    
    if (!isNativePlatform && !isVIP && detectedPlatform !== 'desktop') {
      // Check if user has dismissed the banner in the last 24 hours
      const dismissedUntil = localStorage.getItem('app-install-banner-dismissed-until');
      
      if (dismissedUntil) {
        const dismissTime = new Date(dismissedUntil).getTime();
        const now = new Date().getTime();
        
        // Show banner again if 24 hours have passed
        if (now > dismissTime) {
          setIsVisible(true);
        }
      } else {
        // First time, show the banner
        setIsVisible(true);
      }
    }
  }, [isVIP]);

  const handleDismiss = () => {
    setIsVisible(false);
    
    // Set expiration to 24 hours from now
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    localStorage.setItem('app-install-banner-dismissed-until', tomorrow.toISOString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Download className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm md:text-base font-medium">
              Téléchargez notre application mobile pour une meilleure expérience !
            </p>
          </div>
          <div className="flex items-center gap-2">
            {platform === 'ios' && (
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <a
                  href="https://apps.apple.com/app/amzing-fba"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  App Store
                </a>
              </Button>
            )}
            {platform === 'android' && (
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <a
                  href="https://play.google.com/store/apps/details?id=app.lovable.amzing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Play
                </a>
              </Button>
            )}
            <button
              onClick={handleDismiss}
              className="text-white hover:text-white/80 transition-colors p-1"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppInstallBanner;