import { Matcher } from '../matcher';

export interface ManagedState {
    matchers?: Matcher[];
    locked?: boolean;
}
