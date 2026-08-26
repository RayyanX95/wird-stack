# Sabr — Islamic Habit Tracker

A habit tracker that anchors new habits to the five daily prayers ("After Fajr, I will read one verse"), instead of a generic checklist. See [BUSINESS.md](./BUSINESS.md) for the full product idea. Built with Vue 3 + Vite.

## Project Structure

```
src/
├── assets/
│   └── styles/
├── components/
│   ├── habit/
│   ├── prayer/
│   └── layout/
├── views/
├── stores/
├── composables/
├── router/
└── types/
```

- **`assets/styles/`** — global CSS: the theme's design tokens (colors, type scale, spacing) in `tokens.css`, plus resets and base styles in `main.css`. No component-scoped styles live here.
- **`components/`** — reusable, non-route components, split by domain rather than type:
  - `habit/` — a habit row, the create/edit form, the streak badge, the history grid — anything that renders one habit or its state.
  - `prayer/` — components that group habits under a prayer (e.g. the "next up" block on Today).
  - `layout/` — app chrome shared across every route: the sidebar nav, the shell wrapping `<router-view>`.
- **`views/`** — one component per route, mounted directly by the router: Today, Habits, New/Edit Habit, Habit Detail, Stats. Views compose `components/`; they shouldn't contain reusable UI themselves.
- **`stores/`** — Pinia stores. `habits.ts` owns habit/completion state plus derived logic (streaks, "never miss twice", stats getters).
- **`composables/`** — framework-agnostic logic reused across components: `useHabitsApi` (the async, localStorage-backed data layer — the seam where a real backend would plug in later) and `usePrayerTimes` (static/local prayer time calculation).
- **`router/`** — route definitions, including the `beforeEnter`/`meta.requiresData` guard on `/stats`.
- **`types/`** — shared TypeScript interfaces (`Habit`, `Completion`) used across stores, composables, and components.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
