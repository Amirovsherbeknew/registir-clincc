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
            v-for="(category,idx) in categoryOptions"
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
const emit = defineEmits(['getData'])
const props = defineProps<{
    selected?:doctors,
    newId?:number|null
}>()
const {visitType} = useConstant()
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

onMounted(() => {
  if (props.selected) {
    form.value = {
      category:props.selected.category,
      first_name:props.selected.first_name,
      last_name:props.selected.last_name,
      middle_name:props.selected.middle_name,
      position:props.selected.position
    }
  }
})

const categoryOptions = computed(() => {
  const ignoreList = ['lab']
  return Array.isArray(visitType()) ? visitType()?.filter(resp=> !ignoreList.includes(resp.value)) || []:[]
});

// Submit form
const submitForm = () => {
  doctorForm.value?.validate((valid) => {
    if (valid) {
        if (props.selected) {
          PatchLabTest()
        }
        else createDoctors()
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
        emit('getData')
        dialogVisible.value = false;
    }
}
async function PatchLabTest () {
    const payloadData = {
      create_at:props.selected?.create_at,
      update_at:new Date().toISOString(),
      ...form.value
    };
    const {error} = await useFetchApi.patch(`/doctors/${props.selected?.id}`,payloadData)
    if (!error.value) {
      emit('getData')
      dialogVisible.value = false;
    }
  } 
</script>

<style scoped>
/* Tailwind CSS is used directly in the template, so no additional scoped styles are needed */
</style>