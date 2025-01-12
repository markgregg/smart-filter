import { Sort, SortDirection } from '../sort';

export interface SortState {
  sort: Sort[];
  active: boolean;
  updateSort: (field: string, sortDirection: SortDirection) => void;
  removeSort: (field: string) => void;
  clearSort: () => void;
  setActive: (value: boolean) => void;
}
