import { HintGrouping } from "./hintGrouping";

export interface Hints {
  hintsPerColumn?: number;
  hintWidth?: number;
  hintGroups: HintGrouping[];
}