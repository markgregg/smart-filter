import React from 'react';
import { DisplayComponentProps } from './Display';
import { BooleanToogle } from '@/components/common/BooleanToogle';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';

export const BooleanDisplay = React.memo(({ value, onChanged }: DisplayComponentProps) => {
  const handleChanged = useDynamicCallback((value: boolean) => {
    if (onChanged) {
      onChanged(value + '', value);
    }
  })
  return (
    <BooleanToogle value={typeof value === 'boolean' && value} onChange={handleChanged} />
  )
});