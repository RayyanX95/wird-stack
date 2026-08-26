import { HomeView } from '@/views'
import HabitsView from '@/views/HabitsView.vue'
import StatsView from '@/views/StatsView.vue'
import { createRouter, createWebHistory } from 'vue-router'

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
    path: '/stats',
    name: 'stats',
    component: StatsView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
