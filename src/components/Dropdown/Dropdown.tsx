import React from 'react';
import { Suggestions } from '../Suggestions';
import { useArray, useConfig, useOptions } from '../../state/useState';
import { Options } from '../Options';
import { Array } from '../Array';
import s from './style.module.less';

export const Dropdown = React.memo(() => {
  const { maxDropdownHeight: maxHeight, dropdownWidth: width } = useConfig(
    (state) => state,
  );
  const options = useOptions((state) => state.options);
  const arrayMatcher = useArray((state) => state.matcher);

  return (
    <div id="sf-drop-down" className={s.dropdown} style={{ maxHeight, width }}>
      {options.length > 0 ? (
        <Options />
      ) : arrayMatcher ? (
        <Array />
      ) : (
        <Suggestions />
      )}
    </div>
  );
});
