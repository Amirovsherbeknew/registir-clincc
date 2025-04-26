import { roleList } from "~/constants";
export default defineNuxtRouteMiddleware((to) => {
    const { getRole } = useToken();
    const role = getRole()
    console.log(to.path)
    const navigationList = useNavigation().map(resp => resp.path);
    console.log(navigationList[0])
    if (!role && !["login"].includes(to.name as string)) return navigateTo("/login");
    if (role && roleList.includes(role) && !navigationList.includes(to.path as string)) {
      return navigateTo(navigationList[0])
    }
  });
  