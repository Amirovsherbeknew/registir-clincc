<template>
    <div class="w-full bg-white rounded-[20px] border-stone-100 p-[20px] h-[90px] flex items-center">
      <div class="flex-1">
        <div class="text-[28px] font-semibold text-stone-600">{{ todayDate }}</div>
      </div>
      <el-dropdown>
        <div class="w-[40px] h-[40px] rounded-full bg-stone-300 flex-center text-white text-[36px]">
          <IconUser />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="clearTokens">Chiqish</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  
  const { clearTokens } = useToken()
  
  const todayDate = ref('')
  
  let intervalId: ReturnType<typeof setInterval> // ✅ To'g'ri TypeScript tipi
  
  const updateTime = () => {
    todayDate.value = useDateFormat(new Date())
  }
  
  onMounted(() => {
    updateTime()
    intervalId = setInterval(updateTime, 1000)
  })
  
  onUnmounted(() => {
    clearInterval(intervalId)
  })
  </script>
  
  