import { FilterValueGetter } from '@/aggrid/ClientApi';

export interface RowNode {
  data: any | undefined;
}
export type ColumnPinnedType = 'left' | 'right' | boolean | null | undefined;

export interface ColumnState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aggFun?: string | ((params: any) => any) | null;
  sort?: 'asc' | 'desc' | null;
  sortIndex?: number | null;
  colId: string;
}

export interface ColumnStateParams {
  hide?: boolean | null;
  width?: number;
  flex?: number | null;
  sort?: 'asc' | 'desc' | null;
  sortIndex?: number | null;
  aggFunc?: string | (() => any) | null;
  pivot?: boolean | null;
  pivotIndex?: number | null;
  pinned?: ColumnPinnedType;
  rowGroup?: boolean | null;
  rowGroupIndex?: number | null;
}

export interface ApplyColumnStateParams {
  state?: ColumnState[];
  applyOrder?: boolean;
  defaultState?: ColumnStateParams;
}

export interface ColDef {
  aggFunc?: string | ((params: any) => any) | null;
  headerName?: string;
  colId?: string;
  field?: string;
  filter?: any;
  cellDataType?: boolean | string;
  filterValueGetter?: string | FilterValueGetter | undefined;
}

export interface Column {
  getColDef: () => ColDef;
}

export interface ColumnApi {
  getColumn: (column: string) => Column | null;
  getColumns: () => Column[] | null;
  getColumnState: () => ColumnState[];
  applyColumnState: (updateState: ApplyColumnStateParams) => boolean;
}

export interface GridApi {
  forEachNode: (
    callback: (rowNode: RowNode, index: number) => void,
    includeFooterNodes?: boolean,
  ) => void;
  forEachNodeAfterFilter: (
    callback: (rowNode: RowNode, index: number) => void,
  ) => void;
  setAdvancedFilterModel: (
    advancedFilterModel: AdvancedFilterModel | null,
  ) => void;
}

export type AdvancedFilterModel =
  | JoinAdvancedFilterModel
  | ColumnAdvancedFilterModel;
/** Represents a series of filter conditions joined together. */
export interface JoinAdvancedFilterModel {
  filterType: 'join';
  /** How the conditions are joined together */
  type: 'AND' | 'OR';
  /** The filter conditions that are joined by the `type` */
  conditions: AdvancedFilterModel[];
}
/** Represents a single filter condition on a column */
export type ColumnAdvancedFilterModel =
  | TextAdvancedFilterModel
  | NumberAdvancedFilterModel
  | BooleanAdvancedFilterModel
  | DateAdvancedFilterModel
  | DateStringAdvancedFilterModel
  | ObjectAdvancedFilterModel;
export type TextAdvancedFilterModelType =
  | 'equals'
  | 'notEqual'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'blank'
  | 'notBlank';
export type ScalarAdvancedFilterModelType =
  | 'equals'
  | 'notEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'blank'
  | 'notBlank';
export type BooleanAdvancedFilterModelType = 'true' | 'false';
/** Represents a single filter condition for a text column */
export interface TextAdvancedFilterModel {
  filterType: 'text';
  /** The ID of the column being filtered. */
  colId: string;
  /** The filter option that is being applied. */
  type: TextAdvancedFilterModelType;
  /** The value to filter on. This is the same value as displayed in the input. */
  filter?: string;
}
/** Represents a single filter condition for a number column */
export interface NumberAdvancedFilterModel {
  filterType: 'number';
  /** The ID of the column being filtered. */
  colId: string;
  /** The filter option that is being applied. */
  type: ScalarAdvancedFilterModelType;
  /** The value to filter on. */
  filter?: number;
}
/** Represents a single filter condition for a date column */
export interface DateAdvancedFilterModel {
  filterType: 'date';
  /** The ID of the column being filtered. */
  colId: string;
  /** The filter option that is being applied. */
  type: ScalarAdvancedFilterModelType;
  /** The value to filter on. This is in format `YYYY-MM-DD`. */
  filter?: string;
}
/** Represents a single filter condition for a date string column */
export interface DateStringAdvancedFilterModel {
  filterType: 'dateString';
  /** The ID of the column being filtered. */
  colId: string;
  /** The filter option that is being applied. */
  type: ScalarAdvancedFilterModelType;
  /** The value to filter on. This is in format `YYYY-MM-DD`. */
  filter?: string;
}
/** Represents a single filter condition for a boolean column */
export interface BooleanAdvancedFilterModel {
  filterType: 'boolean';
  /** The ID of the column being filtered. */
  colId: string;
  /** The filter option that is being applied. */
  type: BooleanAdvancedFilterModelType;
}
/** Represents a single filter condition for an object column */
export interface ObjectAdvancedFilterModel {
  filterType: 'object';
  /** The ID of the column being filtered. */
  colId: string;
  /** The filter option that is being applied. */
  type: TextAdvancedFilterModelType;
  /** The value to filter on. This is the same value as displayed in the input. */
  filter?: string;
}
