import React from 'react';
import { useArray } from '../StateProvider/useState';
import { ArrayItem } from './ArrayItem';
import s from './style.module.less';

export const Array = React.memo(() => {
  const { matcher, index, selectedIndex } = useArray(state => state);

  return (
    <div className={s.array}>
      {matcher?.textArray.map((item, idx) => (<ArrayItem index={idx} key={item} text={item} value={matcher.valueArray.length > idx ? matcher.valueArray[idx] : null} active={idx === index} selected={idx === selectedIndex} />))}
    </div>)
}); 