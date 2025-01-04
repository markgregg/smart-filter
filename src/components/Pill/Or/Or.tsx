import React from 'react';
import { useConfig, useMatcher } from '@/components/StateProvider/useState';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import { Button } from '@/components/common/Button';
import { IoClose } from 'react-icons/io5';
import { AND } from '@/util/constants';
import { Matcher } from '@/types';
import s from './style.module.less';

interface OrProps {
  matcher: Matcher;
}

export const Or = React.memo(({ matcher }: OrProps) => {
  const [mouseOver, setMouseOver] = React.useState<boolean>(false);
  const pillHeight = useConfig(state => state.pillHeight);
  const {
    selectedMatcher,
    updateMatcher,
  } = useMatcher(state => state);

  const backgroundColor = React.useMemo(() => {
    return selectedMatcher?.key === matcher.key
      ? (mouseOver ? '#3C3C3C' : '#1C1C1C')
      : 'rgb(98, 98, 98)'
  }, [mouseOver, selectedMatcher, matcher]);

  const handleMouseEnter = useDynamicCallback(() => {
    setMouseOver(true);
    setTimeout(() => {
      if (mouseOver) {
        setMouseOver(false);
      }
    }, 2000);
  });

  const handleMouseLeave = useDynamicCallback(() => {
    setMouseOver(false);
  });

  const handleChangeToAnd = useDynamicCallback(() => {
    updateMatcher({
      ...matcher,
      operator: AND,
    });
  });

  return (
    <div
      className={s.or}
      style={{
        height: pillHeight,
        backgroundColor
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >or
      {mouseOver && <div className={s.closeButton}>
        <Button
          onClick={handleChangeToAnd}
          height={12}
          width={12}
          color='white'
          hoverColor='black'
          backgroundColor='red'
          hoverBackgroundColor='white'
          style={{
            alignSelf: 'center',
            marginLeft: '3px',
            paddingBlock: 0,
            paddingInline: 0,
            borderRadius: '3px',
          }}
        ><IoClose /></Button>
      </div>}
    </div>
  )
});
