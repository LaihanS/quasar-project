import { isFunction } from './types';

export const noop = () => {
  //
};

export const invoke = <T>(fn: () => T): T => fn();

export const invokeIf =
  <Fn extends AnyFn>(
    fn: Fn,
    condition: boolean | ((...args: Parameters<Fn>) => boolean)
  ): ((...args: Parameters<Fn>) => ReturnType<Fn> | void) =>
  (...args: Parameters<Fn>): ReturnType<Fn> | void => {
    if (isFunction(condition) ? !condition(...args) : condition) {
      return;
    }
    return fn(...args);
  };
