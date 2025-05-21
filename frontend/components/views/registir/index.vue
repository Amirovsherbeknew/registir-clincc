<template>
  <Card class="flex flex-col gap-[20px]">
    <div class="flex items-center">
      <VTitle class="flex-1" title="Ro'yxatga olingan mijozlar ro'yxati"/>
    </div>
    <div class="flex gap-[10px]">
      <FiltersRegister v-model="filter" @search="getRegistirClients"/>
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
      <el-table-column label="Ko'rsatilgan xizmatlar">
        <template #default="scope">
          <div v-for="(item,idx) in scope.row?.visitTypes" :key="`visit_types_${idx}`">{{ useConstant().visitType(item)?.label }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Harakat" width="150" align="center">
          <template #default="scope">
              <div class="flex-center gap-[10px]">
                <ActionButton :disabled="!scope.row?.visitTypes?.includes('room')" type="show" tooltip_title="Xona haqida malumot" @click="handleOpenRoomInfoDialog(scope.row?.roomId)"/>
                <ActionButton v-if="roleCode === 'admin'" type="edit" @click="handleOpenClientInfo(scope.row?.id)"/>
              </div>
          </template>
      </el-table-column>
    </el-table>
    <VPagenation
        v-model="filter._page"
        :pageSize="filter._limit"
        :total="tableData?.pagination?.total || 0"
        @change="getRegistirClients"
    />
    <DialogsViewRoomInfo v-if="dialogVisibly" v-model="dialogVisibly" :roomId="roomId"/>
  </Card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const { getRole } = useToken();
const router = useRouter()

const tableData = ref([])
const dialogVisibly = ref(false)
const roomId = ref(null)
const filter = ref({
    _page:1,
    _limit:10,
    _order:'desc',
    _sort:'create_at',
    dateRange:[],
    gender:'',
    last_name:"",
    phone:'',
    visitTypes_like:''
})

onMounted(() => {
  getRegistirClients()
})

const roleCode = computed(() => {
  return getRole()
})

function handleOpenRoomInfoDialog (val) {
    if (val) {
      roomId.value = val
      dialogVisibly.value = true
    }
}

function handleOpenClientInfo (val) {
  router.push({
    path:'/client-info-change',
    query:{
      clientInfoId:val
    }
  })
}

async function getRegistirClients(query) {
  const { data, error } = await useFetchApi.get('/clients',{
    params:useClean(query || filter.value)
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