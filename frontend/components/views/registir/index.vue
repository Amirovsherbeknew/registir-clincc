<template>
  <Card class="flex flex-col gap-[20px]">
    <div class="flex items-center">
      <VTitle class="flex-1" title="Ro'yxatga olingan mijozlar ro'yxati"/>
      <div class="max-w-1/2 flex gap-[10px]">
        <el-input
        v-model="searchQuery"
        placeholder="Qidiruv..."
        clearable
        class="w-[300px] mr-[16px]"
      />
      <el-button type="primary" @click="$router.push('/registir/create')" class="flex gap-[8px]">
        <div class="flex !gap-[8px] items-center">
          Mijoz ro'yxatga olish
          <IconPlusRectangle/>
        </div>
      </el-button>
      </div>
    </div>
    <el-table :data="filteredData" border style="width: 100%">
      <el-table-column label="FIO">
        <template #default="scope">
          {{ scope.row.last_name }} {{ scope.row.first_name }} {{ scope.row.middle_name }}
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="Jinsi"/>
      <el-table-column prop="phone" label="Telefon raqami" />
      <el-table-column label="Ro'yxatga olingan vaqti">
        <template #default="scope">
          {{ formattedDate(scope.row.create_at) }}
        </template>
      </el-table-column>
    </el-table>
  </Card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const tableData = ref([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
])

const searchQuery = ref('')

const filteredData = computed(() => {
  if (!searchQuery.value) return tableData.value
  return tableData.value.filter((item) =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  )
})

onMounted(() => {
  getRegistirClients()
})

async function getRegistirClients() {
  const { data, error } = await useFetchApi.get('/clients')
  if (!error.value) {
    tableData.value = data.value
  }
}
const formattedDate = (date) => {
  const d = new Date(date)
  return d.toLocaleDateString('uz-UZ') + ' ' + d.toLocaleTimeString('uz-UZ')
}
</script>