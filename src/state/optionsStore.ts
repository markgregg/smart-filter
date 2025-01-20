import { StoreApi, UseBoundStore, create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import {
  Field,
  ListMatch,
  LogicalOperator,
  Operator,
  Option,
  PromiseMatch,
  SourceItem,
  Value,
  ValueMatch,
} from '@/types';
import { OptionSelectedCallback, OptionsState } from '@/types/State';
import {
  getText,
  getValue,
  matchExact,
  matchItem,
  trimIfNotSpaces,
  uniqueComparions,
} from '@/util/functions';
import {
  AND,
  DEFAULT_DATE_FORMAT,
  DEFAULT_DATE_TIME_FORMAT,
  EMPTY,
  OR,
} from '@/util/constants';

interface CategoryOption {
  option: Option;
  precedence: number;
  expression: boolean;
}

interface BuildState {
  text: string;
  buildKey: string;
  options: CategoryOption[];
  operator: LogicalOperator | null;
  comparison: string | null;
  field: Field | null;
  fields: Field[];
  fieldMap: Map<string, Field>;
  comparisonsMap: Map<string, Operator>;
  range?: {
    from: string;
    to: string;
  };
  matchText: string;
  matcherKey?: string;
  currentValues?: Value[];
  set: (
    update: (
      state: OptionsState | Partial<OptionsState>,
    ) => OptionsState | Partial<OptionsState>,
    replace?: false,
  ) => void;
}

export const createOptionsStore = (
  fields: Field[],
  operators: Operator[],
  pageSize: number,
  debounce?: number,
): UseBoundStore<StoreApi<OptionsState>> => {
  const fieldMap = new Map(fields.map((f) => [f.name, f]));
  const uniqueComparisonOps = uniqueComparions(fields, operators ?? []);
  const comparisonsMap = new Map((uniqueComparisonOps ?? []).map((o) => [o.symbol, o]));
  return create<OptionsState>((set) => ({
    matcherKey: null,
    options: [],
    operator: null,
    comparison: null,
    matchText: '',
    buildKey: null,
    active: null,
    activeIndex: null,
    onOptionSelected: null,
    buildOptions: async (
      callback: OptionSelectedCallback,
      text: string,
      field?: Field,
      currentValues?: Value[],
      matcherKey?: string,
    ) => {
      const buildState: BuildState = {
        text,
        buildKey: uuidv4(),
        options: [],
        operator: null,
        comparison: null,
        field: field ?? null,
        fields,
        fieldMap,
        comparisonsMap: field
          ? new Map((field.operators ?? []).map((o) => [o, { symbol: o }]))
          : comparisonsMap,
        matchText: '',
        matcherKey,
        currentValues,
        set,
      };
      set({ buildKey: buildState.buildKey });
      setTimeout(() => {
        const relevant = checkDebounced(buildState);
        if (relevant) {
          set({ onOptionSelected: callback, matcherKey: matcherKey ?? null });
          startBuild({
            ...buildState,
            matchText: buildState.text,
          });
        }
      }, debounce ?? 0);
    },
    clearOptions: () =>
      set({ options: [], matchText: '', active: null, activeIndex: null }),
    selectOption: (option: Option) =>
      set((state) => {
        if (state.onOptionSelected) {
          state.onOptionSelected(option);
        }
        return { options: [], matchText: '', active: null, activeIndex: null };
      }, false),
    first: () =>
      set((state) => {
        const { options } = state;
        const activeIndex = 0;
        const active = options[activeIndex];
        return { activeIndex, active };
      }),
    last: () =>
      set((state) => {
        const { options } = state;
        const activeIndex = options.length - 1;
        const active = options[activeIndex];
        return { activeIndex, active };
      }),
    next: () =>
      set((state) => {
        const { activeIndex: index, options } = state;
        const activeIndex =
          index === null || index >= options.length - 1 ? 0 : index + 1;
        const active = options[activeIndex];
        return { activeIndex, active };
      }),
    prev: () =>
      set((state) => {
        const { activeIndex: index, options } = state;
        const activeIndex =
          index === null || index <= 0 ? options.length - 1 : index - 1;
        const active = options[activeIndex];
        return { activeIndex, active };
      }),
    nextPage: () =>
      set((state) => {
        const { activeIndex: index, options } = state;
        const activeIndex =
          index === null ||
            (index !== options.length - 1 &&
              index + pageSize >= options.length - 1)
            ? options.length - 1
            : index === options.length - 1
              ? 0
              : index + pageSize;
        const active = options[activeIndex];
        return { activeIndex, active };
      }),
    prevPage: () =>
      set((state) => {
        const { activeIndex: index, options } = state;
        const activeIndex =
          index === null || (index !== 0 && index - pageSize <= 0)
            ? 0
            : index === 0
              ? options.length - 1
              : index - pageSize;
        const active = options[activeIndex];
        return { activeIndex, active };
      }),
  }));
};

const startBuild = async (buildState: BuildState) => {
  const { field, text, set } = buildState;
  if (!field && text.length > 0) {
    buildState = checkForOperator(buildState);
    buildState = checkForField(buildState);
    buildState = checkForComparison(buildState);
    buildState = checkForRange(buildState);
  }
  if (buildState.text.length > 0) {
    contructOptions({
      ...buildState,
      matchText: buildState.text,
    });
  } else {
    if (!buildState.matcherKey && buildState.field && !buildState.comparison) {
      addFieldOption(buildState, buildState.field);
      updateOptions(buildState);
    } else {
      set(() => ({
        options: [],
        matchText: '',
        activeIndex: null,
        active: null,
      }));
    }
  }
};

const checkForOperator = (buildState: BuildState): BuildState => {
  let { text } = buildState;
  text = trimIfNotSpaces(text);
  if (text.length > 2) {
    if (text.length === 3) {
      if (text === AND) {
        return {
          ...buildState,
          text: '',
          operator: AND,
        };
      }
    } else {
      const symbol = text.substring(0, 4);
      if (symbol === `${AND} `) {
        return {
          ...buildState,
          text: trimIfNotSpaces(text.substring(4)),
          operator: AND,
        };
      }
    }
  }
  if (text.length > 1) {
    if (text.length === 2) {
      if (text === OR) {
        return {
          ...buildState,
          text: '',
          operator: OR,
        };
      }
    } else {
      const symbol = text.substring(0, 3);
      if (symbol === `${OR} `) {
        return {
          ...buildState,
          text: trimIfNotSpaces(text.substring(3)),
          operator: OR,
        };
      }
    }
  }
  return buildState;
};

const checkForField = (buildState: BuildState): BuildState => {
  const { fields, text } = buildState;
  const foundField = fields
    .sort((x, y) => y.title.length - x.title.length)
    .find(
      (f) =>
        f.title.toLocaleLowerCase() ===
        text.substring(0, f.title.length).toLocaleLowerCase(),
    );
  return foundField &&
    text
      .trim()
      .toLocaleLowerCase()
      .includes(`${foundField.title.toLocaleLowerCase()}`) &&
    (text.length === foundField.title.length || !text[foundField.title.length].match(/[a-z]/i)) &&
    !text
      .trim()
      .toLocaleLowerCase()
      .includes(`${foundField.title.toLocaleLowerCase()} to `)
    ? {
      ...buildState,
      field: foundField,
      text: text.substring(foundField.title.length).trimStart(),
    }
    : buildState;
};

const checkForComparison = (buildState: BuildState): BuildState => {
  const { text: cText, comparisonsMap } = buildState;
  const text = trimIfNotSpaces(cText);
  if (text.length >= 1) {
    for (let length = 1; length < 3; length += 1) {
      const symbol = text.substring(0, length);
      if (comparisonsMap.has(symbol)) {

        return {
          ...buildState,
          comparison: symbol,
          text: text.substring(length).trimStart(),
        };
      }
    }
  }
  return buildState;
};

const checkForRange = (buildState: BuildState): BuildState => {
  const { text } = buildState;
  const toPos = text.toLocaleLowerCase().indexOf('to');
  if (toPos !== -1) {
    const toText = text.substring(toPos, toPos + 2);
    const [from, to] = text.split(toText);
    if (!Number.isNaN(Number(from)) && !Number.isNaN(Number(to))) {
      return {
        ...buildState,
        range: {
          from,
          to,
        },
      };
    }
    const toPosWrapped = text.toLocaleLowerCase().indexOf(' to ');
    if (toPosWrapped !== -1) {
      const toTextWrapped = text.substring(toPosWrapped, toPosWrapped + 4);
      const [fromW, toW] = text.split(toTextWrapped);
      return {
        ...buildState,
        range: {
          from: fromW,
          to: toW,
        },
      };
    }
  }
  return buildState;
};

const contructOptions = (buildState: BuildState) => {
  const { text, field, fields } = buildState;
  fields
    .filter((f) => !field || field.name === f.name)
    .forEach((f) => {
      if (text.trim() === '' || text.trim().toLocaleUpperCase().includes(EMPTY.toLocaleUpperCase())) {
        if (f.allowBlanks) {
          addOption(buildState, f, EMPTY, null, true);
        }
      } else if (
        !f.fieldMatchers ||
        (f.fieldMatchers.length === 0 && f.editorType)
      ) {
        matchType(buildState, f);
      } else {
        f.fieldMatchers.forEach((match) => {
          if ('lookup' in match) {
            matchPromiseOptions(buildState, f, match);
          } else if ('source' in match) {
            matchListOptions(buildState, f, match);
          } else if ('match' in match) {
            matchValueOptions(buildState, f, match);
          }
        });
      }
    });
  updateOptions(buildState);
};

const updateOptions = (buildState: BuildState) => {
  const {
    comparison,
    operator,
    matchText,
    options: categoryOptions,
    set,
  } = buildState;
  if (categoryOptions.length > 0) {
    const options = categoryOptions
      .sort((x, y) => optionSort(matchText, x, y))
      .map((o) => o.option);
    set((state) => {
      const { activeIndex: index } = state;
      const activeIndex =
        index === null || index === undefined
          ? 0
          : index > options.length - 1
            ? options.length - 1
            : index;
      return {
        options: [...options],
        matchText,
        comparison,
        operator,
        activeIndex,
        active: options[activeIndex],
      };
    });
  } else {
    set(() => ({ options: [], matchText, activeIndex: null, active: null }));
  }
};

const optionSort = (
  matchedText: string,
  x: CategoryOption,
  y: CategoryOption,
) => {
  if (x.option.type === 'f') {
    return -1;
  }
  if (y.option.type === 'f') {
    return 1;
  }
  if (y.expression !== x.expression) {
    if (x.expression) {
      return 1;
    }
    if (y.expression) {
      return -1;
    }
  }
  const xdiff = Math.abs(
    ('displayText' in x.option ? x.option.displayText : x.option.text).length -
    (matchedText?.length ?? 0),
  );
  const ydiff = Math.abs(
    ('displayText' in y.option ? y.option.displayText : y.option.text).length -
    (matchedText?.length ?? 0),
  );
  return xdiff === ydiff ? (x.precedence - y.precedence) * -1 : xdiff - ydiff;
};

const matchType = (buildState: BuildState, field: Field) => {
  if (field.allowRange && buildState.range) {
    const { from, to } = buildState.range;
    const value = getValueIfValid(from, field);
    const valueTo = getValueIfValid(to, field);
    if (value && valueTo) {
      const displayText = `${from} to ${to}`;
      addRangeOption(
        buildState,
        field,
        from,
        value,
        to,
        valueTo,
        displayText,
        true,
      );
      return;
    }
  }
  const value = getValueIfValid(buildState.text, field);
  if (value) {
    addOption(buildState, field, buildState.text, value, true);
  }
};

const getValueIfValid = (text: string, field: Field) => {
  switch (field.editorType) {
    case 'bool': {
      return text.toLocaleLowerCase() === 'true'
        ? true
        : text.toLocaleLowerCase() === 'false'
          ? false
          : null;
    }
    case 'integer': {
      const int = Number(text);
      if (!Number.isNaN(int) && Number.isInteger(int)) {
        return int;
      }
      break;
    }
    case 'float': {
      const float = Number(text);
      if (!Number.isNaN(float)) {
        return float;
      }
      break;
    }
    case 'date':
    case 'datetime':
    case 'dateString':
    case 'datetimeString': {
      const date = moment(
        text,
        field.dateTimeFormat ??
        (field.editorType === 'date'
          ? DEFAULT_DATE_FORMAT
          : DEFAULT_DATE_TIME_FORMAT),
        true,
      );
      if (date.isValid()) {
        return date.toDate();
      }
      break;
    }
    case 'text': {
      if (text.length > 0) {
        return text;
      }
      break;
    }
    default:
      return null;
  }
  return null;
};

const matchPromiseOptions = (
  buildState: BuildState,
  field: Field,
  match: PromiseMatch,
) => {
  const { text, operator, currentValues, matcherKey } = buildState;
  match.lookup(text, matcherKey ? OR : operator, currentValues).then((promiseItems) => {
    if (!checkDebounced(buildState)) {
      return;
    }

    const items = promiseItems.filter((item) =>
      matchItem(item, field, text, true),
    );

    if (items.length > 0) {
      items.forEach((i) => {
        const iText = getText(i, field);
        const iValue = getValue(i, field);
        addOption(buildState, field, iText, iValue);
      });
      updateOptions(buildState);
    }
  });
};

const matchListOptions = (
  buildState: BuildState,
  field: Field,
  match: ListMatch,
) => {
  if (field.allowRange && buildState.range) {
    if (
      matchRangeListOption(
        buildState,
        field,
        match,
        buildState.range.from,
        buildState.range.to,
      )
    ) {
      return;
    }
  }
  matchIndividualListOptions(buildState, field, match);
};

const matchRangeListOption = (
  buildState: BuildState,
  field: Field,
  match: ListMatch,
  from: string,
  to: string,
): boolean => {
  const item1 = match.source.find((sourceItem: SourceItem) =>
    matchExact(sourceItem, field, from, match.ignoreCase),
  );
  const item2 = match.source.find((sourceItem: SourceItem) =>
    matchExact(sourceItem, field, to, match.ignoreCase),
  );
  if (item1 && item2) {
    const text = getText(item1, field);
    const value = getValue(item1, field);
    const textTo = getText(item2, field);
    const valueTo = getValue(item2, field);
    const displayText = `${text} to ${textTo}`;
    addRangeOption(
      buildState,
      field,
      text,
      value,
      textTo,
      valueTo,
      displayText,
    );
    buildState.matchText = displayText;
    return true;
  }
  return false;
};

const matchIndividualListOptions = (
  buildState: BuildState,
  field: Field,
  match: ListMatch,
) => {
  const items = match.source.filter((sourceItem) =>
    matchItem(sourceItem, field, buildState.text, match.ignoreCase),
  );
  items.forEach((o) =>
    addOption(buildState, field, typeof o === 'string' ? o : `${o}`, o),
  );
};

const matchValueOptions = (
  buildState: BuildState,
  field: Field,
  match: ValueMatch,
) => {
  if (buildState.range) {
    if (
      field.allowRange &&
      expressionMatches(match.match, buildState.range.from) &&
      expressionMatches(match.match, buildState.range.to)
    ) {
      const fromValue = match.value(buildState.range.from);
      const fromText = match.label
        ? match.label(fromValue)
        : buildState.range.from;
      const toValue = match.value(buildState.range.to);
      const toText = match.label ? match.label(toValue) : buildState.range.to;
      const displayText = `${buildState.range.from.trim()} to ${buildState.range.to.trim()}`;
      addRangeOption(
        buildState,
        field,
        fromText,
        fromValue,
        toText,
        toValue,
        displayText,
        true,
      );
      buildState.matchText = displayText;
    }
    return;
  }
  if (expressionMatches(match.match, buildState.text)) {
    const value = match.value(buildState.text);
    const text = match.label ? match.label(value) : buildState.text;
    addOption(buildState, field, text, value, true);
  }
};

const addFieldOption = (
  buildState: BuildState,
  field: Field,
) => {
  buildState.options.push({
    precedence: 10,
    expression: false,
    option: {
      type: 'f',
      key: uuidv4(),
      field: field.name,
    },
  });
};

const addOption = (
  buildState: BuildState,
  field: Field,
  text: string,
  value: Value,
  expression?: true,
) => {
  const Icon = field.iconMap?.get(value);
  buildState.options.push({
    precedence: field.precedence ?? 0,
    expression: expression ?? false,
    option: {
      type: 's',
      key: uuidv4(),
      field: field.name,
      value,
      text,
      Icon,
    },
  });
};

const addRangeOption = (
  buildState: BuildState,
  field: Field,
  text: string,
  value: Value,
  textTo: string,
  valueTo: Value,
  displayText: string,
  expression?: true,
) => {
  const Icon = field.iconMap?.get(value);
  const IconTo = field.iconMap?.get(valueTo);
  buildState.options.push({
    precedence: field.precedence ?? 0,
    expression: expression ?? false,
    option: {
      type: 'r',
      key: uuidv4(),
      field: field.name,
      value,
      text,
      Icon,
      valueTo,
      textTo,
      IconTo,
      displayText,
    },
  });
};

const checkDebounced = (buildState: BuildState) => {
  const { set, buildKey } = buildState;
  let relevant = true;
  set((state) => {
    if (state.buildKey !== buildKey) {
      relevant = false;
    }
    return {};
  }, false);
  return relevant;
};

const expressionMatches = (
  match: RegExp | ((text: string) => boolean),
  text: string,
): boolean => {
  if (typeof match === 'function') {
    return match(text);
  }
  return text.match(match) !== null;
};
