export const navigationList = [
    {
        title:"Ariza yaratish",
        path:'/registir/create',
        icon:'IconsListUserView',
        permisionList:['operator']
    },
    {
        title:"Mijozlar ro'yxat",
        path:'/registir',
        icon:'IconsListUserView',
        permisionList:['super_admin','operator']
    },
    {
        title:"Checklar ro'yxati",
        path:'/checks',
        icon:'IconsListUserView',
        permisionList:['super_admin','kassir']
    },
    {
        title:"Med ko'riklar ro'yxati",
        path:'/medservices',
        icon:'IconsListUserView',
        permisionList:['super_admin']
    },
    {
        title:"Yotoqxonalar ro'yxati",
        path:'/rooms',
        icon:'IconsListUserView',
        permisionList:['super_admin']
    },
    {
        title:"Labaratoriya ro'yxati",
        path:'/laboratory-test',
        icon:'IconsListUserView',
        permisionList:['super_admin']
    }
]