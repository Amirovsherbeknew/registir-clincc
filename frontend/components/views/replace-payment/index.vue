<template>
    <Card>
        <div class="flex gap-[10px] mb-[20px] justify-between">
            <VTitle title="Checklar ro'yxati"/>
            <el-input class="max-w-[250px]" :value="filter.search" @input="handleSearch" placeholder="check raqami bo'yicha qidiruv"/>
        </div>
        <div class="w-full">
            <el-table :data="tableData?.data" style="width: 100%" border>
            <el-table-column prop="id" label="Check raqami" width="150"></el-table-column>
            <el-table-column label="Check egasi" min-width="150">
                <template #default="scope">
                    {{ scope.row?.client?.last_name }} {{ scope.row?.client?.first_name }} {{ scope.row?.client?.middle_name }}
                </template>
            </el-table-column>
            <el-table-column label="To'lov summasi" width="150">
                <template #default="scope">
                    {{ useCurrencyFormat(Number(scope.row?.totalPrice)) }}
                </template>
            </el-table-column>
            <el-table-column label="Yaratilgan vaqti" width="200">
                <template #default="scope">
                    {{ useDateFormat(scope.row?.create_at) }}
                </template>
            </el-table-column>
            <el-table-column label="Holati" width="250" center>
                <template #default="scope">
                    <TableStatus :type="TableStatusType(scope.row)"/>
                </template>
            </el-table-column>
            <el-table-column label="Telefon raqam" width="200">
                <template #default="scope">
                    {{scope?.row?.client?.phone}}
                </template>
            </el-table-column>
            <el-table-column label="Check egasini raqami" width="200">
                <template #default="scope">
                    <div>{{ scope.row.id }}</div>
                </template>
            </el-table-column>
            <el-table-column label="Qaytarilgan miqdor" width="220">
                <template #default="scope">
                    <div>{{ useCurrencyFormat(Number(scope?.row?.replace_payment?.price)) }}</div>
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
        </div>
        <DialogsCancelPayment v-model="dialogVisibly" :check="check"/>
    </Card>
</template>
<script setup lang='ts'>
import type {rooms} from '~/types/api/rooms.type.ts'
const filter = ref({
    search:'',
    _per_page:1,
    _page:1
})

const tableData = ref()
const dialogVisibly = ref(false)
const check = ref()

onMounted(() => {
    GetCheckList()
})

function handleEditOpenDialog (val:any) {
    console.log(val)
    check.value = val
    dialogVisibly.value = true
}

function TableStatusType (check:rooms) {
    if (check?.replace_payment) {
        return 'cancel_payment'
    }
    else return check?.isPaid ? 'approved':'pending'
}

async function handleSearch () {
    const {data,error} = await useFetchApi.get('',{
        params:{
            ...filter.value
        }
    })
    if (!error.value) {
        console.log(data.value)
    }
}

async function GetCheckList () {
    const {data,error} = await useFetchApi.get('/checks',{
        params:{_expand:'client',...filter.value}
    })
    if (!error.value) {
        console.log(data.value);
        tableData.value = data.value
    }
}
</script>