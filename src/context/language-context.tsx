'use client';
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import en from '@/locales/en.json';
import tr from '@/locales/tr.json';

type Locale = 'en' | 'tr';

const translations = { en, tr };

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('tr');

   useEffect(() => {
    // In a real app, you might want to persist this to localStorage
    // For now, we default to 'tr'
    if (typeof window !== 'undefined') {
        const storedLocale = localStorage.getItem('locale') as Locale;
        if (storedLocale && (storedLocale === 'en' || storedLocale === 'tr')) {
            setLocale(storedLocale);
        }
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    if (typeof window !== 'undefined') {
        localStorage.setItem('locale', newLocale);
    }
  };


  const t = useCallback((key: string, values?: Record<string, any>): string => {
    const keys = key.split('.');
    let result: any = translations[locale];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing
        let fallbackResult: any = translations.en;
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
        }
        if (typeof fallbackResult === 'string' && values) {
          return Object.entries(values).reduce(
            (str, [key, value]) => str.replace(`{${key}}`, value),
            fallbackResult
          );
        }
        return fallbackResult || key;
      }
    }

    if (typeof result === 'string' && values) {
      return Object.entries(values).reduce(
        (str, [key, value]) => str.replace(`{${key}}`, value),
        result
      );
    }

    return result || key;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
