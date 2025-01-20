import moment from 'moment';
import { Column, ColumnApi, GridApi, RowNode } from '@/types/agGrid';
import { FieldMatch, SourceItem, Matcher, ValueMatcher, FilterFunction, Sort } from '..';
import {
  AgFilters,
  AgTypes,
  DEFAULT_DATE_FORMAT,
  OR,
} from '@/util/constants';

export type FilterValueGetter = (params: any) => any | null | undefined;

type ValueGetter = <T>(data: RowNode) => T | undefined;

export interface ClientApi {
  getAgColumn: (column: string) => Column | null;
  getAgColumns: () => Column[] | null;
  constructFilter: (matchers: Matcher[]) => FilterFunction | null;
  getFieldMatch: (
    field?: string,
    type?: string | boolean,
    filter?: string,
    dateFormats?: string[],
    displayFormat?: string,
    filterValueGetter?: FilterValueGetter,
  ) => FieldMatch;
  findUniqueHintValues: (
    column: Column | null,
    maxUniqueValues?: number,
    filterValueGetter?: FilterValueGetter,
  ) => string[];
  applySort: (sort: Sort[]) => void;
}

export const createClientApi = (
  gridApi: GridApi | null,
  columnApi: ColumnApi | null,
): ClientApi | null => {
  if (!gridApi) {
    return null;
  }

  const getAgColumn = (column: string): Column | null =>
    columnApi?.getColumn(column) ?? null;

  const getAgColumns = (): Column[] | null => columnApi?.getColumns() ?? null;

  const getFieldMatch = (
    field?: string,
    type?: string | boolean,
    filter?: string,
    dateFormats?: string[],
    displayFormat?: string,
    filterValueGetter?: FilterValueGetter,
  ): FieldMatch => {
    if (type === AgTypes.boolean) {
      return {
        match: (text: string) => text.toLocaleUpperCase() === 'TRUE' || text.toLocaleUpperCase() === 'FALSE',
        value: (text: string) => text.toLocaleUpperCase() === 'TRUE',
        matchOnPaste: true,
      };
    }
    if (field && filter === AgFilters.agSetColumnFilter) {
      return {
        ignoreCase: true,
        minimumSearchLength: 2,
        lookup: async (text, op) =>
          new Promise((resolve) => {
            resolve(
              findUniqueSourceItems(
                text,
                field,
                op === 'or',
                filterValueGetter,
              ),
            );
          }),
        lookupOnPaste: async (text) =>
          new Promise((resolve) => {
            resolve(findItem(text, field, filterValueGetter));
          }),
      };
    }
    if (
      type === AgTypes.number ||
      filter === AgFilters.agNumberColumnFilter
    ) {
      return {
        match: (text: string) => !Number.isNaN(Number(text)),
        value: (text: string) => Number.parseFloat(text),
        matchOnPaste: true,
      };
    }
    if (type === AgTypes.date || filter === AgFilters.agDateColumnFilter) {
      return {
        match: (text: string) =>
          Number.isNaN(Number(text)) &&
          (dateFormats
            ? moment(text, dateFormats, true)
            : moment(text)
          ).isValid(),
        value: (text: string) =>
          dateFormats
            ? moment(text, dateFormats, true).toDate()
            : moment(text).toDate(),
        label: (value: any) => {
          const date = moment(value);
          return date.isValid()
            ? date.format(displayFormat ?? DEFAULT_DATE_FORMAT)
            : value;
        },
        matchOnPaste: true,
      };
    }
    if (
      type === AgTypes.dateString ||
      filter === AgFilters.agDateStringColumnFilter
    ) {
      return {
        match: (text: string) =>
          Number.isNaN(Number(text)) && moment(text).isValid(),
        value: (text: string) =>
          moment(text).format(displayFormat ?? DEFAULT_DATE_FORMAT),
        label: (value: any) => {
          const date = moment(value);
          return date.isValid()
            ? date.format(displayFormat ?? DEFAULT_DATE_FORMAT)
            : value;
        },
        matchOnPaste: true,
      };
    }
    return {
      match: () => true,
      value: (text: string) => text,
      matchOnPaste: true,
    };
  };

  const getNestedValue = <T>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    fields: string[],
    idx: number,
  ): T | undefined => {
    const value = data[fields[idx]];
    if (!value) {
      return undefined;
    }
    if (idx < fields.length - 1) {
      return getNestedValue(value, fields, idx + 1);
    }
    return value;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getValueOrNestedValue = <T>(
    data: any,
    field: string,
  ): T | undefined => {
    if (field.includes('.')) {
      return getNestedValue(data, field.split('.'), 0);
    }
    return data[field];
  };

  const findUniqueHintValues = (
    column: Column | null,
    maxUniqueValues?: number,
    filterValueGetter?: FilterValueGetter,
  ): string[] => {
    const uniqueItems = new Set<string>();
    const { field = undefined } = column?.getColDef() ?? {};
    if (!field) {
      return [];
    }
    const uniqueValueCallback = (row: RowNode) => {
      if (row.data) {
        const value = filterValueGetter
          ? filterValueGetter(row.data)
          : getValueOrNestedValue(row.data, field);
        if (value && typeof value === 'string' && value.toLocaleUpperCase()) {
          uniqueItems.add(value);
        }
        if (Array.isArray(value)) {
          value.forEach((item) => uniqueItems.add(item));
        }
      }
    };

    gridApi.forEachNode(uniqueValueCallback);
    const items = [...uniqueItems].sort();
    return maxUniqueValues && items.length > maxUniqueValues
      ? items?.slice(0, maxUniqueValues)
      : items;
  };

  const findUniqueSourceItems = (
    text: string,
    field: string,
    isOr: boolean,
    filterValueGetter?: FilterValueGetter,
  ): SourceItem[] => {
    const uniqueItems = new Set<string>();
    const uniqueValueCallback = (row: RowNode) => {
      if (row.data) {
        const value = filterValueGetter
          ? filterValueGetter(row.data)
          : getValueOrNestedValue(row.data, field);
        if (
          value &&
          typeof value === 'string' &&
          value.toLocaleUpperCase().includes(text.toLocaleUpperCase())
        ) {
          uniqueItems.add(value);
        }
        if (
          value &&
          Array.isArray(value) &&
          value.some((itemText: string) =>
            itemText.toLocaleUpperCase().includes(text.toLocaleUpperCase()),
          )
        ) {
          const item = value.find((itemText: string) =>
            itemText.toLocaleUpperCase().includes(text.toLocaleUpperCase()),
          );
          if (item) {
            uniqueItems.add(item);
          }
        }
      }
    };
    if (isOr) {
      gridApi.forEachNode(uniqueValueCallback);
    } else {
      gridApi.forEachNodeAfterFilter(uniqueValueCallback);
    }
    const items = [...uniqueItems].sort();
    return items.length > 10 ? items?.slice(10) : items;
  };

  const findItem = (
    text: string,
    field: string,
    filterValueGetter?: FilterValueGetter,
  ): SourceItem[] => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let found: any | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const callback = (row: RowNode) => {
      if (row.data) {
        const value = filterValueGetter
          ? filterValueGetter(row.data)
          : getValueOrNestedValue(row.data, field);
        if (value && value === text) {
          found = value;
        }
      }
    };
    gridApi?.forEachNode(callback);
    return found;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getFieldsFunction = (
    field: string | ((params: any) => any | null | undefined),
  ): ValueGetter => {
    if (typeof field === 'function') {
      return (data: any) => field(data);
    }
    if (field.includes('.')) {
      const fields = field.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (data: any) => getNestedValue(data, fields, 0);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data: any) => data[field];
  };

  const constructFilter = (matchers: Matcher[]): FilterFunction | null => {
    if (matchers.length === 0) {
      return null;
    }
    try {
      const { filter } = processMatchers(0, matchers);
      return filter;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
    return null;
  };

  const processMatchers = (
    start: number,
    matchers: Matcher[],
    matchBracket?: boolean,
  ): { filter: FilterFunction | null; isOr: boolean; index: number } => {
    let index = start;
    let currentFilter: FilterFunction | null = null;
    let isOr: boolean | null = null;
    while (index < matchers.length) {
      let newFilter: FilterFunction | null = null;
      const currentMatcher = matchers[index];
      if (currentMatcher.type === 'b') {
        if (currentMatcher.bracket === ')') {
          if (matchBracket) {
            return { filter: currentFilter, isOr: isOr ?? false, index };
          }
          return { filter: null, isOr: false, index };
        }
        if (currentMatcher.bracket === '(') {
          isOr = currentMatcher.operator === OR;
          ({ filter: newFilter, index } = processMatchers(
            index + 1,
            matchers,
            true,
          ));
        }
      } else {
        ({ filter: newFilter, isOr } = createFilter(currentMatcher));
      }
      if (!newFilter) {
        return { filter: null, isOr: false, index };
      }
      if (!currentFilter) {
        currentFilter = newFilter;
      } else {
        const filterLeft: FilterFunction = currentFilter;
        const filterRight: FilterFunction = newFilter;
        currentFilter = isOr
          ? (row) => filterLeft(row) || filterRight(row)
          : (row) => filterLeft(row) && filterRight(row);
      }
      index += 1;
    }

    return { filter: currentFilter, isOr: isOr ?? false, index };
  };

  const createFilter = (
    matcher: ValueMatcher,
  ): { filter: FilterFunction | null; isOr: boolean } => {
    let filterFunc: FilterFunction | null = null;
    const colunmn = getAgColumn(matcher.field);
    const { field, cellDataType, filter, filterValueGetter } =
      colunmn?.getColDef() ?? {};

    if (field) {
      const valueGetter: ValueGetter = getFieldsFunction(
        filterValueGetter ?? field,
      );
      switch (filter ?? cellDataType) {
        case AgTypes.text:
        case AgFilters.agTextColumnFilter:
        case AgFilters.agSetColumnFilter:
          filterFunc = constructTextFilter(matcher, valueGetter);
          break;
        case AgTypes.number:
        case AgFilters.agNumberColumnFilter:
          filterFunc = constructNumberFilter(matcher, valueGetter);
          break;
        case AgTypes.date:
        case AgFilters.agDateColumnFilter:
          filterFunc = constructDateFilter(matcher, valueGetter);
          break;
        case AgTypes.dateString:
        case AgFilters.agDateStringColumnFilter:
          filterFunc = constructDateStringFilter(matcher, valueGetter);
          break;
        case AgTypes.boolean:
        case AgFilters.agBooleanColumnFilter:
          filterFunc = constructBooleanFilter(matcher, valueGetter);
          break;
        default:
          // eslint-disable-next-line no-console
          console.log(`Unrecognised type ${cellDataType}`);
          filterFunc = null;
          break;
      }
    }
    return { filter: filterFunc, isOr: matcher.operator === OR };
  };

  const constructTextFilter = (
    matcher: ValueMatcher,
    valueGetter: ValueGetter,
  ): FilterFunction | null => {
    if (matcher.type === 'r') {
      return null;
    }
    const getStringValue = (data: any) => {
      const temp = valueGetter<string | undefined>(data);
      return typeof temp === 'string' ? temp.toLocaleUpperCase() : temp;
    };
    const compareString = (
      valueValuePredicate: (x: string, y: string) => boolean,
      arrayValuePredicate: (x: string[], y: string) => boolean,
      valueArrayPredicate: (x: string, y: string[]) => boolean,
      arrayArraypredicate: (x: string[], y: string[]) => boolean,
    ): FilterFunction => {
      if (matcher.type === 'a') {
        return (row) => {
          const value = getStringValue(row.data);
          if (value && Array.isArray(value)) {
            return arrayArraypredicate(value, matcher.valueArray);
          }
          return (
            value !== undefined &&
            valueArrayPredicate(value, matcher.valueArray)
          );
        };
      }
      if (matcher.value === null) {
        return (row) => {
          const value = getStringValue(row.data);
          return !value;
        }
      }
      return (row) => {
        const value = getStringValue(row.data);
        if (Array.isArray(value)) {
          return arrayValuePredicate(value, matcher.value.toLocaleUpperCase());
        }
        return (
          value !== undefined &&
          typeof value === 'string' &&
          valueValuePredicate(value, matcher.value.toLocaleUpperCase())
        );
      };
    };
    switch (matcher.comparison) {
      case '=':
        return compareString(
          (v, m) => v === m.toLocaleUpperCase(),
          (v, m) =>
            v.some((vi) => vi.toLocaleUpperCase() === m.toLocaleUpperCase()),
          (v, m) => m.find((mv) => v.toLocaleUpperCase() === mv) !== undefined,
          (v, m) =>
            m.every((mv) =>
              v.some((vi) => vi.toLocaleUpperCase() === mv.toLocaleUpperCase()),
            ),
        );

      case '!':
        return compareString(
          (v, m) => v !== m.toLocaleUpperCase(),
          (v, m) =>
            v.every((vi) => vi.toLocaleUpperCase() !== m.toLocaleUpperCase()),
          (v, m) => !m.find((mv) => v.toLocaleUpperCase() === mv),
          (v, m) =>
            m.every((mv) =>
              v.every(
                (vi) => vi.toLocaleUpperCase() !== mv.toLocaleUpperCase(),
              ),
            ),
        );

      case '*':
        return compareString(
          (v, m) => v.includes(m.toLocaleUpperCase()),
          (v, m) =>
            v.some((vi) =>
              vi.toLocaleUpperCase().includes(m.toLocaleUpperCase()),
            ),
          (v, m) =>
            m.find((mv) => v.toLocaleUpperCase().includes(mv)) !== undefined,
          (v, m) =>
            m.every((mv) =>
              v.some((vi) =>
                vi.toLocaleUpperCase().includes(mv.toLocaleUpperCase()),
              ),
            ),
        );

      case '!*':
        return compareString(
          (v, m) => !v.includes(m.toLocaleUpperCase()),
          (v, m) =>
            v.every(
              (vi) => !vi.toLocaleUpperCase().includes(m.toLocaleUpperCase()),
            ),
          (v, m) => !m.find((mv) => v.toLocaleUpperCase().includes(mv)),
          (v, m) =>
            m.every(
              (mv) =>
                !v.every((vi) =>
                  vi.toLocaleUpperCase().includes(mv.toLocaleUpperCase()),
                ),
            ),
        );

      case '<*':
        return compareString(
          (v, m) => v.startsWith(m.toLocaleUpperCase()),
          (v, m) =>
            v.some((vi) =>
              vi.toLocaleUpperCase().startsWith(m.toLocaleUpperCase()),
            ),
          (v, m) =>
            m.find((mv) => v.toLocaleUpperCase().startsWith(mv)) !== undefined,
          (v, m) =>
            m.every((mv) =>
              v.some((vi) =>
                vi.toLocaleUpperCase().startsWith(mv.toLocaleUpperCase()),
              ),
            ),
        );

      case '>*':
        return compareString(
          (v, m) => v.endsWith(m.toLocaleUpperCase()),
          (v, m) =>
            v.some((vi) =>
              vi.toLocaleUpperCase().endsWith(m.toLocaleUpperCase()),
            ),
          (v, m) =>
            m.find((mv) => v.toLocaleUpperCase().endsWith(mv)) !== undefined,
          (v, m) =>
            m.every((mv) =>
              v.some((vi) =>
                vi.toLocaleUpperCase().endsWith(mv.toLocaleUpperCase()),
              ),
            ),
        );

      default:
        // eslint-disable-next-line no-console
        console.log(`Unrecognised comparison ${matcher.comparison}`);
        return null;
    }
  };

  const constructNumberFilter = (
    matcher: ValueMatcher,
    valueGetter: ValueGetter,
  ): FilterFunction | null => {
    if (matcher.type === 'a') {
      return null;
    }
    if (matcher.type === 'r') {
      if (matcher.value === null || matcher.valueTo === null) {
        return () => false;
      }
      return (row) => {
        const value = valueGetter<number | undefined>(row.data);
        return (
          value !== undefined &&
          value >= matcher.value &&
          value < matcher.valueTo
        );
      };
    }
    if (matcher.value === null) {
      return (row: any) => {
        const value = valueGetter<number | undefined>(row.data);
        return !value;
      }
    }
    const compareNumber =
      (
        valueValuePredicate: (x: number, y: number) => boolean,
        arrayValuePredicate: (x: number[], y: number) => boolean,
      ): FilterFunction =>
        (row) => {
          const value = valueGetter<number | undefined>(row.data);
          if (Array.isArray(value)) {
            return arrayValuePredicate(value, matcher.value);
          }
          return (
            value !== undefined &&
            typeof value === 'number' &&
            valueValuePredicate(value, matcher.value)
          );
        };

    switch (matcher.comparison) {
      case '=':
        return compareNumber(
          (v, m) => v === m,
          (v, m) => v.some((vi) => vi === m),
        );

      case '>':
        return compareNumber(
          (v, m) => v > m,
          (v, m) => v.every((vi) => vi > m),
        );

      case '<':
        return compareNumber(
          (v, m) => v < m,
          (v, m) => v.every((vi) => vi < m),
        );

      case '>=':
        return compareNumber(
          (v, m) => v >= m,
          (v, m) => v.every((vi) => vi >= m),
        );

      case '<=':
        return compareNumber(
          (v, m) => v <= m,
          (v, m) => v.every((vi) => vi <= m),
        );

      case '!':
        return compareNumber(
          (v, m) => v === m,
          (v, m) => v.every((vi) => vi !== m),
        );

      default:
        // eslint-disable-next-line no-console
        console.log(`Unrecognised comparison ${matcher.comparison}`);
        return null;
    }
  };

  const constructDateFilter = (
    matcher: ValueMatcher,
    valueGetter: ValueGetter,
  ): FilterFunction | null => {
    if (matcher.type === 'a') {
      return null;
    }
    if (matcher.type === 'r') {
      if (matcher.value === null || matcher.valueTo === null) {
        return () => false;
      }
      return (row) => {
        const value = valueGetter<Date | undefined>(row.data);
        return (
          value !== undefined &&
          value.getTime() >= matcher.value.getTime() &&
          value.getTime() < matcher.valueTo.getTime()
        );
      };
    }
    if (matcher.value === null) {
      return (row: any) => {
        const value = valueGetter<Date | undefined>(row.data);
        return !value;
      }
    }
    const compareDate =
      (
        valueValuePredicate: (x: Date, y: Date) => boolean,
        arrayValuePredicate: (x: Date[], y: Date) => boolean,
      ): FilterFunction =>
        (row) => {
          const value = valueGetter<Date | undefined>(row.data);
          if (Array.isArray(value)) {
            return arrayValuePredicate(value, matcher.value);
          }
          return (
            value !== undefined &&
            value instanceof Date &&
            valueValuePredicate(value, matcher.value)
          );
        };

    switch (matcher.comparison) {
      case '=':
        return compareDate(
          (v, m) => v.getTime() === m.getTime(),
          (v, m) => v.some((vi) => vi.getTime() === m.getTime()),
        );

      case '>':
        return compareDate(
          (v, m) => v.getTime() > m.getTime(),
          (v, m) => v.every((vi) => vi.getTime() > m.getTime()),
        );

      case '<':
        return compareDate(
          (v, m) => v.getTime() < m.getTime(),
          (v, m) => v.every((vi) => vi.getTime() < m.getTime()),
        );

      case '>=':
        return compareDate(
          (v, m) => v.getTime() >= m.getTime(),
          (v, m) => v.every((vi) => vi.getTime() >= m.getTime()),
        );

      case '<=':
        return compareDate(
          (v, m) => v.getTime() <= m.getTime(),
          (v, m) => v.every((vi) => vi.getTime() <= m.getTime()),
        );

      case '!':
        return compareDate(
          (v, m) => v.getTime() !== m.getTime(),
          (v, m) => v.every((vi) => vi.getTime() !== m.getTime()),
        );

      default:
        // eslint-disable-next-line no-console
        console.log(`Unrecognised comparison ${matcher.comparison}`);
        return null;
    }
  };

  const constructDateStringFilter = (
    matcher: ValueMatcher,
    valueGetter: ValueGetter,
  ): FilterFunction | null => {
    if (matcher.type === 'a') {
      return null;
    }
    if (matcher.type === 'r') {
      if (matcher.value === null || matcher.valueTo === null) {
        return () => false;
      }
      return (row) => {
        const value = valueGetter<string | undefined>(row.data);
        if (!value) {
          return false;
        }
        const dateV = moment(value);
        return (
          dateV.isSameOrAfter(moment(matcher.value)) &&
          dateV.isBefore(moment(matcher.valueTo))
        );
      };
    }
    if (matcher.value === null) {
      return (row: any) => {
        const value = valueGetter<string | undefined>(row.data);
        return !value;
      }
    }
    const compareDateString =
      (
        valueValuePredicate: (x: moment.Moment, y: moment.Moment) => boolean,
        arrayValuePredicate: (x: string[], y: moment.Moment) => boolean,
      ): FilterFunction =>
        (row) => {
          if (!matcher.value || typeof matcher.value !== 'string') {
            return false;
          }
          const dateM = moment(matcher.value);
          const value = valueGetter<string | undefined>(row.data);
          if (Array.isArray(value)) {
            return arrayValuePredicate(value, dateM);
          }
          if (!value || typeof value !== 'string') {
            return false;
          }
          const dateV = moment(value);
          return dateV.isValid() && valueValuePredicate(dateV, dateM);
        };

    switch (matcher.comparison) {
      case '=':
        return compareDateString(
          (v, m) => v.isSame(m),
          (v, m) => v.some((vi) => moment(vi).isSame(m)),
        );

      case '>':
        return compareDateString(
          (v, m) => v.isAfter(m),
          (v, m) => v.every((vi) => moment(vi).isAfter(m)),
        );

      case '<':
        return compareDateString(
          (v, m) => v.isBefore(m),
          (v, m) => v.every((vi) => moment(vi).isBefore(m)),
        );

      case '>=':
        return compareDateString(
          (v, m) => v.isSameOrAfter(m),
          (v, m) => v.every((vi) => moment(vi).isSameOrAfter(m)),
        );

      case '<=':
        return compareDateString(
          (v, m) => v.isSameOrBefore(m),
          (v, m) => v.every((vi) => moment(vi).isSameOrBefore(m)),
        );

      case '!':
        return compareDateString(
          (v, m) => !v.isSame(m),
          (v, m) => v.every((vi) => !moment(vi).isSame(m)),
        );

      default:
        // eslint-disable-next-line no-console
        console.log(`Unrecognised comparison ${matcher.comparison}`);
        return null;
    }
  };

  const constructBooleanFilter = (
    matcher: ValueMatcher,
    valueGetter: ValueGetter,
  ): FilterFunction | null => {
    if (matcher.type === 'a' || matcher.type === 'r') {
      return null;
    }
    if (matcher.value === null) {
      return (row: any) => {
        const value = <boolean | undefined>valueGetter(row.data);
        return !value;
      }
    }
    switch (matcher.comparison) {
      case '=':
        return (row) => {
          const value = <boolean | undefined>valueGetter(row.data);
          return value !== undefined && value === matcher.value;
        };
      case '!':
        return (row) => {
          const value = <boolean | undefined>valueGetter(row.data);
          return value === undefined || value !== matcher.value;
        };
      default:
        // eslint-disable-next-line no-console
        console.log(`Unrecognised comparison ${matcher.comparison}`);
        return null;
    }
  };

  const applySort = (sort: Sort[]) => {
    const columnState = columnApi?.getColumnState();
    if (columnState) {
      const fieldState = sort.map((sortField, index) => ({ sortField, index }))
      const newColumnState = columnState.map((cs) => {
        const entry = fieldState.find(f => f.sortField.field === cs.colId)
        return {
          ...cs,
          sort: entry?.sortField.sortDirection ?? null,
          sortIndex: entry?.index ?? 0,
        };
      });

      columnApi?.applyColumnState({ state: newColumnState });
    }
  }

  return {
    constructFilter,
    getAgColumn,
    getAgColumns,
    getFieldMatch,
    findUniqueHintValues,
    applySort,
  };
};
