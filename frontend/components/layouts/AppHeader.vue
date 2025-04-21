<template>
    <div class="w-full bg-white rounded-[20px] border-stone-100 p-[20px] h-[90px] flex items-center">
        <div class="flex-1">
            <div class="text-[28px] font-semibold text-stone-600">Ro'yxatga olingan mijozlar</div>
        </div>
        <el-dropdown>
            <div class="w-[40px] h-[40px] rounded-full bg-stone-300 flex-center text-white text-[36px]">
                <IconUser/>
            </div>
            <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="clearTokens">Chiqish</el-dropdown-item>
                <!-- <el-dropdown-item>Add</el-dropdown-item>
                <el-dropdown-item>Delete</el-dropdown-item> -->
            </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>
<script setup lang="ts">
const {clearTokens} = useToken()
</script>