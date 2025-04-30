/* eslint-disable @typescript-eslint/no-explicit-any */
import { noop, promiseTimeout, until } from '@vueuse/core';
import type { Ref } from 'vue';
import { ref } from 'vue';

export interface UsePromiseReturnBase<Params extends any[]> {
  isReady: Ref<boolean>;
  isLoading: Ref<boolean>;
  execute: (delay?: number, ...args: Params) => Promise<void>;
}

export type UsePromiseReturn<Params extends any[]> =
  UsePromiseReturnBase<Params> & PromiseLike<UsePromiseReturnBase<Params>>;

export interface UsePromiseOptions<Params extends any[], Result = any> {
  /**
   * Delay for executing the promise. In milliseconds.
   *
   * @default 0
   */
  delay?: number;

  /**
   * Execute the promise right after the function is invoked.
   * Will apply the delay if any.
   *
   * When set to false, you will need to execute it manually.
   *
   * @default true
   */
  immediate?: boolean;

  /**
   * Callback when error is caught.
   */
  onError?: (e: unknown) => void;

  /**
   * Callback when success is caught.
   * @param {Result} result
   */
  onSuccess?: (result: Result, args: Params) => void;

  /**
   *
   * An error is thrown when executing the execute function
   *
   * @default false
   */
  throwError?: boolean;
}

/**
 * Will not block your setup function and will trigger changes once
 * the promise is ready.
 *
 * @param promise         The promise / async function to be resolved
 * @param options
 */
export function usePromise<Result, Params extends any[] = []>(
  promise: Promise<Result> | ((...args: Params) => Promise<Result>),
  options?: UsePromiseOptions<Params, Result>
): UsePromiseReturn<Params> {
  const {
    immediate = true,
    delay = 0,
    onError = noop,
    onSuccess = noop,
    throwError,
  } = options ?? {};
  const isReady = ref(false);
  const isLoading = ref(false);

  async function execute(delay = 0, ...args: any[]) {
    isReady.value = false;
    isLoading.value = true;

    if (delay > 0) await promiseTimeout(delay);

    const _promise =
      typeof promise === 'function' ? promise(...(args as Params)) : promise;

    try {
      const result = await _promise;
      isReady.value = true;
      onSuccess(result, args as Params);
    } catch (e) {
      onError(e);
      if (throwError) throw e;
    } finally {
      isLoading.value = false;
    }
  }

  if (immediate) execute(delay);

  const shell: UsePromiseReturnBase<Params> = {
    isReady,
    isLoading,
    execute,
  };

  function waitUntilIsLoaded() {
    return new Promise<UsePromiseReturnBase<Params>>((resolve, reject) => {
      until(isLoading)
        .toBe(false)
        .then(() => resolve(shell))
        .catch(reject);
    });
  }

  return {
    ...shell,
    then(onFulfilled, onRejected) {
      return waitUntilIsLoaded().then(onFulfilled, onRejected);
    },
  };
}
