import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

const STORAGE_KEY = 'registration_source';

export const getRegistrationSource = (): string => {
  // Check if we're on native app
  if (Capacitor.isNativePlatform()) {
    return 'App';
  }
  
  // Check localStorage for stored UTM source
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return stored;
  }
  
  return 'site';
};

export const useRegistrationSource = () => {
  useEffect(() => {
    // Don't track on native apps
    if (Capacitor.isNativePlatform()) {
      return;
    }

    // Check URL for utm_source parameter
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    
    if (utmSource) {
      // Map utm_source to our categories
      let source = 'site';
      
      if (utmSource.toLowerCase() === 'instagram' || utmSource.toLowerCase() === 'insta') {
        source = 'Instagram';
      } else if (utmSource.toLowerCase() === 'tiktok' || utmSource.toLowerCase() === 'tik-tok') {
        source = 'TikTok';
      } else if (utmSource.toLowerCase() === 'referral') {
        source = 'Referral';
      } else {
        // Store the raw utm_source if it doesn't match known sources
        source = utmSource;
      }
      
      // Store in localStorage (persists until signup)
      localStorage.setItem(STORAGE_KEY, source);
      console.log('[Registration Source] Captured:', source);
    }
  }, []);

  return getRegistrationSource();
};

export const clearRegistrationSource = () => {
  localStorage.removeItem(STORAGE_KEY);
};
