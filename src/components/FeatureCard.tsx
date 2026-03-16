'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
  to?: string;
  onClick?: () => void;
}

const FeatureCard = ({ icon, title, description, className, to, onClick }: FeatureCardProps) => {
  const cardContent = (
    <>
      <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-sm bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-display font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm font-light leading-relaxed">{description}</p>
    </>
  );

  const cardClasses = cn(
    "glass-card rounded-sm p-6 transition-all duration-300 hover:shadow-md group cursor-pointer border-border/20 hover:border-primary/30", 
    className
  );

  if (to) {
    return (
      <Link href={to} className={cardClasses}>
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={cardClasses} onClick={onClick}>
      {cardContent}
    </div>
  );
};

export default FeatureCard;
