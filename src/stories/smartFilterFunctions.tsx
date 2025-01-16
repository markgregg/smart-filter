import { Field, HintGrouping, LogicalOperator, Matcher, Operator, Sort, SortDirection, SourceItem, ValueMatcher } from '..';
import { ColDef } from 'ag-grid-community';
import { bonds } from '../../data/bonds';
import { OR, defaultComparisons, numberComparisons, stringComparisons } from '@/util/constants';
import moment from 'moment';
import { FilterFunction } from '@/aggrid/agGridApi';

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

export const createFields = (currentBonds: Bond[]): Field[] => {
  const findMatching = (text: string, operator: LogicalOperator | null, getter: ((bond: Bond) => string)): Promise<SourceItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const set = new Set<string>();
        (bonds).map(getter)
          .filter(t => (t ?? '').toLocaleUpperCase().includes(text.toLocaleUpperCase()))
          .forEach((t) => set.add(t));
        resolve([...set.values()].slice(0, 10));
      }, 10);
    });
  }
  return [
    {
      name: 'isin',
      title: 'ISIN',
      operators: ['=', '!'],
      fieldMatchers: [
        {
          lookup: (text: string, operator: LogicalOperator | null) => findMatching(text, operator, (bond) => bond.isin),
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
          source: ['BUY', 'SELL']
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
          lookup: (text: string, operator: LogicalOperator | null) => findMatching(text, operator, (bond) => bond.currency),
        },
      ],
      allowList: true,
      allowBlanks: true,
    },
    {
      name: 'issueDate',
      title: 'Issue Date',
      operators: numberComparisons,
      editorType: 'date',
      dateTimeFormat: 'YYYY-MM-DD',
      allowRange: true,
      allowBlanks: true,
    },
    {
      name: 'maturityDate',
      title: 'Maturity Date',
      operators: numberComparisons,
      editorType: 'date',
      dateTimeFormat: 'YYYY-MM-DD',
      allowRange: true,
      allowBlanks: true,
    },
    {
      name: 'coupon',
      title: 'Coupon',
      operators: numberComparisons,
      editorType: 'float',
      allowRange: true,
      allowBlanks: true,
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
    },
    {
      name: 'active',
      title: 'Active',
      operators: defaultComparisons,
      editorType: 'bool',
      allowBlanks: true,
    },
    {
      name: 'sector',
      title: 'Sector',
      operators: ['=', '!'],
      fieldMatchers: [
        {
          lookup: (text: string, operator: LogicalOperator | null) => findMatching(text, operator, (bond) => bond.categories.sector),
        },
      ],
      allowList: true,
      allowBlanks: true,
    },
  ];
}

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
        text: moment().add(5, 'years').format('YYYY-MM-DD'),
        value: moment().add(5, 'years').format('YYYY-MM-DD'),
        comparison: '<',
      },
      {
        display: '5Y - 10Y',
        text: moment().add(5, 'years').format('YYYY-MM-DD'),
        value: moment().add(5, 'years').format('YYYY-MM-DD'),
        textTo: moment().add(10, 'years').format('YYYY-MM-DD'),
        valueTo: moment().add(10, 'years').format('YYYY-MM-DD'),
      },
      {
        display: '105Y - 15Y',
        text: moment().add(10, 'years').format('YYYY-MM-DD'),
        value: moment().add(10, 'years').format('YYYY-MM-DD'),
        textTo: moment().add(15, 'years').format('YYYY-MM-DD'),
        valueTo: moment().add(15, 'years').format('YYYY-MM-DD'),
      },
      {
        display: '15Y - 20Y',
        text: moment().add(15, 'years').format('YYYY-MM-DD'),
        value: moment().add(15, 'years').format('YYYY-MM-DD'),
        textTo: moment().add(20, 'years').format('YYYY-MM-DD'),
        valueTo: moment().add(20, 'years').format('YYYY-MM-DD'),
      },
      {
        display: '20Y - 30Y',
        text: moment().add(20, 'years').format('YYYY-MM-DD'),
        value: moment().add(20, 'years').format('YYYY-MM-DD'),
        textTo: moment().add(30, 'years').format('YYYY-MM-DD'),
        valueTo: moment().add(30, 'years').format('YYYY-MM-DD'),
      },
      {
        display: '30Y - 40Y',
        text: moment().add(30, 'years').format('YYYY-MM-DD'),
        value: moment().add(30, 'years').format('YYYY-MM-DD'),
        textTo: moment().add(40, 'years').format('YYYY-MM-DD'),
        valueTo: moment().add(40, 'years').format('YYYY-MM-DD'),
      },
      {
        display: '> 40Y',
        text: moment().add(40, 'years').format('YYYY-MM-DD'),
        value: moment().add(40, 'years').format('YYYY-MM-DD'),
        comparison: '>',
      },
    ],
  },
  {
    title: 'Active',
    field: 'active',
    hints: [{ text: 'Yes', value: true }, { text: 'No', value: false }],
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
    filter: 'agDateColumnFilter',
    sortable: true,
    resizable: true,
  },
  {
    field: 'maturityDate',
    filter: 'agDateColumnFilter',
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
    filter: 'agNumberColumnFilter',
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
  switch (matcher.field) {
    case 'isin':
      filterFunc = constructTextFilter(matcher, (bond: Bond) => bond.isin);
      break;
    case 'side':
      filterFunc = constructTextFilter(matcher, (bond: Bond) => bond.side);
      break;
    case 'currency':
      filterFunc = constructTextFilter(matcher, (bond: Bond) => bond ? bond.currency : '');
      break;
    case 'issuer':
      filterFunc = constructTextFilter(matcher, (bond: Bond) => bond.issuer);
      break;
    case 'sector':
      filterFunc = constructTextFilter(matcher, (bond: Bond) => bond.categories.sector);
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
      filterFunc = constructDateStringFilter(matcher, (bond: Bond) => bond.maturityDate);
      break;
    case 'issueDate':
      filterFunc = constructDateStringFilter(matcher, (bond: Bond) => bond.issueDate);
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
      return (row) => {
        const value = getStringValue(row);
        if (value && Array.isArray(value)) {
          return arrayArraypredicate(value, matcher.valueArray);
        }
        return (
          value !== undefined &&
          valueArrayPredicate(value, matcher.valueArray)
        );
      };
    }
    return (row) => {
      const value = getStringValue(row);
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
  valueGetter: (bond: Bond) => number,
): FilterFunction | null => {
  if (matcher.type === 'a') {
    return null;
  }
  if (matcher.type === 'r') {
    return (row) => {
      const value = valueGetter(row);
      return (
        value !== undefined &&
        value >= matcher.value &&
        value < matcher.valueTo
      );
    };
  }

  const compareNumber =
    (
      valueValuePredicate: (x: number, y: number) => boolean,
      arrayValuePredicate: (x: number[], y: number) => boolean,
    ): FilterFunction =>
      (row) => {
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
    return (row) => {
      const value = valueGetter(row);
      return (
        value !== undefined &&
        value.getTime() >= matcher.value.getTime() &&
        value.getTime() < matcher.valueTo.getTime()
      );
    };
  }
  const compareDate =
    (
      valueValuePredicate: (x: Date, y: Date) => boolean,
      arrayValuePredicate: (x: Date[], y: Date) => boolean,
    ): FilterFunction =>
      (row) => {
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
    return (row) => {
      const value = valueGetter(row);
      if (!value) {
        return false;
      }
      const dateV = moment(value, 'YYYY-MM-DD', true);
      return (
        dateV.isSameOrAfter(moment(matcher.value, 'YYYY-MM-DD', true)) &&
        dateV.isBefore(moment(matcher.valueTo, 'YYYY-MM-DD', true))
      );
    };
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
        const dateM = moment(matcher.value, 'YYYY-MM-DD', true);
        const value = valueGetter(row);
        if (Array.isArray(value)) {
          return arrayValuePredicate(value, dateM);
        }
        if (!value || typeof value !== 'string') {
          return false;
        }
        const dateV = moment(value, 'YYYY-MM-DD', true);
        return dateV.isValid() && valueValuePredicate(dateV, dateM);
      };

  switch (matcher.comparison) {
    case '=':
      return compareDateString(
        (v, m) => v.isSame(m),
        (v, m) => v.some((vi) => moment(vi, 'YYYY-MM-DD', true).isSame(m)),
      );

    case '>':
      return compareDateString(
        (v, m) => v.isAfter(m),
        (v, m) => v.every((vi) => moment(vi, 'YYYY-MM-DD', true).isAfter(m)),
      );

    case '<':
      return compareDateString(
        (v, m) => v.isBefore(m),
        (v, m) => v.every((vi) => moment(vi, 'YYYY-MM-DD', true).isBefore(m)),
      );

    case '>=':
      return compareDateString(
        (v, m) => v.isSameOrAfter(m),
        (v, m) => v.every((vi) => moment(vi, 'YYYY-MM-DD', true).isSameOrAfter(m)),
      );

    case '<=':
      return compareDateString(
        (v, m) => v.isSameOrBefore(m),
        (v, m) => v.every((vi) => moment(vi, 'YYYY-MM-DD', true).isSameOrBefore(m)),
      );

    case '!':
      return compareDateString(
        (v, m) => !v.isSame(m),
        (v, m) => v.every((vi) => !moment(vi, 'YYYY-MM-DD', true).isSame(m)),
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
  switch (matcher.comparison) {
    case '=':
      return (row) => {
        const value = valueGetter(row);
        return value !== undefined && value === matcher.value;
      };
    case '!':
      return (row) => {
        const value = valueGetter(row);
        return value === undefined || value !== matcher.value;
      };
    default:
      // eslint-disable-next-line no-console
      console.log(`Unrecognised comparison ${matcher.comparison}`);
      return null;
  }
};

export type SortFunction = (x: any, y: any) => number;
export const constructSort = (sort: Sort[]): SortFunction | null => {
  let currentSort: SortFunction | null = null;

  for (let i = 0; i < sort.length; i++) {
    if (!currentSort) {
      currentSort = createSortFunction(sort[i]);
    } else {
      const existingSort = currentSort as SortFunction;
      const newSort = createSortFunction(sort[i]);
      if (newSort) {
        currentSort = (x, y) => {
          const srt = existingSort(x, y);
          return srt === 0
            ? newSort(x, y)
            : srt;
        }
      } else {
        currentSort = existingSort;
      }
    }
  }
  return currentSort;
}

const createSortFunction = (
  sortItem: Sort,
): SortFunction | null => {
  let sortFunc: SortFunction | null = null;
  const createSortFunc = <T extends any>(type: string, sortDirection: SortDirection, getter: (bond: Bond) => T): SortFunction => {
    return (x, y) => {
      const valX = getter(x);
      const valY = getter(y);
      if (typeof valX !== type) {
        return 1;
      }
      if (typeof valY !== type) {
        return -1;
      }
      return valX === valY
        ? 0
        : valX > valY
          ? sortDirection === 'asc' ? 1 : -1
          : sortDirection === 'asc' ? -1 : 1
    }
  }

  switch (sortItem.field) {
    case 'isin':
    case 'side':
    case 'currency':
    case 'issuer':
      sortFunc = createSortFunc<string>('string', sortItem.sortDirection, (bond: any) => bond[sortItem.field]);
      break;
    case 'sector':
      sortFunc = createSortFunc<string>('string', sortItem.sortDirection, (bond: Bond) => bond.categories.sector);
      break;
    case 'coupon':
    case 'haircut':
      sortFunc = createSortFunc<number>('number', sortItem.sortDirection, (bond: any) => bond[sortItem.field]);
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
        const valXDate = moment(valX, 'YYYY-MM-DD', true);
        const valYDate = moment(valY, 'YYYY-MM-DD', true);
        return valXDate.isBefore(valYDate)
          ? sortItem.sortDirection === 'asc' ? -1 : 1
          : valXDate.isAfter(valYDate)
            ? sortItem.sortDirection === 'asc' ? 1 : -1
            : 0;
      }
      break;
    case 'active':
      sortFunc = createSortFunc<boolean>('boolean', sortItem.sortDirection, (bond: Bond) => bond.active);
      break;
    default:
      // eslint-disable-next-line no-console
      console.log(`Not mappibng for field: ${sortItem.field}`);
      sortFunc = null;
      break;
  }
  return sortFunc;
}