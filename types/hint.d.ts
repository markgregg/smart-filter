import { Value } from './matcher';

export interface SingleValueHint {
    text: string;
    value: Value;
    comparison?: string;
    display?: string | JSX.Element;
}
export interface RangeHint {
    text: string;
    value: Value;
    textTo: string;
    valueTo: Value;
    display: string | JSX.Element;
}
export interface ArrayHint {
    textArray: string[];
    valueArray: Value[];
    comparison?: string;
    display: string | JSX.Element;
}
export type Hint = string | SingleValueHint | RangeHint | ArrayHint;
