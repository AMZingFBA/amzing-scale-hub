import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Barre CTA collante en bas d'écran sur mobile uniquement.
 * Apparaît après 400px de scroll, fermable.
 */
const BlogStickyMobileCTA = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] bg-background/95 backdrop-blur border-t border-primary/30 shadow-2xl">
      <div className="flex items-center gap-2">
        <Button asChild size="lg" variant="hero" className="flex-1 font-bold shadow-lg">
          <Link to="/auth?tab=signup">
            <Zap className="w-4 h-4 mr-2" />
            Démarrer AMZing FBA
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Fermer"
          className="p-2 rounded-md text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default BlogStickyMobileCTA;
