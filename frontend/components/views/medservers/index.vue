<template>
    <Card class="flex flex-col gap-[20px]">
        <div class="flex items-center">
            <VTitle class="flex-1" title="Med ko'riklarning ro'yxati"/>
            <el-button type="primary" @click="handleOpenDialog">
                <div class="flex !gap-[8px] items-center">
                    Yangi med ko'rik yaratish
                    <IconPlusRectangle/>
                </div>
            </el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="name" label="Nomi"/>
            <el-table-column  label="Xizmat narxi">
                <template #default="scope">
                    {{scope.row.price}}
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
        <DialogsCreateMedServers v-if="dialogVisible" v-model="dialogVisible" :newId="newId" :selected="selected" @getData="getMedservers"/>
    </Card>
</template>
<script lang="ts" setup>
import type {medServices} from '~/types/api/medServices.type.ts'
const dialogVisible = ref(false)
const tableData = ref<medServices[]>([])
const newId = ref<number|null>();
const selected = ref<medServices>()
onMounted(() => {
  getMedservers()
})
function handleOpenDialog () {
    dialogVisible.value = true
}
function handleEditOpenDialog (val:medServices) {
    dialogVisible.value = true;
    selected.value = val;
}
async function getMedservers () {
  const {data,error} = await useFetchApi.get<medServices[]>('/medServices',{
    params:{    
        _order:'desc',
        _sort:'create_at',
    }
  });
  if (!error.value && data.value) {
    const idList = data.value.map((resp:medServices) => Number(resp.id))
    newId.value = idList.length > 0 ? Math.max(...idList) + 1:1;
    tableData.value = data.value || []
  }
}
async function handleDelete (id:number) {
    const {error} = await useFetchApi.delete(`/medServices/${id}`);
    if (!error.value) {
        getMedservers()
    } 
}
</script>