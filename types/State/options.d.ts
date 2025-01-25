import { Field } from '../field';
import { LogicalOperator, Value } from '../matcher';
import { Option } from '../option';

export type OptionSelectedCallback = (option: Option) => void;
export interface OptionsState {
    matcherKey: string | null;
    options: Option[];
    operator: LogicalOperator | null;
    comparison: string | null;
    matchText: string;
    buildKey: string | null;
    active: Option | null;
    activeIndex: number | null;
    onOptionSelected: OptionSelectedCallback | null;
    buildOptions: (callback: OptionSelectedCallback, text: string, field?: Field, currentValues?: Value[], matcherKey?: string) => void;
    clearOptions: () => void;
    selectOption: (option: Option) => void;
    next: () => void;
    prev: () => void;
    nextPage: () => void;
    prevPage: () => void;
    first: () => void;
    last: () => void;
}
