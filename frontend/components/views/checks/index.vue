<template>
    <Card class="flex flex-col gap-[20px]">
        <div class="flex items-center">
            <VTitle class="flex-1" title="Checklar ro'yxati"/>
            <div>
                <el-input
                    v-model="search"
                    style="width: 240px"
                    placeholder="Tolov raqamidan qidiring"
                    @input="handleSearch"
                    >
                    <template #suffix>
                        <IconSearch />
                    </template>
                    </el-input>

            </div>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="id" label="Tolov chek raqami"/>
            <el-table-column label="Xizmat narxi">
                <template #default="scope">
                  {{scope.row.isPaid}}
                    {{useCurrencyFormat(scope.row.totalPrice)}}
                </template>
            </el-table-column>
            <el-table-column  label="Xizmat narxi">
                <template #default="scope">
                    {{formattedDate(scope.row.createdAt || scope.row.create_at)}}
                </template>
            </el-table-column>
            <el-table-column  label="Holati">
                <template #default="scope">
                    <TableStatus :type="scope.row.isPaid ? 'approved':'pending'"/>
                </template>
            </el-table-column>
            <el-table-column label="Harakat" width="180">
                <template #default="scope">
                    <div class="flex gap-[10px]">
                        <ActionButton type="payment" @click="handlePaid(scope.row.id)" :disabled="scope.row.isPaid"/>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </Card>
</template>
<script lang="ts" setup>
import type { checkType } from '~/types/api/check.type.ts'

const tableData = ref<checkType[]>([])
const originalData = ref<checkType[]>([])
const search = ref<string>('')

onMounted(() => {
  getChecks()
})

async function getChecks() {
  const { data, error } = await useFetchApi.get<checkType[]>('/checks')
  if (!error.value && data.value) {
    tableData.value = data.value || []
    originalData.value = data.value || []
  }
}

function handleSearch() {
  const query = search.value.trim()
  if (!query) {
    tableData.value = originalData.value
  } else {
    tableData.value = originalData.value.filter((item: checkType) =>
      item.id.toString().includes(query)
    )
  }
}

async function handlePaid(id: number) {
  const { error } = await useFetchApi.patch(`/checks/${id}`,{isPaid:true})
  if (!error.value) {
    getChecks()
  }
}

const formattedDate = (date: any) => {
  const d = new Date(date)
  return d.toLocaleDateString('uz-UZ') + ' ' + d.toLocaleTimeString('uz-UZ')
}
</script>
