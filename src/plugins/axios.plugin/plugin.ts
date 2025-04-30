import { AxiosInstance } from 'axios';
import { reactive } from 'vue';

let axios$: { instance: AxiosInstance };

export const axiosPlugin = (instance: AxiosInstance) => {
  instance.defaults.baseURL = 'https://localhost:7177';

  axios$ = reactive({ instance });

  return { axios$ };
};

export { axios$ };
