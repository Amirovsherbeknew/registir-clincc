import { useNuxtApp } from "#app";

interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
  [key: string]: any;
}

type IUseFetch<T> = Promise<{
  data: Ref<T | null>;
  pending: Ref<boolean>;
  error: Ref<any>;
  refresh: () => Promise<void>;
}>;

const defaultHeaders: Record<string, string> = {};

const request = async <T>(
  url: string,
  options: RequestOptions = {}
): IUseFetch<T> => {
  const config = useRuntimeConfig();
  const baseURL =config.public?.apiBase || `http://localhost:3001`;
  const router = useRouter();
  const { getAccessToken, clearTokens } = useToken();
  const { catchingError } = useRequestError();

  const token = getAccessToken();
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  } else {
    delete defaultHeaders.Authorization;
  }
  defaultHeaders['ngrok-skip-browser-warning'] = '69420';

  try {
    const response = await useFetch<T>(url, {
      baseURL,
      ...options,
      watch: false,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      onResponseError({ response }) {
        catchingError(response);

        if (response.status === 401) {
          clearTokens();
          router.push("/login");
        }

        throw response;
      },
    });

    return response as any;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};

export const useFetchApi = {
  get: <T>(url: string, options: RequestOptions = {}) =>
    request<T>(url, { method: "GET", ...options }),

  post: <T>(url: string, body: any = {}, options: RequestOptions = {}) =>
    request<T>(url, { method: "POST", body, ...options }),

  put: <T>(url: string, body: any = {}, options: RequestOptions = {}) =>
    request<T>(url, { method: "PUT", body, ...options }),

  patch: <T>(url: string, body: any = {}, options: RequestOptions = {}) =>
    request<T>(url, { method: "PATCH", body, ...options }),

  delete: <T>(url: string, options: RequestOptions = {}) =>
    request<T>(url, { method: "DELETE", ...options }),
};
