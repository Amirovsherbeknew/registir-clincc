import { ElMessageBox } from "element-plus";
import { useNuxtApp } from "#app";
interface ErrorMessage {
  key?: string;
  messages: string[];
  icon_type?: "warning" | "error" | "info"; // Можно добавить другие типы
  show: boolean;
}

interface ResponseError {
  status?: number;
  _data?: { show: boolean; key: string; message: string;error:string, icon_type: "warning" | "error" | "info" };
  message?: string;
}
export const useRequestError = () => {
  const { $i18n } = useNuxtApp();
  const { global_error_notification } = useConfig();
  const errorMessages = new Map([
    [401, "wasAnError"],
    [400, "wasAnError"],
    [404, "dataNotFound"],
  ]);

  function catchingError(response: ResponseError | null | undefined) {
    console.log(response)
    if (!response || !response.status) {console.log(1); return};
    if (!global_error_notification) {console.log(2); return};
    const errorMessageKey = errorMessages.get(response.status);
    if (!errorMessageKey) {console.log(3); return};

    const messageText = response._data?.message;

    ElMessageBox.alert(messageText, {
      cancelButtonText: "Yopish",
      closeOnClickModal: true,
      customClass: "el-custom-message",
      showCancelButton: true,
      showConfirmButton: false,
      type: 'error',
      center: true,
    });
  }

  return { catchingError };
};
