import React from 'react';
import { IoClose } from 'react-icons/io5';
import { useConfig, useMatcher } from '@/state/useState';
import { Button } from '@/components/common/Button';
import { AND } from '@/util/constants';
import { Matcher } from '@/types';
import { Colours } from '@/util/colours';
import s from './style.module.less';

interface OrProps {
  matcher: Matcher;
}

export const Or = React.memo(({ matcher }: OrProps) => {
  const [mouseOver, setMouseOver] = React.useState<boolean>(false);
  const [showDelete, setShowDelete] = React.useState<boolean>(false);
  const pillHeight = useConfig((state) => state.pillHeight);
  const { selectedMatcher, updateMatcher } = useMatcher((state) => state);

  const backgroundColor = React.useMemo(
    () =>
      selectedMatcher?.key === matcher.key
        ? mouseOver
          ? Colours.backgrounds.hover
          : Colours.backgrounds.selected
        : matcher.locked
          ? Colours.backgrounds.locked
          : mouseOver
            ? Colours.backgrounds.hover
            : Colours.backgrounds.standard,
    [mouseOver, selectedMatcher, matcher],
  );

  const handleMouseEnter = React.useCallback(() => {
    setMouseOver(true);
    setShowDelete(true);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    setMouseOver(false);
    setShowDelete(false);
  }, [setMouseOver, setShowDelete]);

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
      className={s.or}
      style={{
        height: pillHeight,
        backgroundColor,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      or
      {showDelete && !matcher.locked && (
        <div className={s.closeButton}>
          <Button
            onClick={handleChangeToAnd}
            height={12}
            width={12}
            color={Colours.buttons.delete}
            hoverColor={Colours.buttons.deleteHover}
            backgroundColor={Colours.buttons.deleteBackground}
            hoverBackgroundColor={Colours.buttons.deleteHoverBackground}
            style={{
              alignSelf: 'center',
              marginLeft: '3px',
              paddingBlock: 0,
              paddingInline: 0,
              borderRadius: '3px',
            }}
          >
            <IoClose />
          </Button>
        </div>
      )}
    </div>
  );
});
