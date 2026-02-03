import { useEffect, useRef } from 'react';

/**
 * Hook pour sauvegarder et restaurer la position de scroll d'une page
 * Utilise localStorage avec une clé unique basée sur le chemin de la page
 */
export function useScrollPosition(key: string) {
  const isRestored = useRef(false);

  // Restaurer la position au montage
  useEffect(() => {
    const savedPosition = sessionStorage.getItem(`scroll_${key}`);
    
    if (savedPosition && !isRestored.current) {
      const position = parseInt(savedPosition, 10);
      // Petit délai pour laisser le contenu se charger
      const timer = setTimeout(() => {
        window.scrollTo({ top: position, behavior: 'auto' });
        isRestored.current = true;
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [key]);

  // Sauvegarder la position lors du scroll
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(`scroll_${key}`, String(window.scrollY));
    };

    // Throttle pour éviter trop d'écritures
    let timeoutId: ReturnType<typeof setTimeout>;
    const throttledScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', throttledScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [key]);

  // Fonction pour réinitialiser la position (utile après un refresh manuel)
  const resetPosition = () => {
    sessionStorage.removeItem(`scroll_${key}`);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return { resetPosition };
}
