import React from 'react';
import { useConfig, useMatcher, useOptions } from '../StateProvider/useState';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import { KeyBoardkeys } from '@/util/constants';
import { Field, Option } from '@/types';
import s from './style.module.less';

interface SearchBoxProps {
  matcherKey?: string;
  field?: Field;
  text: string[];
  onSelect: (option: Option) => void;
  position?: number;
}

export const SearchBox = React.memo(({ matcherKey, field, text, onSelect, position }: SearchBoxProps) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [searchText, setSearchText] = React.useState<string>(text[0]);
  const placeholder = useConfig(state => state.placeholder);
  const {
    buildOptions,
    clearOptions,
    next,
    prev,
    nextPage,
    prevPage,
    first,
    last,
    active,
  } = useOptions(state => state);
  const clearSelections = useMatcher(state => state.clearSelections);
  const { editMatcher, selectedMatcher, editPosition } = useMatcher(state => state);

  React.useEffect(() => {
    setSearchText(text[0]);
    if (matcherKey) {
      inputRef.current?.focus();
    }
  }, [text]);

  React.useEffect(() => {
    if ((editMatcher == null && selectedMatcher === null && editPosition === null) || (editPosition !== null && editPosition === position)) {
      inputRef.current?.focus();
    }
  }, [editMatcher, selectedMatcher]);

  React.useEffect(() => {
    buildOptions(handleOptionSelected, searchText ?? '', field, [], matcherKey);
  }, [searchText]);

  const handleOptionSelected = (option: Option) => {
    //option selected via click on option
    onSelect(option);
  }

  const handleFocus = useDynamicCallback(() => {
    if (!matcherKey && position === undefined) {
      clearSelections();
    }
  });

  const handleChange = useDynamicCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.currentTarget.value);
  });

  const select = () => {
    if (active) {
      onSelect(active);
      clearOptions();
    }
  }

  const handleKeyDown = useDynamicCallback((event: React.KeyboardEvent) => {
    if (searchText.length === 0) {
      return;
    }
    let endPropogation = false;
    switch (event.key) {
      case KeyBoardkeys.ArrowRight:
        event.preventDefault();
        break;
      case KeyBoardkeys.ArrowLeft:
        event.preventDefault();
        break;
      case KeyBoardkeys.ArrowDown:
        next();
        endPropogation = true;
        break;
      case KeyBoardkeys.ArrowUp:
        prev();
        endPropogation = true;
        break;
      case KeyBoardkeys.PageDown:
        nextPage();
        endPropogation = true;
        break;
      case KeyBoardkeys.PageUp:
        prevPage();
        endPropogation = true;
        break;
      case KeyBoardkeys.Home:
        first();
        endPropogation = true;
        break;
      case KeyBoardkeys.End:
        last();
        endPropogation = true;
        break;
      case KeyBoardkeys.Enter:
        select();
        endPropogation = true;
        break;
    }
    if (endPropogation) {
      event.stopPropagation();
      event.preventDefault();
    }
  })

  return (
    <input
      ref={inputRef}
      className={s.searchBox}
      type='text'
      placeholder={placeholder ?? 'Enter text to search...'}
      value={searchText}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
    />
  )
});