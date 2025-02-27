import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/index/index.vue'
import Detail from '../views/index/detail.vue'

let router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: 'index'
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    },
    {
      path: '/detail',
      name: 'detail',
      component: Detail
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/AboutView.vue'),
    //   meta: { transition: 'slide-bottom' }
    // }
  ],
})

export default router
