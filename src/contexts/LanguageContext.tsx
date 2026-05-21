
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, TranslationsType } from '../translations';

export type Language = 'en' | 'bs' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, fallback?: string) => string;
}

interface LanguageProviderProps {
  children: React.ReactNode;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('language') as Language) || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    // Update document direction based on language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language === 'ar' ? 'ar' : language === 'bs' ? 'bs' : 'en';
  }, [language]);

  const t = useCallback((key: string, fallback?: string) => {
    const value = translations[key]?.[language];
    if (value) return value;
    if (fallback) return fallback;
    return key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div
        dir={language === 'ar' ? 'rtl' : 'ltr'}
        style={{ direction: language === 'ar' ? 'rtl' : 'ltr', display: 'contents' }}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export { LanguageProvider, useLanguage };