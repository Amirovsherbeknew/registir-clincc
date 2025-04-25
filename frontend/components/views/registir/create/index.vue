<template>
    <Card class="flex flex-col gap-[20px]">
      <VTitle title="Mijozni ro'yxatga olish" />
      <el-form
        :model="form"
        label-position="top"
        class="w"
        ref="createform"
        :rules="useRules('createForm')"
      >
        <div class="w-full grid grid-cols-3 gap-[16px]">
          <el-form-item label="Ismi" prop="last_name">
            <el-input v-model="form.last_name" placeholder="Ismini kiriting" />
          </el-form-item>
          <el-form-item label="Familiyasi" prop="first_name">
            <el-input v-model="form.first_name" placeholder="Familiyasini kiriting" />
          </el-form-item>
          <el-form-item label="Otasini ismi" prop="middle_name">
            <el-input v-model="form.middle_name" placeholder="Otasini ismini kiriting" />
          </el-form-item>
        </div>
  
        <div class="grid grid-cols-2 gap-[16px]">
          <el-form-item label="Telefon" prop="phone">
            <el-input v-model="form.phone" placeholder="+998..." v-mask="'+998 ## ### ## ##'"/>
          </el-form-item>
  
          <el-form-item label="Jinsi" prop="gender">
            <el-button-group>
            <el-button
              :type="form.gender === 'm' ? 'primary' : 'default'"
              @click="form.gender = 'm'"
            >
              Erkak
            </el-button>
            <el-button
              :type="form.gender === 'f' ? 'primary' : 'default'"
              @click="form.gender = 'f'"
            >
              Ayol
            </el-button>
          </el-button-group>
          </el-form-item>
        </div>
  
        <!-- Murojaat turi (Button Group) -->
        <el-form-item label="Murojaat turi" prop="visitTypes">
          <el-button-group>
            <el-button
              :type="form.visitTypes.includes('med') ? 'primary' : 'default'"
              @click="toggleVisitType('med')"
            >
              Med ko‘rik
            </el-button>
            <el-button
              :type="form.visitTypes.includes('room') ? 'primary' : 'default'"
              @click="toggleVisitType('room')"
            >
              Yotoqxona
            </el-button>
            <el-button
              :type="form.visitTypes.includes('lab') ? 'primary' : 'default'"
              @click="toggleVisitType('lab')"
            >
              Labaratoriya
            </el-button>
          </el-button-group>
        </el-form-item>
  
        <!-- Med ko‘rik -->
        <el-form-item
          label="Ko‘rik turlari"
          v-if="form.visitTypes.includes('med')"
          prop="medServices"
        >
          <el-select v-model="form.medServices" multiple placeholder="Ko‘rik tanlang">
            <el-option
              v-for="item in dictionary.medServices"
              :key="item.id"
              :label="`${item.name} - ${useCurrencyFormat(item.price)}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
  
        <!-- Yotoqxona -->
        <template v-if="form.visitTypes.includes('room')">
          <el-form-item label="Xona turi" prop="room.roomId">
            <el-select v-model="form.room.roomId" placeholder="Xona tanlang">
              <el-option
                v-for="room in dictionary.rooms"
                :key="room.id"
                :label="`${room.name} - ${useCurrencyFormat(room.pricePerDay)}/kun`"
                :value="room.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Necha kun" prop="room.days">
            <el-input-number v-model="form.room.days" :min="1" />
          </el-form-item>
        </template>
  
        <!-- Labaratoriya (Select Multiple) -->
        <el-form-item label="Analizlar" v-if="form.visitTypes.includes('lab')" prop="labTests">
          <el-select v-model="form.labTests" multiple placeholder="Analiz tanlang">
            <el-option
              v-for="test in dictionary.labTests"
              :key="test.id"
              :label="`${test.name} - ${useCurrencyFormat(test.price)}`"
              :value="test.id"
            />
          </el-select>
        </el-form-item>
  
        <el-form-item>
          <el-button type="primary" @click="submitForm">Check chiqarish</el-button>
        </el-form-item>
  
        <div class="w-[350px] mx-auto">
          <ReceiptPrint v-if="viewCheck" :data="{...checkData,...form}"/>
        </div>
      </el-form>
    </Card>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const createform = ref(null)
  const viewCheck = ref(false)
  const dictionary = ref({
    medServices: [],
    rooms: [],
    labTests: []
  })
  
  const form = ref({
    last_name: '',
    first_name: '',
    middle_name: '',
    phone: '',
    gender: '',
    visitTypes: [],
    medServices: [],
    rooms: [],
    room: {
      roomId: null,
      days: 1
    },
    labTests: []
  })
  
  // Visit type toggle
  function toggleVisitType(type) {
    const index = form.value.visitTypes.indexOf(type)
    if (index === -1) {
      form.value.visitTypes.push(type)
    } else {
      form.value.visitTypes.splice(index, 1)
    }
  }
  
  // Check hisoblash
  const checkData = ref(null)
  const generateCheck = async (id) => {
    let total = 0
  
    if (form.value.visitTypes.includes('med')) {
      for (let id of form.value.medServices) {
        const item = dictionary.value.medServices.find(m => m.id === id)
        if (item) total += Number(item.price)
      }
    }
  
    if (form.value.visitTypes.includes('room')) {
      console.log(form.value.room)
      const room = dictionary.value.rooms.find(r => r.id === form.value.room.roomId)
      if (room) total += Number(room.pricePerDay) * form.value.room.days
      console.log(total)
    }
  
    if (form.value.visitTypes.includes('lab')) {
      for (let id of form.value.labTests) {
        const test = dictionary.value.labTests.find(t => t.id === id)
        if (test) total += Number(test.price)
      }
    }
  
    checkData.value = {
      id: await generateNewCheckId(),
      clientId:id,
      create_at: new Date().toISOString(),
      update_at: new Date().toISOString(),
      totalPrice: total,
      isPaid: false
    }
    createCheck()
  }
  
  // Submit
  function submitForm() {
    if (!createform.value) return
    createform.value.validate(valid => {
      if (valid) {
        alert('l')
        createClientForm()
      }
      else alert('2')
    })
  }
  
  // Dictionary fetch (placeholder)
  async function getDictionary() {
    const apiList = [
      { key: 'medServices', endpoint: '/medServices' },
      { key: 'rooms', endpoint: '/rooms' },
      { key: 'labTests', endpoint: '/labTests' }
    ]
  
    const fetchPromises = apiList.map(resp => useFetchApi.get(resp.endpoint))
    const results = await Promise.all(fetchPromises)
  
    results.forEach((result, index) => {
      if (!result.error.value) {
        dictionary.value[apiList[index].key] = result.data.value
      }
    })
  }
  async function generateNewId () {
    let newClientId = 0;
    const {data,error} = await useFetchApi.get('/clients');
    if (!error.value && data.value) {
      const clientsIdList = data.value?.map(resp => Number(resp.id))
      console.log(clientsIdList)
      newClientId = clientsIdList.length > 0 ? Math.max(...clientsIdList) + 1:1
    }
    return newClientId;
  }
  async function generateNewCheckId () {
    let newClientId = 0;
    const {data,error} = await useFetchApi.get('/checks');
    if (!error.value && data.value) {
      const clientsIdList = data.value?.map(resp => Number(resp.id))
      console.log(clientsIdList)
      newClientId = clientsIdList.length > 0 ? Math.max(...clientsIdList) + 1:1
    }
    return newClientId;
  }
  async function createClientForm () {
    
    const payloadData = {
      id:await generateNewId(),
      create_at: new Date().toISOString(),
      update_at: new Date().toISOString(),
      ...form.value
    }
    const {data,error} = await useFetchApi.post('/clients',payloadData)
    if (!error.value && data.value) {
      generateCheck(data.value.id)
    }
  }
  async function createCheck (payloadData) {
    const {data,error} = await useFetchApi.post('/checks',checkData.value)
    if (!error.value) {
      viewCheck.value = true;
    }
  }
  onMounted(() => {
    getDictionary()
  })
  </script>
  