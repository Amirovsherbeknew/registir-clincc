<template>
  <el-aside width="340px" class="h-full rounded-[20px] shadow-xl main-bg-linear">
    <el-scrollbar class="h-full bg-white">
      <div class="p-6">
        <img src="~/assets/images/logo.png" class="w-[200px] mx-auto transition-transform duration-300 hover:scale-105"/>
      </div>
      <el-menu class="flex flex-col gap-[5px] !px-4">
          <el-menu-item 
            v-for="(item, index) in useNavigation()" 
            :key="index" 
            class="rounded-[12px] transition-all duration-200 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-100 hover:shadow-md"
          >
            <nuxt-link 
              :to="item.path" 
              class="w-full px-[12px] py-[10px] rounded-[12px] font-medium flex items-center gap-[8px] text-gray-700 hover:text-sky-600 transition-colors duration-200"
            > 
              <IconListUserView class="text-[18px]"/> 
              <span class="text-[18px]">{{ item.title }}</span>
            </nuxt-link>
          </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script lang="ts" setup>
</script>

<style scoped>
/* Main background gradient for the aside */
.main-bg-linear {
  background: linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%);
}

/* Scrollbar styling */
.el-scrollbar {
  border-radius: 20px;
  background: #ffffff;
}

/* Menu item base styling */
.el-menu-item {
  margin-bottom: 5px;
  border-radius: 12px;
  padding: 0px !important;
}

/* Hover state for menu item */
.el-menu-item:hover {
  background: linear-gradient(to right, #e0f7fa, #b3e5fc);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Nuxt-link base styling */
.el-menu-item .nuxt-link {
  transition: all 0.2s ease-in-out;
}

/* Nuxt-link hover state */
.el-menu-item .nuxt-link:hover {
  color: #0288d1;
}

/* Nuxt-link active state */
.el-menu-item .router-link-exact-active  {
  background: linear-gradient(to right, #e0f7fa, #b3e5fc);
  color: #0288d1;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Icon styling */
.el-menu-item .nuxt-link .icon {
  transition: transform 0.2s ease-in-out;
}

/* Icon hover and active state */
.el-menu-item:hover .nuxt-link .icon,
.el-menu-item .router-link-exact-active .icon {
  transform: translateX(5px);
}

/* Remove default Element Plus borders */
.el-menu {
  border-right: none;
}

/* Ensure active menu item doesn't override nuxt-link styling */
.el-menu-item.is-active {
  background: transparent;
}
</style>