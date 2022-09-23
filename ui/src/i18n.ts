import i18n from "i18next";

import Backend from "i18next-http-backend";

import backendconfig from './config/backendconfig'

import LanguageDetector from 'i18next-browser-languagedetector'

import { initReactI18next } from "react-i18next";

//import en from './assets/i18n/translations/en.json'
//import fr from './assets/i18n/translations/fr.json'

const options = {
  order: ['querystring', 'localStorage', 'navigator'],
  lookupQuerystring: 'lng',
  lookupLocalStorage: 'i18nextLng',
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    //lng: 'en', //default language
    fallbackLng: "en", //when specified language translations not present
    supportedLngs: ['en', 'fr'],
    debug: false,
    detection: options,
    /*
    resources: {
      en: {
        translations: en,
      },
      fr: {
        translations: fr,
      },
    },
    */
    backend: {

      /* translation file path */

      loadPath: backendconfig.urli18n + "{{ns}}/{{lng}}.json",
    },

    /* can have multiple namespace, in case you want to divide a huge translation into smaller pieces and load them on demand */


    ns: ["translations"],

    defaultNS: "translations",

    keySeparator: false,

    interpolation: {

      escapeValue: false,

      formatSeparator: ",",

    },

    react: {

      //wait: true,
      useSuspense: false,
    },

  })

export default i18n
