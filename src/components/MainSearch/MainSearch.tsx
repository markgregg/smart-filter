import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SearchBox } from '../SearchBox';
import { Brackets, LogicalOperator, Matcher, Option } from '@/types';
import { useConfig, useMatcher, useOptions } from '../../state/useState';
import {
  createField,
  createRangeValue,
  createValue,
  getDefaultComparison,
} from '@/util/functions';
import { AND, CLIPBOARD_FORMAT } from '@/util/constants';
import {
  checkAndPasteElements,
  getFieldNameFromDelimitedList,
  getMatchersFromCustomParser,
} from '../FilterBar/functions';
import s from './style.module.less';

interface MainSearchProps {
  reducedWidth?: boolean;
  position?: number;
}

export const MainSearch = React.memo(
  ({ reducedWidth, position }: MainSearchProps) => {
    const {
      selectedIndex,
      editPosition,
      matchers,
      copyMatchers,
      insertMatchers,
      deleteMatchers,
      addValue,
      addBracket,
    } = useMatcher((state) => state);
    const [text, setText] = React.useState<string[]>(['']);
    const {
      fieldMap,
      size = 'normal',
      pasteOptions,
    } = useConfig((state) => state);
    const { comparison, operator } = useOptions((state) => state);
    const maxWidth = reducedWidth ? '130px' : undefined;

    const handleCreateBracket = React.useCallback(
      (bracket: Brackets, op: LogicalOperator | null) => {
        addBracket(bracket, editPosition, op);
      },
      [addBracket, editPosition],
    );

    const handleSelect = React.useCallback(
      (option: Option) => {
        const field = fieldMap.get(option.field);
        const value =
          option.type === 'f'
            ? createField(field)
            : option.type === 'r'
              ? createRangeValue(option)
              : createValue(option);
        if (value) {
          addValue({
            value,
            position: editPosition,
            operator: operator ?? AND,
            comparison: comparison ?? getDefaultComparison(field),
          });
        }
        setText(['']);
      },
      [addValue, fieldMap, editPosition, operator, comparison],
    );

    const handleCopy = React.useCallback(
      (event: React.ClipboardEvent) => {
        const matchersToCopy = matchers.filter(
          (m, i) =>
            selectedIndex === i ||
            (copyMatchers && copyMatchers.includes(m.key)),
        );
        if (matchersToCopy.length > 0) {
          event.clipboardData.setData('text', JSON.stringify(matchersToCopy));
          event.preventDefault();
        }
      },
      [matchers, selectedIndex, copyMatchers],
    );

    const handleCut = React.useCallback(
      (event: React.ClipboardEvent) => {
        const matchersToCut = matchers.filter(
          (m, i) =>
            selectedIndex === i ||
            (copyMatchers && copyMatchers.includes(m.key)),
        );
        if (matchersToCut.length > 0 && matchersToCut.every((m) => !m.locked)) {
          event.clipboardData.setData('text', JSON.stringify(matchersToCut));
          event.preventDefault();
          deleteMatchers(matchersToCut);
        }
      },
      [matchers, selectedIndex, copyMatchers, deleteMatchers],
    );

    const handlePaste = React.useCallback(
      (event: React.ClipboardEvent) => {
        if (event.clipboardData.types.includes(CLIPBOARD_FORMAT)) {
          const pasteText = event.clipboardData.getData(CLIPBOARD_FORMAT);
          try {
            const parsedMatchers = JSON.parse(pasteText) as Matcher | Matcher[];
            const pasteMatchers = Array.isArray(parsedMatchers)
              ? parsedMatchers.map((m) => ({ ...m, key: uuidv4() }))
              : {
                  ...parsedMatchers,
                  key: uuidv4(),
                };
            if (pasteMatchers) {
              insertMatchers(pasteMatchers, editPosition);
            }
            event.preventDefault();
            return;
          } catch {
            // ingore
          }
          const customMatchers = getMatchersFromCustomParser(
            pasteText,
            pasteOptions,
          );
          if (customMatchers) {
            insertMatchers(customMatchers, editPosition);
            event.preventDefault();
            return;
          }
          const field = getFieldNameFromDelimitedList(
            pasteText,
            fieldMap,
            pasteOptions,
          );
          if (field) {
            checkAndPasteElements(field, editPosition, insertMatchers);
            event.preventDefault();
          }
        }
      },
      [insertMatchers, fieldMap, pasteOptions, editPosition],
    );

    return (
      <div
        className={[s.searchPill, s[size]].join(' ')}
        style={{
          maxWidth,
        }}
      >
        <SearchBox
          text={text}
          onSelect={handleSelect}
          onCopy={handleCopy}
          onCut={handleCut}
          onPaste={handlePaste}
          onCreateBracket={handleCreateBracket}
          position={position}
        />
      </div>
    );
  },
);
