/* eslint-disable @typescript-eslint/no-explicit-any */

export const isUndefined = (val: unknown): val is undefined =>
  val === undefined;

export const isNull = (val: unknown): val is null => val === null;

/**
 * Checks if the input value is `null` or `undefined`.
 *
 * @example
 * ```typescript
 * isNil(null); //=> true
 * isNil(undefined); //=> true
 * isNil(0); //=> false
 * isNil([]); //=> false
 * ```
 */
export const isNil = (val: unknown): val is null | undefined =>
  isNull(val) || isUndefined(val);

export const isString = (val: unknown): val is string => typeof val == 'string';

export const isSymbol = (val: unknown): val is symbol => typeof val == 'symbol';

export const isNumber = (val: unknown): val is number => typeof val == 'number';

export const isBoolean = (val: unknown): val is boolean =>
  typeof val == 'boolean';

export const isArray = (val: unknown): val is any[] => Array.isArray(val);

export const isObject = (val: unknown): val is object =>
  typeof val == 'object' && val !== null && !isArray(val);

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (val: unknown): val is AnyFn =>
  typeof val == 'function';

export const isDate = (val: unknown): val is Date =>
  isObject(val) && isFunction((val as Date).getTime);

export const isElement = (val: unknown): val is Element =>
  isObject(val) && !!(val as Element).tagName;

export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return (
    isObject(val) &&
    isFunction((val as Promise<unknown>).then) &&
    isFunction((val as Promise<unknown>).catch)
  );
};

/**
 * Tests whether or not an object is a typed array.
 *
 * @example
 * ```typescript
 *      isTypedArray(new Uint8Array([])); //=> true
 *      isTypedArray(new Float32Array([])); //=> true
 *      isTypedArray([]); //=> false
 *      isTypedArray(null); //=> false
 *      isTypedArray({}); //=> false
 * ```
 */
export const isTypedArray = (val: unknown) => {
  const type = Object.prototype.toString.call(val);
  return (
    type == '[object Uint8ClampedArray]' ||
    type == '[object Int8Array]' ||
    type == '[object Uint8Array]' ||
    type == '[object Int16Array]' ||
    type == '[object Uint16Array]' ||
    type == '[object Int32Array]' ||
    type == '[object Uint32Array]' ||
    type == '[object Float32Array]' ||
    type == '[object Float64Array]' ||
    type == '[object BigInt64Array]' ||
    type == '[object BigUint64Array]'
  );
};

export const isArguments = (val: unknown) =>
  !!val &&
  typeof val == 'object' &&
  Object.prototype.hasOwnProperty.call(val, 'callee') &&
  !Object.prototype.propertyIsEnumerable.call(val, 'callee');

/**
 * Returns the empty value of its argument's type. It defines the empty
 * value of Array (`[]`), Object (`{}`), String (`''`),
 * TypedArray (`Uint8Array []`, `Float32Array []`, etc), and Arguments. Other
 * types are supported if they define `<Type>.empty`,
 * `<Type>.prototype.empty`
 *
 * Dispatches to the `empty` method of the first argument, if present.
 *
 * @example
 * ```typescript
 * empty([1, 2, 3]); //=> []
 * empty('cats'); //=> ''
 * empty({x: 1, y: 2}); //=> {}
 * empty(Uint8Array.from([1,2,3])); //=> Uint8Array []
 * ```
 */
export function empty<T>(val: T): T;
export function empty(val: any) {
  if (val != null && typeof val.empty == 'function') {
    return val.empty();
  } else if (
    val != null &&
    val.constructor != null &&
    typeof val.constructor.empty == 'function'
  ) {
    return val.constructor.empty();
  } else if (isArray(val)) {
    return [];
  } else if (isString(val)) {
    return '';
  } else if (isObject(val)) {
    return {};
  } else if (isArguments(val)) {
    return ((...args) => args)();
  } else if (isTypedArray(val)) {
    return val.constructor.from();
  } else {
    return void 0;
  }
}

/**
 * Returns `true` if the given value is its type's empty value; `false`
 * otherwise.
 *
 * @example
 * ```typescript
 * isEmpty([1, 2, 3]);           //=> false
 * isEmpty([]);                  //=> true
 * isEmpty('');                  //=> true
 * isEmpty(null);                //=> false
 * isEmpty({});                  //=> true
 * isEmpty({length: 0});         //=> false
 * isEmpty(Uint8Array.from([])); //=> true
 * ```
 */
export const isEmpty = (val: unknown): boolean => {
  if (isNil(val)) {
    return false;
  } else if (isString(val)) {
    return val === '';
  } else if (isNumber(val)) {
    return val === 0;
  } else if (isBoolean(val)) {
    return !val;
  } else if (isArray(val)) {
    return val.length === 0;
  } else if (isObject(val)) {
    return Object.keys(val).length === 0;
  } else {
    return false;
  }
};

export const hasOwn = <T, K extends PropertyKey>(
  val: T,
  key: K
): val is T & Record<K, T> => Object.prototype.hasOwnProperty.call(val, key);

export const createByKind = <T extends string, U, M = unknown>(
  type: T,
  value: U,
  metadata?: M
): ByKind<T, U, M> => ({ type, value, metadata });
