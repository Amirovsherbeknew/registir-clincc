<template>  
    <el-dialog
      v-model="dialogVisible"
      width="600"
      on-destroy-close
      >
      <VTitle class="flex-1 mb-[20px]" title="Laboratoriya sinovini o'zgartirish" v-if="selected"/>
      <VTitle class="flex-1 mb-[20px]" title="Laboratoriya sinovini yaratish" v-else/>
      <el-form ref="medserversForm" :model="form" label-position="top" :rules="useRules('labTestForm')">
        <el-form-item label="Laboratoriya sinovining nomi:" prop="name">
            <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="Laboratoriya sinovining xizmat narxi:" prop="price">
            <el-input v-model="form.price" v-mask="'##################'"/>
        </el-form-item>
        <el-form-item>
            <div class="w-full flex justify-end">
                <el-button type="default" @click="dialogVisible = false">Bekor qilish</el-button>
                <el-button type="success" @click="submitForm">Saqlash</el-button>
            </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </template>
  
  <script lang="ts" setup>
  import {ref} from 'vue'
  import type {labTests} from '~/types/api/labTests.type.ts'
  import type { FormInstance } from 'element-plus'
  const emit = defineEmits(['getData'])
  const props = defineProps<{
    selected?:labTests,
    newId?:number|null
  }>()
  const dialogVisible = defineModel<boolean>()
  
  const medserversForm = ref<FormInstance>()

  const form = ref({
    name:'',
    price:0
  })
  
  onMounted(() => {
    if (props.selected) {
      form.value = {
        name:props.selected.name,
        price:props.selected.price,
      }
    }
  })

  function submitForm () {
    if (!medserversForm.value) return
    medserversForm.value.validate((valid) => {
      if (valid) {
        if (props.selected) {
          PatchLabTest()
        }
        else CreateLabTest()
      }
    })
  }
  async function CreateLabTest () {
    const payloadData = {
      id:props.newId || 1,
      create_at:new Date().toISOString(),
      update_at:new Date().toISOString(),
      ...form.value
    };
    const {error} = await useFetchApi.post('/labTests',payloadData)
    if (!error.value) {
      emit('getData')
      dialogVisible.value = false;
    }
  }
  async function PatchLabTest () {
    const payloadData = {
      id:props.newId,
      create_at:props.selected?.create_at,
      update_at:new Date().toISOString(),
      ...form.value
    };
    const {error} = await useFetchApi.patch(`/labTests/${props.selected?.id}`,payloadData)
    if (!error.value) {
      emit('getData')
      dialogVisible.value = false;
    }
  }
  </script>