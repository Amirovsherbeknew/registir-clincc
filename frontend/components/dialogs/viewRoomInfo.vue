<template>
    <el-dialog v-model="dialogVisible"
      width="750"
      on-destroy-close v-loading="loading">
      <h1 class="mb-[10px]">
        <VTitle title="Xona haqida malumotlar"/>
      </h1>
        <div class="grid grid-cols-2 gap-y-[6px]">
            <div>Nomi:</div>
            <div>{{roomInfo?.name}}</div>
            <div>Sig'imi:</div>
            <div>{{roomInfo?.people_per_room}}</div>
            <div>Kunlik narxi:</div>
            <div>{{useCurrencyFormat(Number(roomInfo?.pricePerDay))}}</div>
            <div>Binosi:</div>
            <div>{{roomInfo?.building?.name}}</div>
            <div>Mavjud odamlar soni:</div>
            <div class="font-bold">{{clientsInfo?.length}}</div>
            <div>Qachon to'liq bo'shaydi:</div>
            <div>{{ useLatestEndDate(clientsInfo) }}</div>
            <div>Eng yaqin kunda bo'shaydi:</div>
            <div>{{ useLatestEndDate(clientsInfo,'firstest') }}</div>
        </div>
        
        <div class="my-[10px] pt-[5px] font-semibold text-[18px] text-stone-500 border-t-[1px] border-strone-500">
            Xonadagi mavjud odamlar ro'yxati:
        </div>
       <el-table :data="clientsInfo || []" border>
        <el-table-column label="FIO">
            <template #default="scope">
                {{scope.row?.last_name}} {{scope.row?.first_name}} {{scope.row?.middle_name}}
            </template>
        </el-table-column>
        <el-table-column label="Necha kunga olinganligi">
            <template #default="scope">
                <b>{{scope.row?.room?.days}}</b> 
            </template>
        </el-table-column>
        <el-table-column label="Qachon chiqadi">
            <template #default="scope">
                <div>{{useDateFormat(scope.row?.end_date)}}</div> 
            </template>
        </el-table-column>
       </el-table>
    </el-dialog>
</template>
<script lang="ts" setup>
import type {rooms} from '~/types/api/rooms.type.ts'
const props = defineProps<{
    roomId:number|null
}>()
const loading = ref(false)
const dialogVisible = defineModel<boolean>()
const clientsInfo = ref([])
const roomInfo = ref<rooms>()

onMounted(() => {
    getRoomInfo();
})

async function getRoomInfo () {
    loading.value = true
    const {data,error} = await useFetchApi.get<rooms>(`/rooms/${props.roomId}/`,{
        params:{
            _expand:'building'
        }
    })
    if (!error.value && data.value) {
        roomInfo.value = data.value;
        getClientCountByRoomId()
    }
    loading.value = false
}

async function getClientCountByRoomId () {
    loading.value = true
    const { data,error } = await useFetchApi.get<any>(`/clients?roomId=${props.roomId}`)
    if (!error.value && data.value) {
        clientsInfo.value = data.value
    }
    loading.value = false
}

</script>