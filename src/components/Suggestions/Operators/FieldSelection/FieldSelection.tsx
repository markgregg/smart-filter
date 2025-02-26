import React from 'react';
import { MdAddBox } from 'react-icons/md';
import { useConfig, useMatcher } from '@/state/useState';
import { Tooltip } from '@/components/common/Tooltip';
import { Field } from '@/types';
import {
  createValue,
  getDefaultComparison,
  ignoreCaseCompare,
} from '@/util/functions';
import { FieldOption } from './FieldOption';
import s from './style.module.less';

export const FieldSelection = React.memo(() => {
  const [filter, setFilter] = React.useState<string>('');
  const [showFields, setShowFields] = React.useState<boolean>(false);
  const { fields, size = 'normal' } = useConfig((state) => state);
  const { addValue, editPosition } = useMatcher((state) => state);

  const filteredFields = React.useMemo(
    () => fields.filter((f) => f.title && ignoreCaseCompare(f.title, filter)),
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
      const matcher = createValue({
        field: field.name,
        text: '',
        value: null,
      });
      addValue({
        value: matcher,
        position: editPosition,
        comparison: getDefaultComparison(field),
        dontAppend: true,
      });
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

  const handleChanged = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilter(event.currentTarget.value);
    },
    [setFilter],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && filteredFields.length > 0) {
        addMatcher(filteredFields[0]);
      }
    },
    [addMatcher, filteredFields],
  );

  return (
    <div className={s.fieldSelection} onMouseLeave={handleHideFields}>
      <Tooltip caption="Add Field">
        <div
          id="sf-filter-selection-button"
          className={[s.addFieldIcon, s[`icon-${size}`]].join(' ')}
          style={{
            backgroundColor: showFields ? '#DDDDDD' : undefined,
          }}
          onMouseEnter={handleShowFields}
        >
          <MdAddBox />
        </div>
      </Tooltip>
      {showFields && (
        <div className={[s.filterSelectionPopup, s[size]].join(' ')}>
          <div className={s.title}>Fields</div>
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
            {filteredFields.map((f) => (
              <FieldOption key={f.name} field={f} onSelect={handleAddMatcher} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
