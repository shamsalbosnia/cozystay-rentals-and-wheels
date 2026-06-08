'use client';

import { ShieldCheck, Tag, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const PILLARS = [
  {
    icon: Tag,
    titleKey: "trust.price.title",
    titleFallback: "Best Price Guaranteed",
    descKey: "trust.price.desc",
    descFallback: "We match any lower price you find — no questions asked.",
  },
  {
    icon: ShieldCheck,
    titleKey: "trust.fees.title",
    titleFallback: "No Hidden Fees",
    descKey: "trust.fees.desc",
    descFallback: "The price you see is the price you pay. Fully transparent.",
  },
  {
    icon: RotateCcw,
    titleKey: "trust.cancel.title",
    titleFallback: "Free Cancellation",
    descKey: "trust.cancel.desc",
    descFallback: "Cancel up to 24 hours before pickup at no charge.",
  },
];

const TrustBar = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 bg-background border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {PILLARS.map(({ icon: Icon, titleKey, titleFallback, descKey, descFallback }) => (
            <div key={titleKey} className="flex items-start gap-4 px-6 py-6 md:py-2">
              <div className="shrink-0 w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-base">{t(titleKey, titleFallback)}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{t(descKey, descFallback)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
