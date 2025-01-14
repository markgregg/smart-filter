import { FilterFunction } from '@/aggrid/agGridApi';
import { SmartFilterProps } from './SmartFilterProps';
import { AgField } from './agField';
import { ColumnApi, GridAPi } from './agGrid';

export type SmartFilterAgGridProps = Omit<SmartFilterProps, 'fields'> & {
  fields: AgField[];
  dateFormats?: string[]; // date formats to use when entering dates in the search
  displayDateFormat?: string;
  useExternalFilter?: boolean;
  onFiltersChanged?: (filterFunction: FilterFunction | null) => void;
  gridApi: GridAPi | null; // ag-grid api
  columnApi: ColumnApi | null; // ag-grid column api
};
