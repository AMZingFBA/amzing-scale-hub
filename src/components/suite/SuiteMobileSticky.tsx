import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 p-4 bg-suite-bg/95 backdrop-blur-md border-t border-white/10">
      <Link
        to="/demander-rappel"
        className="block w-full text-center bg-gradient-to-r from-suite-orange to-suite-orange/80 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-suite-orange/20"
      >
        Demander un rappel
      </Link>
    </div>
  );
};

export default SuiteMobileSticky;
