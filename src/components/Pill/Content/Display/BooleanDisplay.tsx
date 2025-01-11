import React from 'react';
import { DisplayComponentProps } from './Display';
import { BooleanToogle } from '@/components/common/BooleanToogle';

export const BooleanDisplay = React.memo(
  ({ value, onChanged }: DisplayComponentProps) => {

    const handleChanged = React.useCallback((newValue: boolean) => {
      if (onChanged) {
        onChanged(`${newValue}`, newValue);
      }
    }, [onChanged]);

    return (
      <BooleanToogle
        value={typeof value === 'boolean' && value}
        onChange={handleChanged}
      />
    );
  },
);
