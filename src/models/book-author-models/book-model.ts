import { BookDto } from 'src/api/portal-api';
import { createModelMapper } from '../_types';
import { mergeObjects, filterProps } from 'src/utils/object';
import { isNil, isEmpty } from 'src/utils/types';

export type BookModel = Nullable<{
  id?: number;
  title?: string | null;
  description?: string | null;
  pageCount?: number;
  excerpt?: string | null;
}>;

export const loadBookModel = (
  model?: Partial<BookModel> | null
): BookModel => ({
  id: model?.id ?? 0,
  title: model?.title ?? '',
  description: model?.description ?? '',
  pageCount: model?.pageCount ?? 0,
  excerpt: model?.excerpt ?? '',
});

export const mapBookValues = createModelMapper({
  from: {
    MapFromApiToCustom: (
      model?: BookDto | null,
      merge?: BookModel | null
    ): BookModel => {
      let mapped: BookModel = {
        id: model?.id ?? 0,
        title: model?.title ?? '',
        description: model?.description ?? '',
        pageCount: model?.pageCount ?? 0,
        excerpt: model?.excerpt ?? '',
      };
      if (merge) {
        mapped = mergeObjects(
          merge,
          filterProps(mapped, (x) => !isNil(x) && !isEmpty(x))
        );
      }
      return mapped;
    },
  },
  to: {
    MapFromCustomToApi: (model?: BookModel): BookDto => ({
      id: model?.id ?? 0,
      title: model?.title ?? '',
      description: model?.description ?? '',
      pageCount: model?.id ?? 0,
      excerpt: model?.excerpt ?? '',
    }),
  },
});
