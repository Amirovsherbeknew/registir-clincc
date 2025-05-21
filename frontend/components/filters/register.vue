<template>
    <div class="py-[16px] flex gap-[10px] w-full">
        <el-select v-model="filter.visitTypes_like" placeholder="Xizmati turi" class="max-w-[270px]" clearable @clear="handleSearch">
            <el-option v-for="item in visitTypeList" :key="`filter_building_${item.value}`" :value="item.value" :label="item.label"></el-option>
        </el-select>
        <el-select v-model="filter.gender" placeholder="Jinsi" class="max-w-[270px]" clearable @clear="handleSearch">
            <el-option v-for="item in genderList" :key="`gender_${item.value}`" :value="item.value" :label="item.label"></el-option>
        </el-select>
        <el-select v-model="filter.doctorId" placeholder="Shifokorlar" class="max-w-[270px]" clearable @clear="handleSearch">
            <el-option v-for="item in doctorList" :key="`doctor_${item.id}`" :value="Number(item.id)" :label="`${item.first_name} ${item.last_name} ${item?.middle_name}`"></el-option>
        </el-select>
        <el-date-picker
            v-model="filter.dateRange"
            type="daterange"
            format="DD-MM-YYYY"
            value-format="YYYY-MM-DD"
            placeholder="Sanani tanlang"
            class="w-full"
            clearable @clear="handleSearch"
        />
        <el-input  v-model="filter.phone" placeholder="Telefon raqami" class="max-w-[270px]"/>
        <ActionButton type="search" @click="handleSearch"/>
        <ActionButton type="clear" @click="handleClear"/>
    </div>
</template>
<script setup lang='ts'>
import type {TFilterRegister} from '~/types/filter/index.type'
import type { doctors } from '~/types/api/doctor.type'

const emit = defineEmits(['search'])

const doctorList = ref<doctors[]>([])

const filter = defineModel<TFilterRegister>({
    default:{
        _page:1,
        _limit:10,
        dateRange:[],
        gender:'',

        last_name:"",
        phone:'',
        visitTypes_like:''
    }
})

onMounted(() => {
    getDoctorList()
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
            const query_filter = JSON.parse(JSON.stringify({
                ...filter.value,
                create_at_gte: useDateToISOString(startDate),
                create_at_lte: useDateToISOString(endDate,{ endOfDay: true }),
            }))
            
            delete query_filter.dateRange

            emit('search', useClean(query_filter))
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
        gender:'',
        last_name:"",
        phone:'',
        visitTypes_like:''
    }
    emit('search')
}

async function getDoctorList () {
    const {data,error} = await useFetchApi.get<doctors[]>('/doctors')
    if (!error.value && data.value) {
        doctorList.value = data.value
    }
}
</script>