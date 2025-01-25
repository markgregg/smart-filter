import { ArrayState, BracketState, ConfigState, DragState, FilterBarState, FocusState, HintState, ManagedState, MatcherState, OptionsState } from '../../../../../../src/types/State';
import { Matcher, Sort } from '../../../../../../src/types';
import { SortState } from '../../../../../../src/types/State/sort';

export declare const useConfig: <U>(selector: (state: ConfigState) => U) => U;
export declare const useFocus: <U>(selector: (state: FocusState) => U) => U;
export declare const useFilterBar: <U>(selector: (state: FilterBarState) => U) => U;
export declare const useHint: <U>(selector: (state: HintState) => U) => U;
export declare const useMatcher: <U>(selector: (state: MatcherState) => U) => U;
export declare const useOptions: <U>(selector: (state: OptionsState) => U) => U;
export declare const useArray: <U>(selector: (state: ArrayState) => U) => U;
export declare const useMatcherDrag: <U>(selector: (state: DragState<Matcher>) => U) => U;
export declare const useBrackets: <U>(selector: (state: BracketState) => U) => U;
export declare const useSort: <U>(selector: (state: SortState) => U) => U;
export declare const useSortDrag: <U>(selector: (state: DragState<Sort>) => U) => U;
export declare const useManaged: <U>(selector: (state: ManagedState) => U) => U;
