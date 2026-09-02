import { createI18n } from 'vue-i18n';
import en from './locales/en';
import ar from './locales/ar';

/**
 * The app speaks English and Arabic.
 *
 * `legacy: false` puts vue-i18n in Composition API mode, which is what lets
 * `useI18n()` work inside `<script setup>` and what makes `i18n.global.locale`
 * a real ref rather than a magic string.
 *
 * Locale resolution order — saved choice → browser language → English. The
 * saved choice is read here rather than in useLocale so the very first render
 * is already in the right language: switching after mount would paint one
 * frame of English (and, worse, one frame of LTR) for an Arabic reader.
 */
export const SUPPORTED_LOCALES = ['en', 'ar'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_STORAGE_KEY = 'wirdstack-locale';

/** Locales that read right-to-left — drives `dir` on <html>. */
const RTL_LOCALES = new Set<AppLocale>(['ar']);

export function isRtl(locale: AppLocale): boolean {
  return RTL_LOCALES.has(locale);
}

export function isSupportedLocale(value: string | null | undefined): value is AppLocale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function detectLocale(): AppLocale {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isSupportedLocale(saved)) return saved;
  } catch {
    // Storage blocked — fall through to the browser's own preference.
  }

  // `navigator.language` is a full tag ("ar-SA", "en-GB"); only the primary
  // subtag is meaningful here.
  const browser = typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : undefined;
  return isSupportedLocale(browser) ? browser : 'en';
}

const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  // A key missing from ar.ts renders its English string rather than the raw
  // key path — a partial translation degrades to readable, not broken.
  fallbackLocale: 'en',
  messages: { en, ar },
});

export default i18n;
