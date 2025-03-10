import React from 'react';
import { Operators } from './Operators';
import { Hints } from './Hints';
import s from './style.module.less';

export const Suggestions = React.memo(() => (
  <div className={s.suggestions} id="sf-suggestions">
    <Operators />
    <Hints />
  </div>
));
