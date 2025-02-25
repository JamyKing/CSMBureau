import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/index/index.vue'

let router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/AboutView.vue'),
    //   meta: { transition: 'slide-bottom' }
    // }
  ],
})

export default router
