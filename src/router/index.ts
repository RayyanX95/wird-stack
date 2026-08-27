import { HomeView } from '@/views';
import HabitDetails from '@/views/HabitDetails.vue';
import HabitsView from '@/views/HabitsView.vue';
import NewHabitView from '@/views/NewHabitView.vue';
import StatsView from '@/views/StatsView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/habits',
    name: 'habits',
    component: HabitsView,
  },
  {
    path: '/habits/:id',
    name: 'habit-details',
    component: HabitDetails,
  },
  {
    path: '/habits/new',
    name: 'new-habit',
    component: NewHabitView,
  },

  {
    path: '/stats',
    name: 'stats',
    component: StatsView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;
