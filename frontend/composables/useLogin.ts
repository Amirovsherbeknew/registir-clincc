import type { loginFormType } from "~/types/others/index.type"
export const useLogin = () => {
    async function login (payloadData:loginFormType) {
        const {data,error} = await useFetchApi.post('',payloadData);
        console.log(data.value)
        if (!error.value) {
            return data
        }
    }
    return {login}
}