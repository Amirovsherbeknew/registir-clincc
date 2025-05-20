<template>
    <el-dialog v-model="dialogVisible"
      width="700"
      on-destroy-close>
        <ReceiptPrint v-if="dialogVisible" :data="info" @handleSearch="emit('handleSearch')"/>
    </el-dialog>
</template>
<script lang="ts" setup>
const emit = defineEmits(['handleSearch'])
defineProps<{
  info:any
}>()
const dialogVisible = defineModel<boolean>()
</script>