<template>
    <Card>
        <div class="min-h-screen bg-gray-50">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">Kunlik Hisobot</h1>
  
      <!-- Filter Section -->
      <el-card shadow="hover" class="mb-6">
        <div class="flex gap-[10px]">
          <div class="flex gap-4">
            <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Xizmat turi</label>
            <el-select
              v-model="selectedService"
              placeholder="Xizmat turini tanlang"
              clearable
              class="min-w-[250px]"
            >
              <el-option
                v-for="(service,idx) in useConstant().visitType()"
                :key="idx"
                :label="service.label"
                :value="service.value"
              />
            </el-select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sana</label>
            <el-date-picker
              v-model="selectedDate"
              type="date"
              placeholder="Sanani tanlang"
              format="DD-MM-YYYY"
              value-format="DD-MM-YYYY"
              class="w-full"
            />
          </div>
          </div>
          <div class="flex items-end">
            <ActionButton type="search" @click="fetchReport"/>
          </div>
        </div>
      </el-card>
      <!-- Report Table -->
      <el-card shadow="hover">
        <el-table
          :data="staticsData?.statistic || []"
          style="width: 100%"
          empty-text="Ma'lumot topilmadi"
          class="rounded-lg"
        >
          <el-table-column prop="fullName" label="F.I.O" />
          <el-table-column label="Sana" >
            <template #default="scope">
              {{ useDateFormat(scope.row.create_at) }}
            </template>
          </el-table-column>
          <el-table-column label="Xizmat ko'rsatilgan narx">
            <template #default="scope">
              {{ useCurrencyFormat(scope.row?.totalPrice) }}
            </template>
          </el-table-column>
          <el-table-column label="Ko'rsatilgan xizmatlar">
            <template #default="scope">
              <div v-for="item in scope.row.visitTypes" :key="item.value">{{ item.label }}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
  
      <!-- Summary -->
      <el-card shadow="hover" class="mt-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Jami</h2>
        <p class="text-gray-600">Umumiy mijozlar: {{ staticsData?.statistic?.length || 0 }}</p>
        <p class="text-gray-600">Umumiy to‘lov: {{ useCurrencyFormat(totalPrice)}}</p>
      </el-card>
    </div>
    {{ selectedDate }}
    </Card>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { statics } from '~/server/statistic'
  import dayjs from 'dayjs'
  // Xizmat turlari
  const totalPrice = ref(0)
  const staticsData = ref()
  // Filter uchun reaktiv o‘zgaruvchilar
  const selectedService = ref('')
  const selectedDate = ref(dayjs().format('DD-MM-YYYY'))
  const originalStatics = ref() 
  onMounted(async () => {
    const data = await statics()
    staticsData.value = data
    originalStatics.value = JSON.parse(JSON.stringify(data));
    totalPrice.value = data.total
  })

  // Filtrlash funksiyasi
  const fetchReport = () => {
    console.log('s')
    console.log(selectedService.value)
    console.log(originalStatics.value.statistic)
    const filtered = originalStatics.value.statistic.filter((resp) => {
      console.log(resp.visitTypes.some((v) => v.value === selectedService.value))
      const itemDate = dayjs(resp.create_at).format('DD-MM-YYYY')
      const isSameDate = selectedDate.value
        ? itemDate === selectedDate.value // Sana tanlangan bo'lsa solishtir
        : true  

      const isSameService = selectedService.value
        ? resp.visitTypes.some((v) => v.value === selectedService.value)
        : true
        return isSameDate && isSameService
      })
      
      console.log(filtered)
    staticsData.value.statistic = filtered
    totalPrice.value = 0
    filtered.forEach((resp) => {
      if (resp.totalPrice) {
        totalPrice.value = totalPrice.value + resp.totalPrice
      }
    })
  }
  </script>
  
  <style scoped>
  /* Tailwind CSS bilan qo‘shimcha stil */
  .el-card {
    border-radius: 8px;
  }
  </style>