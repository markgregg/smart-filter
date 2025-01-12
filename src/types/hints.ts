import { HintGrouping } from './hintGrouping';

export interface Hints {
  /* number of hints per column */
  hintsPerColumn?: number;
  /* width of hints */
  hintWidth?: number;
  /* hint groups */
  hintGroups: HintGrouping[];
  /* true show all fields or specify which fields */
  sortHints?: true | string[];
}
