<template>
  <Card
    class="w-full "
  >
    <div class="flex flex-col gap-6 items-center">
      <!-- Sarlavha -->
      <div class="max-w-[540px] w-full">
        <VTitle
          class="text-3xl font-bold text-gray-900 tracking-tight mb-4 flex items-center gap-2"
          title="Check raqamini yozing..."
        >
          <span class="text-blue-500">
            <IconSearch class="text-[24px]" />
          </span>
        </VTitle>

        <!-- Input maydoni -->
        <el-input
          v-model="search"
          style="width: 100%;"
          placeholder="Check raqamini yozing..."
          @input="handleSearch"
          class="rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <template #suffix>
            <IconSearch class="text-gray-500 hover:text-blue-500 transition-colors duration-200" />
          </template>
        </el-input>
      </div>
    </div>

    <!-- Check ma'lumotlari -->
    <div
      v-if="tableData.length > 0"
      class="w-full mt-8 flex flex-col gap-[20px] justify-center"
    >
      <div class="text-2xl font-semibold text-gray-800 tracking-tight">
        Natijalar:
      </div>
      <div class="flex-1 flex-center flex-wrap gap-[20px]">
        <div
          v-for="item in tableData"
          :key="item.id"
          class="min-w-[640px] bg-white rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-50/50"
        >
          <ReceiptPrint :data="{ ...item, ...form }" />
        </div>
      </div>
    </div>

    <!-- Natija topilmaganda -->
    <div v-else-if="search && tableData.length === 0" class="mt-8">
      <p class="text-gray-600 text-center text-lg font-medium">
        Check topilmadi...
      </p>
    </div>
  </Card>
</template>

<script lang="ts" setup>
import type { checkType } from '~/types/api/check.type.ts'

const tableData = ref<checkType[]>([])
const originalData = ref<checkType[]>([])
const search = ref<string>('')

onMounted(() => {
  getChecks()
})

async function getChecks() {
  const { data, error } = await useFetchApi.get<checkType[]>('/checks')
  if (!error.value && data.value) {
    tableData.value = data.value || []
    originalData.value = data.value || []
  }
}

async function handleSearch() {
  const query = search.value.trim()
  if (!query) {
    tableData.value = []
  } else {
    tableData.value = originalData.value.filter((item: checkType) =>
      item.id.toString().includes(query)
    )
  }
}


const formattedDate = (date: any) => {
  const d = new Date(date)
  return d.toLocaleDateString('uz-UZ') + ' ' + d.toLocaleTimeString('uz-UZ')
}
</script>

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

/* Hover effektlari */
button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

button {
  transition: all 0.3s ease;
}

/* Input va natijalar uchun qo'shimcha stillar */
.el-input input {
  padding: 12px 16px;
  font-size: 16px;
  color: #333;
}

.el-input input::placeholder {
  color: #a0aec0;
  font-style: italic;
}

/* Natija kartalari uchun qo'shimcha dizayn */
/* .max-w-[540px] {
  transition: transform 0.3s ease;
}

.max-w-[540px]:hover {
  transform: translateY(-3px);
} */
</style>