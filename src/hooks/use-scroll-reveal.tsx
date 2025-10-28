import { useEffect, useRef, useState } from "react";

export type AnimationType = 
  | "fade-up" 
  | "fade-down" 
  | "fade-left" 
  | "fade-right" 
  | "scale" 
  | "rotate" 
  | "slide-rotate";

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  animation?: AnimationType;
}

export const useScrollReveal = (options: ScrollRevealOptions = {}) => {
  const { threshold = 0.1, rootMargin = "0px", delay = 0, animation = "fade-up" } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          // Add delay before triggering animation
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, delay, isVisible]);

  return { ref, isVisible, animation };
};
