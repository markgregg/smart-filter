import { HintGrouping } from './hintGrouping';

export interface Hints {
  /* number of hints per column */
  hintsPerColumn?: number;
  /* width of hints */
  hintWidth?: number;
  /* hint groups */
  hintGroups: HintGrouping[];
  /* specify which fields to sort and in which order */
  sortHints?: string[];
}
