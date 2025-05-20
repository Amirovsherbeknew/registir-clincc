<template>
    <div class="py-[16px] flex gap-[10px]">
        <el-date-picker
            v-model="filter.dateRange"
            type="daterange"
            format="DD-MM-YYYY"
            placeholder="Sanani tanlang"
            class="max-w-[270px]"
        />
        <el-select v-model="filter.status" class="max-w-[270px]" placeholder="Holati">
            <el-option v-for="(item,idx) in useConstant().statusList()" :key="idx" :value="item.value" :label="item.label"></el-option>
        </el-select>
        <el-input  v-model="filter.id" placeholder="Check raqam bo'yicha qidiruv" class="max-w-[270px]"/>
        <el-input  v-model="filter.phone" placeholder="Telefon raqam" class="max-w-[270px]"/>
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
        id:'',
        status:undefined,
        isPaid:true,
        buildingId:undefined,
        _expand:"client"
    }
})

function handleSearch () {
    if (filter.value) {
        filter.value._page = 1
        filter.value._limit = 10
        if (filter.value.dateRange?.length === 2) {
            const [startDate, endDate] = filter.value.dateRange

            const isoStart = new Date(startDate).toISOString()
            const isoEnd = new Date(endDate).toISOString()
            const query_filter = JSON.parse(JSON.stringify({
                ...filter.value,
                create_at_gte: isoStart,
                create_at_lte: isoEnd,
            }))
            
            delete query_filter.dateRange

            emit('search', query_filter)
            return
        }
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

</script>