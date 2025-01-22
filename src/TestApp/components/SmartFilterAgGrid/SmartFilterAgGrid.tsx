import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  ColumnApi,
  GridApi,
  GridReadyEvent,
  IRowNode,
} from 'ag-grid-community';
import { FilterFunction, Matcher, Sort } from '@/types';
import Bond from '@/TestApp/types/Bond';
import { bonds } from '../../../../data/bonds';
import { columns, hintGroups, operators } from '@/stories/smartFilterFunctions';
import { SmartFilterAgGrid as SmartFilterAgGridCompoent } from '@/components';
import s from './style.module.less';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const hints = {
  hintGroups,
};

export const SmartFilterAgGrid = () => {
  const filterRef = React.useRef<FilterFunction | null>(null);
  const [gridApi, setGridApi] = React.useState<GridApi<Bond> | null>(null);
  const [columnApi, setColumnApi] = React.useState<ColumnApi | null>(null);
  const [rowData] = React.useState<Bond[]>(bonds);
  const [columnDefs] = React.useState<ColDef<Bond>[]>(columns);
  const [matchers, setMatchers] = React.useState<Matcher[]>([]);
  const [sort, setSort] = React.useState<Sort[]>([]);

  const queryParams = React.useMemo(() => {
    const query = window.location.search.substring(1);
    const params = query.split('&').filter((t) => t.trim() !== '');
    return params.reduce((p: any, v) => {
      const pv = v.split('=');
      return pv.length < 2 ? { ...p, [pv[0]]: true } : { ...p, [pv[0]]: pv[1] };
    }, {});
  }, []);

  const handleChange = React.useCallback(
    (newMatchers: Matcher[]) => {
      setMatchers(newMatchers);
    },
    [setMatchers],
  );

  const handleSortChange = React.useCallback(
    (newSort: Sort[]) => {
      setSort(newSort);
    },
    [setSort, columnApi],
  );

  const handleFilterChange = React.useCallback(
    (newFilter: FilterFunction | null) => {
      filterRef.current = newFilter;
      gridApi?.onFilterChanged();
    },
    [setSort, gridApi],
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
          matchers={matchers}
          onChange={handleChange}
          enableSort
          sort={sort}
          onSortChange={handleSortChange}
          onFiltersChange={handleFilterChange}
          operators={operators}
          hints={hints}
          size={size}
          allowLocking={!queryParams.noIcons}
          showSearchIcon={!queryParams.noIcons}
          showUndoIcon={!queryParams.noIcons}
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
