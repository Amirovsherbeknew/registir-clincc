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
            <el-select v-model="form.room.roomId" placeholder="Xona tanlang" filterable>
              <el-option
                v-for="room in dictionary.rooms"
                :key="room.id"
                :label="`${room.name} - ${useCurrencyFormat(room.pricePerDay)}/kun  ${room?.people_per_room - (room?.limit || 0)} ta joy mavjud`"
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

        <el-form-item label="Shifokorlar" v-if="form.visitTypes.includes('med') || form.visitTypes.includes('room')" prop="doctorId">
          <el-select v-model="form.doctorId" placeholder="Shifokorni tanlang">
            <el-option
              v-for="doctor in dictionary.doctor"
              :key="doctor.id"
              :label="`${doctor.first_name} - ${doctor.last_name} - ${doctor.middle_name}`"
              :value="doctor.id"
            />
          </el-select>
        </el-form-item>
  
        <el-form-item>
          <el-button type="primary" @click="submitForm">Check chiqarish</el-button>
        </el-form-item>
        
      </el-form>
      <DialogsViewCheck v-model="viewCheck" :info="{...checkData,clientInfo:clientInfo}"/>
    </Card>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  const router = useRouter()
  const createform = ref(null)
  const viewCheck = ref(false)
  const dictionary = ref({
    medServices: [],
    rooms: [],
    labTests: [],
    doctor:[]
  })
  
  const form = ref({
    last_name: '',
    first_name: '',
    middle_name: '',
    phone: '',
    gender: '',
    visitTypes: [],
    medServices: [],
    room: {
      roomId: null,
      days: 1
    },
    labTests: [],
    doctorId:undefined
  })
  const clientInfo = computed(() => {
    return {
      ...form.value,
      medServices:dictionary.value.medServices?.filter(resp => form.value.medServices.includes(resp.id)),
      labTests:dictionary.value.labTests?.filter(resp => form.value.labTests.includes(resp.id)),
      room:{...form.value.room,
        priceDay:dictionary.value.rooms.find(resp => Number(resp.id) === Number(form.value.room.roomId))?.pricePerDay,
        price:dictionary.value.rooms.find(resp => Number(resp.id) === Number(form.value.room.roomId))?.pricePerDay * form.value.room.days,
      },
      doctorInfo:dictionary.value.doctor.find((resp) => resp.id === form.value.doctorId)
    }
  })

  watch(
    () => viewCheck.value,
    (val) => {
      if (!val) {
        router.push('/registir')
      }
    }
  )
  
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
    let roomPrice = 0
    let med = 0
    let lab = 0
    if (form.value.visitTypes.includes('med')) {
      for (let id of form.value.medServices) {
        const item = dictionary.value.medServices.find(m => m?.id === id)
        if (item) {
          med += Number(item.price)
          total += Number(item.price)
        }
      }
    }
  
    if (form.value.visitTypes.includes('room')) {
      const room = dictionary.value.rooms.find(r => r?.id === form.value.room.roomId)
      if (room) {
        roomPrice += Number(room.pricePerDay) * form.value.room.days
        total += Number(room.pricePerDay) * form.value.room.days
      }
    }
  
    if (form.value.visitTypes.includes('lab')) {
      for (let id of form.value.labTests) {
        const test = dictionary.value.labTests.find(t => t?.id === id)
        if (test) {
          lab += Number(test.price)
          total += Number(test.price)
        }
      }
    }
  
    checkData.value = {
      clientId:id,
      create_at: new Date().toISOString(),
      update_at: new Date().toISOString(),
      totalPrice: total,
      isPaid: false,
      medServices:form.value.medServices || [],
      labTests:form.value.labTests || [],
      doctorId:form.value.doctorId || null,
      roomId:form.value?.room?.roomId || null,
      visitTypes:form.value.visitTypes,
      med,
      lab,
      room:roomPrice
    }
    createCheck()
  }
  
  // Submit
  function submitForm() {
    if (!createform.value) return
    createform.value.validate(valid => {
      if (valid) {
        if (form.value.visitTypes.includes('room')) {
          PatchRoom()
        }
        else createClientForm()
      }
    })
  }
  
  // Dictionary fetch (placeholder)
  async function getDictionary() {
    const apiList = [
      { key: 'medServices', endpoint: '/medServices' },
      { key: 'rooms', endpoint: '/rooms?is_full=false' },
      { key: 'labTests', endpoint: '/labTests' },
      { key: 'doctor', endpoint: '/doctors' }
    ]
  
    const fetchPromises = apiList.map(resp => useFetchApi.get(resp.endpoint))
    const results = await Promise.all(fetchPromises)
  
    results.forEach((result, index) => {
      if (!result.error.value) {
        dictionary.value[apiList[index].key] = result.data.value
      }
    })
  }

  async function createClientForm () {
    const datePlus4Days = new Date();
    
    let payloadData = {
      create_at: new Date().toISOString(),
      update_at: new Date().toISOString(),
      ...form.value
    }
    if (form.value.room.roomId) {
      payloadData = {...payloadData,roomId:form.value.room.roomId}
    }
    if (form.value.visitTypes?.includes('room')) {
      datePlus4Days.setDate(datePlus4Days.getDate() + Number(form.value.room.days));
      payloadData = {...payloadData,end_date:datePlus4Days.toISOString()}
    }
    const {data,error} = await useFetchApi.post('/clients',payloadData)
    if (!error.value && data.value) {
      generateCheck(data.value.id)
    }
  }
  async function createCheck () {
    const {data,error} = await useFetchApi.post('/checks',{...checkData.value,status:'pending'})
    if (!error.value) {
      checkData.value = {...checkData.value,id:data.value?.id}
      viewCheck.value = true;
      useNotifacation.success('Muvaffaqiyatli yaratildi')
    }
  }

  async function PatchRoom () {
    let limit = 1;
    let is_full = false;
    const findRoomId = dictionary.value.rooms?.find((resp) => resp.id === form.value.room.roomId)
    if (findRoomId?.limit) {
      limit = Number(findRoomId?.limit) + 1
    }
    if (limit === Number(findRoomId.people_per_room)) {
      is_full = true
    }
    if (limit > Number(findRoomId.people_per_room)) {
      useNotifacation.error('Xatolik','Xonada bo\'sh joy qolmadi')
      return
    }
    const {data,error} = await useFetchApi.patch(`/rooms/${form.value.room.roomId}`,{limit,is_full})
    if (!error.value) {
      createClientForm()
    }
  }

  async function getReloadRoomList () {
    const {data,error} = await useFetchApi.get('/reload/room')
    if (!error.value ) {
      // useNotifacation.success(data.value?.message)
      getDictionary()
    }
  }

  onMounted(() => {
    getReloadRoomList()
  })
  </script>
  