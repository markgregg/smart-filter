import React from 'react';
import { MdAddBox } from 'react-icons/md';
import { useConfig, useMatcher } from '@/state/useState';
import { Tooltip } from '@/components/common/Tooltip';
import { Field } from '@/types';
import {
  createValue,
  getDefaultComparison,
  getDefaultTextValue,
  ignoreCaseCompare,
} from '@/util/functions';
import s from './style.module.less';

export const FieldSelection = React.memo(() => {
  const [filter, setFilter] = React.useState<string>('');
  const [showFields, setShowFields] = React.useState<boolean>(false);
  const fields = useConfig((state) => state.fields);
  const { addValue, editPosition } = useMatcher((state) => state);

  const filteredFields = React.useMemo(
    () => fields.filter((f) => ignoreCaseCompare(f.title, filter)),
    [fields, filter],
  );

  const handleShowFields = React.useCallback(() => {
    setShowFields(true);
  }, [setShowFields]);

  const handleHideFields = React.useCallback(() => {
    setShowFields(false);
    setFilter('');
  }, [setShowFields, setFilter]);

  const addMatcher = (field: Field) => {
    const { text, value } = getDefaultTextValue(field);
    const matcher = createValue({
      field: field.name,
      text,
      value,
    });
    addValue({
      value: matcher,
      position: editPosition,
      comparison: getDefaultComparison(field),
      dontAppend: true,
    });
    setShowFields(false);
    setFilter('');
  };

  const handleAddMatcher = React.useCallback(
    (event: React.MouseEvent, field: Field) => {
      addMatcher(field);
      event.stopPropagation();
    },
    [addMatcher]);

  const handleChanged = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilter(event.currentTarget.value);
    },
    [setFilter]);

  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && filteredFields.length > 0) {
      addMatcher(filteredFields[0]);
    }
  }, [addMatcher, filteredFields]);

  return (
    <div className={s.fieldSelection}>
      <Tooltip caption="Add field">
        <div className={s.addFieldIcon} onMouseEnter={handleShowFields}>
          <MdAddBox />
        </div>
      </Tooltip>
      {showFields && (
        <div className={s.filterSelectionPopup} onMouseLeave={handleHideFields}>
          <div className={s.filter}>
            <input
              value={filter}
              onChange={handleChanged}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className={s.fields}>
            {filteredFields.map((f) => (
              <div
                className={s.field}
                key={f.name}
                onClick={(e) => handleAddMatcher(e, f)}
              >
                {f.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
