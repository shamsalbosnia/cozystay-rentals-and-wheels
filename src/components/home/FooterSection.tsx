'use client';

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Instagram } from "lucide-react";
import QRCodeSection from "@/components/QRCodeSection";

const FooterSection = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top decorative line */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-primary/20" />
          <span className="text-primary uppercase tracking-[0.3em] text-xs font-sans">Shams Albosnia</span>
          <div className="h-px flex-1 bg-primary/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block">
              <img 
                src="/lovable-uploads/shams-albosnia-logo.png" 
                alt="Shams Albosnia" 
                className="h-14 mb-4"
              />
            </Link>
            <p className="mt-2 text-background/60 max-w-xs text-sm font-light leading-relaxed">
              {t("footer.description", "Your refined gateway to the beauty of Bosnia and Herzegovina.")}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-6">{t("footer.quickLinks", "Quick Links")}</h3>
            <ul className="space-y-3">
              <li><Link href="/apartments" className="text-background/60 hover:text-primary transition-colors text-sm">{t("footer.apartments", "Apartments")}</Link></li>
              <li><Link href="/bundles" className="text-background/60 hover:text-primary transition-colors text-sm">{t("nav.bundles", "Bundles")}</Link></li>
              <li><Link href="/#testimonials" className="text-background/60 hover:text-primary transition-colors text-sm">{t("footer.testimonials", "Testimonials")}</Link></li>
              <li><Link href="/#booking" className="text-background/60 hover:text-primary transition-colors text-sm">{t("footer.bookNow", "Book Now")}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-6">{t("footer.company", "Company")}</h3>
            <ul className="space-y-3">
              <li><Link href="/about-us" className="text-background/60 hover:text-primary transition-colors text-sm">{t("footer.aboutUs", "About Us")}</Link></li>
              <li><Link href="/contact" className="text-background/60 hover:text-primary transition-colors text-sm">{t("footer.contact", "Contact")}</Link></li>
              <li><Link href="/blog" className="text-background/60 hover:text-primary transition-colors text-sm">{t("footer.blog", "Blog")}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-6">{t("footer.legal", "Legal")}</h3>
            <ul className="space-y-3">
              <li><Link href="/terms-of-service" className="text-background/60 hover:text-primary transition-colors text-sm">{t("footer.terms", "Terms of Service")}</Link></li>
              <li><Link href="/privacy-policy" className="text-background/60 hover:text-primary transition-colors text-sm">{t("footer.privacy", "Privacy Policy")}</Link></li>
              <li><Link href="/cookie-policy" className="text-background/60 hover:text-primary transition-colors text-sm">{t("footer.cookies", "Cookie Policy")}</Link></li>
            </ul>
          </div>
          
          <div className="flex flex-col items-center">
            <QRCodeSection 
              url={typeof window !== 'undefined' ? window.location.origin : ''}
              title="Scan to visit on mobile"
            />
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-background/40 text-xs uppercase tracking-wider">
            {t("footer.copyright", "© {year} Shams Albosnia. All rights reserved.").replace("{year}", currentYear.toString())}
          </p>
          
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="https://www.instagram.com/shamsalbosnia/" target="_blank" rel="noopener noreferrer" className="text-background/40 hover:text-primary transition-colors">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-5 w-5" />
            </a>
            
            <a href="https://www.tiktok.com/@shamsalbosnia" target="_blank" rel="noopener noreferrer" className="text-background/40 hover:text-primary transition-colors">
              <span className="sr-only">TikTok</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.307-1.849-1.307-2.849V1h-3v11.6c0 2.4-1.9 4.3-4.3 4.3s-4.3-1.9-4.3-4.3 1.9-4.3 4.3-4.3c.3 0 .6 0 .9.1V5.1c-.3 0-.6-.1-.9-.1-4.8 0-8.7 3.9-8.7 8.7s3.9 8.7 8.7 8.7 8.7-3.9 8.7-8.7V8.8c1.3.8 2.8 1.3 4.4 1.3V6.7c-.8 0-1.5-.4-2.021-1.138z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
