import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  ColumnApi,
  GridApi,
  GridReadyEvent,
  IRowNode,
} from 'ag-grid-community';
import Bond, {
  columns,
  hintGroups,
  operators,
  pasteOptions,
  bonds,
  agFields,
} from './smartFilterFunctions';
import {
  FilterFunction,
  Matcher,
  SmartFilterAgGrid as SmartFilterAgGridComponent,
} from '..';
import { FilterBarSize } from '@/types/uiProperties';
import s from './style.module.less';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export interface SmartFilterAgGridProps {
  /* Example width */
  exampleWidth?: number;
  /* Example height */
  exampleHeight?: number;

  /* size of the filter */
  size?: FilterBarSize;

  /* change notifier for matchers */
  onChange?: (matchers: Matcher[]) => void;

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

  /* if true pills can be locked */
  allowLocking?: boolean;

  /* used only in options state */
  debounce?: number;
  /* number of items to jump when page down/up pressed */
  pageSize?: number;

  /* if true the undo icon is shown */
  showUndoIcon?: boolean;
  /* maxium pill width */
  maxValueWidth?: number;

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

  onFiltersChange: (filterFunction: FilterFunction | null) => void;

  /* return all values, not just the filtered rows */
  returnAllOptions?: boolean;
  dateFormats?: string[];
  displayDateFormat?: string;
}

/** Primary UI component for user interaction */
export const SmartFilterAgGrid: React.FC<SmartFilterAgGridProps> = ({
  onChange,
  onFiltersChange,
  hintsPerColumn,
  hintWidth,
  exampleHeight: height = 800,
  exampleWidth: width = 1000,
  size = 'normal',
  showDropdownOnMouseOver = true,
  ...props
}: SmartFilterAgGridProps) => {
  const filterRef = React.useRef<FilterFunction | null>(null);
  const [gridApi, setGridApi] = React.useState<GridApi<Bond> | null>(null);
  const [columnApi, setColumnApi] = React.useState<ColumnApi | null>(null);
  const [rowData] = React.useState<Bond[]>(bonds);
  const [columnDefs] = React.useState<ColDef<Bond>[]>(columns);
  const [matchers, setMatchers] = React.useState<Matcher[]>([]);

  const hints = React.useMemo(
    () => ({
      hintsPerColumn,
      hintWidth,
      hintGroups,
    }),
    [hintsPerColumn, hintWidth],
  );

  const handleChange = React.useCallback(
    (newMatchers: Matcher[]) => {
      setMatchers(newMatchers);
      if (onChange) {
        onChange(newMatchers);
      }
    },
    [setMatchers, onChange],
  );

  const handleFilterChange = React.useCallback(
    (newFilter: FilterFunction | null) => {
      filterRef.current = newFilter;
      gridApi?.onFilterChanged();
      if (onFiltersChange) {
        onFiltersChange(newFilter);
      }
    },
    [gridApi, onFiltersChange],
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

  return (
    <div
      className={s.storybookSmartFilterPage}
      style={{
        width,
        height,
      }}
    >
      <div className={s.filterBar}>
        <SmartFilterAgGridComponent
          fields={agFields}
          matchers={matchers}
          onChange={handleChange}
          onFiltersChange={handleFilterChange}
          operators={operators}
          hints={hints}
          size={size}
          showDropdownOnMouseOver={showDropdownOnMouseOver}
          gridApi={gridApi}
          columnApi={columnApi}
          pasteOptions={pasteOptions}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
        />
      </div>
      <div className={[s.grid, 'ag-theme-alpine'].join(' ')}>
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
