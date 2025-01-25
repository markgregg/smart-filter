import { SmartFilterProps } from './SmartFilterProps';
import { AgField } from './agField';
import { ColumnApi, GridApi } from './agGrid';

export type FilterFunction = (row: any) => boolean;
export type SmartFilterAgGridProps = Omit<SmartFilterProps, 'fields'> & {
    fields?: AgField[];
    dateFormats?: string[];
    displayDateFormat?: string;
    returnAllOptions?: boolean;
    onFiltersChange?: (filterFunction: FilterFunction | null) => void;
    gridApi: GridApi | null;
    columnApi: ColumnApi | null;
};
