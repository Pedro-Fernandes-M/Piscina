import { createRouter, createWebHistory } from 'vue-router'
import TheForm from '@/views/TheForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TheForm,
    },
  ],
})

export default router
