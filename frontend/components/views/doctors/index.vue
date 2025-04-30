<template>
    <Card class="flex flex-col gap-[20px]">
        <div class="flex items-center">
            <VTitle class="flex-1" title="Shifokorlar ro'yxati"/>
            <el-button type="primary" @click="handleOpenDialog">
                <div class="flex !gap-[8px] items-center">
                    Yangi shifokor qo'shish
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
        <DialogsCreateDoctors  v-if="dialogVisible" v-model="dialogVisible" :newId="newId" :selected="selected" @getData="getDoctorsList"/>
    </Card>
</template>
<script lang="ts" setup>
import type {doctors} from '~/types/api/doctor.type'
const dialogVisible = ref(false)
const tableData = ref<doctors[]>([])
const newId = ref<number|null>();
const selected = ref<doctors>()
onMounted(() => {
    getDoctorsList()
})
function handleOpenDialog () {
    dialogVisible.value = true
}
function handleEditOpenDialog (val:doctors) {
    dialogVisible.value = true;
    selected.value = val;
}
async function getDoctorsList () {
  const {data,error} = await useFetchApi.get<doctors[]>('/doctors');
  if (!error.value && data.value) {
    const idList = data.value?.map((resp:doctors) => Number(resp.id)) 
    newId.value = idList.length > 0 ? Math.max(...idList) + 1:1;
    tableData.value = data.value || []
  }
}
async function handleDelete (id:number) {
    const {error} = await useFetchApi.delete(`/doctors/${id}`);
    if (!error.value) {
        getDoctorsList()
    } 
}
</script>