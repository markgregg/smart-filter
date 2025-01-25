import { LogicalOperator, Value } from './matcher';

export type SourceItem = string | object;
export interface LookupBase {
    minimumSearchLength?: number;
}
export interface ListMatch extends LookupBase {
    source: SourceItem[];
    matchOnPaste?: boolean;
    ignoreCase?: boolean;
}
export type PromiseLookup = (text: string, op: LogicalOperator | null, currentValues?: Value[]) => Promise<SourceItem[]>;
export interface PromiseMatch extends LookupBase {
    lookup: PromiseLookup;
    lookupOnPaste?: (text: string) => Promise<SourceItem | null>;
}
export interface ValueBase {
    matchOnPaste?: boolean;
}
export interface ValueMatch extends ValueBase {
    match: RegExp | ((text: string) => boolean);
    value: (text: string) => Value;
    label?: (value: Value) => string;
}
export type FieldMatch = ListMatch | PromiseMatch | ValueMatch;
