import { computed } from 'vue';
import i18n, { isRtl, LOCALE_STORAGE_KEY, SUPPORTED_LOCALES, type AppLocale } from '@/i18n';

/**
 * Language control: English or Arabic, with the direction switch that Arabic
 * implies.
 *
 * Deliberately shaped like useTheme: one module-level source of truth, a
 * `init*` called once at boot before first paint, and a setter that persists.
 * The two settings behave identically from the user's side, so they behave
 * identically in code.
 *
 * Direction is the part worth care. `dir` is set on <html> rather than toggled
 * per-component because it cascades — every flex row, every logical property,
 * and the browser's own text shaping all read it from the root. Setting it
 * anywhere else leaves half the page mirrored.
 */
export const locale = computed<AppLocale>({
  get: () => i18n.global.locale.value as AppLocale,
  set: (next) => setLocale(next),
});

export const isRtlLocale = computed(() => isRtl(locale.value));

/** Applies `lang` and `dir` to <html> — see index.html for the pre-paint copy. */
function apply(next: AppLocale) {
  const root = document.documentElement;
  root.setAttribute('lang', next);
  root.setAttribute('dir', isRtl(next) ? 'rtl' : 'ltr');
}

export function setLocale(next: AppLocale) {
  i18n.global.locale.value = next;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
  } catch {
    // Non-fatal: the language still applies for this session.
  }
  apply(next);
}

/**
 * Builds a path on the locale-prefixed public routes: `localePath()` → `/ar`,
 * `localePath('/privacy')` → `/ar/privacy`.
 *
 * Only for the public pages. App routes (`/today`, `/habits`) carry no locale
 * segment by design — see the note in router/index.ts. Linking to bare `/` or
 * `/privacy` still works via redirects, but costs an extra hop and leaves the
 * address bar changing under the user, so prefer this in templates.
 */
export function localePath(suffix = '') {
  return `/${locale.value}${suffix}`;
}

/** Flips between the two supported locales — for the single-button switcher. */
export function toggleLocale() {
  const i = SUPPORTED_LOCALES.indexOf(locale.value);
  setLocale(SUPPORTED_LOCALES[(i + 1) % SUPPORTED_LOCALES.length]!);
}

/** Call once at boot, alongside initTheme(). */
export function initLocale() {
  apply(locale.value);
}

export function useLocale() {
  return { locale, isRtlLocale, setLocale, toggleLocale, localePath };
}
