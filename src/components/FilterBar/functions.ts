import { v4 as uuidv4 } from 'uuid';
import {
  ArrayMatcher,
  Field,
  Matcher,
  PasteOptions,
  SingleMatcher,
  ValueMatcher,
} from '@/types';
import { AND, DELIMITERS } from '@/util/constants';
import { getDefaultComparison } from '@/util/functions';

const fromPartial = (matcher: Partial<Matcher>): Matcher => {
  if (matcher.type === 'b') {
    return {
      type: 'b',
      key: uuidv4(),
      operator: matcher.operator ?? AND,
      bracket: matcher.bracket ?? '(',
    };
  }
  const valueMatcher = matcher as ValueMatcher;
  if (!valueMatcher.field) {
    throw new Error(`Field is mnadatory when pasting`);
  }
  if (valueMatcher.type === 'a') {
    return {
      type: 'a',
      key: uuidv4(),
      field: valueMatcher.field,
      operator: valueMatcher.operator ?? AND,
      comparison: valueMatcher.comparison ?? '=',
      valueArray: valueMatcher.valueArray ?? [],
      textArray: valueMatcher.textArray ?? [],
    };
  }
  if (valueMatcher.type === 'r') {
    return {
      type: 'r',
      key: uuidv4(),
      field: valueMatcher.field,
      operator: valueMatcher.operator ?? AND,
      value: valueMatcher.value ?? null,
      text: valueMatcher.text ?? '',
      valueTo: valueMatcher.valueTo ?? null,
      textTo: valueMatcher.textTo ?? '',
    };
  }
  if (valueMatcher.type === 's') {
    const singleMatcher = valueMatcher as SingleMatcher;
    return {
      type: 's',
      key: uuidv4(),
      field: singleMatcher.field,
      operator: singleMatcher.operator ?? AND,
      comparison: singleMatcher.comparison ?? '=',
      value: singleMatcher.value ?? null,
      text: singleMatcher.text ?? '',
    };
  }
  throw Error('Unkonw type of matcher');
};

const splitString = (text: string): string[] | null => {
  for (let index = 0; index < DELIMITERS.length; index += 1) {
    const delimiter = DELIMITERS[index];
    const textArray = text.split(delimiter);
    if (textArray.length > 1) {
      const uniqueItems = new Set<string>();
      textArray.forEach((t) => {
        if (t) {
          uniqueItems.add(t);
        }
      });
      return [...uniqueItems.values()];
    }
  }
  return null;
};

const findFieldMatch = (
  textArray: string[],
  pasteOptions: PasteOptions,
): string | null => {
  if (pasteOptions.fieldPasteMatchPatterns) {
    for (
      let idx = 0;
      idx < pasteOptions.fieldPasteMatchPatterns.length;
      idx += 1
    ) {
      const pastePatterns = pasteOptions.fieldPasteMatchPatterns[idx];
      const patternArray = Array.isArray(pastePatterns.patterns)
        ? pastePatterns.patterns
        : [pastePatterns.patterns];
      for (
        let patternIdx = 0;
        patternIdx < patternArray.length;
        patternIdx += 1
      ) {
        const pattern = patternArray[patternIdx];
        const matches = textArray.filter((text) =>
          typeof pattern === 'function' ? pattern(text) : text.match(pattern),
        ).length;
        if (matches > textArray.length * 0.8) {
          return pastePatterns.field;
        }
      }
    }
  }
  return null;
};

const createMatcher = (textArray: string[], field: Field): ArrayMatcher => {
  const valueArray = [...textArray];
  return {
    type: 'a',
    key: uuidv4(),
    field: field.name,
    operator: AND,
    comparison: getDefaultComparison(field),
    textArray,
    valueArray,
  };
};

export const getMatchersFromText = (
  text: string,
  fieldMap: Map<string, Field>,
  pasteOptions?: PasteOptions,
): Matcher | Matcher[] | null => {
  if (pasteOptions) {
    if (pasteOptions.customParsers) {
      for (let idx = 0; idx < pasteOptions.customParsers.length; idx += 1) {
        const parser = pasteOptions.customParsers[idx];
        const matchers = parser(text);
        if (matchers) {
          return matchers.map(fromPartial);
        }
      }
    }
    const textArray = splitString(text);
    if (textArray) {
      const fieldName = findFieldMatch(textArray, pasteOptions);
      if (fieldName) {
        const field = fieldMap.get(fieldName);
        if (field) {
          return createMatcher(textArray, field);
        }
      }
    }
  }
  if (text.includes('"key":')) {
    const matchers = JSON.parse(text) as Matcher | Matcher[];
    return Array.isArray(matchers)
      ? matchers.map((m) => ({ ...m, key: uuidv4() }))
      : {
          ...matchers,
          key: uuidv4(),
        };
  }
  return null;
};
