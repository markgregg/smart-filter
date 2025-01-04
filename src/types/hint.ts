import { Value } from "./matcher";

export interface BaseHint {
  field: string;
  dislayText: string;
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

export type Hint = SingleValueHint | RangeHint | ArrayHint;