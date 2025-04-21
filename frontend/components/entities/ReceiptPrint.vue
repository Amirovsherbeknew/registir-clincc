<template>
    <div>
      <!-- Chek Dizayni -->
      <div
        id="print-area"
        ref="printSection"
        class="receipt p-4 bg-white border rounded-md w-full mx-auto text-sm font-mono"
      >
        <h2 class="text-center font-bold text-lg mb-2" v-if="data.isPaid">To‘lov Cheki</h2>
        <h2 class="text-center font-bold text-lg mb-2" v-else>To‘lov uchun chek</h2>
        <h1 class="text-center font-bold text-xl mb-2">{{ data.id }}</h1>
        <p><strong>Ism:</strong> {{ data.first_name }}</p>
        <p><strong>Familiya:</strong> {{ data.last_name }}</p>
        <p><strong>Telefon:</strong> {{ data.phone }}</p>
        <p v-if="data.isPaid"><strong>To‘lov summasi:</strong> {{ data.amount }} so‘m</p>
        <p><strong>Sana:</strong> {{ formattedDate }}</p>
      </div>
  
      <!-- Chop Button -->
      <el-button class="no-print" @click="printSection">🖨️ Chop qilish</el-button>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import printJS from 'print-js'
  
  // Props orqali ma’lumot olish
  const props = defineProps({
    data: {
      type: Object,
      required: true,
      default: () => ({
        first_name: '',
        last_name: '',
        phone: '',
        amount: 0,
        date: new Date()
      })
    }
  })
  
  const formattedDate = computed(() => {
    const d = new Date(props.data.create_at || props.data.date)
    return d.toLocaleDateString('uz-UZ') + ' ' + d.toLocaleTimeString('uz-UZ')
  })
  
  const printSection = () => {
    printJS({
      printable: 'print-area',
      type: 'html',
      style: `
        @media print {
          body {
            width: 58mm;
            margin: 0;
            padding: 0;
            font-family: monospace;
            font-size: 12px;
          }
  
          .receipt {
            width: 100%;
            border: none;
            box-shadow: none;
          }
  
          .no-print {
            display: none !important;
          }
        }
  
        .receipt {
          font-family: monospace;
        }
  
        h1, h2 {
          text-align: center;
          margin: 0;
          padding: 5px 0;
        }
  
        p {
          margin: 3px 0;
        }
      `,
      targetStyles: ['*']
    })
  }
  </script>
  
  <style scoped>
  .receipt {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  /* Chopda ko‘rinmasin */
  .no-print {
    display: inline-block;
  }
  
  @media print {
    .no-print {
      display: none !important;
    }
  }
  </style>
  