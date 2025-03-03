import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PlayView from '../views/PlayView.vue'
import AutoPlayView from '../views/AutoPlayView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/play',
      name: 'play',
      component: PlayView,
    },
    {
      path: '/autoplay',
      name: 'autoplay',
      component: AutoPlayView,
    },
  ],
})

export default router
