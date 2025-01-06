import { UIProperties } from './State';
import { Field } from './field';
import { Hints } from './hints';
import { Matcher } from './matcher';
import { Operator } from './operator';

export interface SmartFilterProps extends UIProperties {
  matchers?: Matcher[];
  onChange?: (matchers: Matcher[]) => void;

  onClear?: () => void;
  onLock?: (locked: boolean) => void;
  onExpand?: (expanded: boolean) => void;

  fields: Field[];
  hints?: Hints;
  operators?: Operator[];
  allowLocking?: boolean;

  /* used only in options state */
  debounce?: number;
  pageSize?: number;
}
