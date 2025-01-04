import React from 'react';
import { ArrayMatcher, Value } from '@/types';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import { useArray, useMatcher, useOptions } from '@/components/StateProvider/useState';
import { TextDisplay } from '../Display/TextDisplay';
import { Editor, TextValue } from '../Editor';
import { KeyBoardkeys } from '@/util/constants';
import { ContentProps } from '../../Pill';
import s from './style.module.less';

export const ArrayContent = React.memo(({ matcher, field }: ContentProps) => {
  const arrayMatcher = matcher as ArrayMatcher;
  const [textValue, setTextValue] = React.useState<TextValue>({ text: '', value: null });
  const [inEdit, setInEdit] = React.useState<boolean>(false);
  const {
    editMatcher,
    selectMatcherForEdit,
    updateMatcher,
  } = useMatcher(state => state);
  const { clearOptions, options } = useOptions(state => state);
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
  } = useArray(state => state);

  React.useEffect(() => {
    setTextValue({
      text: selectedIndex !== null && selectedIndex < arrayMatcher.textArray.length ? arrayMatcher.textArray[selectedIndex] : '',
      value: selectedIndex !== null && selectedIndex < arrayMatcher.valueArray.length ? arrayMatcher.valueArray[selectedIndex] : null,
    });
  }, [selectedIndex, matcher]);

  React.useEffect(() => {
    if (editMatcher?.key !== matcher.key) {
      setInEdit(false);
    }
  }, [editMatcher, inEdit]);

  const handleClick = useDynamicCallback(() => {
    setInEdit(true);
    if (editMatcher?.key !== matcher.key) {
      selectMatcherForEdit(matcher.key);
    }
    setMatcher(arrayMatcher);
  });

  const handleCancel = useDynamicCallback(() => {
    if (selectedIndex !== null || options.length > 0) {
      selectItem(null);
      clearOptions();
      setTextValue({ text: '', value: null });
    } else {
      setInEdit(false);
      setMatcher(null);
    }
  });

  const handleChange = useDynamicCallback((text: string, value: Value) => {
    const valueArray = selectedIndex !== null
      ? arrayMatcher.valueArray.map((v, idx) => idx === selectedIndex ? value : v)
      : [...arrayMatcher.valueArray, value];
    const textArray = selectedIndex !== null
      ? arrayMatcher.textArray.map((t, idx) => idx === selectedIndex ? text : t)
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
  });

  const handleKeyDown = useDynamicCallback((event: React.KeyboardEvent) => {
    let endPropogation = false;
    switch (event.key) {
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
        selectItem(index);
        endPropogation = true;
        break;
    }
    if (endPropogation) {
      event.stopPropagation();
      event.preventDefault();
    }
  });

  return (
    <>
      {field
        ? <div onKeyDown={handleKeyDown} className={s.arrayContent}>
          {inEdit
            ? field && <Editor matcherKey={matcher.key} field={field} textValue={textValue} unset={textValue.value === null} onChanged={handleChange} onCancel={handleCancel} />
            : field && <TextDisplay field={field} text={arrayMatcher.textArray.join(',')} onClick={handleClick} />}
        </div>
        : <div /> //how to hanle??????
      }
    </>
  )
});