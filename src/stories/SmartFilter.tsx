import React from 'react';
import Bond, { columns, constructFilter, createFields, hintGroups, operators } from './smartFilterFunctions';
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
  sortHints?: true | string[];

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
  hintsPerColumn,
  hintWidth,
  sortHints,
  exampleHeight: height,
  exampleWidth: width,
  ...props
}: SmartFilterProps) => {
  const [rowData, setRowData] = React.useState<Bond[]>(bonds);
  const [columnDefs] = React.useState<ColDef<Bond>[]>(columns);
  const [matchers, setMatchers] = React.useState<Matcher[]>([]);

  const fields = React.useMemo(() => createFields(rowData), [rowData])

  //move fields here and when or use rowdata
  const handleChange = React.useCallback((
    newMatchers: Matcher[],
  ) => {
    setMatchers(newMatchers);
    const filter = constructFilter(newMatchers);
    setRowData(bonds.filter(b => !filter || filter(b)));
    if (onChange) {
      onChange(newMatchers);
    }
  }, [setMatchers]);

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
          fields={fields}
          operators={operators}
          hints={{
            hintsPerColumn,
            hintWidth,
            sortHints,
            hintGroups: hintGroups,
          }}
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
