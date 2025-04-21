<template>
    <div class="w-full h-svh flex gap-[20px] pl-[20px] py-[20px] wrapper">
        <AppSidebar/>
        <main class="flex-1 overflow-auto rounded-[20px] flex flex-col gap-y-[20px] ">
            <AppHeader/>
            <el-content class="h-full">
                <NuxtPage/>
            </el-content>
        </main>
    </div>
</template>
<script lang="ts" setup>
</script>
<style scoped>
.wrapper {
    background-image: url('~/assets/images/bg-image.png');
    background-size: cover;
    background-repeat: no-repeat;
}
</style>