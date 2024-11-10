import { createRouter, createWebHistory } from 'vue-router'
import LoginLayout from '@/views/layouts/LoginLayout.vue'
import HomeLayout from '@/views/layouts/HomeLayout.vue'
import AccountList from '@/views/AccountList.vue'
import change_password from '@/views/change-password.vue'
import HomeView from '@/views/HomeView.vue'
// import Dompetku from '@/views/Dompetku.vue'
import LoginView from '@/views/LoginView.vue'
import { useUserStore } from '@/stores/user.js'
import Dompetku from '@/views/Dompetku.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: { layout: LoginLayout },
      component: LoginView,
    },
    {
      path: '/',
      name: 'home',
      meta: { layout: HomeLayout },
      component: HomeView,
    },
    {
      path: '/AccountList',
      name: 'AccountList',
      meta: { layout: HomeLayout },
      component: AccountList,
    },
    {
      path: '/change-password',
      name: 'change-password',
      meta: { layout: HomeLayout },
      component: change_password,
    },
    {
      path: '/dompetku',
      name: 'dompetku',
      meta: { layout: HomeLayout },
      component: Dompetku,
    },
  ],
})

// Global route guard to check for token
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.name !== 'login' && !userStore.token) next({ name: 'login' })
  else if (to.name == 'login' && userStore.token) next({ name: 'home' })
  else next()
})

export default router
