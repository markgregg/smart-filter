import { Field } from '../field';
import { Hints } from '../hints';
import { Matcher } from '../matcher';
import { Operator } from '../operator';
import { PasteOptions } from '../pasteOptions';
import { Sort } from '../sort';
import { UIProperties } from '../uiProperties';

export interface ConfigState extends UIProperties {
    onChange?: (matchers: Matcher[]) => void;
    onSortChange?: (sort: Sort[]) => void;
    onClear?: () => void;
    onLock?: (locked: boolean) => void;
    onExpand?: (expanded: boolean) => void;
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
