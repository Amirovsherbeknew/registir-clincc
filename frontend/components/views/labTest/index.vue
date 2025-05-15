<template>
    <Card class="flex flex-col gap-[20px]">
        <div class="flex items-center">
            <VTitle class="flex-1" title="Laboratoriya sinovlari ro'yxati"/>
            <el-button type="primary" @click="handleOpenDialog">
                <div class="flex !gap-[8px] items-center">
                    Yangi laboratoriya sinovini yaratish
                    <IconPlusRectangle/>
                </div>
            </el-button>
        </div>
        <el-table :data="tableData || []" border style="width: 100%">
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
        <DialogsCreateLabTests  v-if="dialogVisible" v-model="dialogVisible" :newId="newId" :selected="selected" @getData="getLabTest"/>
    </Card>
</template>
<script lang="ts" setup>
import type {labTests} from '~/types/api/labTests.type.ts'
const dialogVisible = ref(false)
const tableData = ref<labTests[]>([])
const newId = ref<number|null>();
const selected = ref<labTests>()
onMounted(() => {
  getLabTest()
})
function handleOpenDialog () {
    dialogVisible.value = true
}
function handleEditOpenDialog (val:labTests) {
    dialogVisible.value = true;
    selected.value = val;
}
async function getLabTest () {
  const {data,error} = await useFetchApi.get<labTests[]>('/labTests',{
    params:{        
        _order:'desc',
        _sort:'create_at',
    }
  });
  if (!error.value && data.value) {
    const idList = data.value?.map((resp:labTests) => Number(resp.id)) 
    newId.value = idList.length > 0 ? Math.max(...idList) + 1:1;
    tableData.value = data.value || []
  }
}
async function handleDelete (id:number) {
    const {error} = await useFetchApi.delete(`/labTests/${id}`);
    if (!error.value) {
        getLabTest()
    } 
}
</script>