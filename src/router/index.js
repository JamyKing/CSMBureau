import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/views/index/index.vue'
import Detail from '@/views/index/detail.vue'
import About from '@/views/about/about.vue'

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
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/about/about.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/public/login.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/admin.vue')
    }
  ],
})

export default router
