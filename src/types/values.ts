import { Value } from './matcher';

export interface BaseValue {
  field: string;
}

export interface SingleValue extends BaseValue {
  text: string;
  value: Value;
}

export interface RangeValue extends BaseValue {
  text: string;
  value: Value;
  textTo: string;
  valueTo: Value;
}

export interface ArrayValue extends BaseValue {
  textArray: string[];
  valueArray: Value[];
}

export type MatcherValue = SingleValue | RangeValue | ArrayValue;
