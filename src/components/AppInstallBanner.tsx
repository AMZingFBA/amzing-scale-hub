import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Capacitor } from '@capacitor/core';

const AppInstallBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show banner on web (not in Capacitor app)
    const isNativePlatform = Capacitor.isNativePlatform();
    
    if (!isNativePlatform) {
      // Check if user has previously dismissed the banner
      const dismissed = localStorage.getItem('app-install-banner-dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('app-install-banner-dismissed', 'true');
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
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-primary hover:bg-white/90 hidden sm:inline-flex"
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
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-primary hover:bg-white/90 hidden sm:inline-flex"
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