import { useState, useEffect } from 'react';

const SuiteMobileSticky = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero section (approximately 100vh)
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 p-4 bg-suite-bg/95 backdrop-blur-md border-t border-white/10">
      <button
        onClick={scrollToPricing}
        className="w-full bg-gradient-to-r from-suite-orange to-suite-orange/80 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-suite-orange/20"
      >
        Accès à vie — 1 499,99 €
      </button>
    </div>
  );
};

export default SuiteMobileSticky;
