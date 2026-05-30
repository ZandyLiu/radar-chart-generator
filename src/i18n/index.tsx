import { createContext, useContext, useState, useCallback } from 'react';
import type { Translations } from './types';
import { zh, en } from './translations';

const translations = { zh, en };

export type Language = 'zh' | 'en';

interface I18nContextType {
  lang: Language;
  t: Translations;
  setLang: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType>({
  lang: 'zh',
  t: zh,
  setLang: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('lang') as Language | null;
    if (saved === 'zh' || saved === 'en') return saved;
    const browserLang = navigator.language;
    return browserLang.startsWith('zh') ? 'zh' : 'en';
  });

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
  }, []);

  const t = translations[lang];

  return (
    <I18nContext.Provider value={{ lang, t, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
