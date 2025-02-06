import { LogicalOperator, Value } from './matcher';

export type SourceItem = string | object;

export interface LookupBase {
  minimumSearchLength?: number; // minium charactes entered before matcher is used
}

export interface ListMatch extends LookupBase {
  /* list of options */
  source: SourceItem[];
  /* true if values can be paste */
  matchOnPaste?: boolean;
  /* if source a list of options, true to ignore case */
  ignoreCase?: boolean;
}

export type PromiseLookup = (
  text: string,
  op: LogicalOperator | null,
  currentValues?: Value[],
) => Promise<SourceItem[]>;

export interface PromiseMatch extends LookupBase {
  /* a Promise that returns mathcing items */
  lookup: PromiseLookup;
  /* a promise that returns a match for the pasted value */
  lookupOnPaste?: (text: string) => Promise<SourceItem | null>;
}

export interface ValueBase {
  matchOnPaste?: boolean; // true if users can paste lists
}

export interface ValueMatch extends ValueBase {
  /* either a regex or a function to match entered text */
  match: RegExp | ((text: string) => boolean);
  /* a functiuon to convert the entered text into a value */
  value: (text: string) => Value;
  /* a functiuon to convert the value into a display label */
  label?: (value: Value) => string;
}

export type FieldMatch = ListMatch | PromiseMatch | ValueMatch;
