# WirdStack — Islamic Habit Tracker

> _"The most beloved deeds to Allah are those done consistently, even if small."_ — Prophet Muhammad ﷺ (Sahih al-Bukhari)

**WirdStack** helps Muslims build consistent Islamic practices by anchoring each one to a prayer they already pray, using established habit-formation science rather than a bare checklist.

**Why this name:** a _wird_ (ورد) is the classical Islamic term for a fixed devotional practice kept up daily — exactly what habit formation is about. "Stack" names the core mechanic: practices are stacked onto existing prayer times rather than floating on their own. The name is legible to the target audience and distinct from the crowded field of similarly-named Islamic habit apps.

---

## The idea

Most habit trackers are generic — a checkbox and a streak counter. WirdStack is built around two things:

1. **The science of how habits actually form** (cue → craving → response → reward, habit stacking, the Two-Minute Rule)
2. **The structure Islamic practice already provides** — five daily prayers are fixed, non-negotiable cues that occur every single day. That's a habit-stacking foundation most habit apps have to invent; Muslims already have it built into their day.

Instead of asking "did you do X today?", WirdStack asks "what will you stack after Fajr, after Dhuhr, after Maghrib?" — turning existing prayer times into anchors for new practices (Qur'an reading, dhikr, sadaqah, fasting Sunnah days, etc.).

---

## Positioning

The Islamic habit-tracker category is crowded (Istiqama, Eebadat, Thabat, and several generic "Islamic Habit Tracker" listings). Most are checklist apps with an Islamic skin. Three things separate WirdStack:

- **The anchor is the product.** Every habit is created as "After [Prayer], I will [action]." There is no such thing as an unanchored habit here. Competitors let you tick a box; WirdStack decides *when* you'll be reminded of it by construction.
- **Real prayer times, honestly labelled.** Times come from the Aladhan API for the user's actual coordinates, with the calculation method their community follows. When the app is falling back to Makkah because it has no location, it says so rather than passing off approximate times as the user's own.
- **Local-first and private by default.** No account, no server-side profile, nothing to harvest — a genuine differentiator in a category with a poor track record on adware and data collection.

---

## Wireframe

[Click here to view](https://claude.ai/code/artifact/d9d2e97e-b181-4ceb-8935-989622697b4f)

---

## Habit science → feature mapping

| Principle                                                        | Source                           | How WirdStack implements it                                                                                                 |
| ---------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Cue** — the trigger that starts the loop                       | Cue-Craving-Response-Reward loop | Prayer times act as fixed cues; user picks which prayer a habit is "stacked" after                                          |
| **Habit stacking** — "After [current habit], I will [new habit]" | Habit stacking formula           | Every habit is created as "After [Prayer], I will [action]" — not a floating to-do                                          |
| **Make it obvious**                                              | 4 Laws of Behavior Change        | Today view surfaces only what's relevant _right now_, ordered by the next prayer                                            |
| **Make it easy** — Two-Minute Rule                               | 4 Laws of Behavior Change        | Every habit carries a required "minimal version" (e.g. "1 verse," not "1 juz") — user can scale up later                    |
| **Make it satisfying** — immediate reward + tracking             | 4 Laws of Behavior Change        | Instant visual confirmation on completion + streak counter, visible the moment a habit is marked done                       |
| **Never miss twice**                                             | Atomic Habits core rule          | Streak logic distinguishes a single missed day (soft warning) from two consecutive misses (explicit "at risk" state)        |
| **1% better, compounding**                                       | Atomic Habits core thesis        | Stats view shows trend over time, not just today's completion — the point is the compounding, not any single day            |

---

## Core routes

| Route              | Purpose                                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `/`                | **Landing** — the marketing page, rendered bare (no app chrome). Shows the visitor's own next prayer time, live, before signup    |
| `/today`           | **Today** — habits grouped under their anchor prayer in clock order. The app's home screen                                       |
| `/habits`          | **Manage** — full list of all habits (active + paused), filterable                                                              |
| `/habits/new`      | Create a habit — anchor prayer, the action, the minimal "two-minute" version, and which weekdays it runs                        |
| `/habits/:id`      | Habit detail — week-by-week history calendar, current streak, longest streak, edit/pause/delete                                 |
| `/habits/:id/edit` | Edit an existing habit (same form as create)                                                                                    |
| `/stats`           | Trends — completion rate, per-weekday chart, 30-day activity strip, per-prayer breakdown ("strongest after Fajr, weakest after Dhuhr") |

`/stats` renders an explanatory empty state until there are at least 3 logged completions — there is nothing meaningful to plot before that, and an empty chart reads as a broken one.

---

## Core user flow

1. **First run** — the app starts genuinely empty and explains the "stack it after a prayer" idea, with a single call to action
2. **Daily use** — opens `/today`, sees the day's stack ordered by upcoming/passed prayer times, taps to mark complete
3. **Miss a day** — the app doesn't punish; a missed day is shown as a gap, and the habit is flagged "at risk" only after two consecutive scheduled misses
4. **Weekly reflection** — `/stats` shows the pattern (which prayer-anchors are working, which aren't) so the user can adjust the _anchor_, not just try harder

---

## Data model

Persisted to `localStorage` via `pinia-plugin-persistedstate` under the `habits-store` key.

```
Habit {
  id: string
  title: string              // "Read Qur'an"
  anchorPrayer: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'
  minimalVersion: string     // "1 verse" — the Two-Minute Rule version
  days: WeekDay[]            // which weekdays this habit is scheduled on — defaults to all 7
  createdAt: string
  paused: boolean
}

Completion {
  id: string
  habitId: string
  date: string               // ISO date 'YYYY-MM-DD', one entry per habit per day
  completedAt: string        // ISO timestamp
}
```

The `date` key is always the user's **local** calendar day, never a UTC conversion — otherwise an evening check-in west of Greenwich lands on tomorrow, and every streak built on it is wrong.

---

## Streak & history logic

The `Completion` log is the **only source of truth** for progress — current streak, longest streak, "done today," and the calendar view are all _derived_ from it on demand, never stored as their own fields. A habit does not carry a `streak` number or an `isCompleted` flag; those go stale the moment a day passes (nothing would reset `isCompleted` at midnight, nothing would recompute `streak` if a day gets unchecked). Storing them invites drift; deriving them keeps them correct by construction.

**Derived functions, all scoped to one habit:**

- `isCompletedOn(date)` — does a `Completion` exist for this habit on that date?
- `currentStreak()` — walk backward from today, counting consecutive **scheduled** days (per `Habit.days`) that have a completion. A day the habit isn't scheduled on is skipped entirely, not counted as a miss — "Fast Mondays" doesn't lose its streak because Tuesday–Sunday went unmarked, since those were never asked of it.
- `longestStreak()` — the same walk, scanned across the full log instead of stopping at the first gap.
- `dayState()` — for any date, one of three states, not two: **done** (completion exists), **missed** (a scheduled day with no completion), or **not scheduled** (e.g. Tuesday for a Mondays-only habit). Collapsing "missed" and "not scheduled" into one visual would misrepresent adherence.

**"Never miss twice"** is itself a derived read of the same log: two consecutive **scheduled** days without a completion is the "at risk" state; one missed scheduled day is a soft, non-punitive gap. No separate risk field to keep in sync — it falls out of the streak walk.

**Open decision, not yet locked:** if a habit's `days` schedule is edited after some history already exists (e.g. "Fast Mondays" becomes "Fast Mon + Thu"), does past streak math get re-evaluated against the _new_ schedule, or stay pinned to whatever schedule was active on each historical date? Current lean is the simpler option — always evaluate against the habit's _current_ `days` — since re-deriving from a single log is cheap and per-date schedule snapshots add real complexity for a case unlikely to matter much. Worth revisiting only if it produces a confusing streak jump in practice.

---

## Prayer times

Times come from the **Aladhan API**, keyed on the user's coordinates and their chosen calculation method (ISNA, Umm al-Qura, Muslim World League, and four others — which one is "correct" is regional, so it's the user's call).

The degradation ladder, in order: saved coordinates → a fresh geolocation prompt → a fallback to Makkah. The app is never blocked on the network or on a permission grant; it labels how confident it is instead. Today's and tomorrow's times are cached per day per location, so a revisit paints instantly and hits the network once. Tomorrow's Fajr is fetched specifically so the countdown stays correct across midnight — "in 9h" and "in 21h" are very different messages.

A city name is resolved once per location via a free reverse-geocode call and cached alongside the coordinates, so the UI can say "Riyadh" instead of "24.77°, 46.73°".

---

## Internationalisation

Full **English and Arabic**, with RTL layout. This is not a translation layer bolted on top:

- Arabic uses its own vocabulary register — _وِرد_ for the tracked practice (matching the product name), _مداومة_ for a streak (the term from the hadith the app is built on), _أقلّ ما يُجزئ_ (fiqh vocabulary) for the Two-Minute Rule's minimal version.
- Layout mirrors via CSS logical properties; directional icons flip; the hadith is set in a naskh face (Amiri) distinct from the Kufi used for headings, the way it would be in print.
- Dates render through `Intl` per locale, including the Umm al-Qura Hijri calendar, with Western numerals pinned in both languages for consistency with the prayer-time readout.
- User-entered text is bidi-isolated so an English habit title inside Arabic UI copy doesn't reorder.

---

## Tech stack

- **Vue 3** — Composition API, `<script setup>`
- **Pinia** — `useHabitsStore` (CRUD + derived streak/stats logic), persisted to localStorage
- **Vue Router** — the landing page renders bare via `meta.layout`; every other route lives in the app shell
- **vue-i18n** — EN/AR message catalogues, locale detection and persistence, RTL direction handling
- **Composables** — `usePrayerTimes` (Aladhan + geolocation + caching), `useTheme`, `useLocale`, `useNow`
- **Zod** — habit form validation, with i18n keys as messages so errors re-localise on a language switch
- **Storage** — localStorage; the completion log is shaped the way a backend table would store it

---

## Known gaps before general release

Honest state of the product, in priority order:

1. **No reminders.** The premise is that prayer times are the cue — but the app cannot currently cue anyone; the user has to remember to open it. This is the single biggest gap between the pitch and the product. Web Push requires a small backend and, on iOS, requires the PWA to be installed to the home screen first.
2. **"Works offline" is not yet true.** There is a web app manifest but no service worker, so the app shell does not load without a network. Either ship the service worker or drop the claim.
3. **No export/backup.** All history lives in one browser's localStorage, which is evictable (Safari clears it for non-installed sites after ~7 days of no interaction). Losing a long streak with no recovery path is the failure mode most likely to permanently lose a user.
4. **No privacy policy**, despite requesting geolocation and sending coordinates to two third parties (Aladhan, BigDataCloud). Required for EU/UK visitors.
5. **No onboarding templates.** A new user meets an empty form field labelled "minimal version" with no example of what belongs there.
6. **No analytics or feedback channel**, so there is currently no way to tell whether anyone returns on day 3.

---

## Deliberately not building yet

Accounts as a requirement, social/leaderboard features, gamification badges, multi-prayer anchors, an in-app Qur'an reader. Each adds surface area before the core premise — that prayer-anchoring makes habits stick — has been validated with real retention data.
