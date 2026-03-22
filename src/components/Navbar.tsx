'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const NAV_LINKS = [
  { href: "/", labelKey: "nav.home", fallback: "الرئيسية" },
  { href: "/apartments", labelKey: "nav.apartments", fallback: "أماكن الإقامة" },
  { href: "/cars", labelKey: "nav.cars", fallback: "سيارات" },
  { href: "/bundles", labelKey: "nav.bundles", fallback: "حزم السفر" },
  { href: "/about-us", labelKey: "about.title", fallback: "من نحن" },
] as const;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-foreground/95 backdrop-blur-md py-3 shadow-lg"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo - right side in RTL */}
          <Link href="/" className="flex items-center">
            <img 
              src="/lovable-uploads/shams-albosnia-logo.png" 
              alt="شمس البوسنة" 
              className="h-12 md:h-14"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, labelKey, fallback }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm font-medium transition-all duration-300 hover:text-primary",
                  isActive(href) ? "text-primary" : "text-primary-foreground/80"
                )}
              >
                {t(labelKey, fallback)}
              </Link>
            ))}
            <button aria-label="Search" className="text-primary-foreground/80 hover:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <LanguageSwitcher />
            <Link href="/apartments">
              <Button size="sm" className="rounded-md px-6 font-medium bg-primary text-primary-foreground hover:bg-primary/90">
                {t("nav.booking", "احجز الآن")}
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary-foreground"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden pt-4 pb-6 px-4 bg-foreground/95 backdrop-blur-md border-b border-primary/20">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map(({ href, labelKey, fallback }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary px-4 py-2",
                  isActive(href) ? "text-primary" : "text-primary-foreground/80"
                )}
              >
                {t(labelKey, fallback)}
              </Link>
            ))}
            <Link href="/apartments" className="px-4">
              <Button size="sm" className="rounded-md w-full font-medium bg-primary text-primary-foreground hover:bg-primary/90">
                {t("nav.booking", "احجز الآن")}
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
