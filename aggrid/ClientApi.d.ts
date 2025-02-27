import { Column, ColumnApi, GridApi } from '../../../../../../src/types/agGrid';
import { FieldMatch, Matcher, FilterFunction } from '..';

export type FilterValueGetter = (params: any) => any | null | undefined;
export interface ClientApi {
    getAgColumn: (column: string) => Column | null;
    getAgColumns: () => Column[] | null;
    constructFilter: (matchers: Matcher[]) => FilterFunction | null;
    getFieldMatch: (field?: string, type?: string | boolean, filter?: string, dateFormats?: string[], displayFormat?: string, filterValueGetter?: FilterValueGetter, returnAllOptions?: boolean, maxOptions?: number, lookup?: true) => FieldMatch;
    findUniqueHintValues: (column: Column | null, maxUniqueValues?: number, filterValueGetter?: FilterValueGetter) => string[];
}
export declare const createClientApi: (gridApi: GridApi | null, columnApi: ColumnApi | null) => ClientApi | null;
