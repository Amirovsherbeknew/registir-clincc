<template>
    <el-aside width="320px" class="h-full rounded-[20px] shadow-xl">
      <el-scrollbar class="h-full bg-white">
        <div>
          <img src="~/assets/images/logo.png" class="w-[200px] mx-auto"/>
        </div>
        <el-menu class="flex flex-col gap-[5px]">
            <el-menu-item v-for="(item,index) in useNavigation()" :key="index" class="rounded-[20px] hover:text-sky-500">
              <nuxt-link :to="item.path" class="w-full px-[12px] py-[8px] rounded-[6px] font-medium flex items-center gap-[8px]"> <IconListUserView/> {{ item.title }}</nuxt-link>
            </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>
</template>
<script lang="ts" setup>
</script>
<style>
/* .el-menu-item:hover {
  color: ;
} */
</style>