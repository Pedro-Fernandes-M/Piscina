import { createRouter, createWebHistory } from 'vue-router'
import TheForm from '@/views/TheForm.vue'
import TheTable from '@/views/TheTable.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TheForm,
    },
    {
      path: '/table',
      name: 'table',
      component: TheTable,
    },
  ],
})

export default router
