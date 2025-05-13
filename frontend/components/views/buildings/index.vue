<template>
    <Card>
        <div class="flex justify-between mb-4">
            <VTitle title="Binolar"/>
            <el-button type="primary" @click="dialogVisibly = true">Yangi bino qo'shish</el-button>
        </div>
        <el-table :data="tableData?.data || []" border>
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
                        <!-- <ActionButton type="delete" @click="handleDelete(scope.row.id)"/> -->
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <VPagenation
            v-model="filter._page"
            :pageSize="filter._limit"
            :total="tableData?.pagination?.total || 0"
            @change="getBuildings"
        />
        
        <DialogsCreateBuilding v-if="dialogVisibly" v-model="dialogVisibly" @getData="getBuildings" :selected="selected"/>
    </Card>
</template>
<script setup lang='ts'>
import type {TBuildings,TBuildingsApi} from '~/types/api/buildings.type.ts'
const selected = ref<TBuildings>();
const dialogVisibly = ref(false);
const tableData = ref();
const filter = ref({
    _page:1,
    _limit:10
})

onMounted(() => {
    getBuildings()
})

function handleEditOpenDialog (val:TBuildings) {
    selected.value = val;
    dialogVisibly.value = true;
}

// async function handleDelete (id:number) {
//     const {data,error} = await useFetchApi.delete(`/buildings/${id}`)
// }

async function getBuildings () {
    const {data,error} = await useFetchApi.get<TBuildingsApi>('/buildings',
        {
            params:{...filter.value}
        }
    )
    if (!error.value && data.value) {
        tableData.value = data.value
    }
}
</script>