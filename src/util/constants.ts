export const CLIPBOARD_FORMAT = 'text/plain';
export const DELIMITERS = [',', '\t', '\n'];

export const UNDO_BUFFER_CAPACITY = 100;
export const DEFAULT_KEYBOARD_DROPDOWN_DISPLAY_TIME = 1500;
export const DEFAULT_SORT_OPTION_WIDTH = 200;
export const DEFAULT_SORT_PILL_WIDTH = 90;
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
export const DEFAULT_DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const COMPACT_HEIGHT = 24;
export const NORMAL_HEIGHT = 30;
export const LARGE_HEIGHT = 36;

export const COMPACT_PILL_HEIGHT = 18;
export const NORMAL_PILL_HEIGHT = 22;
export const LARGE_PILL_HEIGHT = 26;

export const AND = 'and';
export const OR = 'or';
export const EQUALS = '=';

export const EMPTY = 'Empty';
export const defaultComparisons: string[] = ['=', '!'] as const;
export const stringComparisons: string[] = [
  '=',
  '!',
  '*',
  '!*',
  '<*',
  '>*',
] as const;
export const numberComparisons: string[] = [
  '=',
  '>',
  '<',
  '>=',
  '<=',
  '!',
] as const;

export const DEFAULT_PAGE_SIZE = 10;

export const KeyBoardkeys = {
  ArrowRight: 'ArrowRight',
  ArrowLeft: 'ArrowLeft',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  PageUp: 'PageUp',
  PageDown: 'PageDown',
  Home: 'Home',
  End: 'End',
  Enter: 'Enter',
  Tab: 'Tab',
  c: 'c',
  C: 'C',
  x: 'x',
  X: 'X',
  v: 'v',
  V: 'V',
};

export const AgTypes = {
  text: 'text',
  boolean: 'boolean',
  number: 'number',
  date: 'date',
  dateString: 'dateString',
};

export const AgFilters = {
  agSetColumnFilter: 'agSetColumnFilter',
  agTextColumnFilter: 'agTextColumnFilter',
  agNumberColumnFilter: 'agNumberColumnFilter',
  agBooleanColumnFilter: 'agBooleanColumnFilter',
  agDateColumnFilter: 'agDateColumnFilter',
  agDateStringColumnFilter: 'agDateStringColumnFilter',
};

export const VALUE = 'value';
export const VALUE_TO = 'valueTo';
export const VALUE_ARRAY = 'valueArray';
