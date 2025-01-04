import { Field, LookupBase, Matcher, SourceItem, Value, ValueMatch } from "..";
import moment from "moment";
import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_TIME_FORMAT, EQUALS } from "./constants";
import { ArrayValue, RangeValue, SingleValue } from "@/types/values";

export const ignoreCaseCompare = (text1: string, text2: string) => {
  return text1.toLocaleLowerCase().includes(text2.toLocaleLowerCase());
}

export const getDefaultComparison = (field?: Field) => {
  return field?.defaultComparison ?? EQUALS;
}

const getMin = (field: Field): Date | undefined => {
  if (field.min) {
    if (typeof field.min === 'string') {
      return moment(field.min, field.dateTimeFormat ?? (field.editorType === 'date' ? DEFAULT_DATE_FORMAT : DEFAULT_DATE_TIME_FORMAT), true).toDate();
    }
    if (field.min instanceof Date) {
      return field.min;
    }
  }
  if (field.editorType === 'datetime') {
    return new Date(Date.now())
  }
  const date = new Date(Date.now());
  date.setHours(0, 0, 0, 0);
  return date;
}

export const getDefaultTextValue = (field?: Field) => {
  if (field?.editorType === 'bool') {
    return { text: 'false', value: false };
  }
  if (field?.editorType === 'date') {
    const date = getMin(field);
    return { text: moment(date, true).format(field.dateTimeFormat ?? DEFAULT_DATE_FORMAT), value: date };
  }
  if (field?.editorType === 'datetime') {
    const date = getMin(field);
    return { text: moment(date, true).format(field.dateTimeFormat ?? DEFAULT_DATE_TIME_FORMAT), value: date };
  }
  if (field?.editorType === 'float') {
    const number = field.min && typeof field.min === 'number' ? field.min : 0.0;
    return { text: number + '', value: number };
  }
  if (field?.editorType === 'integer') {
    const number = field.min && typeof field.min === 'number' ? field.min : 0.0;
    return { text: number + '', value: number };
  }
  return { text: '', value: null };
}

export const createArrayValue = ({
  field,
  valueArray,
  textArray,
}: ArrayValue): ArrayValue => {
  return {
    field,
    valueArray,
    textArray
  };
}

export const createRangeValue = ({
  field,
  value,
  text,
  valueTo,
  textTo,
}: RangeValue): RangeValue => {
  return {
    field,
    value,
    text,
    valueTo,
    textTo,
  };
}

export const createValue = ({
  field,
  value,
  text,
}: SingleValue): SingleValue => {
  return {
    field,
    value,
    text,
  };
}

export const hasError = (matcher: Matcher) => {
  if ('value' in matcher && matcher.value === null) {
    return true;
  }
  if ('valueTo' in matcher && matcher.valueTo === null) {
    return true;
  }

  if ('valueArray' in matcher && matcher.valueArray.length === 0) {
    return true;
  }
}

export const valueMatches = (match: ValueMatch, text: string) => {
  return typeof match.match === 'function'
    ? match.match(text)
    : text.match(match.match);
}

export const trimIfNotSpaces = (text: string): string => {
  return text.trimStart().length > 0 ? text.trimStart() : text;
}

export const ignoreCaseEquals = (str1: string, str2: string): boolean => {
  return str1.toLocaleLowerCase() === str2.toLocaleLowerCase();
}

export const getValue = (item: SourceItem, lookup: LookupBase,): Value => {
  return lookup.valueGetter && typeof item === 'object'
    ? lookup.valueGetter(item)
    : item.toString();
}

export const getText = (item: SourceItem, lookup: LookupBase,): string => {
  return lookup.textGetter && typeof item === 'object'
    ? lookup.textGetter(item)
    : item.toString();
}

export const matchItem = (
  sourceItem: SourceItem,
  lookup: LookupBase,
  text: string,
  ignoreCase?: boolean,
): boolean => {
  const actualItem = getText(sourceItem, lookup);
  return ignoreCase
    ? actualItem.toLocaleLowerCase().includes(text.toLocaleLowerCase())
    : actualItem.includes(text);
};

export const matchExact = (
  sourceItem: SourceItem,
  lookup: LookupBase,
  searchText: string,
  ignoreCase?: boolean,
): boolean => {
  const actualItem = getText(sourceItem, lookup);
  return ignoreCase
    ? ignoreCaseEquals(actualItem, searchText)
    : actualItem === searchText;
};