<template>
    <Card>
        <div class="flex gap-[10px] mb-[20px] justify-between">
            <VTitle title="Checklar ro'yxati"/>
        </div>
        <FiltersReplacePayment v-model="filter" @search="GetCheckList"/>
        <div class="w-full">
            <el-table :data="tableData?.data" style="width: 100%" border>
            <el-table-column prop="id" label="Check raqami" width="150"  align="center"/>
            <el-table-column label="Check egasi" min-width="350">
                <template #default="scope">
                    {{ scope.row?.client?.last_name }} {{ scope.row?.client?.first_name }} {{ scope.row?.client?.middle_name }}
                </template>
            </el-table-column>
            <el-table-column label="To'lov summasi" width="150" align="center">
                <template #default="scope">
                    {{ useCurrencyFormat(Number(scope.row?.totalPrice)) }}
                </template>
            </el-table-column>
            <el-table-column label="Qolgan summasi" width="150" align="center">
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
            <el-table-column label="Holati" width="250"  align="center">
                <template #default="scope">
                    <TableStatus :type="scope.row.status"/>
                </template>
            </el-table-column>
            <el-table-column label="Telefon raqam" width="200" align="center">
                <template #default="scope">
                    {{scope?.row?.client?.phone}}
                </template>
            </el-table-column>
            <el-table-column label="Qaytarilgan miqdor" width="220" align="center">
                <template #default="scope">
                    <div v-if="scope?.row?.replace_payment?.price">{{ useCurrencyFormat(Number(scope?.row?.replace_payment?.price)) }}</div>
                    <div v-else>---</div>
                </template>
            </el-table-column>
            <el-table-column label="Qaytarish sababi" width="250">
                <template #default="scope">
                    <div>{{ scope?.row?.replace_payment?.reason }}</div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="Harakat">
                <template #default="scope">
                    <ActionButton type="edit" @click="handleEditOpenDialog(scope.row)"/>
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
        <DialogsCancelPayment v-model="dialogVisibly" :check="check" @get-data="GetCheckList"/>
    </Card>
</template>
<script setup lang='ts'>
import type {rooms} from '~/types/api/rooms.type.ts'
import type {TFilterReplacePayment} from '~/types/filter/index.type'
const filter = ref<TFilterReplacePayment>({
    _page:1,
    _limit:10,
    name:'',
    phone:'',
    status:undefined,
    dateRange:[],
    id:undefined,
    _order:'desc',
    _sort:'create_at',
    _expand:"client"
})

const tableData = ref()
const dialogVisibly = ref(false)
const check = ref()

onMounted(() => {
    GetCheckList()
})

function handleEditOpenDialog (val:any) {
    check.value = val
    dialogVisibly.value = true
}

async function GetCheckList (query?:TFilterReplacePayment) {
    const {data,error} = await useFetchApi.get('/checks',{
        params:useClean(query || filter.value)
    })
    if (!error.value) {
        tableData.value = data.value
    }
}
</script>