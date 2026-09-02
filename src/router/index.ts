import { watch } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import LandingView from '@/views/LandingView.vue';
import i18n from '@/i18n';

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
 * `/` is the landing page and renders bare — no sidebar, no tab bar (see
 * `meta.layout`, which App.vue reads). The app itself starts at `/today`.
 */
const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingView,
    meta: { layout: 'bare', titleKey: 'routes.landing' },
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
  // Bare, like the landing page: a legal document reached from the footer
  // shouldn't arrive wrapped in the habit-tracking chrome.
  {
    path: '/privacy',
    name: 'privacy',
    component: PrivacyView,
    meta: { layout: 'bare', titleKey: 'routes.privacy' },
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

router.afterEach((to) => applyDocumentTitle(to));

watch(() => i18n.global.locale.value, () => applyDocumentTitle());

export default router;
