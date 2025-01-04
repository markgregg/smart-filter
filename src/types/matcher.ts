export type Value = any;
export type LogicalOperator = 'and' | 'or';
export type Brackets = '(' | ')';

interface BaseMatcher {
  /* unique identifier */
  key: string;
  /* and/or */
  operator: LogicalOperator;
}

export interface BracketMatcher extends BaseMatcher {
  /* open or close bracket */
  bracket: Brackets;
}

export interface SingleMatcher extends BaseMatcher {
  /* field to compare against */
  field: string;
  /* comparison to perform */
  comparison: string;
  /* value to compare against */
  value: Value;
  /* textg to display */
  text: string;
}

export interface ArrayMatcher extends BaseMatcher {
  /* field to compare against */
  field: string;
  /* comparison to perform */
  comparison: string;
  /* List of values to compare against */
  valueArray: Value[];
  /* List of text values to display */
  textArray: string[];
}

export interface RangeMatcher extends BaseMatcher {
  /* field to compare against */
  field: string;
  /* value from */
  value: Value;
  /* text display from */
  text: string;
  /* value to */
  valueTo: Value | null;
  /* text display to */
  textTo: string | null;
}

export type ValueMatcher = SingleMatcher | ArrayMatcher | RangeMatcher;

export type Matcher = BracketMatcher | SingleMatcher | ArrayMatcher | RangeMatcher;