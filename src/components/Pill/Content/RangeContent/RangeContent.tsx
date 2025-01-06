import React from 'react';
import { RangeMatcher, Value } from '@/types';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
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
      <div>
        {rangeMatcher.text}
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
      <div>
        {rangeMatcher.textTo}
        {Icon && <Icon className={s.icon} />}
      </div>
    );
  }, [field, rangeMatcher]);

  React.useEffect(() => {
    if (editMatcher?.key !== matcher.key) {
      setEditField('none');
    }
  }, [editMatcher]);

  const handleClick = useDynamicCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    if (matcher.locked) {
      return;
    }
    setEditField('value');
    if (editMatcher?.key !== matcher.key) {
      selectMatcherForEdit(matcher.key);
    }
  });

  const handleClickTo = useDynamicCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    if (matcher.locked) {
      return;
    }
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
  });

  const handleChangeTo = useDynamicCallback(
    (textTo: string, valueTo: Value) => {
      setEditField('none');
      updateMatcher({
        ...matcher,
        textTo,
        valueTo,
      });
    },
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
