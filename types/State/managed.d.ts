import { Matcher } from '../matcher';
import { Sort } from '../sort';

export interface ManagedState {
    matchers?: Matcher[];
    sort?: Sort[];
}
