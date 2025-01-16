import { SmartFilterProps } from './SmartFilterProps';
import { AgField } from './agField';
import { ColumnApi, GridApi } from './agGrid';

export type FilterFunction = (row: any) => boolean;

export type SmartFilterAgGridProps = Omit<SmartFilterProps, 'fields'> & {
  fields: AgField[];
  dateFormats?: string[]; // date formats to use when entering dates in the search
  displayDateFormat?: string;
  useExternalFilter?: boolean;
  onFiltersChange?: (filterFunction: FilterFunction | null) => void;
  gridApi: GridApi | null; // ag-grid api
  columnApi: ColumnApi | null; // ag-grid column api
};
