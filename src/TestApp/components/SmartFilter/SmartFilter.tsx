import React from 'react';
import Bond, { columns, constructFilter, constructSort, fields, hintGroups, operators } from '@/stories/smartFilterFunctions';
import { Matcher, SmartFilter as SmartFilterComponent, Sort } from '../../../';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { bonds } from '../../../../data/bonds';
import s from './style.module.less';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const hints = {
  hintGroups: hintGroups,
}

export const SmartFilter = () => {
  const [rowData, setRowData] = React.useState<Bond[]>(bonds);
  const [columnDefs] = React.useState<ColDef<Bond>[]>(columns);
  const [matchers, setMatchers] = React.useState<Matcher[]>([]);
  const [sort, setSort] = React.useState<Sort[]>([]);

  const queryParams = React.useMemo(() => {
    const query = window.location.search.substring(1);
    const params = query.split("&").filter(t => t.trim() !== '');
    return params.reduce((p: any, v) => {
      const pv = v.split('=');
      return pv.length < 2
        ? { ...p, [pv[0]]: true }
        : { ...p, [pv[0]]: pv[1] }
    }, {});
  }, []);

  const handleChange = React.useCallback((
    newMatchers: Matcher[],
  ) => {
    setMatchers(newMatchers);
  }, [setMatchers]);

  const handleSortChange = React.useCallback((
    newSort: Sort[],
  ) => {
    setSort(newSort);
  }, [setSort]);

  React.useEffect(() => {
    const filterFunc = constructFilter(matchers);
    const newData = bonds.filter(b => !filterFunc || filterFunc(b));
    const sortFunc = constructSort(sort);
    if (sortFunc) {
      newData.sort(sortFunc);
    }
    setRowData(newData);
  }, [sort, matchers, setRowData]);

  const style = queryParams.width
    ? { width: `${queryParams.width}px` }
    : undefined;

  const size = queryParams.size ?? 'normal';

  return (
    <div
      className={s.smartFilterPage}
    >
      <h4>Smart Filter</h4>
      <div
        className={s.filterBar}
        style={style}
      >
        <SmartFilterComponent
          matchers={matchers}
          onChange={handleChange}
          sort={sort}
          onSortChange={handleSortChange}
          fields={fields}
          operators={operators}
          hints={hints}
          size={size}
          enableSort
          allowLocking={!queryParams.noIcons}
          showSearchIcon={!queryParams.noIcons}
          showUndoIcon={!queryParams.noIcons}
        />
      </div>
      <div className={[s.grid, 'ag-theme-alpine'].join(' ')}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
        />
      </div>
    </div>
  );
}
