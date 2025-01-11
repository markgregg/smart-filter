import React from 'react';
import { useConfig, useMatcher, useOptions } from '../../state/useState';
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

export const SearchBox = React.memo(
  ({ matcherKey, field, text, onSelect, position }: SearchBoxProps) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [searchText, setSearchText] = React.useState<string>(text[0]);
    const placeholder = useConfig((state) => state.placeholder);
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
    } = useOptions((state) => state);
    const clearSelections = useMatcher((state) => state.clearSelections);
    const {
      editMatcher,
      selectedMatcher,
      editPosition,
      addClearCallback,
      removeClearCallback,
    } = useMatcher((state) => state);

    React.useEffect(() => {
      if (!matcherKey) {
        const clearSeachText = () => {
          setSearchText('');
        };
        addClearCallback(clearSeachText);
        return () => {
          removeClearCallback(clearSeachText);
        };
      }
      return () => {
        /* nothing */
      };
    }, [matcherKey]);

    React.useEffect(() => {
      setSearchText(text[0]);
      if (inputRef.current) {
        if (matcherKey) {
          inputRef.current?.focus();
        } else if (selectedMatcher === null) {
          inputRef.current.scrollIntoView({ behavior: 'smooth' });
          inputRef.current.focus();
        }
      }
    }, [text, matcherKey, selectedMatcher]);

    React.useEffect(() => {
      if (
        (editMatcher == null &&
          selectedMatcher === null &&
          editPosition === null) ||
        (editPosition !== null && editPosition === position)
      ) {
        if (inputRef.current) {
          inputRef.current.scrollIntoView({ behavior: 'smooth' });
          inputRef.current.focus();
        }
      }
    }, [editMatcher, selectedMatcher, editPosition, position]);

    React.useEffect(() => {
      buildOptions(
        handleOptionSelected,
        searchText ?? '',
        field,
        [],
        matcherKey,
      );
    }, [searchText]);

    const handleOptionSelected = React.useCallback((option: Option) => {
      // option selected via click on option
      onSelect(option);
    }, [onSelect]);

    const handleFocus = React.useCallback(() => {
      if (!matcherKey && position === undefined) {
        clearSelections();
      }
      if (!matcherKey && searchText !== '') {
        buildOptions(
          handleOptionSelected,
          searchText ?? '',
          field,
          [],
          matcherKey,
        );
      }
    }, [matcherKey, position, searchText, field, matcherKey, buildOptions, handleOptionSelected, clearSelections]);

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.currentTarget.value);
      },
      [setSearchText]);

    const select = React.useCallback(() => {
      if (active) {
        onSelect(active);
        clearOptions();
      }
    }, [active, onSelect, clearOptions]);

    const addOptionToSearchText = React.useCallback(() => {
      if (active !== null) {
        setSearchText(active.text);
      }
    }, [active, setSearchText]);

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
      if (searchText.length === 0) {
        return;
      }
      let endPropogation = false;
      switch (event.key) {
        case KeyBoardkeys.ArrowRight: {
          event.preventDefault();
          break;
        }
        case KeyBoardkeys.ArrowLeft: {
          event.preventDefault();
          break;
        }
        case KeyBoardkeys.ArrowDown: {
          next();
          endPropogation = true;
          break;
        }
        case KeyBoardkeys.ArrowUp: {
          prev();
          endPropogation = true;
          break;
        }
        case KeyBoardkeys.PageDown: {
          nextPage();
          endPropogation = true;
          break;
        }
        case KeyBoardkeys.PageUp: {
          prevPage();
          endPropogation = true;
          break;
        }
        case KeyBoardkeys.Home: {
          first();
          endPropogation = true;
          break;
        }
        case KeyBoardkeys.End: {
          last();
          endPropogation = true;
          break;
        }
        case KeyBoardkeys.Enter: {
          select();
          endPropogation = true;
          break;
        }
        case KeyBoardkeys.Tab: {
          addOptionToSearchText();
          endPropogation = true;
          break;
        }
        default: {
          // ignore
        }
      }
      if (endPropogation) {
        event.stopPropagation();
        event.preventDefault();
      }
    }, [next, prev, first, last, select, addOptionToSearchText]);

    const handleClick = React.useCallback((event: React.MouseEvent) => {
      event.stopPropagation();
    }, []);

    return (
      <input
        ref={inputRef}
        className={s.searchBox}
        type="text"
        placeholder={placeholder ?? 'Enter text to search...'}
        value={searchText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onClick={handleClick}
      />
    );
  },
);
