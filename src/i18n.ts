import { createI18n } from 'vue-i18n'
import { en } from './locales/en'
import { ru } from './locales/ru'
import type { LocaleMessages } from './locales/messages'

export type AppLocale = 'ru' | 'en'

const LOCALE_STORAGE_KEY = 'gymnote:locale'

function isAppLocale(value: string | null): value is AppLocale {
  return value === 'ru' || value === 'en'
}

const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY)
const initialLocale: AppLocale = isAppLocale(savedLocale) ? savedLocale : 'en'

export const i18n = createI18n<[LocaleMessages], AppLocale, false>({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: {
    ru,
    en,
  },
})

export function setAppLocale(nextLocale: AppLocale) {
  i18n.global.locale.value = nextLocale
  localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale)
  document.documentElement.lang = nextLocale
}

document.documentElement.lang = initialLocale
