import { useState, useEffect } from 'react';

const SuiteNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-suite-bg/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-xl md:text-2xl font-bold">
              <span className="text-suite-orange">AMZing</span>
              <span className="text-white"> FBA</span>
              <span className="text-suite-blue ml-1 text-sm font-medium">Suite</span>
            </span>
          </div>

          {/* CTA Button */}
          <button
            onClick={scrollToPricing}
            className="hidden md:block bg-suite-orange hover:bg-suite-orange/90 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-suite-orange/20"
          >
            Débloquer mon accès
          </button>
        </div>
      </div>
    </nav>
  );
};

export default SuiteNavbar;
