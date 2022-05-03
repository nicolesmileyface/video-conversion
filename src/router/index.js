// https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes
import { createWebHistory, createRouter } from 'vue-router'
import Home from '../pages/home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Home',
    component: Home,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
