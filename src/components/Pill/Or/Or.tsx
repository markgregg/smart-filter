import React from 'react';
import { useConfig, useMatcher } from '@/state/useState';
import { AND } from '@/util/constants';
import { Matcher } from '@/types';
import { Colours } from '@/util/colours';
import { CloseButton } from '@/components/CloseButton';
import s from './style.module.less';

interface OrProps {
  matcher: Matcher;
}

export const Or = React.memo(({ matcher }: OrProps) => {
  const [mouseOver, setMouseOver] = React.useState<boolean>(false);
  const size = useConfig((state) => state.size) ?? 'normal';
  const { selectedMatcher, updateMatcher, copyMatchers } = useMatcher(
    (state) => state,
  );

  const backgroundColor = React.useMemo(
    () =>
      matcher.locked && !copyMatchers?.includes(matcher.key)
        ? Colours.backgrounds.locked
        : mouseOver
          ? Colours.backgrounds.hover
          : selectedMatcher?.key === matcher.key
            ? Colours.backgrounds.selected
            : copyMatchers?.includes(matcher.key)
              ? Colours.backgrounds.multiSelect
              : Colours.backgrounds.standard,
    [mouseOver, selectedMatcher, matcher, copyMatchers],
  );

  const handleMouseEnter = React.useCallback(() => {
    setMouseOver(true);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    setMouseOver(false);
  }, [setMouseOver]);

  const handleChangeToAnd = React.useCallback(() => {
    if (!matcher.locked) {
      updateMatcher({
        ...matcher,
        operator: AND,
      });
    }
  }, [matcher, updateMatcher]);

  return (
    <div
      className={[s.or, s[size]].join(' ')}
      style={{
        backgroundColor,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      or
      {mouseOver && !matcher.locked && (
        <CloseButton onClick={handleChangeToAnd} />
      )}
    </div>
  );
});
