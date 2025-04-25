<template>
    <div class="rounded-[20px] p-[20px] border-[1px] border-stone-100  min-h-full shadow-xl rounded-2xl bg-white/90 backdrop-blur-xl p-8 transition-all duration-300 hover:shadow-2xl">
        <slot></slot>
    </div>
</template>
<style scoped>
/* Gradient fon va boshqa kichik animatsiyalar uchun qo‘shimcha stillar */
.min-h-screen {
  background: linear-gradient(to bottom right, #e0f7fa, #ffffff, #e0f7fa);
}

.shadow-xl {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.shadow-2xl {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.rounded-2xl {
  border-radius: 1.5rem;
}

.backdrop-blur-md {
  backdrop-filter: blur(8px);
}
</style>