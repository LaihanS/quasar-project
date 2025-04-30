import { axiosInstance, axiosPlugin } from 'plugins/axios.plugin';
import { boot } from 'quasar/wrappers';
import { logInfo } from 'utils/logger';

export default boot(() => {
  const { axios$ } = axiosPlugin(axiosInstance);
  axios$.instance.interceptors.response.use(
    (response) => response,
    (error) => {
      return Promise.reject(error);
    }
  );

  logInfo('🚀 axiosPlugin initialized');
});
