import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import Bond, {
  columns,
  constructFilter,
  hintGroups,
  operators,
  pasteOptions,
  bonds,
  getFields,
} from '@/stories/smartFilterFunctions';
import { Matcher, SmartFilter as SmartFilterComponent } from '../../..';
import { getQueryParams } from '@/TestApp/functions';
import { deterministicTestData } from '../../../../data/bonds';
import s from './style.module.less';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const hints = {
  hintGroups,
};

export const SmartFilter = () => {
  const queryParams = getQueryParams();
  const bondData = React.useMemo(
    () => (queryParams.automation ? deterministicTestData : bonds),
    [queryParams.automation],
  );
  const [rowData, setRowData] = React.useState<Bond[]>(bondData);
  const [columnDefs] = React.useState<ColDef<Bond>[]>(columns);
  const [matchers, setMatchers] = React.useState<Matcher[]>([]);

  const fields = React.useMemo(() => getFields(bondData), [bondData]);

  const handleChange = React.useCallback(
    (newMatchers: Matcher[]) => {
      setMatchers(newMatchers);
    },
    [setMatchers],
  );

  React.useEffect(() => {
    const filterFunc = constructFilter(matchers);
    const newData = bondData.filter((b) => !filterFunc || filterFunc(b));
    setRowData(newData);
  }, [bondData, matchers, setRowData]);

  const style = queryParams.width
    ? { width: `${queryParams.width}px` }
    : undefined;

  const size = queryParams.size ?? 'normal';

  return (
    <div className={s.smartFilterPage}>
      <h4>Smart Filter</h4>
      <div className={s.filterBar} style={style}>
        <SmartFilterComponent
          matchers={matchers}
          onChange={handleChange}
          fields={fields}
          operators={operators}
          hints={hints}
          size={size}
          allowLocking={!queryParams.noIcons}
          showUndoIcon={!queryParams.noIcons}
          pasteOptions={pasteOptions}
        />
      </div>
      <div className={[s.grid, 'ag-theme-alpine'].join(' ')}>
        <AgGridReact rowData={rowData} columnDefs={columnDefs} />
      </div>
    </div>
  );
};
