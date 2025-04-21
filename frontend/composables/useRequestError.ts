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
  _data?: { show: boolean; key: string; messages: string[]; icon_type: "warning" | "error" | "info" }[];
  message?: string;
}
export const useRequestError = () => {
  const { $i18n } = useNuxtApp();
  const { global_error_notification } = useConfig();
  const errorMessages = new Map([
    [400, "wasAnError"],
    [404, "dataNotFound"],
  ]);

  function catchingError(response: ResponseError | null | undefined) {
    if (!response || !response.status) return;
    if (!global_error_notification) return;
    const errorMessageKey = errorMessages.get(response.status);
    if (!errorMessageKey) return;

    const errorMessagesList = response?._data?.filter?.((resp: ErrorMessage) => resp.show) || [];
    if (!errorMessagesList.length) return;

    const { key, messages, icon_type = "warning" } = errorMessagesList[0];
    const messageText = key ? `${key}: ${messages}` : messages?.join(", ");

    ElMessageBox.alert(messageText, {
      cancelButtonText: "Yopish",
      closeOnClickModal: true,
      customClass: "el-custom-message",
      showCancelButton: true,
      showConfirmButton: false,
      type: icon_type,
      center: true,
    });
  }

  return { catchingError };
};
