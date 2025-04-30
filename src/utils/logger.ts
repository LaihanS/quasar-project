import { isDev } from 'utils/env';

export const log = isDev
  ? console.log.bind(window.console)
  : () => {
      //
    };

export const logDebug = isDev
  ? console.debug.bind(window.console)
  : () => {
      //
    };

export const logInfo = isDev
  ? console.info.bind(window.console)
  : () => {
      //
    };

export const logWarn = isDev
  ? console.warn.bind(window.console)
  : () => {
      //
    };

export const logError = isDev
  ? console.error.bind(window.console)
  : () => {
      //
    };
