import { ElNotification } from 'element-plus'
const notication = (title:string,message:string,type:'success'|'warning'|'info'|'error', options?:any) => {
    ElNotification({
        title: title,
        message: message,
        type: type,
        ...options
    })
}
export const useNotifacation = {
    success:(title:string,message:string) => notication(title,message,'success'),
    warning:(title:string,message:string) => notication(title,message,'warning'),
    info:(title:string,message:string) => notication(title,message,'info'),
    error:(title:string,message:string) => notication(title,message,'error')
}