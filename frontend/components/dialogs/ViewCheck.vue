<template>
    <el-dialog v-model="dialogVisible"
      width="600"
      on-destroy-close>
        <ReceiptPrint/>
    </el-dialog>
</template>
<script lang="ts" setup>
const dialogVisible = defineModel<boolean>()
</script>