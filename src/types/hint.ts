import { Value } from './matcher';

export interface BaseHint {
  display: string | JSX.Element;
}

export interface SingleValueHint extends BaseHint {
  text: string;
  value: Value;
  comparison?: string;
}

export interface RangeHint extends BaseHint {
  text: string;
  value: Value;
  textTo: string;
  valueTo: Value;
}

export interface ArrayHint extends BaseHint {
  textArray: string[];
  valueArray: Value[];
  comparison?: string;
}

export type Hint = string | SingleValueHint | RangeHint | ArrayHint;
