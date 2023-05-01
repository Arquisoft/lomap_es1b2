import esp_translation from "./es/translation.json";
import eng_translation from "./en/translation.json";
import { initReactI18next } from 'react-i18next/initReactI18next';
import i18next from 'i18next';

i18next
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    resources: {
      es:{
        translation: esp_translation
      },
      en: {
        translation: eng_translation
      }
    }
  });

export default i18next;