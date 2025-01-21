import React from 'react';
import { SingleMatcher, Value } from '@/types';
import { useMatcher, useOptions } from '@/state/useState';
import { Editor } from '../Editor';
import { Display } from '../Display';
import { EMPTY } from '@/util/constants';
import { ContentProps } from '../../Pill';
import s from './style.module.less';

export const ValueContent = React.memo(({ matcher, field }: ContentProps) => {
  const valueMatcher = matcher as SingleMatcher;
  const [inEdit, setInEdit] = React.useState<boolean>(false);
  const { editMatcher, selectMatcherForEdit, updateMatcher, clearEditMatcher } = useMatcher(
    (state) => state,
  );
  const clearOptions = useOptions((state) => state.clearOptions);
  const itemValue = React.useMemo(
    () => ({ text: valueMatcher.text ?? '', value: valueMatcher.value }),
    [matcher],
  );

  const html = React.useMemo(() => {
    if (!field?.display || field?.display === 'text') {
      return null;
    }
    const Icon = field?.iconMap?.get(valueMatcher.value);
    return field?.display === 'icon' ? (
      <div>{Icon && <Icon className={s.icon} />}</div>
    ) : (
      <div className={s.iconText}>
        <div className={s.text}>{valueMatcher.text}</div>
        {Icon && <Icon className={s.icon} />}
      </div>
    );
  }, [field, valueMatcher]);

  React.useEffect(() => {
    if (editMatcher?.key !== matcher.key) {
      setInEdit(false);
    } else if (
      valueMatcher.value === null &&
      !inEdit &&
      field?.editorType !== 'bool' &&
      valueMatcher.text !== EMPTY
    ) {
      setInEdit(true);
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
  }, [matcher, setInEdit, matcher, selectMatcherForEdit]);

  const handleCancel = React.useCallback(() => {
    setInEdit(false);
    clearOptions();
    clearEditMatcher();
  }, [setInEdit, clearOptions, clearEditMatcher]);

  const handleChange = React.useCallback(
    (text: string, value: Value) => {
      setInEdit(false);
      updateMatcher({
        ...valueMatcher,
        text,
        value,
      });
      clearOptions();
      clearEditMatcher();
    },
    [setInEdit, matcher, updateMatcher, clearOptions, clearEditMatcher],
  );

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {
        field ? (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>
            {inEdit
              ? field && (
                <Editor
                  matcherKey={matcher.key}
                  field={field}
                  textValue={itemValue}
                  onChanged={handleChange}
                  onCancel={handleCancel}
                />
              )
              : field && (
                <Display
                  field={field}
                  text={valueMatcher.text}
                  value={valueMatcher.value}
                  html={html}
                  onClick={handleClick}
                  onChanged={handleChange}
                />
              )}
          </>
        ) : (
          <div />
        ) // how to hanle??????
      }
    </>
  );
});
