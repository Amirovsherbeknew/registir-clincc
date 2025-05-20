<template>
    <div class="py-[16px] flex gap-[10px]">
        <el-select v-model="filter.buildingId" placeholder="bino bo'yicha qidiruv" class="max-w-[270px]">
            <el-option v-for="item in buildingList" :key="`filter_building_${item.id}`" :value="Number(item.id)" :label="item.name"></el-option>
        </el-select>
        <el-input  v-model="filter.name" placeholder="Xona nomi" class="max-w-[270px]"/>
        <ActionButton type="search" @click="handleSearch"/>
        <ActionButton type="clear" @click="handleClear"/>
        <ActionButton type="reload" @click="reload"/>
    </div>
</template>
<script setup lang='ts'>
import type {TBuildings} from '~/types/api/buildings.type'
import type {TFilterRoom} from '~/types/filter/index.type'

const emit = defineEmits(['search'])

const buildingList = ref<TBuildings[]>([])

const filter = defineModel<TFilterRoom>({
    default:{
        _page:1,
        _limit:10,
        name:'',
        buildingId:undefined,
        _expand:"building"
    }
})

onMounted(() => {
    getBuildingList()
})

function handleSearch () {
    if (filter.value) {
        filter.value._page = 1
        filter.value._limit = 10
        emit('search')
    }
}

function handleClear () {
    filter.value = {
        _page:1,
        _limit:10,
        name:'',
        buildingId:undefined,
        _expand:"building"
    }
    emit('search')
}

async function getBuildingList () {
    const {data,error} = await useFetchApi.get<TBuildings[]>('/buildings')
    if (!error.value && data.value) {
        buildingList.value = data.value
    }
}
async function reload () {
    const {data,error}:any = await useFetchApi.get('/reload/room')
    if (!error.value) {
        useNotifacation.success(data.value?.message,'')
    }
}
</script>