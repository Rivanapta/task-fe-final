<template>
    <v-app>
      <v-container>
        <v-row justify="center" class="mt-5">
          <v-col cols="12" md="8">
            <!-- Form Input for Data -->
            <v-card>
              <v-card-title class="text-h5">Dompetku - Expense & Income Money Management</v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field v-model="description" label="Keterangan" required></v-text-field>
    
                  <!-- Dropdown for Transaction Type -->
                  <v-select v-model="type" :items="types" label="Pilih Jenis Transaksi" outlined required></v-select>
    
                  <!-- Dropdown for Category -->
                  <v-select v-model="category" :items="categories" label="Kategori" outlined required></v-select>
    
                  <v-text-field v-model="amount" label="Jumlah Uang" type="number" required></v-text-field>
    
                  <v-btn color="primary" @click="handleSubmit">Submit</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
    
            <!-- Summary Dashboard -->
            <v-row class="mt-4" dense>
              <!-- Total Transaksi Card -->
              <v-col cols="12" sm="6" md="3">
                <v-card outlined color="primary lighten-5">
                  <v-card-title class="justify-center">
                    <v-icon color="primary" large>mdi-format-list-bulleted</v-icon>
                  </v-card-title>
                  <v-card-subtitle class="text-center text-h6 font-weight-bold">Total Transaksi</v-card-subtitle>
                  <v-card-text class="text-center text-h5 font-weight-bold">{{ records.length }}</v-card-text>
                </v-card>
              </v-col>
    
              <!-- Jumlah Masuk Card -->
              <v-col cols="12" sm="6" md="3">
                <v-card outlined color="green lighten-5">
                  <v-card-title class="justify-center">
                    <v-icon color="green" large>mdi-cash-plus</v-icon>
                  </v-card-title>
                  <v-card-subtitle class="text-center text-h6 font-weight-bold">Jumlah Masuk</v-card-subtitle>
                  <v-card-text class="text-center text-h5 font-weight-bold">Rp {{ totalIncome.toLocaleString() }}</v-card-text>
                </v-card>
              </v-col>
    
              <!-- Jumlah Keluar Card -->
              <v-col cols="12" sm="6" md="3">
                <v-card outlined color="red lighten-5">
                  <v-card-title class="justify-center">
                    <v-icon color="red" large>mdi-cash-minus</v-icon>
                  </v-card-title>
                  <v-card-subtitle class="text-center text-h6 font-weight-bold">Jumlah Keluar</v-card-subtitle>
                  <v-card-text class="text-center text-h5 font-weight-bold">Rp {{ totalExpense.toLocaleString() }}</v-card-text>
                </v-card>
              </v-col>
    
              <!-- Saldo Akhir Card -->
              <v-col cols="12" sm="6" md="3">
                <v-card outlined color="blue lighten-5">
                  <v-card-title class="justify-center">
                    <v-icon color="blue" large>mdi-bank</v-icon>
                  </v-card-title>
                  <v-card-subtitle class="text-center text-h6 font-weight-bold">Saldo Akhir</v-card-subtitle>
                  <v-card-text class="text-center text-h5 font-weight-bold">
                    Rp {{ balance.toLocaleString() }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
    
            <!-- Financial Summary List -->
            <v-card class="mt-5">
              <v-card-title class="text-h6">Rekap Keuangan</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item v-for="(record, index) in records" :key="index">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ record.description }} - {{ record.category }} - {{ record.type }}
                      </v-list-item-title>
                      <v-list-item-subtitle>Rp {{ record.amount.toLocaleString() }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <!-- Icon button with white delete icon -->
                      <v-btn text color="red" @click="removeRecord(index)"> 
                        <small>delete</small>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-btn color="red" @click="confirmClearAll = true">Hapus Semua Data</v-btn>
              </v-card-actions>
    
              <!-- Dialog for Confirming Clear All -->
              <v-dialog v-model="confirmClearAll" max-width="400px">
                <v-card>
                  <v-card-title class="headline">Konfirmasi Hapus Semua</v-card-title>
                  <v-card-text>
                    Apakah Anda yakin ingin menghapus semua data?
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="confirmClearAll = false">Batal</v-btn>
                    <v-btn color="red darken-1" text @click="clearAllRecords">Hapus</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </template>
  
  <script>
  export default {
    data() {
      return {
        description: '',
        type: null,
        types: ['Transaksi Masuk', 'Transaksi Keluar'],
        category: null,
        categories: ['Food', 'Transport', 'Shopping', 'Bills', 'Others'],
        amount: null,
        valid: true,
        records: [],
        confirmClearAll: false,
      };
    },
    computed: {
      totalIncome() {
        return this.records
          .filter((record) => record.type === 'Transaksi Masuk')
          .reduce((sum, record) => sum + record.amount, 0);
      },
      totalExpense() {
        return this.records
          .filter((record) => record.type === 'Transaksi Keluar')
          .reduce((sum, record) => sum + record.amount, 0);
      },
      balance() {
        return this.totalIncome - this.totalExpense;
      },
    },
    created() {
      this.loadFromLocalStorage();
    },
    methods: {
      handleSubmit() {
        if (this.description && this.amount && this.type && this.category) {
          this.records.push({
            description: this.description,
            amount: parseInt(this.amount),
            type: this.type,
            category: this.category,
          });
          // Reset form after submit
          this.description = '';
          this.amount = null;
          this.type = null;
          this.category = null;
          this.saveToLocalStorage();
        }
      },
      removeRecord(index) {
        this.records.splice(index, 1);
        this.saveToLocalStorage();
      },
      clearAllRecords() {
        this.confirmClearAll = false;
        this.records = [];
        this.saveToLocalStorage();
      },
      saveToLocalStorage() {
        localStorage.setItem('records', JSON.stringify(this.records));
      },
      loadFromLocalStorage() {
        const savedRecords = localStorage.getItem('records');
        if (savedRecords) {
          this.records = JSON.parse(savedRecords);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .v-application {
    background-color: #f5f5f5;
  }
  .v-btn {
    margin-top: 10px;
  }
  .v-card {
    padding: 20px;
  }
  </style>
  