<template>
    <el-dialog v-model="dialogVisible"
      width="500"
      on-destroy-close>
      <VTitle title="Check bo'yicha to'lovlar tarixi:"/>
      <hr class="my-[20px]"/> 
      <div v-for="(item,idx) in info?.part_pay_price" :key="idx" class="grid grid-cols-2 gap-[10px] my-[10px]">
            <div>{{ useDateFormat(item.create_at) }}</div>
            <div class="text-right">{{ useCurrencyFormat(item.price) }}</div>
       </div>
       <div class="w-full mt-[20px] flex-center">
        <el-button @click="dialogVisible = false">Yopish</el-button>
       </div>
    </el-dialog>
</template>
<script lang="ts" setup>
defineProps<{
  info:any
}>()
const dialogVisible = defineModel<boolean>()
</script>