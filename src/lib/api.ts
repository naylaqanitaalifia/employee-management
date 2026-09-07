import {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

// const api = axios.create({
//   baseURL: apiConfig.API_URL,
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access_token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default api;

export function setupAxios(axios: AxiosInstance) {
  axios.defaults.headers.Accept = "application/json";

  axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem("access_token");

      if (token) {
        // if (!config.headers) config.headers = {};

        config.headers.Authorization = `Bearer ${token}`;

        if (config.url) {
          config.params = {
            ...config.params,
          };
        }
      }

      return config;
    },
    async (err: unknown) => Promise.reject(err),
  );
}
