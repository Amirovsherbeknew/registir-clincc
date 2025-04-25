<template>
    <div class="w-full">
      <div
        id="print-area"
        ref="printSection"
        class="receipt p-4 bg-white rounded-md w-full mx-auto text-sm font-mono"
      >
        <h2 class="text-center font-bold text-lg mb-2" v-if="data.isPaid">To‘lov Cheki</h2>
        <h2 class="text-center font-bold text-lg mb-2" v-else>To‘lov uchun chek</h2>
        <h1 class="text-center text-4xl font-semibold text-blue-600 mb-2">{{ data.id }}</h1>
        <p class="flex justify-between"><strong>Ism:</strong> {{ data?.clientInfo?.first_name }}</p>
        <p class="flex justify-between"><strong>Familiya:</strong> {{ data?.clientInfo?.last_name }}</p>
        <p class="flex justify-between"><strong>Jinsi:</strong> {{ useConstant().gender(data?.clientInfo?.gender)?.label }}</p>
        <p class="flex justify-between"><strong>Telefon:</strong> {{ data?.clientInfo?.phone }}</p>
        <p class="flex justify-between" v-if="data.isPaid"><strong>To‘lov summasi:</strong> {{ data.amount }} so‘m</p>
        <p class="flex justify-between mb-[10px]"><strong>Sana:</strong> {{ useDateFormat(data.create_at || props.data.date) }}</p>
        <hr>
        <p class="flex justify-between my-[10px] font-[700]"><strong>Xizmatlar:</strong></p>
        <hr>
        <!-- <p class="flex justify-between my-[10px] border-b border-dashed" v-if="data?.clientInfo?.visitTypes.includes('med')"><strong>Med ko'rik:</strong> {{ usePriceCalculate(data?.clientInfo.medServices) }}</p> -->
          <template v-if="data?.clientInfo?.visitTypes.includes('med')">
            <p class="flex justify-between my-[5px]" v-for="item in data?.clientInfo.medServices"><strong>{{item.name}}:</strong>{{ useCurrencyFormat(item.price) }}</p>
          </template>
        <!-- <hr> -->
        <p class="flex justify-between my-[5px] " v-if="data?.clientInfo?.visitTypes.includes('room')"><strong>Yotoqxona:</strong> {{ useCurrencyFormat(Number(data?.clientInfo?.room?.priceDay)) }} x {{ data?.clientInfo?.room?.days }} = {{ useCurrencyFormat(Number(data?.clientInfo?.room?.price)) }}</p>
        <!-- <hr> -->
        <!-- <p class="flex justify-between my-[10px] border-b border-dashed" v-if="data?.clientInfo?.visitTypes.includes('lab')"><strong>Laboratoriya test:</strong> {{ usePriceCalculate(data?.clientInfo.labTests) }}</p> -->
          <template v-if="data?.clientInfo?.visitTypes.includes('lab')">
            <p class="flex justify-between my-[5px]" v-for="item in data?.clientInfo.labTests"><strong>{{item.name}}:</strong> {{ item.price }}</p>
          </template>
        <hr>
        <p class="flex justify-between mt-[30px] text-[20px]"><strong>Jami:</strong> {{ useCurrencyFormat(data?.totalPrice)}}</p>
      </div>
  
      <!-- Chop Button -->
      <div class="w-full">
        
        <!-- Agar to‘langan bo‘lsa -->
        <p v-if="data?.isPaid || data?.is_paid" @click="handlePaid(data.id)" class="mt-4 text-green-500 text-2xl font-medium text-center">
          To‘langan
        </p>
        <button 
          v-else
          @click="handlePaid(data.id)"
          class="w-full mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          To‘lash
        </button>
      </div>
      <!-- <el-button class="no-print" @click="printSection">🖨️ Chop qilish</el-button> -->
    </div>
  </template>
  
  <script setup>
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

  async function handlePaid(id) {
    const { error } = await useFetchApi.patch(`/checks/${id}`, { isPaid: !props.data.isPaid })
    if (!error.value) {
      printSection()
    }
  }

  const printSection = () => {
    printJS({
      printable: 'print-area',
      type: 'html',
      targetStyles: ['*']
    })
  }
  </script>
  
  <!-- <style scoped>
  /* .receipt {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  } */
  
  /* Chopda ko‘rinmasin */
  .no-print {
    display: inline-block;
  }
  
  @media print {
    .no-print {
      display: none !important;
    }
  }
  </style> -->
  