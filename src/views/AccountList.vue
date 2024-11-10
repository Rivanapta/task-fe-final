<template>
    <v-app>
      <v-container>
        <!-- Create Account Button -->
        <v-card class="mb-4">
          <v-card-title class="table-title">
            <span class="headline">Account List</span>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="openCreateDialog">Create Account</v-btn>
          </v-card-title>
          
          <!-- Account List Table -->
          <v-data-table
            :items="lists"
            :headers="headers"
            class="elevation-1 large-table"
            :items-per-page="5"
            dense
          >
            <template v-slot:[`item.balance`]="{ item }">
              {{ formatCurrency(item.balance) }}
            </template>
  
            <!-- Actions Buttons (Update and Delete) -->
            <template v-slot:item.actions="{ item }">
              <v-btn @click="openUpdateDialog(item)" color="primary" small>Edit</v-btn>
              <v-btn @click="deleteAccount(item.account_id)" color="red" small class="ml-2">Delete</v-btn>
            </template>
          </v-data-table>
        </v-card>
  
        <!-- Account Statistics Cards -->
        <v-card class="mt-4">
          <v-card-title class="table-title">
            <span class="headline">Account Statistics</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-card class="stat-card mb-4">
                  <v-card-title>Total Accounts: {{ totalAccounts }}</v-card-title>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card class="stat-card mb-4">
                  <v-card-title>Total Balance: {{ formatCurrency(totalBalance) }}</v-card-title>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card class="stat-card mb-4">
                  <v-card-title>Average Balance: {{ formatCurrency(averageBalance) }}</v-card-title>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
  
        <!-- Dialog for Create and Update Account -->
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span v-if="dialogMode === 'create'">Create Account</span>
              <span v-else>Edit Account</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="accountForm">
                <v-text-field v-model="accountFormData.name" label="Account Name" required></v-text-field>
                <v-text-field v-model="accountFormData.balance" label="Balance" type="number" required></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="closeDialog">Cancel</v-btn>
              <v-btn color="success" text @click="submitForm">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-app>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import axios from 'axios'
  import Swal from 'sweetalert2'
  import { useUserStore } from '@/stores/user'
  
  // Account data and statistics state
  const lists = ref([])
  const stats = ref([])
  
  // Dialog states and form data
  const dialog = ref(false)
  const dialogMode = ref('create')  // 'create' or 'edit'
  const accountFormData = ref({ name: '', balance: '', account_id: null })
  
  // Table headers for v-data-table
  const headers = [
    { text: 'Name', value: 'name' },
    { text: 'Balance', value: 'balance' },
    { text: 'Account ID', value: 'account_id' },
    { text: 'Actions', value: 'actions', sortable: false }
  ]
  
  // Currency formatting function
  function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
  }
  
  const userStore = useUserStore()
  
  // Computed properties for total and average balance
  const totalAccounts = computed(() => lists.value.length)
  const totalBalance = computed(() => lists.value.reduce((acc, account) => acc + account.balance, 0))
  const averageBalance = computed(() => totalBalance.value / (totalAccounts.value || 1))
  
  // Fetch account list data
  const fetchList = async () => {
    try {
      const response = await axios.get('http://localhost:8080/account/list', {
        headers: {
          Authorization: userStore.token
        }
      })
      lists.value = response.data.data
    } catch (error) {
      console.error('Error fetching accounts:', error)
    }
  }
  
  // CRUD methods
  const openCreateDialog = () => {
    dialogMode.value = 'create'
    accountFormData.value = { name: '', balance: '', account_id: null }
    dialog.value = true
  }
  
  const openUpdateDialog = (account) => {
    dialogMode.value = 'edit'
    accountFormData.value = { ...account }
    dialog.value = true
  }
  
  const closeDialog = () => {
    dialog.value = false
  }
  
  // Create account logic
  const createAccount = async () => {
    try {
      const accountData = {
        name: accountFormData.value.name,
        balance: Number(accountFormData.value.balance)
      }
      
      const response = await axios.post('http://localhost:8080/account/create', accountData)
      
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Account Created',
          text: 'Your account has been successfully created!',
          confirmButtonColor: '#2E8B57',
        })
        fetchList() // Refresh the list
        closeDialog()
      } else {
        throw new Error('Unexpected response status: ' + response.status)
      }
    } catch (error) {
      console.error('Error creating account:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error creating the account. Please try again.',
        confirmButtonColor: '#FF4136',
      })
    }
  }
  
  // Update account logic
  const updateAccount = async () => {
  // Pastikan account_id terdefinisi
  if (!accountFormData.value.account_id) {
    console.error("Account ID is undefined, cannot update account.");
    return;
  }

  try {
    // Data yang akan dikirimkan
    const updatedAccount = {
      name: accountFormData.value.name,
      balance: Number(accountFormData.value.balance), // Pastikan balance dalam bentuk angka
    };

    // Lakukan request update dengan axios
    const response = await axios.patch(
      `http://localhost:8080/account/update/${accountFormData.value.account_id}`,
      updatedAccount
    );

    // Cek jika respons sukses (200 atau 204 jika tidak ada konten dikembalikan)
    if (response.status === 200 || response.status === 204) {
      // SweetAlert untuk update sukses
      Swal.fire({
        icon: "success",
        title: "Account Updated",
        text: "Account has been successfully updated!",
        confirmButtonColor: "#2E8B57",
      });

      // Refresh daftar akun dan tutup dialog
      fetchList();
      closeDialog();
    } else {
      // Jika status kode lain selain 200 atau 204
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    // SweetAlert untuk error
    console.error("Error updating account:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "There was an error updating the account. Please try again.",
      confirmButtonColor: "#FF4136",
    });
  }
};

// Fungsi submit form untuk menentukan apakah 'create' atau 'update'
const submitForm = () => {
  if (dialogMode.value === "create") {
    createAccount(); // Panggil fungsi create jika mode create
  } else {
    updateAccount(); // Panggil fungsi update jika mode update
  }
};

  
  // Delete account
  const deleteAccount = async (accountId) => {
  if (!accountId) {
    console.error('Invalid accountId:', accountId);
    alert('Account ID is missing or invalid.');
    return;
  }

  try {
    const response = await axios.delete(`http://localhost:8080/account/delete/${accountId}`, {
      headers: { Authorization: userStore.token }
    });

    if (response.status === 200) {
      // Show success alert
      Swal.fire('Deleted!', 'Your account has been deleted.', 'success');

      // Remove the deleted account from the list
      lists.value = lists.value.filter(account => account.account_id !== accountId);

      // Fetch the updated list
      fetchList();
    } else {
      throw new Error('Failed to delete account');
    }
  } catch (error) {
    console.error('Error deleting account:', error);

    // Show error alert
    Swal.fire('Error', 'Failed to delete the account. Please try again.', 'error');
  }
};


  
  // Fetch data on component mount
  onMounted(() => {
    fetchList()
  })
  </script>
  
  <style scoped>
  .table-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.5rem;
  }
  
  .large-table {
    font-size: 1.2rem;
    width: 100%;
  }
  
  .stat-card {
    font-size: 1.1rem;
    padding: 1rem;
  }
  
  .headline {
    font-size: 1.8rem;
  }
  
  .v-data-table__wrapper {
    overflow-x: auto;
  }
  
  .ml-2 {
    margin-left: 8px;
  }
  </style>
  