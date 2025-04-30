<template>
  <el-dialog v-model="dialogVisible"
      width="600"
      on-destroy-close >
      <div class="flex my-[10px]">
            <VTitle class="flex-1" v-if="selected" title="Shifokor haqidagi malumotlarni olish"/>
            <VTitle class="flex-1" v-else   title="Yangi shifokor ro'yxatga olish'"/>
      </div>
      <hr class="mb-2">
    <el-form
      ref="doctorForm"
      :model="form"
      :rules="useRules('doctorsForm')"
      label-position="top"
      class="space-y-4"
    >
      <el-form-item label="Familiyasi" prop="last_name">
        <el-input
          v-model="form.last_name"
          placeholder="Familiyasi"
          class="w-full"
        />
      </el-form-item>

      <el-form-item label="Ismi" prop="first_name">
        <el-input
          v-model="form.first_name"
          placeholder="Ismi"
          class="w-full"
        />
      </el-form-item>

      <el-form-item label="Otasini ismi" prop="middle_name">
        <el-input
          v-model="form.middle_name"
          placeholder="Otasini ismi"
          class="w-full"
        />
      </el-form-item>

      <el-form-item label="Lavozimi" prop="position">
        <el-input
          v-model="form.position"
          placeholder="Lavozimi"
          class="w-full"
        />
      </el-form-item>

      <el-form-item label="Xizmat ko'rsatish turi" prop="category">
        <el-select
          v-model="form.category"
          multiple
          placeholder="Xizmat ko'rsatish turi"
          class="w-full"
        >
          <el-option
            v-for="category in categoryOptions"
            :key="category.value"
            :label="category.label"
            :value="category.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <div class="w-full flex justify-end space-x-4">
            <el-button
                @click="resetForm;dialogVisible = false"
                class="bg-gray-200 hover:bg-gray-300 text-gray-800">
                    Bekor qilish
            </el-button>
            <el-button
                type="primary"
                @click="submitForm"
                class="bg-blue-600 hover:bg-blue-700 text-white">
                    Saqlash
            </el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElForm } from 'element-plus';
import type { FormInstance } from 'element-plus';
import type {doctors} from '~/types/api/doctor.type'
const props = defineProps<{
    selected?:doctors,
    newId?:number|null
}>()
// Form data
const dialogVisible = defineModel<boolean>()
const form = ref<doctors>({
  last_name: '',
  first_name: '',
  middle_name: '',
  position: '',
  category: [],
});

// Form reference
const doctorForm = ref<FormInstance>();

const categoryOptions = ref([
  { value: 'cat1', label: 'Category 1' },
  { value: 'cat2', label: 'Category 2' },
  { value: 'cat3', label: 'Category 3' },
]);

// Submit form
const submitForm = () => {
  doctorForm.value?.validate((valid) => {
    if (valid) {
        createDoctors()
        console.log('Form submitted:', form.value);
      // alert('Form submitted successfully!');
    } else {
        console.log('Validation failed');
    }
  });
};

// Reset form
const resetForm = () => {
  doctorForm.value?.resetFields();
};

async function createDoctors () {
    const {error} = await useFetchApi.post('/doctors',{id:String(props.newId),...form.value})
    if (!error.value) {
        resetForm()
        dialogVisible.value = false;
    }
} 
</script>

<style scoped>
/* Tailwind CSS is used directly in the template, so no additional scoped styles are needed */
</style>