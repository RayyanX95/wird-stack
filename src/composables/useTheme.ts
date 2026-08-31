import { computed, ref } from 'vue';

/**
 * Theme control: light, dark, or follow the OS.
 *
 * "system" is the default and is *not* the same as light — it means "don't
 * stamp anything on <html> and let the `prefers-color-scheme` block in
 * tokens.css decide." Only an explicit choice writes `data-theme`, which is
 * what makes an explicit light choice win on a dark OS and vice versa.
 *
 * Module-level state, deliberately: this is one setting for the whole app, so
 * every caller of useTheme() shares the same refs rather than each owning a
 * copy that could drift.
 */
export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'wirdstack-theme';
const ORDER: ThemePreference[] = ['system', 'light', 'dark'];

function readStored(): ThemePreference {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
  } catch {
    // Private mode / storage disabled — fall through to the default.
  }
  return 'system';
}

const preference = ref<ThemePreference>(readStored());

// Tracks the OS setting so `resolved` is correct while the preference is
// "system". Guarded because this module is also imported by the pre-render
// inline script path where matchMedia exists, but tests may not have it.
const prefersDark = ref(
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false,
);

if (typeof window !== 'undefined' && window.matchMedia) {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => (prefersDark.value = e.matches));
}

/** What the user is actually looking at right now — never 'system'. */
const resolved = computed<'light' | 'dark'>(() =>
  preference.value === 'system' ? (prefersDark.value ? 'dark' : 'light') : preference.value,
);

function apply() {
  const root = document.documentElement;
  if (preference.value === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', preference.value);
  }
  // Keeps the mobile browser chrome (address bar) in step with the page.
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', resolved.value === 'dark' ? '#0f1411' : '#f3f4ef');
}

function setTheme(next: ThemePreference) {
  preference.value = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Non-fatal: the theme still applies for this session.
  }
  apply();
}

/** Cycles system → light → dark → system, for the single-button toggle. */
function cycleTheme() {
  const next = ORDER[(ORDER.indexOf(preference.value) + 1) % ORDER.length]!;
  setTheme(next);
}

/** Call once at boot, before the first paint of the app shell. */
export function initTheme() {
  apply();
}

export function useTheme() {
  return { preference, resolved, setTheme, cycleTheme };
}
