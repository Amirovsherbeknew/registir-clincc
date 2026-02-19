<template>
  <el-dialog v-model="dialogVisible" width="480" destroy-on-close>
    <div class="flex my-[10px]">
      <VTitle class="flex-1" title="Mijoz faylini yuklash" />
    </div>
    <hr class="mb-4" />

    <!-- Upload zona -->
    <div
      class="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors"
      :class="isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'"
      @click="triggerFileInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <input
        ref="fileInputRef"
        type="file"
        class="hidden"
        @change="onFileChange"
      />

      <div v-if="!selectedFile">
        <el-icon class="text-4xl text-gray-400 mb-2"><Upload /></el-icon>
        <p class="text-gray-500 text-sm">Faylni bu yerga tashlang yoki bosib tanlang</p>
      </div>

      <div v-else class="flex items-center justify-center gap-3">
        <el-icon class="text-2xl text-blue-500"><Document /></el-icon>
        <div class="text-left">
          <p class="font-medium text-sm text-gray-800">{{ selectedFile.name }}</p>
          <p class="text-xs text-gray-400">{{ formatSize(selectedFile.size) }}</p>
        </div>
        <el-button
          type="danger"
          link
          @click.stop="selectedFile = null"
        >
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- Tugmalar -->
    <div class="flex justify-end gap-3 mt-5">
      <el-button @click="dialogVisible = false">Bekor qilish</el-button>
      <el-button
        type="primary"
        :loading="loading"
        :disabled="!selectedFile"
        @click="submitUpload"
      >
        Yuklash
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Upload, Document, Close } from '@element-plus/icons-vue'

const props = defineProps<{
  clientId?: number
}>()

const emit = defineEmits(['getData'])

const dialogVisible = defineModel<boolean>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const loading = ref(false)

function triggerFileInput() {
  fileInputRef.value?.click()
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) {
    selectedFile.value = input.files[0]
  }
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) selectedFile.value = file
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function submitUpload() {
  if (!selectedFile.value || !props.clientId) return

  const formData = new FormData()
  formData.append('file', selectedFile.value)
  formData.append('clientId', String(props.clientId))

  loading.value = true
  try {
    const { error } = await useFetchApi.post('/upload/clientFile', formData)
    if (!error.value) {
      useNotifacation.success('Muvaffaqiyatli', 'Fayl yuklandi')
      selectedFile.value = null
      emit('getData')
      dialogVisible.value = false
    }
  } finally {
    loading.value = false
  }
}
</script>
