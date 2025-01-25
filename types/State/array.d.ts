import { ArrayMatcher } from '../matcher';

export interface ArrayState {
    index: number | null;
    matcher: ArrayMatcher | null;
    selectedIndex: number | null;
    setMatcher: (matcher: ArrayMatcher | null) => void;
    selectItem: (selectedIndex: number | null) => void;
    next: () => void;
    prev: () => void;
    nextPage: () => void;
    prevPage: () => void;
    first: () => void;
    last: () => void;
}
