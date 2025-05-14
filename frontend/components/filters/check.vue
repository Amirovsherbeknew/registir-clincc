<template>
    <div class="py-[16px] flex gap-[10px] w-full">
        <el-select v-model="filter.visitTypes_like" placeholder="Xizmati turi" class="max-w-[270px]">
            <el-option v-for="item in visitTypeList" :key="`filter_building_${item.value}`" :value="item.value" :label="item.label"></el-option>
        </el-select>
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