<template>
    <v-container style="text-align: center; padding-top: 80px">
      <v-card class="mx-auto" max-width="400">
        <v-card-title class="text-h5">Change Password</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="oldPassword"
              label="Old Password"
              type="password"
              :rules="[rules.required, rules.minLength]"
            ></v-text-field>
            <v-text-field
              v-model="newPassword"
              label="New Password"
              type="password"
              :rules="[rules.required, rules.minLength]"
            ></v-text-field>
            <v-text-field
              v-model="confirmPassword"
              label="Confirm New Password"
              type="password"
              :rules="[rules.required, rules.matchPassword]"
            ></v-text-field>
            <v-btn color="primary" class="mt-4" @click="changePassword">
              Ubah Password
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import Swal from 'sweetalert2';
  
  const router = useRouter();
  const form = ref(null);
  
  const oldPassword = ref('');
  const newPassword = ref('');
  const confirmPassword = ref('');
  
  // Validation rules
  const rules = {
    required: (value) => !!value || 'Field is required',
    minLength: (value) => value.length >= 6 || 'Password must be at least 6 characters',
    matchPassword: (value) => value === newPassword.value || 'Passwords do not match',
  };
  
  // Function to handle password change
  const changePassword = async () => {
    const isFormValid = await form.value?.validate();
    if (!isFormValid) {
      Swal.fire('Error', 'Please fill in all required fields correctly.', 'error');
      return;
    }
  
    // Show confirmation dialog before proceeding
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to change your password?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2E8B57',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            Swal.fire('Not logged in', 'You are not logged in. Please login first.', 'warning');
            router.push({ name: 'login' });
            return;
          }
  
          const payload = {
            oldPassword: oldPassword.value,
            newPassword: newPassword.value,
            confirmPassword: confirmPassword.value,
          };
  
          const response = await axios.post('http://localhost:8080/auth/change-password', payload, {
            headers: { Authorization: `Bearer ${token}` },  // Fix header syntax
          });
  
          if (response.data.message === 'Password updated successfully') {
            // Clear the token to log out the user
            localStorage.removeItem('token');
  
            // Redirect to the login page
            await Swal.fire('Success', 'Password has been successfully changed.', 'success');
            router.push({ name: 'login' }); // Redirect to login page
          } else {
            Swal.fire('Failed', response.data.message || 'Failed to change password. Please try again.', 'error');
          }
        } catch (error) {
          console.error('Error changing password:', error);
          const errorMessage = error.response?.data?.message || error.message;
          Swal.fire('Error', `Error changing password: ${errorMessage}`, 'error');
        }
      }
    });
  };
  </script>
  
  <style scoped>
  .v-container {
    padding: 0;
  }
  </style>
  