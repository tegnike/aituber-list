import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonJA from '../public/locales/ja/common.json';
import commonEN from '../public/locales/en/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'ja',
    supportedLngs: ['ja', 'en'],
    defaultNS: 'common',
    ns: ['common'],
    resources: {
      ja: {
        common: commonJA,
      },
      en: {
        common: commonEN,
      },
    },
    interpolation: {
      escapeValue: false, // Reactは既にXSS対策を行っているため
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
