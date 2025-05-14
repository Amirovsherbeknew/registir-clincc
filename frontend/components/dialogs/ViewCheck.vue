<template>
    <el-dialog v-model="dialogVisible"
      width="700"
      on-destroy-close>
        <ReceiptPrint :data="info"/>
    </el-dialog>
</template>
<script lang="ts" setup>
defineProps<{
  info:any
}>()
const dialogVisible = defineModel<boolean>()
</script>