import React from 'react';
import { useSort } from '../../state/useState';
import { SortItem } from './SortItem';
import s from './style.module.less';

export const Sort = React.memo(() => {
  const sort = useSort((state) => state.sort);
  return (
    <div className={s.sort}>
      {sort.map((sortItem, index) => (
        <SortItem key={sortItem.field} sort={sortItem} index={index} />
      ))}
    </div>
  );
});
