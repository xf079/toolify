import i18n, { ModuleType } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getSystemLanguage } from '@/utils/system';

import en from './locales/en-us';
import zh from './locales/zh-cn';

import dayjs from 'dayjs';

export const lngCacheKey = 'language';

export enum Language {
  EN = 'en-US',
  ZH = 'zh-CN'
}

const LanguageKeyEnum: Recordable = {
  'ja-JP': Language.JA,
  ja: Language.JA,
  'it-IT': Language.IT,
  it: Language.IT,
  'fr-FR': Language.FR,
  fr: Language.FR,
  'en-US': Language.EN,
  en: Language.EN,
  'zh-TW': Language.ZH_TW,
  'zh-Hans': Language.ZH_TW,
  'zh-CN': Language.ZH,
  zh: Language.ZH
};

export const DayLocaleEnum: Recordable = {
  [Language.EN]: 'en-us',
  [Language.ZH]: 'zh-cn'
};

export const resources = {
  [Language.EN]: {
    translation: en
  },
  [Language.ZH]: {
    translation: zh
  }
} as const;

const languageDetector = {
  type: 'languageDetector' as ModuleType,
  async: true,
  detect: (callback: (arg0: string) => void) => {
    const locale = getSystemLanguage();
    const _defaultLocale = LanguageKeyEnum[locale] || 'en-US';
    // 获取上次选择的语言
    AsyncStorage.getItem(lngCacheKey, (error, lng) => {
      if (!error && lng) {
        const _newLng = lng === 'locale' ? _defaultLocale : lng;
        dayjs.locale(_newLng);
        callback(_newLng);
      } else {
        dayjs.locale(_defaultLocale);
        AsyncStorage.setItem(lngCacheKey, _defaultLocale);
        callback(_defaultLocale);
      }
    });
  }
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: resources,
    debug: false,
    fallbackLng: Language.EN,
    interpolation: {
      escapeValue: false
    }
  });

/**
 * Change language
 * @param language
 */
export const changeLanguage = async (language: any) => {
  dayjs.locale(DayLocaleEnum[language]);
  await i18n.changeLanguage(language);
  await AsyncStorage.setItem(lngCacheKey, language);
};

export default i18n;
