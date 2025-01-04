import React from 'react';
import { EditorComponentProps } from '../Editor';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import { SearchBox } from '@/components/SearchBox';
import { Option } from '@/types';

export const SearchEditor = React.memo(({ matcherKey, field, textValue, onChanged }: EditorComponentProps) => {

  const handleSelect = useDynamicCallback((option: Option) => {
    onChanged({ text: option.text, value: option.value }, true);
  });

  return (
    <SearchBox matcherKey={matcherKey} text={[textValue.text]} field={field} onSelect={handleSelect} />
  )
});