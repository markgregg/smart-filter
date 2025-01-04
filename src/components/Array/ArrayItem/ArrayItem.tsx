import React from 'react';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import { useArray, useMatcher } from '@/components/StateProvider/useState';
import { FaCaretRight } from "react-icons/fa6";
import { IoClose } from 'react-icons/io5';
import { Button } from '@/components/common/Button';
import s from './style.module.less';
import { Matcher } from '@/types';

interface OptionProps {
  index: number;
  text: string;
  value: string;
  active: boolean;
  selected: boolean;
}

export const ArrayItem = React.memo(({ index, text, active, selected }: OptionProps) => {
  const { selectItem, setMatcher, matcher } = useArray(state => state);
  const updateMatcher = useMatcher(state => state.updateMatcher);

  const handleClick = useDynamicCallback(() => {
    selectItem(index);
  });

  const handleDeleteArrayItem = useDynamicCallback(() => {
    if (matcher) {
      const newMatcher: Matcher = {
        ...matcher,
        valueArray: matcher?.valueArray.filter((_, i) => i !== index),
        textArray: matcher?.textArray.filter((_, i) => i !== index),
      };
      updateMatcher(newMatcher);
      setMatcher(newMatcher);
    }
  });

  return (
    <div
      className={[s.arrayItem, active ? s.active : ''].join(' ')}
      onClick={handleClick}
    >
      <Button
        onClick={handleDeleteArrayItem}
        height={12}
        width={12}
        color='black'
        hoverColor='black'
        backgroundColor='lightgray'
        hoverBackgroundColor='white'
        style={{
          alignSelf: 'center',
          marginLeft: '3px',
          paddingBlock: 0,
          paddingInline: 0,
        }}
      ><IoClose /></Button>
      <div className={s.text}>
        {selected && <FaCaretRight />}
        {text}
      </div>
    </div>)
});