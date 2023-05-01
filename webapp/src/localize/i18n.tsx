import esp_translation from "./es/translation.json";
import eng_translation from "./en/translation.json";
import fr_translation from "./fr/translation.json";
import { initReactI18next } from 'react-i18next/initReactI18next';
import i18next from 'i18next';

i18next
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    debug: true,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
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