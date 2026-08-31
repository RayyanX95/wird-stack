import { computed, ref } from 'vue';
import type { Prayer } from '@/types';
import { PRAYERS } from '@/types';
import { toIso } from '@/utils';

/**
 * Real prayer times for the user's actual location.
 *
 * The whole premise of Sabr is stacking a habit onto a prayer, so the times
 * can't be a hardcoded table — they move by tens of minutes across a month and
 * by hours across latitudes. Times come from the Aladhan API, keyed on
 * coordinates the user grants once.
 *
 * Degradation ladder, in order: saved coordinates → a fresh geolocation
 * prompt → a fallback city. The app is never blocked on the network or on a
 * permission grant; it just labels how confident it is (see `source`).
 *
 * Module-level state so the Today view, the header countdown and any future
 * widget all share one fetch rather than each hitting the API.
 */

const API = 'https://api.aladhan.com/v1/timings';

/** Aladhan calculation-method ids. Which one is "correct" is regional, so it's the user's call. */
export const CALCULATION_METHODS = [
  { id: 2, label: 'ISNA — North America' },
  { id: 3, label: 'Muslim World League' },
  { id: 4, label: 'Umm al-Qura — Makkah' },
  { id: 5, label: 'Egyptian General Authority' },
  { id: 1, label: 'University of Karachi' },
  { id: 8, label: 'Gulf Region' },
  { id: 13, label: 'Diyanet — Turkey' },
] as const;

/** Used only when we have no coordinates at all. Labelled as such in the UI — never passed off as the user's location. */
const FALLBACK = { latitude: 21.4225, longitude: 39.8262, label: 'Makkah' };

const COORDS_KEY = 'sabr-coords';
const METHOD_KEY = 'sabr-calc-method';
const TIMES_KEY = 'sabr-times-cache';

/** Free, no-key, CORS-enabled reverse geocoder — good enough for a city name. */
const GEOCODE_API = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

export type TimesSource = 'geolocation' | 'saved' | 'fallback';
export type TimesStatus = 'idle' | 'locating' | 'loading' | 'ready' | 'error';

export type PrayerTimes = Record<Prayer, string>;

interface Coords {
  latitude: number;
  longitude: number;
}

/** Coordinates plus the city name resolved for them, so a returning visit can skip the geocode call. */
interface SavedLocation extends Coords {
  city?: string;
}

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable — everything still works, just without caching.
  }
}

const savedCoords = readJson<SavedLocation>(COORDS_KEY);

const coords = ref<Coords>(savedCoords ?? FALLBACK);
const source = ref<TimesSource>(savedCoords ? 'saved' : 'fallback');
const status = ref<TimesStatus>('idle');
const error = ref<string | null>(null);
const method = ref<number>(readJson<number>(METHOD_KEY) ?? 2);

/** City name for the current coordinates, once resolved. Null while pending or on geocode failure. */
const cityLabel = ref<string | null>(savedCoords?.city ?? null);

/** Best-effort — a failed or slow lookup just leaves the coordinate label in place. */
async function loadCityLabel(target: Coords, persist: boolean) {
  try {
    const url = `${GEOCODE_API}?latitude=${target.latitude}&longitude=${target.longitude}&localityLanguage=en`;
    const res = await fetch(url);
    if (!res.ok) return;

    const body = (await res.json()) as {
      city?: string;
      locality?: string;
      principalSubdivision?: string;
      countryName?: string;
    };
    const city = body.city || body.locality || body.principalSubdivision;
    if (!city) return;

    // Stale response for coordinates the user has since moved away from.
    if (target.latitude !== coords.value.latitude || target.longitude !== coords.value.longitude) return;

    cityLabel.value = body.countryName ? `${city}, ${body.countryName}` : city;
    if (persist) writeJson(COORDS_KEY, { ...target, city: cityLabel.value });
  } catch {
    // Offline or blocked — the coordinate label already covers this case.
  }
}

if (savedCoords && !savedCoords.city) void loadCityLabel(savedCoords, true);

/** Today's five times, and tomorrow's Fajr — needed to count down across midnight. */
const times = ref<PrayerTimes | null>(null);
const tomorrowFajr = ref<string | null>(null);

/** Aladhan returns e.g. "05:14 (EET)" — keep the clock part, drop the zone tag. */
function parseTime(raw: string): string {
  const match = /(\d{1,2}):(\d{2})/.exec(raw);
  if (!match) return '--:--';
  return `${match[1]!.padStart(2, '0')}:${match[2]}`;
}

/** Minutes since local midnight, for ordering and countdowns. */
export function minutesOfDay(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function apiDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

/** Coordinates are cached to ~1km so a slightly different GPS fix still hits the cache. */
function cacheKey(dateIso: string): string {
  return `${dateIso}|${coords.value.latitude.toFixed(2)}|${coords.value.longitude.toFixed(2)}|${method.value}`;
}

async function fetchTimings(date: Date): Promise<PrayerTimes> {
  const url =
    `${API}/${apiDate(date)}?latitude=${coords.value.latitude}` +
    `&longitude=${coords.value.longitude}&method=${method.value}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Prayer time service returned ${res.status}`);

  const body = (await res.json()) as { data?: { timings?: Record<string, string> } };
  const timings = body.data?.timings;
  if (!timings) throw new Error('Prayer time service returned an unexpected shape');

  return Object.fromEntries(
    PRAYERS.map((p) => [p, parseTime(timings[p] ?? '')]),
  ) as PrayerTimes;
}

/**
 * Loads today's and tomorrow's times, serving the day's cache first so a
 * revisit paints instantly and only hits the network once per day per place.
 */
async function load() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const cached = readJson<{ key: string; times: PrayerTimes; tomorrowFajr: string }>(TIMES_KEY);
  if (cached && cached.key === cacheKey(toIso(today))) {
    times.value = cached.times;
    tomorrowFajr.value = cached.tomorrowFajr;
    status.value = 'ready';
    return;
  }

  status.value = 'loading';
  error.value = null;
  try {
    const [todayTimes, tomorrowTimes] = await Promise.all([
      fetchTimings(today),
      fetchTimings(tomorrow),
    ]);
    times.value = todayTimes;
    tomorrowFajr.value = tomorrowTimes.Fajr;
    status.value = 'ready';
    writeJson(TIMES_KEY, {
      key: cacheKey(toIso(today)),
      times: todayTimes,
      tomorrowFajr: tomorrowTimes.Fajr,
    });
  } catch (e) {
    // A stale cache from another day still beats showing nothing — the times
    // are minutes off, not hours, and the UI says they're offline.
    if (cached) {
      times.value = cached.times;
      tomorrowFajr.value = cached.tomorrowFajr;
      status.value = 'ready';
    } else {
      status.value = 'error';
    }
    error.value = e instanceof Error ? e.message : 'Could not load prayer times';
  }
}

/** Asks the browser for a location. Safe to call repeatedly — a denial just leaves the fallback in place. */
function requestLocation(): Promise<void> {
  if (!('geolocation' in navigator)) {
    error.value = 'This browser can’t share a location.';
    return load();
  }

  status.value = 'locating';
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        coords.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        source.value = 'geolocation';
        cityLabel.value = null;
        writeJson(COORDS_KEY, coords.value);
        void loadCityLabel(coords.value, true);
        void load().then(resolve);
      },
      () => {
        // Denied or timed out — keep whatever coordinates we already had.
        error.value = 'Location unavailable — showing times for ' + FALLBACK.label + '.';
        void load().then(resolve);
      },
      { timeout: 8000, maximumAge: 60 * 60 * 1000 },
    );
  });
}

function setMethod(id: number) {
  method.value = id;
  writeJson(METHOD_KEY, id);
  void load();
}

let loadStarted = false;
let locateAttempted = false;

/**
 * Idempotent — the first consumer kicks this off and the rest reuse the
 * result.
 *
 * `autoLocate` is what separates the landing page from the app. Throwing a
 * browser permission prompt at someone who has just arrived on a marketing
 * page is the fastest way to get a permanent "Block" — so the landing page
 * loads fallback-city times and offers a button, and only the app itself asks
 * outright. The flags are separate so arriving via the landing page doesn't
 * permanently suppress the prompt on Today.
 */
function ensureLoaded(autoLocate: boolean) {
  if (autoLocate && !locateAttempted && !savedCoords) {
    locateAttempted = true;
    loadStarted = true;
    void requestLocation();
    return;
  }
  if (loadStarted) return;
  loadStarted = true;
  void load();
}

export function usePrayerTimes(now = ref(new Date()), options: { autoLocate?: boolean } = {}) {
  ensureLoaded(options.autoLocate ?? false);

  const usingFallbackLocation = computed(() => source.value === 'fallback');
  const locationLabel = computed(() => {
    if (usingFallbackLocation.value) return FALLBACK.label;
    if (cityLabel.value) return cityLabel.value;
    return `${coords.value.latitude.toFixed(2)}°, ${coords.value.longitude.toFixed(2)}°`;
  });

  /** The five prayers in clock order with their times — the spine of the Today view. */
  const schedule = computed(() => {
    if (!times.value) return [];
    return PRAYERS.map((prayer) => ({
      prayer,
      time: times.value![prayer],
      minutes: minutesOfDay(times.value![prayer]),
    })).sort((a, b) => a.minutes - b.minutes);
  });

  const nowMinutes = computed(() => now.value.getHours() * 60 + now.value.getMinutes());

  /**
   * The next prayer to come. After Isha this rolls to tomorrow's Fajr, which
   * is why tomorrow's time is fetched at all — "in 9h" is a very different
   * message from "in 21h", and reusing today's Fajr would give the latter.
   */
  const nextPrayer = computed(() => {
    if (schedule.value.length === 0) return null;

    const upcoming = schedule.value.find((s) => s.minutes > nowMinutes.value);
    if (upcoming) {
      return { ...upcoming, isTomorrow: false, minutesAway: upcoming.minutes - nowMinutes.value };
    }

    const fajr = tomorrowFajr.value ?? schedule.value[0]!.time;
    const minutes = minutesOfDay(fajr);
    return {
      prayer: 'Fajr' as Prayer,
      time: fajr,
      minutes,
      isTomorrow: true,
      minutesAway: 24 * 60 - nowMinutes.value + minutes,
    };
  });

  const countdown = computed(() => {
    const next = nextPrayer.value;
    if (!next) return '';
    const h = Math.floor(next.minutesAway / 60);
    const m = next.minutesAway % 60;
    if (h === 0) return `${m}m`;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  });

  const timeFor = (prayer: Prayer): string => times.value?.[prayer] ?? '--:--';

  return {
    times,
    schedule,
    status,
    error,
    source,
    method,
    locationLabel,
    usingFallbackLocation,
    nextPrayer,
    countdown,
    timeFor,
    requestLocation,
    setMethod,
    reload: load,
  };
}
