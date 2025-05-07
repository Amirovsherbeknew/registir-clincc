<template>  
    <el-dialog
      v-model="dialogVisible"
      width="600"
      on-destroy-close
      >
      <VTitle class="flex-1 mb-[20px]" title="Xona haqidago ma'lumotlarni o'zgartirish" v-if="selected"/>
      <VTitle class="flex-1 mb-[20px]" title="Xona yaratish" v-else/>
      <el-form ref="medserversForm" :model="form" label-position="top" :rules="useRules('roomsForm')">
        <el-form-item label="Xonaning nomi:" prop="name">
            <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="Xonaning 1 kunlik xizmat narxi:" prop="pricePerDay">
            <el-input v-model="form.pricePerDay" v-mask="'##################'"/>
        </el-form-item>
        <el-form-item label="Qaysi binoga tegishli" prop="buildingId">
            <el-select v-model="form.buildingId" placeholder="Qaysi binoga tegishli">
              <el-option v-for="catergory in catergory" :key="catergory.id" :value="catergory?.id || ''" :label="catergory.name"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="Xonani sig'imi" prop="people_per_room">
          <el-input-number v-model="form.people_per_room" :min="1" />
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
  import type {rooms} from '~/types/api/rooms.type.ts'
  import type { FormInstance } from 'element-plus'
  const emit = defineEmits(['getData'])
  const props = defineProps<{
    selected?:rooms,
    newId?:number|null
  }>()
  const dialogVisible = defineModel<boolean>()
  const catergory = ref<TBuildings[]>([])
  const medserversForm = ref<FormInstance>()

  const form = ref<rooms>({
    name:'',
    people_per_room:1,
    pricePerDay:0,
    buildingId:undefined
  })
  
  onMounted(() => {
    getCategory()
    if (props.selected) {
      form.value = {
        name:props.selected.name,
        people_per_room:props.selected?.people_per_room,
        buildingId:props.selected?.buildingId,
        pricePerDay:props.selected.pricePerDay,
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
      id:props.newId,
      create_at:new Date().toISOString(),
      update_at:new Date().toISOString(),
      ...form.value
    };
    const {error} = await useFetchApi.post('/rooms',payloadData)
    if (!error.value) {
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
    const {error} = await useFetchApi.patch(`/rooms/${props.selected?.id}`,payloadData)
    if (!error.value) {
      emit('getData')
      dialogVisible.value = false;
    }
  }
  async function getCategory () {
      const {data,error} = await useFetchApi.get<TBuildings[]>('/buildings')
      if (!error.value && data.value) {
        catergory.value = data.value
      }
  }
  </script>