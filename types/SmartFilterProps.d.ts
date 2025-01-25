import { UIProperties } from './State';
import { Field } from './field';
import { Hints } from './hints';
import { Matcher } from './matcher';
import { Operator } from './operator';
import { PasteOptions } from './pasteOptions';
import { Sort } from './sort';

export interface SmartFilterProps extends UIProperties {
    matchers?: Matcher[];
    onChange?: (matchers: Matcher[]) => void;
    enableSort?: boolean;
    sort?: Sort[];
    onSortChange?: (sort: Sort[]) => void;
    onClear?: () => void;
    onLock?: (locked: boolean) => void;
    onExpand?: (expanded: boolean) => void;
    fields: Field[];
    hints?: Hints;
    operators?: Operator[];
    allowLocking?: boolean;
    debounce?: number;
    pageSize?: number;
    pasteOptions?: PasteOptions;
}
