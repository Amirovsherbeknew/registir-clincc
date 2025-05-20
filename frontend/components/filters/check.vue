<template>
    <div class="py-[16px] flex gap-[10px] w-full">
        <el-select v-model="filter.visitTypes_like" placeholder="Xizmati turi" class="max-w-[270px]">
            <el-option v-for="item in visitTypeList" :key="`filter_building_${item.value}`" :value="item.value" :label="item.label"></el-option>
        </el-select>
        <el-select v-model="filter.status" class="max-w-[270px]" placeholder="Holati">
            <el-option v-for="(item,idx) in useConstant().statusList()" :key="idx" :value="item.value" :label="item.label"></el-option>
        </el-select>
        <el-date-picker
            v-model="filter.dateRange"
            type="daterange"
            format="DD-MM-YYYY"
            placeholder="Sanani tanlang"
            class="max-w-[270px]"
        />
        <ActionButton type="search" @click="handleSearch"/>
        <ActionButton type="clear" @click="handleClear"/>
    </div>
</template>
<script setup lang='ts'>
import type {TFilterCheck} from '~/types/filter/index.type'

const emit = defineEmits(['search'])

const filter = defineModel<TFilterCheck>({
    default:{
        _page:1,
        _limit:10,
        status:undefined,
        dateRange:[],
        visitTypes_like:undefined
    }
})

const visitTypeList = computed(() => {
    return useConstant().visitType() && Array.isArray(useConstant().visitType()) ? useConstant().visitType():[]
})

const genderList = computed(() => {
    return Array.isArray(useConstant().gender()) ? useConstant().gender():[]
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
        dateRange:[],
        visitTypes_like:undefined
    }
    emit('search')
}
</script>