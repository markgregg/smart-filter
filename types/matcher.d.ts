export type Value = any;
export type LogicalOperator = 'and' | 'or';
export type Brackets = '(' | ')';
interface BaseMatcher {
    key: string;
    operator: LogicalOperator;
    locked?: boolean;
}
export interface BracketMatcher extends BaseMatcher {
    type: 'b';
    bracket: Brackets;
}
export interface SingleMatcher extends BaseMatcher {
    type: 's';
    field: string;
    comparison: string;
    value: Value;
    text: string;
}
export interface ArrayMatcher extends BaseMatcher {
    type: 'a';
    field: string;
    comparison: string;
    valueArray: Value[];
    textArray: string[];
}
export interface RangeMatcher extends BaseMatcher {
    type: 'r';
    field: string;
    value: Value;
    text: string;
    valueTo: Value | null;
    textTo: string | null;
}
export type ValueMatcher = SingleMatcher | ArrayMatcher | RangeMatcher;
export type Matcher = BracketMatcher | SingleMatcher | ArrayMatcher | RangeMatcher;
export {};
