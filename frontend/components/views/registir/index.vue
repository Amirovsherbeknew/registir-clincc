<template>
  <Card class="flex flex-col gap-[20px]">
    <div class="flex items-center">
      <VTitle class="flex-1" title="Ro'yxatga olingan mijozlar ro'yxati"/>
      <div class="max-w-1/2 flex gap-[10px]">
        <el-input
        v-model="searchQuery"
        placeholder="Qidiruv..."
        clearable
        class="w-[300px]"
      />
      </div>
    </div>
    <el-table :data="tableData?.data || []" border style="width: 100%">
      <el-table-column label="FIO">
        <template #default="scope">
          {{ scope.row.last_name }} {{ scope.row.first_name }} {{ scope.row.middle_name }}
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="Jinsi">
        <template #default="scope">
          {{ useConstant().gender(scope.row.gender).label }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="Telefon raqami" />
      <el-table-column label="Ro'yxatga olingan vaqti">
        <template #default="scope">
          {{ formattedDate(scope.row.create_at) }}
        </template>
      </el-table-column>
      <el-table-column label="Harakat" width="150" align="center">
          <template #default="scope">
              <div class="flex-center">
                <ActionButton :disabled="!scope.row?.visitTypes?.includes('room')" type="show" tooltip_title="Xona haqida malumot" @click="handleOpenRoomInfoDialog(scope.row?.roomId)"/>
              </div>
          </template>
      </el-table-column>
    </el-table>
    <DialogsViewRoomInfo v-if="dialogVisibly" v-model="dialogVisibly" :roomId="roomId"/>
  </Card>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const tableData = ref([])
const searchQuery = ref('')
const dialogVisibly = ref(false)
const roomId = ref(null)
const filter = ref({
  _page:1,
  _per_page:10,
  phone:'',
  id:null,
  _expand:'room'
})

onMounted(() => {
  getRegistirClients()
})

function handleOpenRoomInfoDialog (val) {
    roomId.value = val
    dialogVisibly.value = true
}

async function getRegistirClients() {
  let queryFilter = {}
  
  Object.entries(filter.value).forEach(([key,value]) => {
    if (value) {
      queryFilter = {...queryFilter,[key]:value}
    }
  })

  const { data, error } = await useFetchApi.get('/clients',{
    params:queryFilter
  })
  if (!error.value) {
    tableData.value = data.value
  }
}
const formattedDate = (date) => {
  const d = new Date(date)
  return d.toLocaleDateString('uz-UZ') + ' ' + d.toLocaleTimeString('uz-UZ')
}
</script>