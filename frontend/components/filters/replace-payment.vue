<template>
    <div class="py-[16px] flex gap-[10px]">
        <el-date-picker
            v-model="filter.dateRange"
            type="daterange"
            format="DD-MM-YYYY"
            placeholder="Sanani tanlang"
            class="max-w-[270px]"
        />
        <el-input  v-model="filter.name" placeholder="Check raqam bo'yicha qidiruv" class="max-w-[270px]"/>
        <ActionButton type="search" @click="handleSearch"/>
        <ActionButton type="clear" @click="handleClear"/>
    </div>
</template>
<script setup lang='ts'>
import type {TBuildings} from '~/types/api/buildings.type'
import type {TFilterReplacePayment} from '~/types/filter/index.type'

const emit = defineEmits(['search'])

const buildingList = ref<TBuildings[]>([])

const filter = defineModel<TFilterReplacePayment>({
    default:{
        _page:1,
        _limit:10,
        name:'',
        buildingId:undefined,
        _expand:"client"
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
        phone:'',
        dateRange:[],
        id:undefined,
        _expand:"client"
    }
    emit('search')
}

async function getBuildingList () {
    const {data,error} = await useFetchApi.get<TBuildings[]>('/buildings')
    if (!error.value && data.value) {
        buildingList.value = data.value
    }
}
</script>