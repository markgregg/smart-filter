import React from 'react';
import { RangeMatcher, Value } from '@/types';
import { useMatcher, useOptions } from '@/state/useState';
import { Editor } from '../Editor';
import { Display } from '../Display';
import { ContentProps } from '../../Pill';
import s from './style.module.less';

type EditField = 'none' | 'value' | 'valueto';

export const RangeContent = React.memo(({ matcher, field }: ContentProps) => {
  const rangeMatcher = matcher as RangeMatcher;
  const [editField, setEditField] = React.useState<EditField>('none');
  const { editMatcher, selectMatcherForEdit, updateMatcher } = useMatcher(
    (state) => state,
  );
  const clearOptions = useOptions((state) => state.clearOptions);
  const itemValue = React.useMemo(
    () => ({ text: rangeMatcher.text ?? '', value: rangeMatcher.value }),
    [matcher],
  );
  const itemValueTo = React.useMemo(
    () => ({ text: rangeMatcher.textTo ?? '', value: rangeMatcher.valueTo }),
    [matcher],
  );

  const html = React.useMemo(() => {
    if (!field?.display || field?.display === 'text') {
      return null;
    }
    const Icon = field?.iconMap?.get(rangeMatcher.value);
    return field?.display === 'icon' ? (
      <div>{Icon && <Icon className={s.icon} />}</div>
    ) : (
      <div className={s.iconText}>
        <div className={s.text}>{rangeMatcher.text}</div>
        {Icon && <Icon className={s.icon} />}
      </div>
    );
  }, [field, rangeMatcher]);

  const htmlTo = React.useMemo(() => {
    if (!field?.display || field?.display === 'text') {
      return null;
    }
    const Icon = field?.iconMap?.get(rangeMatcher.valueTo);
    return field?.display === 'icon' ? (
      <div className={s.iconText}>{Icon && <Icon className={s.icon} />}</div>
    ) : (
      <div className={s.iconText}>
        <div className={s.text}>{rangeMatcher.textTo}</div>
        {Icon && <Icon className={s.icon} />}
      </div>
    );
  }, [field, rangeMatcher]);

  React.useEffect(() => {
    if (editMatcher?.key !== matcher.key) {
      setEditField('none');
    }
  }, [editMatcher, setEditField]);

  const handleClick = React.useCallback(() => {
    if (matcher.locked) {
      return;
    }
    setEditField('value');
    if (editMatcher?.key !== matcher.key) {
      selectMatcherForEdit(matcher.key);
    }
  }, [matcher, editMatcher, setEditField, selectMatcherForEdit]);

  const handleClickTo = React.useCallback(() => {
    if (matcher.locked) {
      return;
    }
    setEditField('valueto');
    if (editMatcher?.key !== matcher.key) {
      selectMatcherForEdit(matcher.key);
    }
  }, [matcher, editField, setEditField, selectMatcherForEdit]);

  const handleCancel = React.useCallback(() => {
    setEditField('none');
    clearOptions();
  }, [setEditField, clearOptions]);

  const handleChange = React.useCallback(
    (text: string, value: Value) => {
      setEditField('none');
      updateMatcher({
        ...matcher,
        text,
        value,
      });
      clearOptions();
    },
    [setEditField, matcher, updateMatcher, clearOptions],
  );

  const handleChangeTo = React.useCallback(
    (textTo: string, valueTo: Value) => {
      setEditField('none');
      updateMatcher({
        ...matcher,
        textTo,
        valueTo,
      });
    },
    [setEditField, matcher, updateMatcher],
  );

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {
        field ? (
          <>
            {editField === 'value'
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
                    text={rangeMatcher.text}
                    value={rangeMatcher.value}
                    html={html}
                    onClick={handleClick}
                    onChanged={handleChange}
                  />
                )}
            <div className={s.toText}>to</div>
            {editField === 'valueto'
              ? field && (
                  <Editor
                    matcherKey={matcher.key}
                    field={field}
                    textValue={itemValueTo}
                    onChanged={handleChangeTo}
                    onCancel={handleCancel}
                  />
                )
              : field && (
                  <Display
                    field={field}
                    text={rangeMatcher.textTo ?? ''}
                    value={rangeMatcher.valueTo}
                    html={htmlTo}
                    onClick={handleClickTo}
                    onChanged={handleChangeTo}
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
