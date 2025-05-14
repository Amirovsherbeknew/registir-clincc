<template>
  <Card>
        <div class="flex gap-[10px] justify-between">
            <VTitle title="Checklar ro'yxati"/>
        </div>
        <div class="">
            <FiltersCheck v-model="filter" @search="GetCheckList"/>
        </div>
        <div class="w-full">
            <el-table :data="tableData?.data || []" style="width: 100%" border>
                <el-table-column prop="id" label="Check raqami" width="150" align="center"></el-table-column>
                <el-table-column label="Check egasi" width="300">
                    <template #default="scope">
                        {{ scope.row?.client?.last_name }} {{ scope.row?.client?.first_name }} {{ scope.row?.client?.middle_name }}
                    </template>
                </el-table-column>
                <el-table-column label="To'lov summasi" width="200" align="center">
                    <template #default="scope">
                        {{ useCurrencyFormat(Number(scope.row?.totalPrice)) }}
                    </template>
                </el-table-column>
                <el-table-column label="Yaratilgan vaqti" width="200" align="center">
                    <template #default="scope">
                        {{ useDateFormat(scope.row?.create_at) }}
                    </template>
                </el-table-column>
                <el-table-column label="Holati" width="200" align="center">
                    <template #default="scope">
                        <TableStatus :type="TableStatusType(scope.row)"/>
                    </template>
                </el-table-column>
                <el-table-column label="Telefon raqam" width="200" align="center">
                    <template #default="scope">
                        {{scope?.row?.client?.phone}}
                    </template>
                </el-table-column>
                <el-table-column label="Check egasini raqami" width="200" align="center">
                    <template #default="scope">
                        <div>{{ scope.row.client?.id }}</div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="Harakat" width="150" align="center">
                    <template #default="scope">
                        <div class="flex-center">
                            <ActionButton type="show" tooltip_title="Xona haqida malumot" @click="handleOpenRoomInfoDialog(scope.row?.client?.roomId)"/>
                        </div>
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
      
      <DialogsViewRoomInfo v-if="dialogVisibly" v-model="dialogVisibly" :roomId="roomId"/>
  </Card>
</template>
<script setup lang='ts'>
import type {rooms} from '~/types/api/rooms.type.ts'
import type { TFilterCheck } from '~/types/filter/index.type'
const filter = ref<TFilterCheck>({
    _page:1,
    _limit:10,
    dateRange:[],
    visitTypes_like:undefined
})

const tableData = ref()
const dialogVisibly = ref(false)
const roomId = ref<number|null>(null)

onMounted(() => {
  GetCheckList()
})

function handleOpenRoomInfoDialog (val:number) {
    roomId.value = val
    dialogVisibly.value = true
}

function TableStatusType (check:rooms) {
    if (check?.replace_payment) {
        return 'cancel_payment'
    }
    else return check?.isPaid ? 'approved':'pending'
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