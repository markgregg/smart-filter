import { Field } from '../field';
import { Hints } from '../hints';
import { Operator } from '../operator';
import { PasteOptions } from '../pasteOptions';
import { UIProperties } from '../uiProperties';


export interface ConfigState extends UIProperties {
  fields: Field[];
  fieldMap: Map<string, Field>;
  hints?: Hints;
  comparisons: Operator[];
  comparisonsMap: Map<string, Operator>;
  allowLocking?: boolean;
  debounce?: number;
  pageSize?: number;
  pasteOptions?: PasteOptions;
  enableSort?: boolean;
}
