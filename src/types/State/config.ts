import { Field } from "../field";
import { Hints } from "../hints";
import { Operator } from "../operator";
import { UICustomisations } from "./uiCustomisations";

export interface ConfigState extends UICustomisations {
  fields: Field[];
  fieldMap: Map<string, Field>;
  hints?: Hints;
  comparisons: Operator[];
  comparisonsMap: Map<string, Operator>;
  allowLocking?: boolean;
}