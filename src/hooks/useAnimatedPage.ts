import { useEffect } from 'react';
import { initAnimateOnScroll } from '@/utils/animateOnScroll';

/**
 * Custom hook to initialize page animations
 * Replaces repetitive animation setup code across pages
 */
export const useAnimatedPage = () => {
  useEffect(() => {
    const cleanup = initAnimateOnScroll();
    return cleanup;
  }, []);
};