<template>
  <v-responsive>
    <v-app id="app">
      <v-navigation-drawer v-model="drawer">
        <!-- sidebar -->
        <v-sheet class="pa-4" color="primary">
          <!-- Displaying the user's name dynamically -->
          <div class="font-weight-bold">Hello, {{ userName }}</div>
          May the Force be with you
        </v-sheet>

        <v-divider></v-divider>

        <v-list>
          <RouterLink
            v-for="{ icon, text, route, click } in sidebarLinks"
            :key="route"
            :to="route"
            custom
          >
            <v-list-item
              :prepend-icon="icon"
              :title="text"
              link
              @click="click"
              v-if="click"
            ></v-list-item>
            <v-list-item :prepend-icon="icon" :title="text" link :to="route" v-else></v-list-item>
          </RouterLink>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-img class="" max-width="100" :src="logo"></v-img>

        <v-spacer></v-spacer>
      </v-app-bar>

      <v-main id="main">
        <RouterView />
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup>
import { ref, computed } from 'vue'
import logo from '@/assets/logodompet.png'
import { mdiHome, mdiLogout, mdiLockReset, mdiAccount, mdiWallet } from '@mdi/js' // Import icons
import { RouterView, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()
const router = useRouter()

const drawer = ref(null)

// Computed property to get the logged-in user's name
const userName = computed(() => {
  const user = userStore.user
  return user ? user.name : 'Guest' // Default to 'Guest' if user is null
})

function logout() {
  userStore.logout()
  router.push({ name: 'login' })
}

// Adding items to sidebarLinks for additional navigation
const sidebarLinks = [
  { icon: mdiHome, text: 'Home', route: '/' },
  { icon: mdiAccount, text: 'Account', route: '/AccountList' },
  { icon: mdiLockReset, text: 'Change Password', route: '/change-password' },
  { icon: mdiWallet, text: 'Dompetku', route: '/dompetku' },
  { icon: mdiLogout, text: 'Logout', route: '/login', click: logout },
]
</script>
