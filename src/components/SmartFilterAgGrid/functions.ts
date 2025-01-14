import { ClientApi } from '@/aggrid/ClientApi';
import { Field } from '@/types';
import { AgField } from '@/types/agField';
import {
  ScalarAdvancedFilterModelType,
  TextAdvancedFilterModelType,
} from '@/types/agGrid';
import {
  AgTypes,
  defaultComparisons,
  numberComparisons,
  stringComparisons,
} from '@/util/constants';

export const textComparisonMap = new Map<string, TextAdvancedFilterModelType>([
  ['=', 'equals'],
  ['!', 'notEqual'],
  ['*', 'contains'],
  ['!*', 'notContains'],
  ['<*', 'startsWith'],
  ['>*', 'endsWith'],
]);

export const scalarComparisonMap = new Map<
  string,
  ScalarAdvancedFilterModelType
>([
  ['=', 'equals'],
  ['!', 'notEqual'],
  ['<', 'lessThan'],
  ['<=', 'lessThanOrEqual'],
  ['>', 'greaterThan'],
  ['>=', 'greaterThanOrEqual'],
]);

export const getComparisons = (
  type?: string | boolean,
  filter?: string,
): string[] => {
  if (
    type === AgTypes.boolean ||
    filter === 'AgFilters.agBooleanColumnFilter' ||
    filter === 'AgFilters.agSetColumnFilter'
  ) {
    return defaultComparisons;
  }
  if (
    type === AgTypes.number ||
    type === AgTypes.date ||
    type === AgTypes.dateString ||
    filter === 'AgFilters.agNumberColumnFilter' ||
    filter === 'AgFilters.agDateColumnFilter' ||
    filter === 'AgFilters.agDateStringColumnFilter'
  ) {
    return numberComparisons;
  }
  return stringComparisons;
};

export const getDefaultComparison = (
  type?: string | boolean,
  filter?: string,
): string => {
  if (
    type === AgTypes.text &&
    filter !== 'AgFilters.agSetColumnFilter' &&
    filter !== 'AgFilters.agDateStringColumnFilter'
  ) {
    return '*';
  }
  return '=';
};

export const useLists = (filter?: string): boolean => {
  if (filter === 'AgFilters.agSetColumnFilter') {
    return true;
  }
  return false;
};

export const useRanges = (
  type?: string | boolean,
  filter?: string,
): boolean => {
  if (
    type === AgTypes.number ||
    type === AgTypes.date ||
    type === AgTypes.dateString ||
    filter === 'AgFilters.agNumberColumnFilter' ||
    filter === 'AgFilters.agDateColumnFilter' ||
    filter === 'AgFilters.agDateStringColumnFilter'
  ) {
    return true;
  }
  return false;
};

export const convertToheader = (field?: string): string => {
  const header = field?.includes('.')
    ? field.split('.').find((_, i, a) => i === a.length - 1)
    : field;
  return header?.replace(/^./, (str) => str.toUpperCase()) ?? 'Unknown';
};

export const constructFields = (
  agClientApi: ClientApi | null,
  fields: AgField[],
  dateFormats?: string[],
  displayDateFormat?: string,
): Field[] | null => {
  if (agClientApi) {
    const columns = agClientApi?.getAgColumns() ?? [];
    if (columns) {
      return columns
        .map((col) => {
          const {
            field,
            colId,
            headerName,
            cellDataType,
            filter,
            filterValueGetter,
          } = col.getColDef();
          const overrides = fields?.find((f) => f.name === (colId ?? field));
          const { excludeFromFilter, ...fieldOverides } = overrides ?? {};
          const fieldName = colId ?? field;
          return {
            name: fieldName ?? '',
            title: headerName ?? convertToheader(field),
            operators: getComparisons(cellDataType),
            defaultComparison: getDefaultComparison(cellDataType, filter),
            allowLists: useLists(filter),
            allowRanges: useRanges(cellDataType),
            allowBlanks: true,
            textGetter:
              cellDataType === AgTypes.boolean
                ? (item: any) => item.text
                : undefined,
            valueGetter:
              cellDataType === AgTypes.boolean
                ? (item: any) => item.value
                : undefined,
            fieldMatchers:
              fieldName && !excludeFromFilter
                ? [
                    agClientApi.getFieldMatch(
                      fieldName,
                      field,
                      cellDataType,
                      filter,
                      dateFormats,
                      displayDateFormat,
                      filterValueGetter,
                    ),
                  ]
                : [],
            ...fieldOverides,
          };
        })
        .filter((f) => f.name !== undefined);
    }
  }
  return null;
};
