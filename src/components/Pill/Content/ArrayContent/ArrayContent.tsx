import React from 'react';
import { ArrayMatcher, Value } from '@/types';
import { useArray, useMatcher, useOptions } from '@/state/useState';
import { TextDisplay } from '../Display/TextDisplay';
import { Editor, TextValue } from '../Editor';
import { KeyBoardkeys } from '@/util/constants';
import { ContentProps } from '../../Pill';
import s from './style.module.less';

export const ArrayContent = React.memo(({ matcher, field }: ContentProps) => {
  const arrayMatcher = matcher as ArrayMatcher;
  const [textValue, setTextValue] = React.useState<TextValue>({
    text: '',
    value: null,
  });
  const [inEdit, setInEdit] = React.useState<boolean>(false);
  const { editMatcher, selectMatcherForEdit, updateMatcher, clearEditMatcher } = useMatcher(
    (state) => state,
  );
  const { clearOptions, options } = useOptions((state) => state);
  const {
    next,
    prev,
    nextPage,
    prevPage,
    first,
    last,
    selectItem,
    setMatcher,
    index,
    selectedIndex,
  } = useArray((state) => state);

  const html = React.useMemo(
    () =>
      !field?.display || field?.display === 'text' ? null : (
        <div className={s.iconList}>
          {arrayMatcher.valueArray.map((v, i, a) => {
            const Icon = field?.iconMap?.get(v);
            const text =
              i < arrayMatcher.textArray.length
                ? arrayMatcher.textArray[i]
                : '';
            return field?.display === 'both' ? (
              <div key={text} className={s.iconText}>
                <div className={s.text}>{text}</div>
                {Icon && <Icon className={s.icon} />}
                <div className={s.text}>{i < a.length - 1 ? ',' : ''}</div>
              </div>
            ) : (
              <div key={text}>{Icon && <Icon className={s.icon} />}</div>
            );
          })}
        </div>
      ),
    [field, arrayMatcher],
  );

  React.useEffect(() => {
    setTextValue({
      text:
        selectedIndex !== null && selectedIndex < arrayMatcher.textArray.length
          ? arrayMatcher.textArray[selectedIndex]
          : '',
      value:
        selectedIndex !== null && selectedIndex < arrayMatcher.valueArray.length
          ? arrayMatcher.valueArray[selectedIndex]
          : null,
    });
  }, [selectedIndex, matcher]);

  React.useEffect(() => {
    if (editMatcher?.key !== matcher.key) {
      setInEdit(false);
    }
  }, [editMatcher, inEdit]);

  const handleClick = React.useCallback(() => {
    if (matcher.locked) {
      return;
    }
    setInEdit(true);
    if (editMatcher?.key !== matcher.key) {
      selectMatcherForEdit(matcher.key);
    }
    setMatcher(arrayMatcher);
  }, [matcher, editMatcher, setInEdit, selectMatcherForEdit, setMatcher]);

  const handleCancel = React.useCallback(() => {
    if (selectedIndex !== null || options.length > 0) {
      selectItem(null);
      clearOptions();
      setTextValue({ text: '', value: null });
    } else {
      setInEdit(false);
      setMatcher(null);
      clearEditMatcher();
    }
  }, [
    selectedIndex,
    options,
    selectItem,
    clearOptions,
    setTextValue,
    setInEdit,
    clearEditMatcher,
  ]);

  const handleChange = React.useCallback(
    (text: string, value: Value) => {
      if (selectedIndex === null) {
        if (arrayMatcher.valueArray.includes(value)) {
          throw new Error(`${value} alrady exist in pill`);
        }
      }
      const valueArray =
        selectedIndex !== null
          ? arrayMatcher.valueArray.map((v, idx) =>
            idx === selectedIndex ? value : v,
          )
          : [...arrayMatcher.valueArray, value];
      const textArray =
        selectedIndex !== null
          ? arrayMatcher.textArray.map((t, idx) =>
            idx === selectedIndex ? text : t,
          )
          : [...arrayMatcher.textArray, text];
      const newMatcher = {
        ...arrayMatcher,
        valueArray,
        textArray,
      };
      updateMatcher(newMatcher);
      setMatcher(newMatcher);
      selectItem(null);
      clearOptions();
      setTextValue({ text: '', value: null });
    },
    [
      selectedIndex,
      arrayMatcher,
      updateMatcher,
      setMatcher,
      selectItem,
      clearOptions,
      setTextValue,
    ],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      let endPropogation = false;
      switch (event.key) {
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
          selectItem(index);
          endPropogation = true;
          break;
        }
        default: {
          // ingore
        }
      }
      if (endPropogation) {
        event.stopPropagation();
        event.preventDefault();
      }
    },
    [next, prev, first, last, nextPage, prevPage, selectItem, index],
  );

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {
        field ? (
          <div onKeyDown={handleKeyDown} className={s.arrayContent}>
            {inEdit
              ? field && (
                <Editor
                  matcherKey={matcher.key}
                  field={field}
                  textValue={textValue}
                  unset={textValue.value === null}
                  onChanged={handleChange}
                  onCancel={handleCancel}
                />
              )
              : field && (
                <TextDisplay
                  field={field}
                  text={arrayMatcher.textArray.join(',')}
                  html={html}
                  onClick={handleClick}
                />
              )}
          </div>
        ) : (
          <div />
        ) // how to hanle??????
      }
    </>
  );
});
