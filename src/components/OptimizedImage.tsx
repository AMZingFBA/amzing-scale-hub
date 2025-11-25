import { ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  loading?: 'lazy' | 'eager';
  className?: string;
}

/**
 * Composant d'image optimisé avec lazy loading automatique
 * 
 * Caractéristiques:
 * - Lazy loading par défaut pour améliorer les performances
 * - Support de loading="eager" pour les images critiques (hero, above-the-fold)
 * - Préserve tous les attributs HTML standards
 * - Améliore le LCP et les Core Web Vitals
 * 
 * Usage:
 * <OptimizedImage src={myImage} alt="Description" /> // lazy par défaut
 * <OptimizedImage src={heroImage} alt="Hero" loading="eager" /> // pour images critiques
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  loading = 'lazy', 
  className,
  ...props 
}: OptimizedImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      {...props}
    />
  );
};

export default OptimizedImage;
