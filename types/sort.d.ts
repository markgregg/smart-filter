export type SortDirection = 'asc' | 'desc';
export interface Sort {
    field: string;
    sortDirection: SortDirection;
}
