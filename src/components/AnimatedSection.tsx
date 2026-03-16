
import { useEffect, useRef, ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-left' | 'fade-right' | 'fade-down';
  delay?: number;
}

const AnimatedSection = ({ 
  children, 
  className = '',
  animation = 'fade-up',
  delay = 0
}: AnimatedSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            section.classList.add('in-view');
          }, delay);
          observer.unobserve(section);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );
    
    observer.observe(section);
    
    return () => {
      if (section) observer.unobserve(section);
    };
  }, [delay]);
  
  return (
    <div 
      ref={sectionRef} 
      data-animate={animation}
      className={className}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
