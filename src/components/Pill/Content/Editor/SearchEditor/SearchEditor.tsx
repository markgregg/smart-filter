import React from 'react';
import { EditorComponentProps } from '../Editor';
import { SearchBox } from '@/components/SearchBox';
import { Option } from '@/types';

export const SearchEditor = React.memo(
  ({ matcherKey, field, textValue, onChanged }: EditorComponentProps) => {
    const handleSelect = React.useCallback(
      (option: Option) => {
        if (option.type !== 'f') {
          onChanged({ text: option.text, value: option.value }, true);
        }
      },
      [onChanged],
    );

    return (
      <SearchBox
        matcherKey={matcherKey}
        text={[textValue.text]}
        field={field}
        onSelect={handleSelect}
      />
    );
  },
);
