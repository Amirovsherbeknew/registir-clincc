<template>  
    <el-dialog
      v-model="dialogVisible"
      width="600"
      on-destroy-close
      >
      <VTitle class="flex-1 mb-[20px]" title="Pulni qaytarish"/>
      <el-form ref="medserversForm" :model="form" label-position="top" :rules="useRules('replacePayment')">
        
        <el-form-item label="Qaytariladigan summa:" prop="price">
            <el-input v-model="form.price" v-mask="'##################'"/>
        </el-form-item>
        <el-form-item label="Qaytarilish sababi:" prop="reason">
            <el-input v-model="form.reason" type="textarea" :row="6"/>
        </el-form-item>
        <el-form-item>
            <div class="w-full flex justify-end">
                <el-button type="default" @click="dialogVisible = false">Bekor qilish</el-button>
                <el-popconfirm
                  class="box-item min-w-[250px]"
                  title="Haqiqatdan ham pulni qaytarishni xohlaysizmi"
                  placement="top-start"
                  confirm-button-text="Ha"
                  cancel-button-text="Yo'q"
                  @confirm="submitForm"
                >
                    <template #reference>
                      <el-button type="success">Saqlash</el-button>
                    </template>
                </el-popconfirm>
                
            </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </template>
  
  <script lang="ts" setup>
  import {ref} from 'vue'
  import type {medServices} from '~/types/api/medServices.type.ts'
  import type {checkType} from '~/types/api/check.type.ts'
  import type { FormInstance } from 'element-plus'
  const emit = defineEmits(['getData'])
  const props = defineProps<{
    check?:checkType
    selected?:medServices,
    newId?:number|null
  }>()
  const dialogVisible = defineModel<boolean>()
  
  const medserversForm = ref<FormInstance>()

  const form = ref({
    reason:'',
    price:null
  })

  function submitForm () {
    if (!medserversForm.value) return
    medserversForm.value.validate((valid) => {
      if (valid) {
        if (form.value.price && props.check?.totalPrice && Number(props.check.totalPrice) < Number(form.value.price)) {
          useNotifacation.warning('Xatolik','qaytarish summasi to\'langan miqdordan ko\'p bo\'lib ketdi')
          return
        }
        if (props.selected) {
          PatchMedServers()
        }
        else  CreateMedServers()
      }
    })
  }
  async function CreateMedServers () {
    const payloadData = {
      create_at:new Date().toISOString(),
      update_at:new Date().toISOString(),
      ...form.value
    };
    const {error} = await useFetchApi.patch(`/checks/${props.check?.id}`,{totalPrice:(Number(props?.check?.totalPrice) - Number(payloadData.price)),  replace_payment:payloadData,
    status:'cancel_payment'
    })
    if (!error.value) {
      emit('getData')
      dialogVisible.value = false;
    }
  }
  async function PatchMedServers () {
    const payloadData = {
      create_at:props.selected?.create_at,
      update_at:new Date().toISOString(),
      ...form.value
    };
    const {error} = await useFetchApi.patch(`/checks/${props.check?.id}`,{totalPrice:(Number(props?.check?.totalPrice) - Number(payloadData.price)),replace_payment:payloadData,
    status:'cancel_payment'})
    if (!error.value) {
      emit('getData')
      dialogVisible.value = false;
    }
  }
  </script>