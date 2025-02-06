import { Value } from './matcher';

export interface BaseValue {
  field: string;
}

export interface SingleValue extends BaseValue {
  type: 's';
  text: string;
  value: Value;
}

export interface RangeValue extends BaseValue {
  type: 'r';
  text: string;
  value: Value;
  textTo: string;
  valueTo: Value;
}

export interface ArrayValue extends BaseValue {
  type: 'a';
  textArray: string[];
  valueArray: Value[];
}

export type MatcherValue = SingleValue | RangeValue | ArrayValue;
