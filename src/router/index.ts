import { createRouter, createWebHistory } from 'vue-router';
import LandingView from '@/views/LandingView.vue';

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
    meta: { layout: 'bare', title: 'WirdStack — small acts, kept up daily' },
  },
  {
    path: '/today',
    name: 'today',
    component: HomeView,
    meta: { title: 'Today' },
  },
  {
    path: '/habits',
    name: 'habits',
    component: HabitsView,
    meta: { title: 'Habits' },
  },
  // Declared before the `:id` route so the literal segment is unambiguous to
  // read here, even though the router would rank it higher regardless.
  {
    path: '/habits/new',
    name: 'new-habit',
    component: NewHabitView,
    meta: { title: 'New habit' },
  },
  {
    path: '/habits/:id',
    name: 'habit-details',
    component: HabitDetails,
    meta: { title: 'Habit' },
  },
  {
    path: '/habits/:id/edit',
    name: 'habit-edit',
    component: NewHabitView,
    meta: { title: 'Edit habit' },
  },
  {
    path: '/stats',
    name: 'stats',
    component: StatsView,
    meta: { title: 'Stats' },
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView, meta: { title: 'Not found' } },
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

// The tab title is the only "you are here" cue for someone with a dozen tabs open.
router.afterEach((to) => {
  const title = to.meta.title as string | undefined;
  document.title =
    to.name === 'landing' ? (title ?? 'WirdStack') : `${title ?? 'WirdStack'} · WirdStack`;
});

export default router;
