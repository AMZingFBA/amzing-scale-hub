import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface InternalLinkProps {
  text: string;
  url: string;
  context?: string;
  className?: string;
}

/**
 * Composant de lien interne optimisé pour le SEO
 * - Attributs aria pour l'accessibilité
 * - Texte descriptif pour les ancres
 * - Prefetch automatique au hover
 */
const InternalLink = ({ text, url, context, className = "" }: InternalLinkProps) => {
  return (
    <Link
      to={url}
      className={`group inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors ${className}`}
      aria-label={context || text}
      // Prefetch au hover pour améliorer la performance perçue
      onMouseEnter={() => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        link.as = 'document';
        document.head.appendChild(link);
      }}
    >
      <span className="font-medium">{text}</span>
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
};

export default InternalLink;
