import { ColDef } from 'ag-grid-community';
import dayjs from 'dayjs';
import {
  Field,
  FilterFunction,
  HintGrouping,
  Matcher,
  Operator,
  PasteOptions,
  Sort,
  SortDirection,
  SourceItem,
  ValueMatcher,
} from '..';
import {
  OR,
  defaultComparisons,
  numberComparisons,
  stringComparisons,
} from '@/util/constants';

export type SortFunction = (x: any, y: any) => number;

export default interface Bond {
  isin: string;
  currency: string;
  issueDate: string;
  maturityDate: string;
  price: number;
  size: number;
  side: string;
  coupon: number;
  issuer: string;
  hairCut: number;
  active: boolean;
  categories: {
    type: string;
    sector: string;
  };
}

export const pasteOptions: PasteOptions = {
  fieldPasteMatchPatterns: [
    {
      field: 'isin',
      patterns: /[A-Z]{2}[-]{0,1}[0-9A-Z]{8}[-]{0,1}[0-9]/,
    },
  ],
};

export const getFields = (bondData: Bond[]): Field[] => {
  const findItem = async (
    text: string,
    getter: (bond: Bond) => string,
  ): Promise<SourceItem | null> =>
    new Promise<SourceItem | null>((resolve) => {
      setTimeout(() => {
        const isin =
          bondData
            .map(getter)
            .find((t) =>
              (t ?? '').toLocaleUpperCase().includes(text.toLocaleUpperCase()),
            ) ?? null;
        resolve(isin);
      }, 1);
    });

  const findMatching = async (
    text: string,
    getter: (bond: Bond) => string,
  ): Promise<SourceItem[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const set = new Set<string>();
        bondData
          .map(getter)
          .filter((t) =>
            (t ?? '').toLocaleUpperCase().includes(text.toLocaleUpperCase()),
          )
          .forEach((t) => set.add(t));
        resolve([...set.values()].slice(0, 10));
      }, 10);
    });

  return [
    {
      name: 'isin',
      title: 'ISIN',
      operators: ['=', '!'],
      fieldMatchers: [
        {
          lookup: (text: string) => findMatching(text, (bond) => bond.isin),
          lookupOnPaste: (text: string) => findItem(text, (bond) => bond.isin),
        },
      ],
      allowList: true,
      allowBlanks: true,
    },
    {
      name: 'side',
      title: 'Side',
      operators: ['=', '!'],
      fieldMatchers: [
        {
          ignoreCase: true,
          source: ['BUY', 'SELL'],
        },
      ],
      allowBlanks: true,
    },
    {
      name: 'currency',
      title: 'CCY',
      operators: ['=', '!'],
      fieldMatchers: [
        {
          lookup: (text: string) => findMatching(text, (bond) => bond.currency),
        },
      ],
      allowList: true,
      allowBlanks: true,
    },
    {
      name: 'issueDate',
      title: 'IssueDate',
      operators: numberComparisons,
      editorType: 'dateString',
      dateTimeFormat: 'YYYY-MM-DD',
      allowRange: true,
      allowBlanks: true,
      precedence: 8,
    },
    {
      name: 'maturityDate',
      title: 'MaturityDate',
      operators: numberComparisons,
      editorType: 'dateString',
      dateTimeFormat: 'YYYY-MM-DD',
      allowRange: true,
      allowBlanks: true,
      precedence: 9,
    },
    {
      name: 'coupon',
      title: 'Coupon',
      operators: numberComparisons,
      editorType: 'float',
      allowRange: true,
      allowBlanks: true,
      precedence: 7,
    },
    {
      name: 'issuer',
      title: 'Issuer',
      operators: stringComparisons,
      editorType: 'text',
      allowList: true,
      allowBlanks: true,
    },
    {
      name: 'hairCut',
      title: 'Hair Cut',
      operators: numberComparisons,
      editorType: 'float',
      allowRange: true,
      allowBlanks: true,
      precedence: 6,
    },
    {
      name: 'active',
      title: 'Active',
      operators: defaultComparisons,
      editorType: 'bool',
      allowBlanks: true,
      precedence: 10,
    },
    {
      name: 'sector',
      title: 'Sector',
      operators: ['=', '!'],
      fieldMatchers: [
        {
          lookup: (text: string) =>
            findMatching(text, (bond) => bond.categories.sector),
        },
      ],
      allowList: true,
      allowBlanks: true,
    },
  ];
};

export const operators: Operator[] = [
  { symbol: '=', description: 'Equals' },
  { symbol: '!', description: 'Not equals' },
];

export const hintGroups: HintGrouping[] = [
  {
    title: 'CCY',
    field: 'currency',
    hints: ['GBP', 'USD', 'EUR'],
  },
  {
    title: 'Maturity',
    field: 'maturityDate',
    hints: [
      {
        display: '< 5Y',
        text: dayjs().add(5, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(5, 'years').format('YYYY-MM-DD'),
        comparison: '<',
      },
      {
        display: '5Y - 10Y',
        text: dayjs().add(5, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(5, 'years').format('YYYY-MM-DD'),
        textTo: dayjs().add(10, 'years').format('YYYY-MM-DD'),
        valueTo: dayjs().add(10, 'years').format('YYYY-MM-DD'),
      },
      {
        display: '10Y - 15Y',
        text: dayjs().add(10, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(10, 'years').format('YYYY-MM-DD'),
        textTo: dayjs().add(15, 'years').format('YYYY-MM-DD'),
        valueTo: dayjs().add(15, 'years').format('YYYY-MM-DD'),
      },
      {
        display: '15Y - 20Y',
        text: dayjs().add(15, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(15, 'years').format('YYYY-MM-DD'),
        textTo: dayjs().add(20, 'years').format('YYYY-MM-DD'),
        valueTo: dayjs().add(20, 'years').format('YYYY-MM-DD'),
      },
      {
        display: '20Y - 30Y',
        text: dayjs().add(20, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(20, 'years').format('YYYY-MM-DD'),
        textTo: dayjs().add(30, 'years').format('YYYY-MM-DD'),
        valueTo: dayjs().add(30, 'years').format('YYYY-MM-DD'),
      },
      {
        display: '30Y - 40Y',
        text: dayjs().add(30, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(30, 'years').format('YYYY-MM-DD'),
        textTo: dayjs().add(40, 'years').format('YYYY-MM-DD'),
        valueTo: dayjs().add(40, 'years').format('YYYY-MM-DD'),
      },
      {
        display: '> 40Y',
        text: dayjs().add(40, 'years').format('YYYY-MM-DD'),
        value: dayjs().add(40, 'years').format('YYYY-MM-DD'),
        comparison: '>',
      },
    ],
  },
  {
    title: 'Active',
    field: 'active',
    hints: [
      { text: 'Yes', value: true },
      { text: 'No', value: false },
    ],
  },
  {
    title: 'Coupon',
    field: 'coupon',
    hints: [
      {
        display: '< 0.5',
        text: '0.5',
        value: 0.5,
        comparison: '<',
      },
      {
        display: '0.5 - 1',
        text: '0.5',
        value: 0.5,
        textTo: '1',
        valueTo: 1,
      },
      {
        display: '1 - 2',
        text: '1',
        value: 1,
        textTo: '2',
        valueTo: 2,
      },
      {
        display: '2 - 3',
        text: '2',
        value: 2,
        textTo: '3',
        valueTo: 3,
      },
      {
        display: '3 - 4',
        text: '3',
        value: 3,
        textTo: '4',
        valueTo: 4,
      },
      {
        display: '4 - 5',
        text: '4',
        value: 4,
        textTo: '5',
        valueTo: 5,
      },
      {
        display: '> 5',
        text: '5',
        value: 5,
        comparison: '>',
      },
    ],
  },
];

export const columns: ColDef<Bond>[] = [
  {
    field: 'isin',
    filter: 'agSetColumnFilter',
    sortable: true,
    resizable: true,
  },
  {
    field: 'side',
    filter: 'agSetColumnFilter',
    sortable: true,
    resizable: true,
  },
  {
    field: 'currency',
    filter: 'agSetColumnFilter',
    sortable: true,
    resizable: true,
  },
  {
    field: 'issueDate',
    filter: 'agDateStringColumnFilter',
    sortable: true,
    resizable: true,
  },
  {
    field: 'maturityDate',
    filter: 'agDateStringColumnFilter',
    sortable: true,
    resizable: true,
  },
  {
    field: 'coupon',
    filter: 'agNumberColumnFilter',
    sortable: true,
    resizable: true,
  },
  {
    field: 'issuer',
    filter: 'agTextColumnFilter',
    sortable: true,
    resizable: true,
  },
  {
    field: 'hairCut',
    filter: 'agNumberColumnFilter',
    sortable: true,
    resizable: true,
  },
  {
    field: 'active',
    filter: 'agBooleanColumnFilter',
    sortable: true,
    resizable: true,
  },
  {
    colId: 'sector',
    field: 'categories.sector',
    filter: 'agSetColumnFilter',
    sortable: true,
    resizable: true,
  },
];

export const constructFilter = (matchers: Matcher[]): FilterFunction | null => {
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
        ? (row: any) => filterLeft(row) || filterRight(row)
        : (row: any) => filterLeft(row) && filterRight(row);
    }
    index += 1;
  }

  return { filter: currentFilter, isOr: isOr ?? false, index };
};

const createFilter = (
  matcher: ValueMatcher,
): { filter: FilterFunction | null; isOr: boolean } => {
  let filterFunc: FilterFunction | null = null;
  switch (matcher.field) {
    case 'isin':
      filterFunc = constructTextFilter(matcher, (bond: Bond) => bond.isin);
      break;
    case 'side':
      filterFunc = constructTextFilter(matcher, (bond: Bond) => bond.side);
      break;
    case 'currency':
      filterFunc = constructTextFilter(matcher, (bond: Bond) =>
        bond ? bond.currency : '',
      );
      break;
    case 'issuer':
      filterFunc = constructTextFilter(matcher, (bond: Bond) => bond.issuer);
      break;
    case 'sector':
      filterFunc = constructTextFilter(
        matcher,
        (bond: Bond) => bond.categories.sector,
      );
      break;
    case 'coupon':
      filterFunc = constructNumberFilter(matcher, (bond: Bond) => bond.coupon);
      break;
    case 'haircut':
      filterFunc = constructNumberFilter(matcher, (bond: Bond) => bond.hairCut);
      break;
    case '':
      filterFunc = constructDateFilter(matcher, () => new Date(Date.now()));
      break;
    case 'maturityDate':
      filterFunc = constructDateStringFilter(
        matcher,
        (bond: Bond) => bond.maturityDate,
      );
      break;
    case 'issueDate':
      filterFunc = constructDateStringFilter(
        matcher,
        (bond: Bond) => bond.issueDate,
      );
      break;
    case 'active':
      filterFunc = constructBooleanFilter(matcher, (bond: Bond) => bond.active);
      break;
    default:
      // eslint-disable-next-line no-console
      console.log(`Not mappibng for field: ${matcher.field}`);
      filterFunc = null;
      break;
  }
  return { filter: filterFunc, isOr: matcher.operator === OR };
};

const constructTextFilter = (
  matcher: ValueMatcher,
  valueGetter: (bond: Bond) => string,
): FilterFunction | null => {
  if (matcher.type === 'r') {
    return null;
  }
  const getStringValue = (row: Bond) => {
    const temp = valueGetter(row);
    return typeof temp === 'string' ? temp.toLocaleUpperCase() : temp;
  };
  const compareString = (
    valueValuePredicate: (x: string, y: string) => boolean,
    arrayValuePredicate: (x: string[], y: string) => boolean,
    valueArrayPredicate: (x: string, y: string[]) => boolean,
    arrayArraypredicate: (x: string[], y: string[]) => boolean,
  ): FilterFunction => {
    if (matcher.type === 'a') {
      return (row: any) => {
        const value = getStringValue(row);
        if (value && Array.isArray(value)) {
          return arrayArraypredicate(value, matcher.valueArray);
        }
        return (
          value !== undefined && valueArrayPredicate(value, matcher.valueArray)
        );
      };
    }
    if (matcher.value === null) {
      return (row: any) => {
        const value = getStringValue(row);
        return !value;
      };
    }
    return (row: any) => {
      const value = getStringValue(row);
      if (Array.isArray(value)) {
        if (!matcher.value) {
          return false;
        }
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
            v.every((vi) => vi.toLocaleUpperCase() !== mv.toLocaleUpperCase()),
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
  valueGetter: (bond: Bond) => number,
): FilterFunction | null => {
  if (matcher.type === 'a') {
    return null;
  }
  if (matcher.type === 'r') {
    if (matcher.value === null || matcher.valueTo === null) {
      return () => false;
    }
    return (row: any) => {
      const value = valueGetter(row);
      return (
        value !== undefined && value >= matcher.value && value < matcher.valueTo
      );
    };
  }

  if (matcher.value === null) {
    return (row: any) => {
      const value = valueGetter(row);
      return !value;
    };
  }
  const compareNumber =
    (
      valueValuePredicate: (x: number, y: number) => boolean,
      arrayValuePredicate: (x: number[], y: number) => boolean,
    ): FilterFunction =>
    (row: any) => {
      const value = valueGetter(row);
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
  valueGetter: (bond: Bond) => Date,
): FilterFunction | null => {
  if (matcher.type === 'a') {
    return null;
  }
  if (matcher.type === 'r') {
    if (matcher.value === null || matcher.valueTo === null) {
      return () => false;
    }
    return (row: any) => {
      const value = valueGetter(row);
      return (
        value !== undefined &&
        value.getTime() >= matcher.value.getTime() &&
        value.getTime() < matcher.valueTo.getTime()
      );
    };
  }
  if (matcher.value === null) {
    return (row: any) => {
      const value = valueGetter(row);
      return !value;
    };
  }
  const compareDate =
    (
      valueValuePredicate: (x: Date, y: Date) => boolean,
      arrayValuePredicate: (x: Date[], y: Date) => boolean,
    ): FilterFunction =>
    (row: any) => {
      const value = valueGetter(row);
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
  valueGetter: (bond: Bond) => string,
): FilterFunction | null => {
  if (matcher.type === 'a') {
    return null;
  }
  if (matcher.type === 'r') {
    if (matcher.value === null || matcher.valueTo === null) {
      return () => false;
    }
    return (row: any) => {
      const value = valueGetter(row);
      if (!value) {
        return false;
      }
      const dateV = dayjs(value, 'YYYY-MM-DD', true);
      return (
        (dateV.isSame(dayjs(matcher.value, 'YYYY-MM-DD', true)) ||
          dateV.isAfter(dayjs(matcher.value, 'YYYY-MM-DD', true))) &&
        dateV.isBefore(dayjs(matcher.valueTo, 'YYYY-MM-DD', true))
      );
    };
  }
  if (matcher.value === null) {
    return (row: any) => {
      const value = valueGetter(row);
      return !value;
    };
  }
  const compareDateString =
    (
      valueValuePredicate: (x: dayjs.Dayjs, y: dayjs.Dayjs) => boolean,
      arrayValuePredicate: (x: string[], y: dayjs.Dayjs) => boolean,
    ): FilterFunction =>
    (row: any) => {
      if (!matcher.value || typeof matcher.value !== 'string') {
        return false;
      }
      const dateM = dayjs(matcher.value, 'YYYY-MM-DD', true);
      const value = valueGetter(row);
      if (Array.isArray(value)) {
        return arrayValuePredicate(value, dateM);
      }
      if (!value || typeof value !== 'string') {
        return false;
      }
      const dateV = dayjs(value, 'YYYY-MM-DD', true);
      return dateV.isValid() && valueValuePredicate(dateV, dateM);
    };

  switch (matcher.comparison) {
    case '=':
      return compareDateString(
        (v, m) => v.isSame(m),
        (v, m) => v.some((vi) => dayjs(vi, 'YYYY-MM-DD', true).isSame(m)),
      );

    case '>':
      return compareDateString(
        (v, m) => v.isAfter(m),
        (v, m) => v.every((vi) => dayjs(vi, 'YYYY-MM-DD', true).isAfter(m)),
      );

    case '<':
      return compareDateString(
        (v, m) => v.isBefore(m),
        (v, m) => v.every((vi) => dayjs(vi, 'YYYY-MM-DD', true).isBefore(m)),
      );

    case '>=':
      return compareDateString(
        (v, m) => v.isSame(m) || v.isAfter(m),
        (v, m) =>
          v.every(
            (vi) =>
              dayjs(vi, 'YYYY-MM-DD', true).isSame(m) ||
              dayjs(vi, 'YYYY-MM-DD', true).isAfter(m),
          ),
      );

    case '<=':
      return compareDateString(
        (v, m) => v.isSame(m) || v.isBefore(m),
        (v, m) =>
          v.every(
            (vi) =>
              dayjs(vi, 'YYYY-MM-DD', true).isSame(m) ||
              dayjs(vi, 'YYYY-MM-DD', true).isBefore(m),
          ),
      );

    case '!':
      return compareDateString(
        (v, m) => !v.isSame(m),
        (v, m) => v.every((vi) => !dayjs(vi, 'YYYY-MM-DD', true).isSame(m)),
      );

    default:
      // eslint-disable-next-line no-console
      console.log(`Unrecognised comparison ${matcher.comparison}`);
      return null;
  }
};

const constructBooleanFilter = (
  matcher: ValueMatcher,
  valueGetter: (bond: Bond) => boolean,
): FilterFunction | null => {
  if (matcher.type === 'a' || matcher.type === 'r') {
    return null;
  }
  if (matcher.value === null) {
    return (row: any) => {
      const value = valueGetter(row);
      return !value;
    };
  }
  switch (matcher.comparison) {
    case '=':
      return (row: any) => {
        const value = valueGetter(row);
        return value !== undefined && value === matcher.value;
      };
    case '!':
      return (row: any) => {
        const value = valueGetter(row);
        return value === undefined || value !== matcher.value;
      };
    default:
      // eslint-disable-next-line no-console
      console.log(`Unrecognised comparison ${matcher.comparison}`);
      return null;
  }
};

export const constructSort = (sort: Sort[]): SortFunction | null => {
  let currentSort: SortFunction | null = null;

  for (let i = 0; i < sort.length; i += 1) {
    if (!currentSort) {
      currentSort = createSortFunction(sort[i]);
    } else {
      const existingSort = currentSort as SortFunction;
      const newSort = createSortFunction(sort[i]);
      if (newSort) {
        currentSort = (x, y) => {
          const srt = existingSort(x, y);
          return srt === 0 ? newSort(x, y) : srt;
        };
      } else {
        currentSort = existingSort;
      }
    }
  }
  return currentSort;
};

const createSortFunction = (sortItem: Sort): SortFunction | null => {
  let sortFunc: SortFunction | null = null;
  const createSortFunc =
    (
      type: string,
      sortDirection: SortDirection,
      getter: (bond: Bond) => any,
    ): SortFunction =>
    (x, y) => {
      const valX = getter(x);
      const valY = getter(y);
      // eslint-disable-next-line valid-typeof
      if (typeof valX !== type) {
        return 1;
      }
      // eslint-disable-next-line valid-typeof
      if (typeof valY !== type) {
        return -1;
      }
      return valX === valY
        ? 0
        : valX > valY
          ? sortDirection === 'asc'
            ? 1
            : -1
          : sortDirection === 'asc'
            ? -1
            : 1;
    };

  switch (sortItem.field) {
    case 'isin':
    case 'side':
    case 'currency':
    case 'issuer':
      sortFunc = createSortFunc(
        'string',
        sortItem.sortDirection,
        (bond: any) => bond[sortItem.field],
      );
      break;
    case 'sector':
      sortFunc = createSortFunc(
        'string',
        sortItem.sortDirection,
        (bond: Bond) => bond.categories.sector,
      );
      break;
    case 'coupon':
    case 'haircut':
      sortFunc = createSortFunc(
        'number',
        sortItem.sortDirection,
        (bond: any) => bond[sortItem.field],
      );
      break;
    case 'maturityDate':
    case 'issueDate':
      sortFunc = (x: any, y: any) => {
        const valX = x[sortItem.field];
        const valY = y[sortItem.field];
        if (typeof valX !== 'string') {
          return 1;
        }
        if (typeof valY !== 'string') {
          return -1;
        }
        const valXDate = dayjs(valX, 'YYYY-MM-DD', true);
        const valYDate = dayjs(valY, 'YYYY-MM-DD', true);
        return valXDate.isBefore(valYDate)
          ? sortItem.sortDirection === 'asc'
            ? -1
            : 1
          : valXDate.isAfter(valYDate)
            ? sortItem.sortDirection === 'asc'
              ? 1
              : -1
            : 0;
      };
      break;
    case 'active':
      sortFunc = createSortFunc(
        'boolean',
        sortItem.sortDirection,
        (bond: Bond) => bond.active,
      );
      break;
    default:
      // eslint-disable-next-line no-console
      console.log(`Not mappibng for field: ${sortItem.field}`);
      sortFunc = null;
      break;
  }
  return sortFunc;
};

const randomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const COUNRY_CODES = ['US', 'GB', 'FR', 'AT', 'IT', 'DE', 'XS'] as const;
const CURRENCIES = ['USD', 'GBP', 'EUR'] as const;

const currencyFromCountry = (country: string) => {
  switch (country) {
    case 'US':
      return 'USD';
    case 'GB':
      return 'GBP';
    case 'XS':
      return CURRENCIES[randomInt(0, CURRENCIES.length)];
    default:
      return 'EUR';
  }
};

const fromCountry = (): { isin: string; currency: string } => {
  const country = COUNRY_CODES[randomInt(0, COUNRY_CODES.length)];
  const isinNumber = new Intl.NumberFormat('en-US', {
    minimumIntegerDigits: 8,
    useGrouping: false,
  }).format(randomInt(0, 99999999));
  return {
    isin: `${country}00${isinNumber}`,
    currency: currencyFromCountry(country),
  };
};

const randomDate = (startDate: string, endDate: string) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const date = new Date(
    start.valueOf() + Math.random() * (end.valueOf() - start.valueOf()),
  );
  return dayjs(date).format('YYYY-MM-DD');
};

function randomFloat(min: number, max: number) {
  return Number((Math.random() * (max - min) + min).toPrecision(3));
}

const randomWord = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < randomInt(0, 5) + 2; i += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

const randomWords = () => {
  const words = [];
  for (let i = 0; i < randomInt(0, 2) + 1; i += 1) {
    words.push(randomWord());
  }
  return words.join(' ');
};

const SECTORS = [
  'Technology',
  'Medicine',
  'Media',
  'Manufacturing',
  'Chemicals',
  'Engineering',
  'Transport',
  'Energy',
] as const;

const generateBondData = (): Bond => ({
  ...fromCountry(),
  issueDate: randomDate('2010-01-01', '2025-02-01'),
  maturityDate: randomDate('2023-01-01', '2080-01-01'),
  price: randomFloat(90.0, 110.0),
  size: randomInt(10, 100) * 10000,
  side: randomInt(0, 2) === 0 ? 'BUY' : 'SELL',
  coupon: randomFloat(0, 10),
  issuer: randomWords(),
  hairCut: randomFloat(0, 30),
  active: randomInt(0, 2) === 0,
  categories: {
    type: 'corporate',
    sector: SECTORS[randomInt(0, 6)],
  },
});

const bonds = new Array(5000).fill(0).map(() => generateBondData());

export { bonds };
