import React from 'react';
import Bond, { columns, constructFilter, constructSort, createFields, hintGroups, operators } from './smartFilterFunctions';
import { Matcher, SmartFilter as SmartFilterComponent, Sort } from '../';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { bonds } from '../../data/bonds';
import s from './SmartFilter.module.less';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export interface SmartFilterProps {
  /* Example width */
  exampleWidth?: number;
  /* Example height */
  exampleHeight?: number;

  /* change notifier for matchers */
  onChange?: (matchers: Matcher[]) => void;

  /* if sorting is allow */
  enableSort?: boolean;
  /* sort change notifier */
  onSortChange?: (sort: Sort[]) => void;

  /* matcher clear notifier */
  onClear?: () => void;
  /* lock toggle notifier */
  onLock?: (locked: boolean) => void;
  /* expand toggle notifier */
  onExpand?: (expanded: boolean) => void;

  /* number of hints per column */
  hintsPerColumn?: number;
  /* width of hints */
  hintWidth?: number;
  /* true show all fields or specify which fields */
  sortHints?: string[];

  /* if true pills can be locked */
  allowLocking?: boolean;

  /* used only in options state */
  debounce?: number;
  /* number of items to jump when page down/up pressed*/
  pageSize?: number;

  /* number of lines to expand the fitler bar */
  expandedLines?: number;
  /* if ture search icon is shown */
  showSearchIcon?: boolean;
  /* if true the undo icon is shown */
  showUndoIcon?: boolean;
  /* hight of the filter bar. Defaults to 30px */
  filterBarHeight?: number;

  /* height of pills. Defaults to 22px */
  pillHeight?: number;
  /* maxium pill width */
  maxValueWidth?: number;
  /* maxium width of the sort pill. Defaults to 90px */
  sortPillWidth?: number;

  /* max height of the dropdown */
  maxDropdownHeight?: number;
  /* max width of the dropdown */
  dropdownWidth?: number;
  /* width of option text in dropdown */
  optionWidth?: number;
  /* If true dropdown is only shown when the mouse enters the control */
  showDropdownOnMouseOver?: boolean;

  /* placeholder for the search input */
  placeholder?: string;
}

/** Primary UI component for user interaction */
export const SmartFilter: React.FC<SmartFilterProps> = ({
  onChange,
  onSortChange,
  hintsPerColumn,
  hintWidth,
  sortHints,
  exampleHeight: height,
  exampleWidth: width,
  showDropdownOnMouseOver = true,
  ...props
}: SmartFilterProps) => {
  const [rowData, setRowData] = React.useState<Bond[]>(bonds);
  const [columnDefs] = React.useState<ColDef<Bond>[]>(columns);
  const [matchers, setMatchers] = React.useState<Matcher[]>([]);
  const [sort, setSort] = React.useState<Sort[]>([]);
  const fields = React.useMemo(() => createFields(rowData), [rowData])

  const handleChange = React.useCallback((
    newMatchers: Matcher[],
  ) => {
    setMatchers(newMatchers);
    if (onChange) {
      onChange(newMatchers);
    }
  }, [setMatchers, setRowData]);

  const handleSortChange = React.useCallback((
    newSort: Sort[],
  ) => {
    setSort(newSort);
    if (onSortChange) {
      onSortChange(newSort);
    }
  }, [setSort, setRowData]);

  React.useEffect(() => {
    const filterFunc = constructFilter(matchers);
    const newData = bonds.filter(b => !filterFunc || filterFunc(b));
    const sortFunc = constructSort(sort);
    if (sortFunc) {
      newData.sort(sortFunc);
    }
    setRowData(newData);
  }, [sort, matchers, setRowData]);

  return (
    <div
      className={s.storybookSmartFilterPage}
      style={{
        width,
        height
      }}
    >
      <div className={s.filterBar}>
        <SmartFilterComponent
          matchers={matchers}
          onChange={handleChange}
          sort={sort}
          onSortChange={handleSortChange}
          fields={fields}
          operators={operators}
          hints={{
            hintsPerColumn,
            hintWidth,
            sortHints,
            hintGroups: hintGroups,
          }}
          showDropdownOnMouseOver={showDropdownOnMouseOver}
          {...props}
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
