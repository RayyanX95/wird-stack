# WirdStack — Islamic Habit Tracker

> _"The most beloved deeds to Allah are those done consistently, even if small."_ — Prophet Muhammad ﷺ (Sahih al-Bukhari)

**WirdStack** is a habit-tracking app that helps Muslims build consistent Islamic practices using proven habit-formation science, not just a checklist. It's built as a portfolio project for Phase 2 of a Vue 3 learning roadmap — the goal is to demonstrate real state management, routing, and composable architecture, not just CRUD.

**Why this name:** a *wird* (ورد) is the classical Islamic term for a fixed devotional practice kept up daily — exactly what habit formation is about. "Stack" names the app's core mechanic: habits are stacked onto existing prayer times rather than floating on their own. Together the name is legible to the target audience and distinct from the crowded field of similarly-named Islamic habit apps.

---

## The idea

Most habit trackers are generic — a checkbox and a streak counter. WirdStack is built around two things:

1. **The science of how habits actually form** (cue → craving → response → reward, habit stacking, the Two-Minute Rule)
2. **The structure Islamic practice already provides** — five daily prayers are fixed, non-negotiable cues that occur every single day. That's a habit-stacking foundation most habit apps have to invent; Muslims already have it built into their day.

Instead of asking "did you do X today?", WirdStack asks "what will you stack after Fajr, after Dhuhr, after Maghrib?" — turning existing prayer times into anchors for new habits (Qur'an reading, dhikr, sadaqah, fasting Sunnah days, etc.).

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
| **Make it easy** — Two-Minute Rule                               | 4 Laws of Behavior Change        | New habits default to a minimal version (e.g. "read 1 verse," not "read 1 juz") — user can scale up later                   |
| **Make it satisfying** — immediate reward + tracking             | 4 Laws of Behavior Change        | Instant visual confirmation on completion + streak counter, visible the moment a habit is marked done                       |
| **Never miss twice**                                             | Atomic Habits core rule          | Streak logic distinguishes a single missed day (soft warning) from two consecutive misses (explicit "you're at risk" state) |
| **1% better, compounding**                                       | Atomic Habits core thesis        | Stats view shows trend over time, not just today's completion — the point is the compounding, not any single day            |

---

## Core routes

| Route         | Purpose                                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `/`           | **Today** — habits due around today's prayer times, ordered chronologically. The default landing screen.                         |
| `/habits`     | **Manage** — full list of all habits (active + paused), create/edit/delete                                                       |
| `/habits/new` | Create a new habit — pick the anchor prayer, the action, and the minimal "two-minute" version                                    |
| `/habits/:id` | Habit detail — history, current streak, longest streak, edit/pause/delete                                                        |
| `/stats`      | Trends over time — weekly/monthly completion rate, per-prayer breakdown (e.g. "you're strongest after Fajr, weakest after Isha") |

`/stats` is gated behind a route guard (`meta.requiresData`) that redirects to `/habits/new` if the user has fewer than 3 logged completions — there's nothing meaningful to show yet, and it doubles as a real `beforeEnter`/`meta` guard exercise for the Phase 2 checklist.

---

## Core user flow

1. **Onboarding** — user is introduced to the "stack it after a prayer" idea, creates their first 1–3 habits
2. **Daily use** — opens `/`, sees today's stack ordered by upcoming/passed prayer times, taps to mark complete
3. **Miss a day** — app doesn't punish; on return, it surfaces a gentle "pick back up" prompt tied to the next prayer, not a guilt-based streak reset screen
4. **Weekly reflection** — `/stats` shows the pattern (which prayer-anchors are working, which aren't) so the user can adjust the _anchor_, not just try harder

---

## Data model (localStorage-backed for this project)

```
Habit {
  id: string
  title: string              // "Read Qur'an"
  anchorPrayer: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'
  minimalVersion: string     // "1 verse" — the Two-Minute Rule version
  days: WeekDay[]             // which weekdays this habit is scheduled on — defaults to all 7
  createdAt: string
  isPaused: boolean
}

Completion {
  id: string
  habitId: string
  date: string                // ISO date, one entry per habit per day
  completedAt: string
}
```

Deliberately backend-agnostic: the composable API layer (`useHabitsApi`) wraps localStorage behind an async interface (loading/error states included) so swapping in a real backend later is a drop-in change, not a rewrite.

---

## Streak & history logic

The `Completion` log above is the **only source of truth** for progress — current streak, longest streak, "done today," and the calendar view are all *derived* from it on demand, never stored as their own fields. A habit does not carry a `streak` number or an `isCompleted` flag; those go stale the moment a day passes (nothing would reset `isCompleted` at midnight, nothing would recompute `streak` if a day gets unchecked). Storing them invites drift; deriving them keeps them correct by construction.

**Derived functions, all scoped to one habit:**

- `isCompletedOn(date)` — does a `Completion` exist for this habit on that date?
- `currentStreak()` — walk backward from today, counting consecutive **scheduled** days (per `Habit.days`) that have a completion. A day the habit isn't scheduled on is skipped entirely, not counted as a miss — "Fast Mondays" doesn't lose its streak because Tuesday–Sunday went unmarked, since those were never asked of it.
- `longestStreak()` — the same walk, scanned across the full log instead of stopping at the first gap.
- Calendar cell state — for any date, one of three states, not two: **done** (completion exists), **missed** (a scheduled day with no completion), or **not scheduled** (e.g. Tuesday for a Mondays-only habit). Collapsing "missed" and "not scheduled" into one visual would misrepresent adherence.

**"Never miss twice" (habit science → feature mapping, above)** is itself a derived read of the same log: two consecutive **scheduled** days without a completion is the "at risk" state; one missed scheduled day is a soft, non-punitive gap. No separate risk field to keep in sync — it falls out of the streak walk.

**Open decision, not yet locked:** if a habit's `days` schedule is edited after some history already exists (e.g. "Fast Mondays" becomes "Fast Mon + Thu"), does past streak math get re-evaluated against the *new* schedule, or does it stay pinned to whatever schedule was active on each historical date? Current lean is the simpler option — always evaluate against the habit's *current* `days` — since re-deriving from a single log is cheap and per-date schedule snapshots add real complexity for a case that's unlikely to matter much in a personal habit tracker. Worth revisiting only if it produces a confusing streak jump in practice.

---

## Tech stack (Phase 2 scope)

- **Vue 3** — Composition API, `<script setup>`
- **Pinia** — `useHabitsStore` (CRUD + streak/getter logic)
- **Vue Router** — nested routes, one guarded route (`/stats`)
- **Composables** — `useHabitsApi` (data layer), `usePrayerTimes` (static/local prayer time logic — no external API dependency needed for the MVP)
- **Validation** — habit creation form (title required, anchor prayer required)
- **Storage** — localStorage, structured to mimic a real API response shape

---

## What this project is meant to prove

Not "can build a CRUD app" — that's table stakes. The actual claims this project backs, for interview purposes:

- Can I make a real product decision (prayer-anchored stacking) and translate it into a data model and routing structure?
- Can I structure a composable API layer that isn't tightly coupled to localStorage, so it's honest about being backend-ready?
- Can I reason about state that isn't just "a list" — streaks, derived stats, and guard logic all require actual getter/computed thinking in Pinia, not just `state.push()`.

---

## Out of scope (for now)

- Real prayer-time API integration (using static/approximate times initially — can be a Phase 3/4 stretch add-on)
- Push notifications
- Multi-user / auth
- Backend persistence (explicitly deferred — see Phase 2 decision to stay localStorage-only to protect study hours)
