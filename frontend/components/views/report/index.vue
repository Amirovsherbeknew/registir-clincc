<template>
    <Card>
        <div class="min-h-screen bg-gray-50">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">Kunlik Hisobot</h1>
  
      <!-- Filter Section -->
      <el-card shadow="hover" class="mb-6">
        <div class="flex gap-[10px]">
          <div class="flex gap-4 flex-wrap">
            <div>
              <el-select v-model="filter.status" class="min-w-[230px]" placeholder="Holati">
                  <el-option v-for="(item,idx) in useConstant().statusList()" :key="idx" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </div>
            <div>
              <el-select
                v-model="filter.visitTypes_like"
                placeholder="Xizmat turini tanlang"
                clearable
                class="min-w-[200px]"
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
              <el-select
                v-model="filter.roomId"
                placeholder="Xonani tanlang"
                clearable
                class="min-w-[200px]"
              >
                <el-option
                  v-for="(service,idx) in dictionary?.rooms"
                  :key="idx"
                  :label="service.name"
                  :value="service.id"
                />
              </el-select>
            </div>
            <div>
              <el-select
                v-model="filter.doctorId"
                placeholder="Shifokorni tanlang"
                clearable
                class="min-w-[200px]"
              >
                <el-option
                  v-for="(doctor,idx) in dictionary?.doctor"
                  :key="idx"
                  :label="`${doctor?.first_name} ${doctor?.last_name} ${doctor?.middle_name}`"
                  :value="doctor.id"
                />
              </el-select>
            </div>
          <div>
            <el-date-picker
              v-model="selectedDate"
              type="daterange"
              placeholder="Sanani tanlang"
              format="DD-MM-YYYY"
              value-format="YYYY-MM-DD"
              class="max-w-[240px]"
            />
          </div>
          </div>
          <div class="flex items-end gap-[10px] flex-1">
            <ActionButton type="search" @click="handleSearch"/>
            <ActionButton type="clear" @click="handleClear"/>
          </div>
        </div>
      </el-card>
      <!-- Report Table -->
      <el-card shadow="hover">
        <el-table border
          :data="tableData?.data || []"
          style="width: 100%"
          empty-text="Ma'lumot topilmadi"
          class="rounded-lg"
        >
          <el-table-column label="F.I.O" >
            <template #default="scope">
              {{ scope?.row?.client?.first_name }} {{ scope?.row?.client?.last_name }} {{ scope?.row?.client?.middle_name }}
            </template>
          </el-table-column>
          <el-table-column label="Ro'yxatga olingan sana" >
            <template #default="scope">
              {{ useDateFormat(scope.row.create_at) }}
            </template>
          </el-table-column>
           <el-table-column label="Holati" >
            <template #default="scope">
              <TableStatus :type="scope.row.status"/>
            </template>
          </el-table-column>
          <el-table-column label="Xizmat ko'rsatilgan narx">
            <template #default="scope">
              {{ useCurrencyFormat(scope.row?.totalPrice) }}
            </template>
          </el-table-column>
          <el-table-column label="Ko'rsatilgan xizmatlar">
            <template #default="scope">
              <div v-for="(item,idx) in scope.row.visitTypes" :key="`visit_type_${idx}`" :class="useConstant().visitType(item).value === visitType ? 'font-bold':''">{{ useConstant().visitType(item)?.label }}</div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Harakat" width="150" align="center">
              <template #default="scope">
                  <div class="flex-center">
                      <ActionButton type="show" tooltip_title="Xona haqida malumot" @click="handleOpenRoomInfoDialog(scope.row?.client?.roomId)"/>
                  </div>
              </template>
          </el-table-column>
        </el-table>
        <VPagenation
            v-model="filter._page"
            :pageSize="filter._limit"
            :total="tableData?.pagination?.total || 0"
            @change="handlePagenation"
        />
      </el-card>
  
      <!-- Summary -->
      <el-card shadow="hover" class="mt-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Jami</h2>
        <p class="text-gray-600">Umumiy mijozlar: {{ tableData?.pagination?.total || 0 }}</p>
        <p class="text-gray-600">Umumiy to‘lov: {{ useCurrencyFormat(staticsData?.totalPrice)}}</p>
      </el-card>
    </div>
    <DialogsViewRoomInfo v-if="dialogVisibly" v-model="dialogVisibly" :roomId="roomId"/>  
  </Card>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import dayjs from 'dayjs'
  // Xizmat turlari
  const staticsData = ref()
  const dialogVisibly = ref(false)
  const tableData = ref()
  const roomId = ref(null)
  const visitType = ref()
  const dictionary = ref({
    medServices: [],
    rooms: [],
    labTests: [],
    doctor:[]
  })

  const filter = ref({
    _expand:'client',
    _order:'desc',
    _sort:'create_at',
    _page:1,
    _limit:10,
    status:undefined,
    visitTypes_like:'',
    roomId:undefined,
    doctorId:undefined,
    medServices:undefined
  })
  const selectedDate = ref([])
  
  onMounted(async () => {
    getList()
    getDictionary()
    getStatics()
  })

  function handlePagenation () {
    getList()
    getStatics()
  }

  function handleSearch () {
    filter.value._page = 1
    filter.value._limit = 10
    visitType.value = filter.value.visitTypes_like
    getList()
    getStatics()
    getReports()
  }

  function handleClear () {
    filter.value = {
      _expand:'client',
      _page:1,
      _limit:10,
      status:undefined,
      visitTypes_like:'',
      roomId:undefined,
      doctorId:undefined,
      medServices:undefined
    }
    visitType.value = undefined
    selectedDate.value = undefined
    getList()
    getStatics()
  }

  function handleOpenRoomInfoDialog (val) {
    roomId.value = val
    dialogVisibly.value = true
  }

  async function getList () {
    const {data,error} = await useFetchApi.get(`/reports`,{
      params:useClean({
        create_at_gte:useDateToISOString(selectedDate.value?.[0]),
        create_at_lte:useDateToISOString(selectedDate.value?.[1],{ endOfDay: true }),
        ...filter.value
      })
    })
    if (!error.value) {
      tableData.value = data.value
    }
  }

  async function getDictionary() {
    const apiList = [
      { key: 'medServices', endpoint: '/medServices' },
      { key: 'rooms', endpoint: '/rooms?is_full=false' },
      { key: 'labTests', endpoint: '/labTests' },
      { key: 'doctor', endpoint: '/doctors' }
    ]
  
    const fetchPromises = apiList.map(resp => useFetchApi.get(resp.endpoint))
    const results = await Promise.all(fetchPromises)
  
    results.forEach((result, index) => {
      if (!result.error.value) {
        dictionary.value[apiList[index].key] = result.data.value
      }
    })
  }

  async function getStatics () {
    const {data,error} = await useFetchApi.get('/checks/total',{
      params:useClean({
        create_at_gte:useDateToISOString(selectedDate.value?.[0]),
        create_at_lte:useDateToISOString(selectedDate.value?.[1],{ endOfDay: true }),
        ...filter.value
      })
    })
    if (!error.value) {
      console.log(data)
      staticsData.value = {
        totalPrice:data.value?.total
      }
    }
  }

  </script>
  
  <style scoped>
  /* Tailwind CSS bilan qo‘shimcha stil */
  .el-card {
    border-radius: 8px;
  }
  </style>