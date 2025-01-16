import React from 'react';
import { MdAddBox } from 'react-icons/md';
import { BiSort } from 'react-icons/bi';
import { useConfig, useMatcher, useSort } from '@/state/useState';
import { Tooltip } from '@/components/common/Tooltip';
import { Field } from '@/types';
import {
  createValue,
  getDefaultComparison,
  getDefaultTextValue,
  ignoreCaseCompare,
} from '@/util/functions';
import { FieldOption } from './FieldOption';
import { SortOption } from './SortOption';
import { SortDirection } from '@/types/sort';
import s from './style.module.less';
interface FieldSelectionProps {
  showSort?: boolean;
}

export const FieldSelection = React.memo(
  ({ showSort }: FieldSelectionProps) => {
    const [filter, setFilter] = React.useState<string>('');
    const [showFields, setShowFields] = React.useState<boolean>(false);
    const { fieldMap, fields, enableSort, size = 'normal', hints: { sortHints = undefined } = {} } = useConfig(
      (state) => state,
    );
    const { addValue, editPosition } = useMatcher((state) => state);
    const { updateSort } = useSort((state) => state);

    const filteredFields = React.useMemo(
      () =>
        fields.filter(
          (f) =>
            (!showSort ||
              enableSort ||
              (enableSort && sortHints && sortHints.includes(f.name))) &&
            ignoreCaseCompare(f.title, filter),
        ),
      [fields, filter],
    );

    const handleShowFields = React.useCallback(() => {
      setShowFields(true);
    }, [setShowFields]);

    const handleHideFields = React.useCallback(() => {
      setShowFields(false);
      setFilter('');
    }, [setShowFields, setFilter]);

    const addMatcher = React.useCallback(
      (field: Field) => {
        const { text, value } = getDefaultTextValue(field);
        const matcher = createValue({
          field: field.name,
          text,
          value,
        });
        if (!showSort) {
          addValue({
            fieldMap,
            value: matcher,
            position: editPosition,
            comparison: getDefaultComparison(field),
            dontAppend: true,
          });
        }
        setShowFields(false);
        setFilter('');
      },
      [editPosition, addValue],
    );

    const handleAddMatcher = React.useCallback(
      (field: Field) => {
        addMatcher(field);
      },
      [addMatcher],
    );

    const handleAddSort = React.useCallback(
      (field: string, sortDirection: SortDirection) => {
        updateSort(field, sortDirection);
      },
      [updateSort],
    );

    const handleChanged = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.currentTarget.value);
      },
      [setFilter],
    );

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && filteredFields.length > 0 && !showSort) {
          addMatcher(filteredFields[0]);
        }
      },
      [addMatcher, filteredFields],
    );

    return (
      <div className={s.fieldSelection} onMouseLeave={handleHideFields}>
        <Tooltip caption={showSort ? 'Add Sort Field' : 'Add Field'}>
          <div className={[s.addFieldIcon, s[`icon-${size}`]].join(' ')} onMouseEnter={handleShowFields}>
            {showSort ? <BiSort /> : <MdAddBox />}
          </div>
        </Tooltip>
        {showFields && (
          <div className={[s.filterSelectionPopup, s[size]].join(' ')}>
            <div className={s.title}>
              {showSort ? 'Sort Fields' : 'Fields'}
            </div>
            <div className={s.filter}>
              <label htmlFor="fields-filter">
                Filter:
                <input
                  id="fields-filter"
                  value={filter}
                  onChange={handleChanged}
                  onKeyDown={handleKeyDown}
                />
              </label>
            </div>
            <div className={s.fields}>
              {filteredFields.map((f) =>
                showSort ? (
                  <SortOption key={f.name} field={f} onSelect={handleAddSort} />
                ) : (
                  <FieldOption
                    key={f.name}
                    field={f}
                    onSelect={handleAddMatcher}
                  />
                ),
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);
