import { IconType } from 'react-icons';
import { Value } from './matcher';

export interface BaseOption {
  key: string;
  field: string;
}

export interface SingleOption extends BaseOption {
  value: Value;
  Icon?: IconType;
  text: string;
}

export interface RangeOption extends BaseOption {
  value: Value;
  text: string;
  Icon?: IconType;
  valueTo: Value;
  textTo: string;
  IconTo?: IconType;
  displayText: string;
}

export type Option = SingleOption | RangeOption;
