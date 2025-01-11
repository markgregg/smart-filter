import { AdvancedFilterModel, ApplyColumnStateParams, ColumnApi, GridAPi } from "@/types/agGrid";

export type FilterValueGetter = (params: any) => any | null | undefined;

export interface AgRowNode<TData extends object> {
  data: TData | undefined;
}

export type FilterFunction = (row: any) => boolean;

const getApi = (
  gridAp: GridAPi | null,
  columnApi: ColumnApi | null,
): GridAPi | ColumnApi | null => columnApi ?? gridAp;

export const getColumns = (
  gridApi: GridAPi | null,
  columnApi: ColumnApi | null,
) => {
  const api = getApi(gridApi, columnApi);

  if (!api) {
    return [];
  }
  return api.getColumns();
}

export const getColumn = (
  column: string,
  gridApi: GridAPi | null,
  columnApi: ColumnApi | null,
) => {
  const api = getApi(gridApi, columnApi);

  if (!api) {
    return null;
  }
  return api.getColumn(column);
}

export const getColumnState = (
  gridApi: GridAPi | null,
  columnApi: ColumnApi | null,
) => {
  const api = getApi(gridApi, columnApi);

  if (!api) {
    return null;
  }
  return api.getColumnState();
}

export const applyColumnState = (
  columnState: ApplyColumnStateParams,
  gridApi: GridAPi | null,
  columnApi: ColumnApi | null,
) => {
  const api = getApi(gridApi, columnApi);

  if (!api) {
    return;
  }
  return api.applyColumnState(columnState);
}

export const setAdvancedFilterModel = (
  filter: AdvancedFilterModel | null,
  gridApi: GridAPi | null,
) => {
  if (!gridApi) {
    return;
  }
  return gridApi.setAdvancedFilterModel(filter);
}