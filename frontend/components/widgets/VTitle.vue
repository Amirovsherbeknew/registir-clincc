<template>
    <div class="text-[24px] font-semibold text-stone-600">{{title}} </div>
</template>
<script setup lang="ts">
const props = defineProps<{
    title:string
}>()
</script>