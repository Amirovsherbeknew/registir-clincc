<template>
  <Card>
        <div class="flex gap-[10px] justify-between">
            <VTitle title="Checklar ro'yxati"/>
        </div>
        <div class="">
            <FiltersCheck v-model="filter" @search="GetCheckList"/>
        </div>
        <div class="w-full">
            <el-table :data="tableData?.data || []" style="width: 100%" border>
                <el-table-column prop="id" label="Check raqami" width="150" align="center"></el-table-column>
                <el-table-column label="Check egasi" width="300">
                    <template #default="scope">
                        {{ scope.row?.client?.last_name }} {{ scope.row?.client?.first_name }} {{ scope.row?.client?.middle_name }}
                    </template>
                </el-table-column>
                <el-table-column label="To'lov summasi" width="200" align="center">
                    <template #default="scope">
                        {{ useCurrencyFormat(Number(scope.row?.totalPrice)) }}
                    </template>
                </el-table-column>
                <el-table-column label="Yaratilgan vaqti" width="200" align="center">
                    <template #default="scope">
                        {{ useDateFormat(scope.row?.create_at) }}
                    </template>
                </el-table-column>
                <el-table-column label="Holati" width="200" align="center">
                    <template #default="scope">
                        <TableStatus :type="TableStatusType(scope.row)"/>
                    </template>
                </el-table-column>
                <el-table-column label="Telefon raqam" width="200" align="center">
                    <template #default="scope">
                        {{scope?.row?.client?.phone}}
                    </template>
                </el-table-column>
                <el-table-column label="Check egasini raqami" width="200" align="center">
                    <template #default="scope">
                        <div>{{ scope.row.client?.id }}</div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="Harakat" width="150" align="center">
                    <template #default="scope">
                        <div class="flex-center gap-[10px]">
                            <ActionButton type="show" :disabled="!scope.row?.visitTypes?.includes('room')" tooltip_title="Xona haqida malumot" @click="handleOpenRoomInfoDialog(scope.row?.client?.roomId)"/>
                            <ActionButton type="file" tooltip_title="Check" @click="handleOpenCheckInfoDialog(scope.row)"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <VPagenation
                v-model="filter._page"
                :pageSize="filter._limit"
                :total="tableData?.pagination?.total || 0"
                @change="GetCheckList"
            />
        </div>
      
      <DialogsViewRoomInfo v-if="dialogVisibly" v-model="dialogVisibly" :roomId="roomId"/>
      <DialogsViewCheck v-model="checkDialogVisibly" :info="{...selectedCheck,clientInfo:clientInfo}" @handleSearch="GetCheckList"/>
  </Card>
</template>
<script setup lang='ts'>
import type {rooms} from '~/types/api/rooms.type.ts'
import type { TFilterCheck } from '~/types/filter/index.type'
const filter = ref<TFilterCheck>({
    _page:1,
    _limit:10,
    dateRange:[],
    visitTypes_like:undefined
})

const dictionary = ref<any>({
    medServices: [],
    rooms: [],
    labTests: [],
    doctor:[]
})

const tableData = ref()
const dialogVisibly = ref(false)
const checkDialogVisibly = ref(false)
const roomId = ref<number|null>(null)
const selectedCheck = ref<any>()
onMounted(() => {
  GetCheckList()
  getDictionary()
})

const clientInfo = computed(() => {
    if (selectedCheck.value) {
        console.log(selectedCheck.value.client.room.roomId)
        console.log(dictionary.value.rooms)
        console.log(dictionary.value.rooms.find((resp:any) => Number(resp.id) === Number(selectedCheck.value.client.room.roomId)))
        return {
            ...selectedCheck.value.client,
            medServices:dictionary.value.medServices?.filter((resp:any) => selectedCheck.value.client.medServices.includes(resp.id)),
            labTests:dictionary.value.labTests?.filter((resp:any) => selectedCheck.value.client.labTests.includes(resp.id)),
            room:{...selectedCheck.value.client.room,
            priceDay:dictionary.value.rooms.find((resp:any) => Number(resp.id) === Number(selectedCheck.value.client.room.roomId))?.pricePerDay,
            price:dictionary.value.rooms.find((resp:any) => Number(resp.id) === Number(selectedCheck.value.client.room.roomId))?.pricePerDay * selectedCheck.value.client.room.days,
            },
            doctorInfo:dictionary.value.doctor.find((resp:any) => resp.id === selectedCheck.value.client.doctorId)
        }
    }
    else return
})

function handleOpenRoomInfoDialog (val:number) {
    roomId.value = val
    dialogVisibly.value = true
}

function handleOpenCheckInfoDialog (val:any) {
    selectedCheck.value = val
    checkDialogVisibly.value = true
}


function TableStatusType (check:rooms) {
    if (check?.replace_payment) {
        return 'cancel_payment'
    }
    else return check?.isPaid ? 'approved':'pending'
}

async function GetCheckList (query?:any) {
  const {data,error} = await useFetchApi.get('/checks',{
      params:{_expand:'client',...useClean(query || filter.value)}
  })
  if (!error.value) {
      console.log(data.value);
      tableData.value = data.value
  }
}

async function getDictionary() {
    const apiList = [
        { key: 'medServices', endpoint: '/medServices' },
        { key: 'rooms', endpoint: '/rooms' },
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
</script>