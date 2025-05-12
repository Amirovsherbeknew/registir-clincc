import { roleList } from "~/constants";
export default defineNuxtRouteMiddleware((to) => {
    const { getRole } = useToken();
    const role = getRole()
    const navigationList = useNavigation().map(resp => resp.path);
    if (!role && !["login"].includes(to.name as string)) return navigateTo("/login");
    if (role && roleList.includes(role) && !navigationList.includes(to.path as string)) {
      return navigateTo(navigationList[0])
    }
  });
  