<template>
    <Card>
        <div class="flex justify-between">
            <VTitle title="Binolar"/>
            <el-button type="primary" @click="dialogVisibly = true">Yangi bino qo'shish</el-button>
        </div>
        <el-table>
            <el-table-column prop="name" label="Bino nomi"/>
            <el-table-column prop="per_room" label="Binoda nechta xona mavjudligi"/>
            <el-table-column label="Yaratilgan vaqti">
                <template #default="scope">
                    {{useDateFormat(scope.row.create_at)}}
                </template>
            </el-table-column>
            <el-table-column label="O'zgaritilgan vaqti">
                <template #default="scope">
                    {{useDateFormat(scope.row.update_at)}}
                </template>
            </el-table-column>
            <el-table-column label="Harakat" width="180">
                <template #default="scope">
                    <div class="flex gap-[10px]">
                        <ActionButton type="edit" @click="handleEditOpenDialog(scope.row)"/>
                        <ActionButton type="delete" @click="handleDelete(scope.row.id)"/>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <DialogsCreateBuilding v-model="dialogVisibly" @getData="getBuildings"/>
    </Card>
</template>
<script setup lang='ts'>

const dialogVisibly = ref(false);
const tableData = ref();
const filter = ref({
    _page:1,
    _per_page:10
})

onMounted(() => {
    getBuildings()
})

function handleEditOpenDialog () {

}

async function handleDelete (id:number) {
    const {data,error} = await useFetchApi.delete(`/buildings/${id}`)
}

async function getBuildings () {
    const {data,error} = await useFetchApi.get('/buildings')
    if (!error.value) {

    }
}
</script>