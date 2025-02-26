import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  ColumnApi,
  GridApi,
  GridReadyEvent,
  IRowNode,
} from 'ag-grid-community';
import { FilterFunction, Matcher } from '@/types';
import Bond, {
  columns,
  hintGroups,
  operators,
  pasteOptions,
  bonds,
  agFields,
} from '@/stories/smartFilterFunctions';
import { deterministicTestData } from '../../../../data/bonds';
import { SmartFilterAgGrid as SmartFilterAgGridCompoent } from '@/components';
import { getQueryParams } from '@/TestApp/functions';
import s from './style.module.less';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const hints = {
  hintGroups,
};

export const SmartFilterAgGrid = () => {
  const queryParams = getQueryParams();
  const bondData = React.useMemo(
    () => (queryParams.automation ? deterministicTestData : bonds),
    [queryParams.automation],
  );
  const filterRef = React.useRef<FilterFunction | null>(null);
  const [gridApi, setGridApi] = React.useState<GridApi<Bond> | null>(null);
  const [columnApi, setColumnApi] = React.useState<ColumnApi | null>(null);
  const [rowData] = React.useState<Bond[]>(bondData);
  const [columnDefs] = React.useState<ColDef<Bond>[]>(columns);
  const [matchers, setMatchers] = React.useState<Matcher[]>([]);

  const handleChange = React.useCallback(
    (newMatchers: Matcher[]) => {
      setMatchers(newMatchers);
    },
    [setMatchers],
  );

  const handleFilterChange = React.useCallback(
    (newFilter: FilterFunction | null) => {
      filterRef.current = newFilter;
      gridApi?.onFilterChanged();
    },
    [gridApi],
  );

  const handleGridReady = (event: GridReadyEvent<Bond>) => {
    setGridApi(event.api);
    setColumnApi(event.columnApi);
  };

  const isExternalFilterPresent = React.useCallback(
    (): boolean => filterRef.current !== null,
    [],
  );

  const doesExternalFilterPass = React.useCallback(
    (node: IRowNode<Bond>): boolean =>
      filterRef.current !== null && filterRef.current(node),
    [],
  );

  const style = queryParams.width
    ? { width: `${queryParams.width}px` }
    : undefined;

  const size = queryParams.size ?? 'normal';

  return (
    <div className={s.smartFilterAgGridPage}>
      <h4>Smart Filter AgGrid</h4>
      <div className={s.filterBar} style={style}>
        <SmartFilterAgGridCompoent
          fields={agFields}
          matchers={matchers}
          onChange={handleChange}
          onFiltersChange={handleFilterChange}
          operators={operators}
          hints={hints}
          size={size}
          allowLocking={!queryParams.noIcons}
          showUndoIcon={!queryParams.noIcons}
          pasteOptions={pasteOptions}
          returnAllOptions
          gridApi={gridApi}
          columnApi={columnApi}
        />
      </div>
      <div id="sf-ag-grid" className={[s.grid, 'ag-theme-alpine'].join(' ')}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          onGridReady={handleGridReady}
          isExternalFilterPresent={isExternalFilterPresent}
          doesExternalFilterPass={doesExternalFilterPass}
        />
      </div>
    </div>
  );
};
