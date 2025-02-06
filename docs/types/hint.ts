import { Value } from './matcher';

export interface SingleValueHint {
  /* Option text */
  text: string;
  /* Value value */
  value: Value;
  /* comparison operator to apply */
  comparison?: string;
  /* display value */
  display?: string | JSX.Element;
}

export interface RangeHint {
  /* Option text */
  text: string;
  /* Option value */
  value: Value;
  /* Option text to */
  textTo: string;
  /* Option value to */
  valueTo: Value;
  /* display value */
  display: string | JSX.Element;
}

export interface ArrayHint {
  /* Option value array */
  textArray: string[];
  /* Option value array */
  valueArray: Value[];
  /* comparison operator to apply */
  comparison?: string;
  /* display value */
  display: string | JSX.Element;
}

export type Hint = string | SingleValueHint | RangeHint | ArrayHint;
