<template>
    <div>
      <el-tooltip class="box-item" effect="dark" :content="tooltip_title || tooltip_titles[type]" placement="top-start">
        <button
          :class="[type, { '!bg-stone-200 !text-white pointer-events-none': disabled }]"
          class="flex-center w-10 h-10 rounded-[10px] transition-colors duration-300"
        >
          <component :is="`icon-${type}`" />
        </button>
      </el-tooltip>
    </div>
  </template>
  
  <script setup lang="ts">
  interface TProps {
    type: "search" | "show" | "delete" | "clear" | "exit" | "file" | "edit"|"payment"|"reload";
    disabled?: boolean;
    tooltip_title?: string;
  }
  defineProps<TProps>();
  const tooltip_titles = {
    search: "Qidirish",
    show: "Ko'rish",
    delete: "O'chirish",
    clear: "Tozalash",
    exit: "Chiqish",
    file: "Hujjatni ko'rish",
    edit: "O'zgaritirish",
    payment: "To'lov qilish",
    reload: "Yangilash"
  };
  </script>
  
  <style scoped>
  .search,
  .reload,
  .show {
    background: var(--color-sky-50);
    color: var(--color-sky-600);
  }
  .search:hover,.reload:hover,
  .show:hover {
    background: theme("colors.sky.500");
  }
  .delete,
  .clear,
  .payment,
  .exit {
    background: var(--color-rose-50);
    color: var(--color-red-600);
  }
  .delete:hover,
  .payment:hover,
  .clear:hover,
  .exit:hover {
    background: theme("colors.rose.500");
  }
  .file {
    background: var(--color-violet-50);
    color: var(--color-violet-600);
  }
  .file:hover {
    background: theme("colors.violet.500");
  }
  .edit {
    background: var(--color-teal-50);
    color: var(--color-teal-600);
  }
  .edit:hover {
    background: theme("colors.teal.500");
  }
  
  .search:hover,
  .show:hover,
  .delete:hover,
  .clear:hover,
  .payment:hover,
  .exit:hover,
  .file:hover,
  .reload:hover,
  .edit:hover {
    color: #fff;
  }

  </style>
  