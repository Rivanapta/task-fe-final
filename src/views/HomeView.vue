<template>
  <v-container class="py-5 text-center">
    <!-- Color Selector for Theme Customization -->
    <v-row justify="center" class="mb-6">
      <v-col cols="auto">
        <v-radio-group
          v-model="color"
          hide-details
          inline
        >
          <v-radio color="indigo" label="Indigo" value="indigo"></v-radio>
          <v-radio color="indigo-darken-3" label="Indigo Darken-3" value="indigo-darken-3"></v-radio>
          <v-radio color="primary" label="Primary" value="primary"></v-radio>
          <v-radio color="secondary" label="Secondary" value="secondary"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <!-- User Info and Balance Card -->
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card :color="color" class="mx-auto" elevation="6" max-width="500">
          <v-card-item>
            <div>
              <div class="text-overline mb-1">Welcome Back</div>
              <div class="text-h5 font-weight-bold mb-1">Hello, {{ userName }}</div>
              <div class="text-caption">Hope you have a wonderful day!</div>
            </div>
          </v-card-item>

          <v-card-item class="d-flex flex-column align-center">
            <v-icon large color="white">mdi-wallet</v-icon>
            <div class="display-2 font-weight-bold text-white mt-2">{{ userBalanceFormatted }}</div>
            <div class="text-caption text-white">Current Balance</div>
          </v-card-item>

          <!-- Card Actions for Quick Actions -->
          <v-card-actions>
            <v-row justify="center" no-gutters>
              <v-col cols="4">
                <v-btn text block color="white" @click="topUp">Top Up</v-btn>
              </v-col>
              <v-col cols="4">
                <v-btn text block color="white" @click="withdraw">Withdraw</v-btn>
              </v-col>
              <v-col cols="4">
                <v-btn text block color="white" @click="viewHistory">History</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { useRouter } from 'vue-router'
import axios from 'axios'

const userStore = useUserStore()
const router = useRouter()

// State for the selected color theme of the card
const color = ref('indigo')

// Check if the user is logged in
const isLoggedIn = computed(() => userStore.isAuthorized)

// Safe getters for userName and userBalance, check if user is null
const userName = computed(() => {
  const user = userStore.user
  return user ? user.name : 'Guest'  // Return 'Guest' if user is null
})

const userBalance = computed(() => {
  const user = userStore.user
  return user ? user.balance : 0  // Return 0 if user is null
})

// Format balance to currency (IDR or USD)
const userBalanceFormatted = computed(() => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(userBalance.value)
})

// Redirect if user is not logged in
onMounted(async () => {
  if (!isLoggedIn.value) {
    router.push({ name: 'login' })
  } else {
    // Fetch user data if not already present
    if (!userStore.user) {
      await fetchUserData()
    }
  }
})

// Fetch user data if it's not in the store
async function fetchUserData() {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found, user is not authenticated.')
      return
    }
    
    const response = await axios.get('http://localhost:8080/account/my', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    
    if (response.data && response.data.data) {
      userStore.storeUser(response.data.data) // Save the user data to the store
    } else {
      console.error('Invalid response structure:', response.data)
    }
  } catch (error) {
    console.error('Error fetching user data:', error.message)
  }
}

// Quick action methods
function topUp() {
  // Add top-up logic here
  alert('Top Up clicked!')
}

function withdraw() {
  // Add withdraw logic here
  alert('Withdraw clicked!')
}

function viewHistory() {
  // Add logic to view transaction history
  alert('View History clicked!')
}
</script>

<style scoped>
.text-center {
  text-align: center;
}

.display-2 {
  font-size: 2.5rem;
}

.text-white {
  color: white;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
</style>
