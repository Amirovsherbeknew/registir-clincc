export const rules = {
    login:{
        username:[{required:true,message:''}],
        password:[{required:true,message:''}]
    },
    createForm:{
        last_name:[{required:true,message:''},{validator: useTrim(),trigger: 'blur'}],
        first_name:[{required:true,message:''},{validator: useTrim(),trigger: 'blur'}],
        middle_name:[{required:false,message:''}],
        phone:[{required:true,message:''},{validator: usePhoneNumberValidate(),trigger: 'blur'}],
        gender:[{required:true,message:'Jinsini tanlang'}],
        servers_type:[{required:true,message:''}],
        medServices:[{required:true,message:''}],
        visitTypes:[{required:true,message:'Murojat turini tanlang'}],
        room:{
            roomId: [{ required: true, message: '' }],
            days: [{ required: true, message: '' }],
        },
        labTests:[{required:true,message:''}]
    },
    medServersForm: {
        name:[{required:true,message:""}],
        price:[{required:true,message:""}]
    },
    labTestForm: {
        name:[{required:true,message:""}],
        price:[{required:true,message:""}]
    },
    roomsForm: {
        name:[{required:true,message:""}],
        pricePerDay:[{required:true,message:""}]
    },
    doctorsForm:{
        last_name: [
          { required: true, message: '', trigger: 'blur' },
          {validator: useTrim(),trigger: 'blur'}
        ],
        first_name: [
          { required: true, message: '', trigger: 'blur' },
          {validator: useTrim(),trigger: 'blur'}
        ],
        middle_name: [
          { required: false, message: '', trigger: 'blur' },
          {validator: useTrim(),trigger: 'blur'}
        ],
        position: [
            { required: true, message: '', trigger: 'blur' },
            {validator: useTrim(),trigger: 'blur'}
        ],
        clients: [
            { required: true, message: '', trigger: 'blur' }
        ],
        category: [
            { required: true, message: '', trigger: 'blur' }
        ],
      }
}