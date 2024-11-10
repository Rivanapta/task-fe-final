import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/plugins/api'

export const useUserStore = defineStore('user', () => {
  // state
  const token = ref(localStorage.getItem('token') || null)
  const storedUser = ref(localStorage.getItem('user') || null)

  // getters
  const user = computed(() => {
    if (storedUser.value) {
      return JSON.parse(storedUser.value)
    }
    return null  // Ensure it's null if user data is not available
  })

  const isAuthorized = computed(() => !!token.value)

  function storeToken(newToken) {
    localStorage.setItem('token', newToken)
    token.value = newToken
  }

  function storeUser(newUser) {
    const stringifiedUser = JSON.stringify(newUser)
    localStorage.setItem('user', stringifiedUser)
    storedUser.value = stringifiedUser
  }

  const login = async (credentials) => {
    try {
      // Call login API
      console.log('Credentials:', credentials);
      const response = await api.post('/auth/login', credentials);
      console.log('Response from login API:', response.data);
  
      // If successful, save token
      const newToken = response.data.data;
      if (!newToken) {
        console.error('Token not found in API response.');
        throw new Error('Invalid or empty token.');
      }
      storeToken(newToken);
      console.log('Token saved successfully:', newToken);
  
      // Call account/my API to get user data
      const responseMy = await api.get('/account/my', {
        headers: {
          Authorization: `Bearer ${newToken}`,  // Fixed header syntax
        },
      });
  
      // If successful, save user data
      if (responseMy.data && responseMy.data.data) {
        storeUser(responseMy.data.data);
      } else {
        console.error('User data is invalid:', responseMy.data);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Failed to login. Please check your credentials and try again.');
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    token.value = null
    storedUser.value = null
  }

  return {
    token,
    user,
    isAuthorized,
    storeToken,
    storeUser,
    login,
    logout,
  }
})
