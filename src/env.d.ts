/* eslint-disable */

interface Config {
  API_ENDPOINT: string;
  APP_BASE_PATH: string;
  RELATIVE_FILE_ROUTE_URI?: string;
}

interface DevConfig {}

declare namespace NodeJS {
  interface ProcessEnv extends Config, DevConfig {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}
