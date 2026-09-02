import { watch } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import LandingView from '@/views/LandingView.vue';
import i18n, { isSupportedLocale } from '@/i18n';
// One-directional on purpose: the router imports useLocale, never the reverse.
// Keeping `setLocale` free of any router dependency is what stops this pair
// from becoming a circular import; the URL rewrite that a manual language
// switch needs lives in LocaleToggle, which already has router access.
import { setLocale } from '@/composables/useLocale';

/**
 * Only the landing page is bundled eagerly — it is the entry point, so it must
 * paint without waiting on a second request. Every app view is a dynamic
 * import, which keeps the marketing page's payload down to the shell plus its
 * own chunk instead of the entire application.
 */
const HomeView = () => import('@/views/HomeView.vue');
const HabitsView = () => import('@/views/HabitsView.vue');
const HabitDetails = () => import('@/views/HabitDetails.vue');
const NewHabitView = () => import('@/views/NewHabitView.vue');
const StatsView = () => import('@/views/StatsView.vue');
const PrivacyView = () => import('@/views/PrivacyView.vue');
const NotFoundView = () => import('@/views/NotFoundView.vue');

/**
 * Locale lives in the URL for the *public* pages only — `/en`, `/ar`,
 * `/en/privacy`, `/ar/privacy` — and nowhere else.
 *
 * The prefix exists to make a page separately indexable and separately
 * shareable in one language. That is true of the marketing and legal pages,
 * and false of the app: `/today` and `/habits` render the user's own
 * localStorage, so there is nothing for a crawler to index (it would see an
 * empty first-run state), nobody links to someone else's habit list, and the
 * language there should follow the user's saved preference rather than a URL
 * they never chose. Prefixing those routes would double every path, force
 * every RouterLink in the app to become locale-aware, and buy no SEO at all.
 *
 * So the rule is: a locale prefix *sets* the locale (see the guard below), and
 * unprefixed app routes *read* whatever it was set to.
 */
const routes = [
  // Bare `/` and `/privacy` still resolve — both are already live and linked,
  // and /privacy may already be indexed. Send them to the current locale
  // rather than 404ing or silently changing what those URLs mean.
  {
    path: '/',
    redirect: () => `/${i18n.global.locale.value}`,
  },
  {
    path: '/privacy',
    redirect: () => `/${i18n.global.locale.value}/privacy`,
  },
  {
    // The regex constraint matters: without it, `/today` would match this as
    // `locale === 'today'` and shadow the real app routes below.
    path: '/:locale(en|ar)',
    children: [
      {
        path: '',
        name: 'landing',
        component: LandingView,
        meta: { layout: 'bare', titleKey: 'routes.landing', indexable: true },
      },
      // Bare, like the landing page: a legal document reached from the footer
      // shouldn't arrive wrapped in the habit-tracking chrome.
      {
        path: 'privacy',
        name: 'privacy',
        component: PrivacyView,
        meta: { layout: 'bare', titleKey: 'routes.privacy', indexable: true },
      },
    ],
  },
  {
    path: '/today',
    name: 'today',
    component: HomeView,
    meta: { titleKey: 'routes.today' },
  },
  {
    path: '/habits',
    name: 'habits',
    component: HabitsView,
    meta: { titleKey: 'routes.habits' },
  },
  // Declared before the `:id` route so the literal segment is unambiguous to
  // read here, even though the router would rank it higher regardless.
  {
    path: '/habits/new',
    name: 'new-habit',
    component: NewHabitView,
    meta: { titleKey: 'routes.newHabit' },
  },
  {
    path: '/habits/:id',
    name: 'habit-details',
    component: HabitDetails,
    meta: { titleKey: 'routes.habitDetails' },
  },
  {
    path: '/habits/:id/edit',
    name: 'habit-edit',
    component: NewHabitView,
    meta: { titleKey: 'routes.editHabit' },
  },
  {
    path: '/stats',
    name: 'stats',
    component: StatsView,
    meta: { titleKey: 'routes.stats' },
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView, meta: { titleKey: 'routes.notFound' } },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Restore the previous scroll position on back/forward, jump to a hash
  // target (the landing page's in-page links), and otherwise start at the top —
  // without this, navigating from a scrolled Stats page lands mid-screen.
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    return { top: 0 };
  },
});

/**
 * The tab title is the only "you are here" cue for someone with a dozen tabs
 * open. Routes carry a `titleKey`, not a title, so this resolves through i18n
 * at navigation time.
 *
 * Exported and also called from a locale watcher: `afterEach` only fires on
 * navigation, so without that watch, switching language would leave the tab
 * showing the previous language's title until the user navigated somewhere.
 */
export function applyDocumentTitle(route = router.currentRoute.value) {
  const key = route.meta.titleKey as string | undefined;
  const brand = i18n.global.t('brand');
  const title = key ? i18n.global.t(key) : brand;
  document.title = route.name === 'landing' ? title : `${title} · ${brand}`;
}

/**
 * A locale prefix in the URL is authoritative for that navigation.
 *
 * Someone arriving on `/ar` from a search result or a shared link should get
 * Arabic even if they once picked English on this device — the URL is a more
 * specific, more recent signal than the stored preference. `setLocale` also
 * persists it, so the choice carries into the unprefixed app routes.
 */
router.beforeEach((to) => {
  const urlLocale = to.params.locale;
  if (typeof urlLocale === 'string' && isSupportedLocale(urlLocale)) {
    if (i18n.global.locale.value !== urlLocale) setLocale(urlLocale);
  }
});

/**
 * Canonical + hreflang, maintained for the indexable pages.
 *
 * Only Google benefits from these, since it executes JavaScript; the static
 * tags in index.html are what non-JS social crawlers read. See the note there.
 */
const SITE_ORIGIN = 'https://wird-stack.ibrahim-alrayany.workers.dev';

function setLinkTag(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    if (hreflang) el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

function applySeoTags(route = router.currentRoute.value) {
  // Non-indexable app routes get no canonical: they are private views of local
  // data, and pointing a canonical at them would invite indexing we don't want.
  if (!route.meta.indexable) return;

  // The path with the locale segment stripped, e.g. '' or '/privacy'.
  const suffix = route.path.replace(/^\/(en|ar)/, '');
  const url = (loc: string) => `${SITE_ORIGIN}/${loc}${suffix}`;

  setLinkTag('canonical', url(i18n.global.locale.value));
  setLinkTag('alternate', url('en'), 'en');
  setLinkTag('alternate', url('ar'), 'ar');
  // x-default is what a crawler serves someone whose language matches neither.
  setLinkTag('alternate', url('en'), 'x-default');

  document.head
    .querySelector('meta[property="og:url"]')
    ?.setAttribute('content', url(i18n.global.locale.value));
}

router.afterEach((to) => {
  applyDocumentTitle(to);
  applySeoTags(to);
});

watch(
  () => i18n.global.locale.value,
  () => {
    applyDocumentTitle();
    applySeoTags();
  },
);

export default router;
