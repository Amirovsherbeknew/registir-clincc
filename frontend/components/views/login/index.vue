<template>
    <div class="min-h-screen flex items-center justify-center bg-[#E6E2FF]">
      <div class="w-full max-w-5xl flex rounded-[20px] shadow-2xl overflow-hidden">
        <!-- Left side - Login Form -->
        <div class="w-[45%] bg-white p-10 flex flex-col">
          <div class="mb-8">
            <h1 class="text-2xl font-bold mb-2">LOGIN</h1>
            <p class="text-sm text-gray-500">How to I get started lorem ipsum dolor sit?</p>
          </div>
  
          <el-form class="mb-6" :rules="useRules('login')" :model="form" ref="loginFormRef" @keyup.enter="submitForm">
            <el-form-item prop="username">
              <el-input
                v-model="form.username"
                placeholder="Username"
                :prefix-icon="User"
                class="custom-input"
              />
            </el-form-item>
  
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="Password"
                :prefix-icon="Lock"
                class="custom-input"
              />
            </el-form-item>
          </el-form>
          <el-form-item>
            <div class="flex justify-center w-full">
                <el-button @click="submitForm"
                    type="primary" 
                    class="login-button mb-8" 
                    round
                >
                    Login Now
                </el-button>
            </div>
          </el-form-item>
        </div>
  
        <!-- Right side - Image -->
        <div class="flex-1 bg-violet-500 relative overflow-hidden">
          <div class="absolute inset-0 bg-violet-500">
            <div class="absolute w-64 h-64 rounded-full bg-violet-400 opacity-30 -top-10 -right-10"></div>
            <div class="absolute w-64 h-64 rounded-full bg-violet-400 opacity-30 -bottom-10 -left-10"></div>
          </div>
          
          <div class="relative h-full flex items-center justify-center p-8">
            <div class="bg-violet-400 bg-opacity-20 rounded-3xl p-4 w-4/5 h-4/5 flex items-center justify-center">
              <img 
                src="~/assets/images/login-image.png" 
                alt="Woman with tablet" 
                class="max-h-full object-cover"
              />
            </div>
            
            <!-- <div class="absolute bottom-12 right-12 bg-yellow-100 p-2 rounded-full">
              <el-icon class="text-yellow-500"><Lightning /></el-icon>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import type {loginFormType} from '~/types/others/index.type'
  import type { FormInstance } from 'element-plus'
  import type {usersType} from '~/types/api/user.type'
  import { User, Lock, Lightning } from '@element-plus/icons-vue';
  const router = useRouter()
  const {setRole} = useToken()
  const loginFormRef = ref<FormInstance>()

  const form = ref<loginFormType>({
    username: '',
    password: ''
  });

  function submitForm () {
    if (!loginFormRef.value) return;
    loginFormRef.value.validate((valid:boolean) => {
      if (valid) {
        handleLogin()
      }
    })
  }
  async function handleLogin () {
    const {data,error}:any = await useFetchApi.post('/login',form.value);
    if (!error.value && data.value) {
      setRole(data.value?.user?.role)
      router.push('/')
    }
  }
  </script>
  
  <style>
  /* Custom styles to match the design */
  .custom-input :deep(.el-input__wrapper) {
    background-color: #f3f4f6;
    border: none;
    box-shadow: none;
    padding: 0.5rem 0.75rem;
  }
  
  .custom-input :deep(.el-input__prefix) {
    margin-right: 0.5rem;
  }
  
  .login-button {
    background-color: #8b5cf6 !important;
    border-color: #8b5cf6 !important;
    height: 40px;
  }
  
  .login-button:hover {
    background-color: #7c3aed !important;
    border-color: #7c3aed !important;
  }
  
  .social-button {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e5e7eb;
    background-color: white;
    height: 40px;
  }
  
  .social-button:hover {
    background-color: #f9fafb;
  }
  </style>