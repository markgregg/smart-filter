import { Field, HintGrouping, LogicalOperator, Matcher, Operator, SourceItem, ValueMatcher } from '..';
import { ColDef } from 'ag-grid-community';
import { bonds } from '../../data/bonds';
import { BRACKET, OR, VALUE_ARRAY, VALUE_TO, defaultComparisons, numberComparisons, stringComparisons } from '@/util/constants';
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
        (operator === OR ? bonds : currentBonds).map(getter)
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
    if (BRACKET in currentMatcher) {
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
    case 'side':
    case 'currency':
    case 'issuer':
      filterFunc = constructTextFilter(matcher, (bond: any) => bond[matcher.field]);
      break;
    case 'sector':
      filterFunc = constructTextFilter(matcher, (bond: Bond) => bond.categories.sector);
      break;
    case 'coupon':
    case 'haircut':
      filterFunc = constructNumberFilter(matcher, (bond: any) => bond[matcher.field]);
      break;
    case '':
      filterFunc = constructDateFilter(matcher, () => new Date(Date.now()));
      break;
    case 'maturityDate':
    case 'issueDate':
      filterFunc = constructDateStringFilter(matcher, (bond: any) => bond[matcher.field]);
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
  if (VALUE_TO in matcher) {
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
    if (VALUE_ARRAY in matcher) {
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
  if (VALUE_ARRAY in matcher) {
    return null;
  }
  if (VALUE_TO in matcher) {
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
  if (VALUE_ARRAY in matcher) {
    return null;
  }
  if (VALUE_TO in matcher) {
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
  if (VALUE_ARRAY in matcher) {
    return null;
  }
  if (VALUE_TO in matcher) {
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
  if (VALUE_ARRAY in matcher || VALUE_TO in matcher) {
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