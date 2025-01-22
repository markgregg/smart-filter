import { Sort, SortDirection } from '../sort';
import { DROP_POSITION } from './drag';

export interface SortState {
  sort: Sort[];
  active: boolean;
  setSort: (sort: Sort[]) => void;
  updateSort: (field: string, sortDirection: SortDirection) => void;
  removeSort: (field: string) => void;
  clearSort: () => void;
  setActive: (value: boolean) => void;
  moveTo: (from: number, to: number, position: DROP_POSITION) => void;
  moveUp: (index: number) => void;
  moveDown: (index: number) => void;
}
