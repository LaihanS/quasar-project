/* eslint-disable @typescript-eslint/no-explicit-any */

import { isNil } from 'src/utils/types';

export type ModelBase<
  T extends Record<string, unknown>,
  Display extends Partial<Record<KeyOf<T>, true>> = Record<string, never>,
  Metadata extends Record<string, unknown> = Record<string, never>
> = {
  _id: string | null;
  _display: Partial<Nullable<Record<KeyOf<Display>, string>>>;
  _metadata: Metadata;
} & T;

type ModelMapper<F, T> = { from: F; to: T };
export const createModelMapper = <F, T>(mapper: ModelMapper<F, T>) => mapper;

export type ItemWithCid<T> = { _cid: string; item: T };
export type CollectionWithCid<T> = ItemWithCid<T>[];
export const loadItemWithCid = <T>(item: T): ItemWithCid<T> => ({
  _cid: crypto.randomUUID(),
  item,
});
export const loadItemWithCidSafe = <T>(
  item?: T | null
): ItemWithCid<T> | null =>
  isNil(item)
    ? null
    : {
        _cid: crypto.randomUUID(),
        item,
      };
