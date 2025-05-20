<template>
  <div class="w-full">
    <div
      id="print-area"
      ref="printSection"
      class="receipt p-4 bg-white rounded-md w-full mx-auto text-sm font-mono"
    >
      <h2 class="text-center font-bold text-lg mb-2" v-if="data.isPaid">To'lov Cheki</h2>
      <h2 class="text-center font-bold text-lg mb-2" v-else>To'lov uchun chek</h2>
      <h1 class="text-center text-4xl font-semibold text-blue-600 mb-2">{{ data.id }}</h1>
      
      <!-- Используем таблицу для гарантированного разделения -->
      <table class="w-full mb-2">
        <tr>
          <td class="font-bold w-1/3">Ism:</td>
          <td class="text-right">{{ data?.clientInfo?.first_name }}</td>
        </tr>
        <tr>
          <td class="font-bold">Familiya:</td>
          <td class="text-right">{{ data?.clientInfo?.last_name }}</td>
        </tr>
        <tr>
          <td class="font-bold">Jinsi:</td>
          <td class="text-right">{{ useConstant().gender(data?.clientInfo?.gender)?.label }}</td>
        </tr>
        <tr>
          <td class="font-bold">Telefon:</td>
          <td class="text-right">{{ data?.clientInfo?.phone }}</td>
        </tr>
        <tr v-if="data.isPaid">
          <td class="font-bold">To'lov summasi:</td>
          <td class="text-right">{{ data.amount }} so'm</td>
        </tr>
        <tr>
          <td class="font-bold">Sana:</td>
          <td class="text-right">{{ useDateFormat(data.create_at || props.data.date) }}</td>
        </tr>
      </table>
      
      <hr>
      <p class="font-bold my-2">Xizmatlar:</p>
      <hr>
      
      <!-- Медицинские услуги -->
      <table class="w-full" v-if="data?.clientInfo?.visitTypes.includes('med')">
        <tr v-for="item in data?.clientInfo.medServices" class="my-1">
          <td class="font-bold w-2/3">{{item.name}}:</td>
          <td class="text-right">{{ useCurrencyFormat(item.price) }}</td>
        </tr>
      </table>
      
      <!-- Услуги проживания -->
      <table class="w-full" v-if="data?.clientInfo?.visitTypes.includes('room')">
        <tr class="my-1">
          <td class="font-bold w-1/2">Yotoqxona:</td>
          <td class="text-right">
            {{ Number(data?.clientInfo?.room?.priceDay) }} x 
            {{ data?.clientInfo?.room?.days }} = 
            {{ useCurrencyFormat(Number(data?.clientInfo?.room?.price)) }}
          </td>
        </tr>
      </table>
      
      <!-- Лабораторные тесты -->
      <table class="w-full" v-if="data?.clientInfo?.visitTypes.includes('lab')">
        <tr v-for="item in data?.clientInfo.labTests" class="my-1">
          <td class="font-bold w-2/3">{{item.name}}:</td>
          <td class="text-right">{{ useCurrencyFormat(item.price) }}</td>
        </tr>
      </table>
      
      <table class="w-full" v-if="data?.clientInfo?.doctorInfo">
        <tr class="my-1">
          <td class="font-bold w-2/3">Shifokor:</td>
          <td class="text-right">{{ data?.clientInfo?.doctorInfo?.first_name }} {{ data?.clientInfo?.doctorInfo?.last_name }} {{ data?.clientInfo?.doctorInfo?.middle_name }}</td>
        </tr>
      </table>

      <hr>
      <table class="w-full mt-4">
        <tr>
          <td class="font-bold text-xl w-1/3">Jami:</td>
          <td class="text-right text-xl">{{ useCurrencyFormat(data?.totalPrice)}}</td>
        </tr>
      </table>
    </div>
    <!-- Кнопка оплаты -->
    <div class="w-full">
      <el-form :model="form" :rules="useRules('part_pay_price')">
        <el-form-item label="To'lov turi:">
          <el-select v-model="paymentType" placeholder="To'lov turi">
            <el-option label="To'liq to'lov" value="all"></el-option>
            <el-option label="Qisman to'lov" value="part"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Miqdori:" prop="part_pay_price">
          <el-input v-model="form.part_pay_price" placeholder=""/>
        </el-form-item>
        <el-form-item>
          <template v-if="role === 'kassir'">
            <p v-if="responsePaid || data?.isPaid || data?.is_paid" class="mt-4 text-green-500 text-2xl font-medium text-center">
              To'langan
            </p>
            <button  type="button"
              v-else
              @click="handlePaid(data.id)"
              class="w-full mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              To'lash
            </button>
          </template>
        </el-form-item>
      </el-form>
      
      <button type="button"
        v-if="role === 'operator'"
        @click="printSection"
        class="w-full mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
      >
        Checkni chop etish
      </button>
    </div>
  </div>
</template>

<script setup>
import printJS from 'print-js'
const emit = defineEmits(['handleSearch'])
const { getRole } = useToken();

// Props orqali ma'lumot olish
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

const role = getRole()
const responsePaid = ref(false)
const paymentType = ref(false)

const form = ref({
  part_pay_price:undefined
})

async function handlePaid(id) {
  const 
  const { data,error } = await useFetchApi.patch(`/checks/${id}`, { isPaid:true })
  if (!error.value) {
    emit('handleSearch')
    responsePaid.value = data.value.isPaid
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

<style scoped>
/* Дополнительные стили для корректного отображения в печати */
@media print {
  table {
    width: 100%;
    table-layout: fixed;
  }
  
  td {
    overflow-wrap: break-word;
    word-wrap: break-word;
  }
}
</style>