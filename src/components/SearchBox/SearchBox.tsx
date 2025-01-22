import React from 'react';
import {
  useConfig,
  useFilterBar,
  useFocus,
  useMatcher,
  useOptions,
  useSort,
} from '../../state/useState';
import { KeyBoardkeys } from '@/util/constants';
import { Field, Option } from '@/types';
import s from './style.module.less';
import { isVisible } from '@/util/functions';

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
    const { placeholder, size } = useConfig((state) => state);
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
      options,
    } = useOptions((state) => state);
    const clearSelections = useMatcher((state) => state.clearSelections);
    const {
      editMatcher,
      selectedMatcher,
      editPosition,
      addClearCallback,
      removeClearCallback,
    } = useMatcher((state) => state);
    const { active: sortActive, setActive } = useSort((state) => state);
    const enableExpand = useFilterBar((state) => state.enableExpand);
    const setKeyboardFocus = useFocus((state) => state.setKeyboardFocus);

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
        }
      }
    }, [text, matcherKey, selectedMatcher, sortActive]);

    React.useEffect(() => {
      if (
        (!matcherKey &&
          editMatcher === null &&
          selectedMatcher === null &&
          !sortActive &&
          editPosition === null) ||
        (editPosition !== null && editPosition === position)
      ) {
        if (inputRef.current) {
          if (enableExpand && !isVisible(inputRef.current)) {
            inputRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
            });
          }
          inputRef.current.focus();
        }
      }
    }, [
      editMatcher,
      selectedMatcher,
      editPosition,
      sortActive,
      position,
      enableExpand,
    ]);

    React.useEffect(() => {
      buildOptions(
        handleOptionSelected,
        searchText ?? '',
        field,
        [],
        matcherKey,
      );
    }, [searchText]);

    const handleOptionSelected = React.useCallback(
      (option: Option) => {
        // option selected via click on option
        onSelect(option);
      },
      [onSelect],
    );

    const handleFocus = React.useCallback(() => {
      if (sortActive) {
        setActive(false);
      }
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
    }, [
      matcherKey,
      position,
      searchText,
      field,
      matcherKey,
      buildOptions,
      handleOptionSelected,
      clearSelections,
      sortActive,
      setActive,
    ]);

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.currentTarget.value);
      },
      [setSearchText],
    );

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

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        setKeyboardFocus();
        let endPropogation = false;
        switch (event.key) {
          case KeyBoardkeys.ArrowDown: {
            if (options.length > 0) {
              next();
              endPropogation = true;
            }
            break;
          }
          case KeyBoardkeys.ArrowUp: {
            if (options.length > 0) {
              prev();
              endPropogation = true;
            }
            break;
          }
          case KeyBoardkeys.PageDown: {
            if (options.length > 0) {
              nextPage();
              endPropogation = true;
            }
            break;
          }
          case KeyBoardkeys.PageUp: {
            if (options.length > 0) {
              prevPage();
              endPropogation = true;
            }
            break;
          }
          case KeyBoardkeys.Enter: {
            if (options.length > 0) {
              select();
              endPropogation = true;
            }
            break;
          }
          case KeyBoardkeys.Tab: {
            if (options.length > 0) {
              addOptionToSearchText();
              endPropogation = true;
            }
            break;
          }
          default: {
            if (searchText.length > 0) {
              event.stopPropagation();
            }
            // ignore
          }
        }
        if (endPropogation) {
          event.stopPropagation();
          event.preventDefault();
        }
      },
      [next, prev, first, last, select, addOptionToSearchText, options],
    );

    const handleClick = React.useCallback((event: React.MouseEvent) => {
      event.stopPropagation();
    }, []);

    return (
      <input
        id="sf-search-box"
        ref={inputRef}
        className={[s.searchBox, s[`font-${size}`]].join(' ')}
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
