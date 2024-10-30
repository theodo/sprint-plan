/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";

import { Filter, SupportedTypes } from "@/app/notion/list/types";

const SEARCH_KEY_BY_TYPE: Record<SupportedTypes, string> = {
  multi_select: "contains",
  select: "equals",
};

export const buildFilter = (
  appliedFilters: Filter[],
): QueryDatabaseParameters["filter"] | null => {
  switch (appliedFilters.length) {
    case 0:
      return null;
    case 1:
      if (appliedFilters[0].values.length === 1)
        return {
          property: appliedFilters[0].property,
          type: appliedFilters[0].type,
          [appliedFilters[0].type]: {
            [SEARCH_KEY_BY_TYPE[appliedFilters[0].type]]:
              appliedFilters[0].values[0],
          },
        } as any;

      return buildOrFilter(appliedFilters[0]) as any;

    default:
      return {
        and: appliedFilters.map((filter) => {
          if (filter.values.length === 1)
            return {
              property: filter.property,
              [filter.type]: {
                [SEARCH_KEY_BY_TYPE[filter.type]]: filter.values[0],
              },
            };

          return buildOrFilter(filter);
        }) as any,
      };
  }
};

const buildOrFilter = (filter: Filter) => {
  return {
    or: filter.values.map((_filter) => ({
      property: filter.property,
      [filter.type]: {
        [SEARCH_KEY_BY_TYPE[filter.type]]: _filter,
      },
    })),
  };
};
