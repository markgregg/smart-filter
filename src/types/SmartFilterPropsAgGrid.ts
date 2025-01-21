import { SmartFilterProps } from './SmartFilterProps';
import { AgField } from './agField';
import { ColumnApi, GridApi } from './agGrid';

export type FilterFunction = (row: any) => boolean;

export type SmartFilterAgGridProps = Omit<SmartFilterProps, 'fields'> & {
  /* field overrides */
  fields?: AgField[];
  /* the date format to use for values */
  dateFormats?: string[]; // date formats to use when entering dates in the search
  /* the format to use for dates in pills */
  displayDateFormat?: string;
  /* if true all matching options are returned, not just those selected */
  returnAllOptions?: boolean;
  /* change event for filters */
  onFiltersChange?: (filterFunction: FilterFunction | null) => void;
  /* ag-grid api */
  gridApi: GridApi | null;
  /* ag-grid column api */
  columnApi: ColumnApi | null;
};
