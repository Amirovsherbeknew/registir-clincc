<template>  
    <el-dialog
      v-model="dialogVisible"
      width="600"
      on-destroy-close
      >
      <VTitle class="flex-1 mb-[20px]" title="Laboratoriya sinovini o'zgartirish" v-if="selected"/>
      <VTitle class="flex-1 mb-[20px]" title="Laboratoriya sinovini yaratish" v-else/>
      <el-form ref="medserversForm" :model="form" label-position="top" :rules="useRules('buildingForm')">
        <el-form-item label="Bino nomi:" prop="name">
            <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="Binoda nechta xona mavjudligi:" prop="per_room">
            <el-input-number v-model="form.per_room"/>
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
  import type {TBuildings} from '~/types/api/buildings.type.ts'
  import type { FormInstance } from 'element-plus'
  const emit = defineEmits(['getData'])
  const props = defineProps<{
    selected?:TBuildings,
    newId?:number|null
  }>()
  const dialogVisible = defineModel<boolean>()
  
  const medserversForm = ref<FormInstance>()

  const form = ref<TBuildings>({
    name:'',
    per_room:1
  })
  
  onMounted(() => {
    if (props.selected) {
      form.value = {
        name:props.selected.name,
        per_room:props.selected.per_room,
      }
    }
  })

  function submitForm () {
    if (!medserversForm.value) return
    medserversForm.value.validate((valid) => {
      if (valid) {
        if (props.selected) {
            PatchBuilding()
        }
        else CreateBuild()
      }
    })
  }
  async function CreateBuild () {
    const payloadData = {
      create_at:new Date().toISOString(),
      update_at:new Date().toISOString(),
      ...form.value
    };
    const {error} = await useFetchApi.post('/buildings',payloadData)
    if (!error.value) {
      emit('getData')
      dialogVisible.value = false;
    }
  }
  async function PatchBuilding () {
    const payloadData = {
      id:props.newId,
      create_at:props.selected?.create_at,
      update_at:new Date().toISOString(),
      ...form.value
    };
    const {error} = await useFetchApi.patch(`/buildings/${props.selected?.id}`,payloadData)
    if (!error.value) {
      emit('getData')
      dialogVisible.value = false;
    }
  }
  </script>