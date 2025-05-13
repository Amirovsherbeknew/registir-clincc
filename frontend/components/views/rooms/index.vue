<template>
    <Card class="flex flex-col gap-[20px]">
        <FiltersRoom v-model="filter" @search="getRoomList"/>
        <div class="flex items-center">
            <VTitle class="flex-1" title="Xonalar ro'yxati"/>
            <el-button type="primary" @click="handleOpenDialog">
                <div class="flex !gap-[8px] items-center">
                    Yangi turdagi xona kiritish
                    <IconPlusRectangle/>
                </div>
            </el-button>
        </div>
        <el-table :data="tableData?.data || []" border style="width: 100%">
            <el-table-column prop="name" label="Nomi"/>
            <el-table-column prop="people_per_room" label="Sig'imi"/>
            <el-table-column label="binosi joylashuvi">
                <template #default="scope">
                    {{scope.row?.building?.name}}
                </template>
            </el-table-column>
            <el-table-column  label="Xizmat narxi">
                <template #default="scope">
                    {{useCurrencyFormat(Number(scope.row.pricePerDay))}}
                </template>
            </el-table-column>
            <el-table-column label="Harakat" width="180">
                <template #default="scope">
                    <div class="flex gap-[10px]">
                        <ActionButton type="edit" @click="handleEditOpenDialog(scope.row)"/>
                        <ActionButton type="show" tooltip_title="Xona haqida malumot" @click="handleOpenRoomInfoDialog(scope.row?.id)"/>
                        <ActionButton type="delete" @click="handleDelete(scope.row.id)"/>
                    </div>
                </template>
            </el-table-column>
        </el-table><div class="flex justify-end items-center py-[15px]">
        <VPagenation
            v-model="filter._page"
            :pageSize="filter._limit"
            :total="tableData?.pagination?.total || 0"
            @change="getRoomList"
        />
        </div>
      
        <DialogsViewRoomInfo v-if="dialogVisibly" v-model="dialogVisibly" :roomId="roomId"/>
        <DialogsCreateRoom v-if="dialogVisible" v-model="dialogVisible" :newId="newId" :selected="selected" @getData="getRoomList"/>
    </Card>
</template>
<script lang="ts" setup>
import type {rooms,TRoom} from '~/types/api/rooms.type.ts'
import type {TFilterRoom} from '~/types/filter/index.type'
const dialogVisible = ref(false)
const dialogVisibly = ref(false)
const tableData = ref<TRoom>()
const newId = ref<number|null>();
const roomId = ref<number|null>(null);
const selected = ref<rooms>()
const filter = ref<TFilterRoom>({
    _page:1,
    _limit:10,
    name:'',
    buildingId:undefined,
    _expand:"building"
})

onMounted(() => {
    getRoomList()
})

function handleOpenRoomInfoDialog (val:number) {
    roomId.value = val
    dialogVisibly.value = true
}

function handleOpenDialog () {
    dialogVisible.value = true
}

function handleEditOpenDialog (val:rooms) {
    dialogVisible.value = true;
    selected.value = val;
}

async function getRoomList () {
  const {data,error} = await useFetchApi.get<TRoom>('/rooms',{
    params:useClean(filter.value)
  });
  if (!error.value && data.value) {
    tableData.value = data.value
  }
}

async function handleDelete (id:number) {
    const {error} = await useFetchApi.delete(`/rooms/${id}`);
    if (!error.value) {
        getRoomList()
    } 
}
</script>