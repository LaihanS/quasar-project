import api from 'api';
import { axios$ } from 'plugins/axios.plugin';
import { boot } from 'quasar/wrappers';
import { logInfo } from 'utils/logger';

export default boot(() => {
  api(axios$.instance);

  logInfo('🚀 api initialized');
});
