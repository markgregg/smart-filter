import React from 'react';
import { RangeMatcher, Value } from '@/types';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import { useMatcher, useOptions } from '@/components/StateProvider/useState';
import { Editor } from '../Editor';
import { Display } from '../Display';
import s from './style.module.less';
import { ContentProps } from '../../Pill';

type EditField = 'none' | 'value' | 'valueto';

export const RangeContent = React.memo(({ matcher, field }: ContentProps) => {
  const rangeMatcher = matcher as RangeMatcher;
  const [editField, setEditField] = React.useState<EditField>('none');
  const {
    editMatcher,
    selectMatcherForEdit,
    updateMatcher,
  } = useMatcher(state => state);
  const clearOptions = useOptions(state => state.clearOptions);
  const itemValue = React.useMemo(() => ({ text: rangeMatcher.text ?? '', value: rangeMatcher.value }), [matcher]);
  const itemValueTo = React.useMemo(() => ({ text: rangeMatcher.textTo ?? '', value: rangeMatcher.valueTo }), [matcher]);

  React.useEffect(() => {
    if (editMatcher?.key !== matcher.key) {
      setEditField('none');
    }
  }, [editMatcher]);

  const handleClick = useDynamicCallback(() => {
    setEditField('value');
    if (editMatcher?.key !== matcher.key) {
      selectMatcherForEdit(matcher.key);
    }
  });

  const handleClickTo = useDynamicCallback(() => {
    setEditField('valueto');
    if (editMatcher?.key !== matcher.key) {
      selectMatcherForEdit(matcher.key);
    }
  });

  const handleCancel = useDynamicCallback(() => {
    setEditField('none');
    clearOptions();
  });

  const handleChange = useDynamicCallback((text: string, value: Value) => {
    setEditField('none');
    updateMatcher({
      ...matcher,
      text,
      value,
    });
    clearOptions();
  })

  const handleChangeTo = useDynamicCallback((textTo: string, valueTo: Value) => {
    setEditField('none');
    updateMatcher({
      ...matcher,
      textTo,
      valueTo,
    });
  })


  return (
    <>
      {field
        ? <>
          {editField === 'value'
            ? field && <Editor matcherKey={matcher.key} field={field} textValue={itemValue} onChanged={handleChange} onCancel={handleCancel} />
            : field && <Display field={field} text={rangeMatcher.text} value={rangeMatcher.value} onClick={handleClick} onChanged={handleChange} />}
          <div className={s.toText}>to</div>
          {editField === 'valueto'
            ? field && <Editor matcherKey={matcher.key} field={field} textValue={itemValueTo} onChanged={handleChangeTo} onCancel={handleCancel} />
            : field && <Display field={field} text={rangeMatcher.textTo ?? ''} value={rangeMatcher.valueTo} onClick={handleClickTo} onChanged={handleChangeTo} />}
        </>
        : <div /> //how to hanle??????
      }
    </>
  )
});
