import { UIProperties } from './State';
import { Field } from './field';
import { Hints } from './hints';
import { Matcher } from './matcher';
import { Operator } from './operator';
import { PasteOptions } from './pasteOptions';

export interface SmartFilterProps extends UIProperties {
  /* managed matchers */
  matchers?: Matcher[];
  /* change notifier for matchers */
  onChange?: (matchers: Matcher[]) => void;

  /* matcher clear notifier */
  onClear?: () => void;
  /** lock state */
  locked?: boolean;
  /* lock toggle notifier */
  onLock?: (locked: boolean) => void;
  /* expand toggle notifier */
  onExpand?: (expanded: boolean) => void;

  /* fields on which to filter */
  fields: Field[];
  /* field hints */
  hints?: Hints;
  /* operator descriptions and colours */
  operators?: Operator[];
  /* if true pills can be locked */
  allowLocking?: boolean;

  /* used only in options state */
  debounce?: number;
  /* number of items to jump when page down/up pressed */
  pageSize?: number;

  /* how to handle pasting of arrays and pills */
  pasteOptions?: PasteOptions;
}
