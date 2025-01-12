import { Value } from './matcher';

export interface BaseHint {
  /* text to display */
  display: string | JSX.Element;
}

export interface SingleValueHint extends BaseHint {
  /* Option text */
  text: string;
  /* Value value */
  value: Value;
  /* comparison operator to apply*/
  comparison?: string;
}

export interface RangeHint extends BaseHint {
  /* Option text */
  text: string;
  /* Option value */
  value: Value;
  /* Option text to*/
  textTo: string;
  /* Option value to*/
  valueTo: Value;
}

export interface ArrayHint extends BaseHint {
  /* Option value array*/
  textArray: string[];
  /* Option value array*/
  valueArray: Value[];
  /* comparison operator to apply*/
  comparison?: string;
}

export type Hint = string | SingleValueHint | RangeHint | ArrayHint;
