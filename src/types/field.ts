import { FieldMatch } from "./fieldMatches";

export type ValueType = 'bool' | 'integer' | 'float' | 'text' | 'date' | 'datetime';

export interface Field {
  name: string;
  /* the title of the field displayed in searches */
  title: string;
  /* operators that can ba applied to the field */
  operators: string[];
  /* default operator if one isn't selected */
  defaultComparison?: string;
  /* value type, defaults to string */
  editorType?: ValueType;
  /* value edit matchers */
  fieldMatchers: FieldMatch[];
  /* date-time format */
  dateTimeFormat?: string;
  /* minimun date or number value */
  min?: number | string | Date;
  /* maximum date or number value */
  max?: number | string | Date;
  /* increments when clicking up or down*/
  increments?: number;
  /* order in which two equal items will appear in the suggestions list */
  precedence?: number;
  /* allow lists */
  allowList?: boolean;
  /* allow ranges */
  allowRange?: boolean;
  /* allow blank values */
  allowBlanks?: boolean;
}