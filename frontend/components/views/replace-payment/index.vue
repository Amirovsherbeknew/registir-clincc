<template>
    <Card>
        <div>
            <VTitle title="Checklar ro'yxati"/>
            <el-input :value="filter.search" @input=""/>
        </div>
        <el-table :data="tableData?.data">
            <el-table-column prop="id" label="Check raqami"></el-table-column>
            <el-table-column label="Check egasi">
                <template #default="scope">
                    {{ scope.row?.client?.last_name }} {{ scope.row?.client?.first_name }} {{ scope.row?.client?.middle_name }}
                </template>
            </el-table-column>
            <el-table-column label="To'lov summasi">
                <template #default="scope">
                    {{ useCurrencyFormat(Number(scope.row?.totalPrice)) }}
                </template>
            </el-table-column>
            <el-table-column label="Yaratilgan vaqti">
                <template #default="scope">
                    {{ useDateFormat(scope.row?.create_at) }}
                </template>
            </el-table-column>
            <el-table-column label="Holati">
                <template #default="scope">
                    <TableStatus :type="scope.row?.is_paid ? 'approved':'pending'"/>
                </template>
            </el-table-column>
            <el-table-column label="Telefon raqam">
                <template #default="scope">
                    {{scope?.row?.client?.phone}}
                </template>
            </el-table-column>
            <el-table-column label="Check egasini raqami">
                <template #default="scope">
                    <pre>{{ scope.row.id }}</pre>
                </template>
            </el-table-column>
            <el-table-column label="Harakat">
                <template #default="scope">
                    <ActionButton type="edit" @click="handleEditOpenDialog(scope.row)"/>
                </template>
            </el-table-column>
        </el-table>
        <DialogsCancelPayment v-model="dialogVisibly"/>
    </Card>
</template>
<script setup lang='ts'>
const filter = ref({
    search:'',
    _per_page:1,
    _page:1
})

const tableData = ref()
const dialogVisibly = ref(false)

onMounted(() => {
    GetCheckList()
})

function handleEditOpenDialog (val:any) {
    console.log(val)
    dialogVisibly.value = true
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