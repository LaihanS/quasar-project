import { AuthorDto } from 'src/api/portal-api';
import { createModelMapper } from '../_types';
import { mergeObjects, filterProps } from 'src/utils/object';
import { isNil, isEmpty } from 'src/utils/types';

export type AuthorModel = Nullable<{
  id?: number;
  idBook?: number;
  firstName?: string;
  lastName?: string;
}>;

export const loadAuthorModel = (
  model?: Partial<AuthorModel> | null
): AuthorModel => ({
  id: model?.id ?? 0,
  idBook: model?.idBook ?? 0,
  firstName: model?.lastName ?? '',
  lastName: model?.lastName ?? '',
});

export const mapAuthorValues = createModelMapper({
  from: {
    MapFromApiToCustom: (
      model?: AuthorDto | null,
      merge?: AuthorModel | null
    ): AuthorModel => {
      let mapped: AuthorModel = {
        id: model?.id ?? 0,
        idBook: model?.idBook ?? 0,
        firstName: model?.firstName ?? '',
        lastName: model?.lastName ?? '',
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
    MapFromCustomToApi: (model?: AuthorModel): AuthorDto => ({
      id: model?.id ?? 0,
      idBook: model?.idBook ?? 0,
      firstName: model?.firstName,
      lastName: model?.lastName,
    }),
  },
});
