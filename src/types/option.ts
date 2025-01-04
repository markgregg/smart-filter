import { Value } from "./matcher";

export interface BaseOption {
  key: string;
  field: string;
}

export interface SingleOption extends BaseOption {
  value: Value;
  text: string;
}

export interface RangeOption extends BaseOption {
  value: Value;
  text: string;
  valueTo: Value;
  textTo: string;
  displayText: string;
}

export type Option = SingleOption | RangeOption;