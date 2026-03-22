
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/home/FooterSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAnimatedPage } from "@/hooks/useAnimatedPage";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, Target, Car, Mountain, Building, MapPin, Phone, Mail, Globe, ArrowLeft, Star, Handshake } from "lucide-react";
import { useState, useEffect } from "react";

const BIH_IMAGES = [
  { src: '/lovable-uploads/stari-most.jpg', label: 'Stari Most, Mostar' },
  { src: '/lovable-uploads/bascarsija.jpg', label: 'Baščaršija, Sarajevo' },
  { src: '/lovable-uploads/sarajevo-panorama.jpg', label: 'Sarajevo' },
];

const AboutUs = () => {
  const { t } = useLanguage();
  useAnimatedPage();
  const [currentImg, setCurrentImg] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrentImg(i => (i + 1) % BIH_IMAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const services = [
    {
      icon: Car,
      title: t("about.concept.project1.title", "تأجير السيارات الفاخرة"),
      description: t("about.concept.project1.description", "مركبات عالية الجودة لرحلة مريحة وأنيقة"),
    },
    {
      icon: Mountain,
      title: t("about.concept.project2.title", "السياحة المختارة"),
      description: t("about.concept.project2.description", "تجارب سياحية مخصصة للزوار المميزين"),
    },
    {
      icon: Building,
      title: t("about.concept.project3.title", "العقارات والاستثمار"),
      description: t("about.concept.project3.description", "فرص استثمارية استراتيجية في البوسنة"),
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section with slideshow */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {BIH_IMAGES.map((img, i) => (
            <div
              key={img.src}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
              style={{ backgroundImage: `url(${img.src})`, opacity: i === currentImg ? 1 : 0 }}
            />
          ))}
          <div className="absolute inset-0 bg-foreground/70" />
          {/* Location label */}
          <div className="absolute bottom-8 right-8 z-20 text-white/60 text-sm font-medium tracking-wide">
            {BIH_IMAGES[currentImg].label}
          </div>
          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {BIH_IMAGES.map((_, i) => (
              <button key={i} onClick={() => setCurrentImg(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentImg ? 'bg-white scale-125' : 'bg-white/40'}`} />
            ))}
          </div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="w-20 h-0.5 bg-primary mx-auto mb-8" />
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-6 tracking-tight">
              {t("about.hero.title", "شمس البوسنة")}
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/80 mb-4 font-medium">
              {t("about.hero.subtitle", "بوابتك الموثوقة إلى البوسنة والهرسك")}
            </p>
            <p className="text-base md:text-lg text-primary-foreground/60 max-w-3xl mx-auto leading-relaxed">
              {t("about.hero.description")}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-up" className="max-w-4xl mx-auto text-center">
            <Star className="w-10 h-10 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-8">
              {t("about.welcome.title", "عن شمس البوسنة")}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
              {t("about.welcome.description")}
            </p>
            <p className="text-base md:text-lg text-muted-foreground/80 leading-relaxed">
              {t("about.intro")}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <AnimatedSection animation="fade-right">
              <Card className="h-full border-primary/20 hover:border-primary/40 transition-colors duration-300">
                <CardContent className="p-10">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Eye className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                    {t("about.vision.title", "رؤيتنا")}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {t("about.vision.description")}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="fade-left">
              <Card className="h-full border-primary/20 hover:border-primary/40 transition-colors duration-300">
                <CardContent className="p-10">
                  <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                    <Target className="w-7 h-7 text-secondary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                    {t("about.mission.title", "مهمتنا")}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {t("about.mission.description")}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              {t("about.concept.title", "خدماتنا")}
            </h2>
          </AnimatedSection>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 150}>
                <Card className="h-full hover:scale-[1.03] transition-all duration-300 group">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                      <service.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-4">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Investment & Partnership */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/lovable-uploads/bascarsija.jpg)` }}
        >
          <div className="absolute inset-0 bg-foreground/85" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="fade-up" className="max-w-4xl mx-auto text-center">
            <Handshake className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-8">
              {t("about.investment.title", "الاستثمار والشراكة")}
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/70 leading-relaxed">
              {t("about.investment.description")}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Shams Al Bosnia */}
      <section className="py-24 bg-foreground text-primary-foreground">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-up" className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
              {t("about.strategy.title", "لماذا شمس البوسنة")}
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/70 leading-relaxed">
              {t("about.strategy.description")}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-up" className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              {t("about.contact.title", "تواصل معنا")}
            </h2>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
            {[
              { icon: Phone, label: t("about.contact.phone", "رقم الهاتف"), value: "+387 00 000 000" },
              { icon: Mail, label: t("about.contact.email", "البريد الإلكتروني"), value: "info@shamsalbosnia.com" },
              { icon: Globe, label: t("about.contact.website", "موقعنا"), value: "www.shamsalbosnia.com" },
              { icon: MapPin, label: t("about.contact.address", "عنواننا"), value: "Milana Preloga 12A, Sarajevo, BiH" },
            ].map((item, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <Card className="hover:border-primary/30 transition-colors duration-300">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                      <p className="text-foreground font-medium">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection animation="fade-up" delay={500} className="text-center mt-12">
            <Link href="/contact">
              <Button size="lg" className="hover:scale-105 transition-all duration-200">
                {t("about.contact.title", "تواصل معنا")}
                <ArrowLeft className="w-4 h-4 mr-2 scale-x-[-1]" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default AboutUs;
