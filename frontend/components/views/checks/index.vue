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
                <el-table-column label="Qolgan summa" width="200" align="center">
                    <template #default="scope">
                        <div v-if="scope.row?.isPaid">{{ useCurrencyFormat(0) }}</div>
                        <div v-else>
                            {{ useCurrencyFormat(scope.row?.totalPrice - (scope.row.part_pay_price ? scope.row?.part_pay_price.reduce((sum:any,item:any) => sum + Number(item.price),0):0) ) }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="Yaratilgan vaqti" width="200" align="center">
                    <template #default="scope">
                        {{ useDateFormat(scope.row?.create_at) }}
                    </template>
                </el-table-column>
                <el-table-column label="Holati" width="200" align="center">
                    <template #default="scope">
                        <TableStatus :type="scope.row.status"/>
                    </template>
                </el-table-column>
                <el-table-column label="Telefon raqam" width="200" align="center">
                    <template #default="scope">
                        {{scope?.row?.client?.phone}}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="Harakat" width="220" align="center">
                    <template #default="scope">
                        <div class="flex-center gap-[10px]">
                            <ActionButton type="show" :disabled="!scope.row?.visitTypes?.includes('room')" tooltip_title="Xona haqida malumot" @click="handleOpenRoomInfoDialog(scope.row?.client?.roomId)"/>
                            <ActionButton type="file" tooltip_title="Check" @click="handleOpenCheckInfoDialog(scope.row)"/>
                            <ActionButton :disabled="!scope.row?.part_pay_price" type="payment" tooltip_title="To'lovlar tarixi" @click="handleHistoryPaymentDialog(scope.row)"/>
                            <ActionButton v-if="getRole() === 'super_admin'" type="delete" @click="handleDeleteCheck(scope.row?.id,scope.row?.client?.id)"/>
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
      <DialogsHistoryPayment v-model="historyDialogVisibly" :info="{...selectedCheck,clientInfo:clientInfo}"/>
      <DialogsViewRoomInfo v-if="dialogVisibly" v-model="dialogVisibly" :roomId="roomId"/>
      <DialogsViewCheck v-model="checkDialogVisibly" :info="{...selectedCheck,clientInfo:clientInfo}" @handleSearch="GetCheckList"/>
  </Card>
</template>
<script setup lang='ts'>
import type {rooms} from '~/types/api/rooms.type.ts'
import type { TFilterCheck } from '~/types/filter/index.type'
const {getRole} = useToken()
const filter = ref<TFilterCheck>({
    _page:1,
    _limit:10,
    dateRange:[],
    isPaid:undefined,
    status:undefined,
    _order:'desc',
    _sort:'create_at',
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
const historyDialogVisibly = ref(false)
const checkDialogVisibly = ref(false)
const roomId = ref<number|null>(null)
const selectedCheck = ref<any>()
onMounted(() => {
  GetCheckList()
  getDictionary()
})

const clientInfo = computed(() => {
    if (selectedCheck.value) {
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
    if (val) {
        roomId.value = val
        dialogVisibly.value = true
    }
}

function handleOpenCheckInfoDialog (val:any) {
    selectedCheck.value = val
    checkDialogVisibly.value = true
}

function handleHistoryPaymentDialog (val:any) {
    selectedCheck.value = val
    historyDialogVisibly.value = true
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

async function handleDeleteCheck (id:number,userId:number) {
    const {data,error} = await useFetchApi.delete(`/checks/${id}`)
    if (!error.value) {
        handleDeleteClient(userId)
    }
}

async function handleDeleteClient (id:number) {
    const {data,error} = await useFetchApi.delete(`/clients/${id}`)
    if (!error.value) {
        useNotifacation.info('Check o\'chirildi')
        GetCheckList()
    }
}

</script>