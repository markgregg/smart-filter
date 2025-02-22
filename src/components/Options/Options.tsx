import React from 'react';
import { useOptions } from '../../state/useState';
import { Option } from './Option/Option';
import s from './style.module.less';

export const Options = React.memo(() => {
  const { options, active } = useOptions((state) => state);

  return (
    <div id="sf-options-list" className={s.options}>
      {options.map((o) => (
        <Option key={o.key} option={o} active={o.key === active?.key} />
      ))}
    </div>
  );
});
