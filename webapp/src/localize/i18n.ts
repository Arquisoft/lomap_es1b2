import esp_translation from "./es/translation.json";
import eng_translation from "./en/translation.json";
import fr_translation from "./fr/translation.json";
import { initReactI18next } from 'react-i18next/initReactI18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import i18next from 'i18next';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'es',
    resources: {
      es:{
        translation: esp_translation
      },
      en: {
        translation: eng_translation
      },
      fr: {
        translation: fr_translation
      }
    }
  });

export default i18next;