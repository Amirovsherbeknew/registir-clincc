import { navigationList } from "~/navigation";
export const useNavigation = (role?:string) => {
    const {getRole} = useToken()
    if (role) {
        return navigationList.filter(resp => resp.permisionList.includes(role));
    }
    return navigationList.filter(resp => resp.permisionList.includes(getRole() || ''));
}