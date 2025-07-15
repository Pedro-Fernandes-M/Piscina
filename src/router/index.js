import { createRouter, createWebHistory } from 'vue-router'
import TheForm from '@/views/TheForm.vue'
import TheTable from '@/views/TheTable.vue'
import { ref } from 'vue'
import HomeBase from '@/views/HomeBase.vue'
import TheBedroom from '@/views/TheBedroom.vue'
import ChangeSettings from '@/views/ChangeSettings.vue'

const previousRoute = ref(null)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeBase,
    },
    {
      path: '/piscina',
      name: 'piscina',
      component: TheForm,
    },
    {
      path: '/table',
      name: 'table',
      component: TheTable,
    },
    {
      path: '/quartos',
      name: 'quartos',
      component: TheBedroom,
    },
    {
      path: '/settings',
      name: 'settings',
      component: ChangeSettings,
    },
  ],
})

router.beforeEach((to, from, next) => {
  previousRoute.value = from
  next()
})

export { router, previousRoute }
