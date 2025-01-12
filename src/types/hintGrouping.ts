import { Hint } from './hint';

export interface HintGrouping {
  /* title to show for hint group */
  title: string;
  /* Associated field */
  field: string;
  /* List of hints or hint functon */
  hints: Hint[] | (() => Hint[]);
}
