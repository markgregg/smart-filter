import { ClientApi } from '@/aggrid/ClientApi';
import { Field, ValueType } from '@/types';
import { AgField } from '@/types/agField';
import {
  ScalarAdvancedFilterModelType,
  TextAdvancedFilterModelType,
} from '@/types/agGrid';
import {
  AgFilters,
  AgTypes,
  DEFAULT_DATE_FORMAT,
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
    filter === AgFilters.agBooleanColumnFilter ||
    filter === AgFilters.agSetColumnFilter
  ) {
    return defaultComparisons;
  }
  if (
    type === AgTypes.number ||
    type === AgTypes.date ||
    type === AgTypes.dateString ||
    filter === AgFilters.agNumberColumnFilter ||
    filter === AgFilters.agDateColumnFilter ||
    filter === AgFilters.agDateStringColumnFilter
  ) {
    return numberComparisons;
  }
  return stringComparisons;
};

const getEditorType = (
  type?: string | boolean,
  filter?: string,
  lookup?: true,
): ValueType | undefined => {
  if (filter === AgFilters.agSetColumnFilter || lookup) {
    return undefined;
  }
  switch (type) {
    case AgTypes.text:
      return 'text';
    case AgTypes.boolean:
      return 'bool';
    case AgTypes.number:
      return 'float';
    case AgTypes.date:
      return 'date';
    case AgTypes.dateString:
      return 'dateString';
    default:
      return undefined;
  }
};

export const getPrecedence = (
  type?: string | boolean,
  filter?: string,
  lookup?: true,
): number => {
  if (filter === AgFilters.agTextColumnFilter && type === AgTypes.text) {
    return 0;
  }

  if (filter === AgFilters.agSetColumnFilter || lookup) {
    return 10;
  }
  if (type === AgTypes.boolean) {
    return 9;
  }
  if (
    type === AgTypes.date ||
    type === AgTypes.dateString ||
    type === AgTypes.number
  ) {
    return 8;
  }
  return 5;
};

export const getDefaultComparison = (
  type?: string | boolean,
  filter?: string,
  lookup?: true,
): string => {
  if (
    type === AgTypes.text &&
    filter !== AgFilters.agSetColumnFilter &&
    filter !== AgFilters.agDateStringColumnFilter &&
    !lookup
  ) {
    return '*';
  }
  return '=';
};

export const useLists = (filter?: string, lookup?: true): boolean => {
  if (filter === AgFilters.agSetColumnFilter || lookup) {
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
    filter === AgFilters.agNumberColumnFilter ||
    filter === AgFilters.agDateColumnFilter ||
    filter === AgFilters.agDateStringColumnFilter
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
  fields?: AgField[],
  dateFormats?: string[],
  displayDateFormat?: string,
  returnAllOptions?: boolean,
  maxOptions?: number,
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
          const {
            excludeFromFilter,
            dateTimeFormat,
            editorType,
            lookup,
            ...fieldOverides
          } = overrides ?? {};
          const fieldName = colId ?? field;
          const overriddenField: Field = {
            name: fieldName ?? '',
            title: headerName ?? convertToheader(field),
            operators: getComparisons(cellDataType),
            defaultComparison: getDefaultComparison(
              cellDataType,
              filter,
              lookup,
            ),
            allowList: useLists(filter, lookup),
            allowRange: useRanges(cellDataType),
            allowBlanks: true,
            editorType:
              editorType ?? getEditorType(cellDataType, filter, lookup),
            dateTimeFormat:
              dateTimeFormat ?? displayDateFormat ?? DEFAULT_DATE_FORMAT,
            precedence: getPrecedence(cellDataType, filter, lookup),
            fieldMatchers:
              fieldName && !excludeFromFilter
                ? [
                    agClientApi.getFieldMatch(
                      field,
                      cellDataType,
                      filter,
                      dateFormats,
                      displayDateFormat,
                      typeof filterValueGetter === 'function'
                        ? filterValueGetter
                        : undefined,
                      returnAllOptions,
                      maxOptions,
                      lookup,
                    ),
                  ]
                : [],
            ...fieldOverides,
          };
          return overriddenField;
        })
        .filter((f) => f.name !== undefined);
    }
  }
  return null;
};
