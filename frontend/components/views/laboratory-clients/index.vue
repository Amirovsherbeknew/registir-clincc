<template>
    <Card class="flex flex-col gap-[20px]">
        <div class="flex items-center">
            <VTitle class="flex-1" title="Laboratoriyaga kelgan mijozlar ro'yxati"/>
        </div>
        <el-table :data="tableData?.data || []" border style="width: 100%">
            <el-table-column  label="F.I.O">
                <template #default="scope">
                    {{scope.row.last_name}} {{scope.row.first_name}} {{scope.row.middle_name}}
                </template>
            </el-table-column>
            <el-table-column  label="Xizmat ko'rsatish ">
                <template #default="scope">
                    <div v-for="(lab,labIdx) in scope.row?.labTests" :key="labIdx">
                        {{ lab?.name }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="Natija fayli" width="180">
                <template #default="scope">
                    <el-button
                        v-if="scope.row?.clientFile"
                        type="success"
                        size="small"
                        @click="downloadFile(scope.row.clientFile)"
                    >
                        <el-icon class="mr-1"><Download /></el-icon>
                        Yuklab olish
                    </el-button>
                    <span v-else class="text-gray-400 text-sm">Mavjud emas</span>
                </template>
            </el-table-column>
            <el-table-column label="Harakat" width="180">
                <template #default="scope">
                    <div class="flex gap-[10px]">
                        <ActionButton type="file" @click="handleEditOpenDialog(scope.row?.id)"/>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <VPagenation
            v-model="filters._page"
            :pageSize="filters._limit"
            :total="tableData?.pagination?.total || 0"
            @change="getDoctorsList"
        />
        <UploadClientFile v-model="dialogVisible" :client-id="selected" @get-data="getDoctorsList"/>
    </Card>
</template>
<script lang="ts" setup>
import UploadClientFile from '~/components/dialogs/uploadClientFile.vue';
import { Download } from '@element-plus/icons-vue'

const dialogVisible = ref(false)

function downloadFile(filename: string) {
    const config = useRuntimeConfig()
    const base = config.public?.apiBase || 'http://localhost:3001'
    const link = document.createElement('a')
    link.href = base + '/clients/file/' + filename
    link.download = filename
    link.click()
}
const tableData = ref()
const selected = ref<number|undefined>()
const filters = ref({
    _page:1,
    _limit:10,
    _order:'desc',
    _sort:'create_at',
    visitTypes_like:'lab'
})
onMounted(() => {
    getDoctorsList()
})

function handleEditOpenDialog (val:number) {
    dialogVisible.value = true;
    selected.value = val;
}
async function getDoctorsList () {
  const {data:ListLab} = await useFetchApi.get('/labTests')
  const {data,error} = await useFetchApi.get<any>('/clients',{
    params:filters.value
  });
  if (!error.value && data.value) {
    tableData.value = {
        ...data.value,
        data:data.value?.data?.map((resp:any) => {
        if (resp?.labTests?.length > 0) {
            return {
                ...resp,
                labTests:ListLab.value?.filter((lab:any) => resp?.labTests?.includes(lab?.id))
            }
        }
        else return resp
    })
    }
  }
}
</script>