import React from 'react';
import { FaCaretRight } from 'react-icons/fa6';
import { VscClose } from 'react-icons/vsc';
import { useArray, useConfig, useMatcher } from '@/state/useState';
import { Button } from '@/components/common/Button';
import { Matcher, Value } from '@/types';
import { Colours } from '@/util/colours';
import s from './style.module.less';

interface ArrayItemProps {
  index: number;
  text: string;
  value: Value;
  active: boolean;
  selected: boolean;
}

export const ArrayItem = React.memo(
  ({ index, text, value, active, selected }: ArrayItemProps) => {
    const { size = 'normal' } = useConfig((state) => state);
    const { selectItem, setMatcher, matcher } = useArray((state) => state);
    const updateMatcher = useMatcher((state) => state.updateMatcher);
    const buttonSize = size === 'normal' ? 22 : size === 'compact' ? 20 : 26;
    const iconSize = size === 'normal' ? 16 : size === 'compact' ? 12 : 20;

    const handleClick = React.useCallback(
      (event: React.MouseEvent) => {
        selectItem(index);
        event.stopPropagation();
      },
      [selectItem, index],
    );

    const handleDeleteArrayItem = React.useCallback(() => {
      if (matcher) {
        const newMatcher: Matcher = {
          ...matcher,
          valueArray: matcher?.valueArray.filter((_, i) => i !== index),
          textArray: matcher?.textArray.filter((_, i) => i !== index),
        };
        updateMatcher(newMatcher);
        setMatcher(newMatcher);
      }
    }, [matcher, index]);

    return (
      <div
        id={`sf-arr-item-${text}`}
        className={[
          s.arrayItem,
          active ? s.active : '',
          value === null ? s.error : '',
        ].join(' ')}
        onClick={handleClick}
      >
        <Button
          id={`sf-delete-arr-${text}`}
          onClick={handleDeleteArrayItem}
          height={buttonSize}
          width={buttonSize}
          color={Colours.buttons.arrayItem}
          hoverColor={Colours.buttons.arrayItemhover}
          backgroundColor={Colours.buttons.arrayItembackground}
          hoverBackgroundColor={Colours.buttons.arrayItemHoverBackground}
          style={{
            alignSelf: 'center',
            marginLeft: '3px',
            paddingBlock: 0,
            paddingInline: 0,
          }}
        >
          <VscClose style={{ width: iconSize, height: iconSize }} />
        </Button>
        <div className={s.text}>
          {selected && <FaCaretRight />}
          {text}
        </div>
      </div>
    );
  },
);
