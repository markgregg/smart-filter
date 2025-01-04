import React from 'react';
import { useOptions } from '../StateProvider/useState';
import { Option } from './Option/Option';
import s from './style.module.less';

export const Options = React.memo(() => {
  const { options, active } = useOptions(state => state);

  return (
    <div className={s.options}>
      {options.map(o => (<Option key={o.key} option={o} active={o.key === active?.key} />))}
    </div>)
});