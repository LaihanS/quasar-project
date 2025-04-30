import { hasOwn } from './types';

export const filterProps = <T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): Partial<T> => {
  const filteredObj: Partial<T> = {};
  for (const key in obj) {
    if (hasOwn(obj, key) && predicate(obj[key], key)) {
      filteredObj[key] = obj[key];
    }
  }
  return filteredObj;
};

export const mergeObjects = <T extends object, S extends object>(
  target: T,
  source: S
): T & S => ({ ...target, ...source });
