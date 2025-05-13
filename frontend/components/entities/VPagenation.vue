<template>
    <div class="flex justify-end items-center py-[15px]">
        <el-pagination
            :current-page="internalPage"
            :page-size="pageSize"
            background
            layout="prev, pager, next"
            :total="total"
            @current-change="onPageChange"
        />     
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    modelValue: number,  // bu v-model ni avtomatik bog‘laydi
    pageSize?: number,
    total: number
  }>()
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
    (e: 'change', value: number): void
  }>()
  
  const internalPage = ref(props.modelValue)
  
  watch(() => props.modelValue, (val) => {
    internalPage.value = val
  })
  
  function onPageChange(page: number) {
    internalPage.value = page
    emit('update:modelValue', page) // v-model uchun
    emit('change', page)            // optional, qo‘shimcha ishlatish uchun
  }
  </script>
  