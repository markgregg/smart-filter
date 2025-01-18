import React from 'react';
import { HintGroup } from './HintGroup';
import { HintItems } from './HintItems';
import { useConfig, useHint, useMatcher } from '@/state/useState';
import s from './style.module.less';

export const Hints = React.memo(() => {
  const hints = useConfig((state) => state.hints);
  const { selectedHintGroup, selectHintGroup, clearSelection } = useHint((state) => state);
  const selectedMatcher = useMatcher((state) => state.selectedMatcher);

  React.useEffect(() => {
    if (selectedMatcher && 'field' in selectedMatcher) {
      const group = hints?.hintGroups.find(
        (g) => g.field === selectedMatcher.field,
      );
      if (group) {
        selectHintGroup(group.title);
        return;
      }
    }
    clearSelection();
  }, [selectedMatcher, hints, clearSelection, selectHintGroup]);

  const hintGroup = React.useMemo(
    () => hints?.hintGroups.find((g) => g.title === selectedHintGroup),
    [selectedHintGroup, hints],
  );

  return (
    <div className={s.hints}>
      <div className={s.hintGroups}>
        {hintGroup ? (
          <HintGroup
            title={hintGroup.title}
            hints={hintGroup.hints.length}
            selected
          />
        ) : (
          hints?.hintGroups.map((h) => (
            <HintGroup key={h.title} title={h.title} hints={h.hints.length} />
          ))
        )}
      </div>
      <div className={s.hintItems}>
        {hintGroup ? (
          <HintItems
            field={hintGroup.field}
            hintSource={hintGroup.hints}
            showAll
          />
        ) : (
          hints?.hintGroups.map((h) => (
            <HintItems field={h.field} key={h.title} hintSource={h.hints} />
          ))
        )}
      </div>
    </div>
  );
});
