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
} from './smartFilterFunctions';
import { Matcher, SmartFilter as SmartFilterComponent } from '..';
import { FilterBarSize } from '@/types/uiProperties';
import s from './style.module.less';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export interface SmartFilterProps {
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
}

const fields = getFields(bonds);
/** Primary UI component for user interaction */
export const SmartFilter: React.FC<SmartFilterProps> = ({
  onChange,
  hintsPerColumn,
  hintWidth,
  exampleHeight: height = 800,
  exampleWidth: width = 1000,
  size = 'normal',
  showDropdownOnMouseOver = true,
  ...props
}: SmartFilterProps) => {
  const [rowData, setRowData] = React.useState<Bond[]>(bonds);
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

  React.useEffect(() => {
    const filterFunc = constructFilter(matchers);
    const newData = bonds.filter((b) => !filterFunc || filterFunc(b));
    setRowData(newData);
  }, [matchers, setRowData]);

  return (
    <div
      className={s.storybookSmartFilterPage}
      style={{
        width,
        height,
      }}
    >
      <div className={s.filterBar}>
        <SmartFilterComponent
          matchers={matchers}
          onChange={handleChange}
          fields={fields}
          operators={operators}
          size={size}
          hints={hints}
          showDropdownOnMouseOver={showDropdownOnMouseOver}
          pasteOptions={pasteOptions}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
        />
      </div>
      <div className={[s.grid, 'ag-theme-alpine'].join(' ')}>
        <AgGridReact rowData={rowData} columnDefs={columnDefs} />
      </div>
    </div>
  );
};
