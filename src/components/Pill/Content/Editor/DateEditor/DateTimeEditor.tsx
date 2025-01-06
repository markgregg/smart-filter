import React from 'react';
import moment from 'moment';
import { EditorComponentProps } from '../Editor';
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import { Value, Field } from '@/types';
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_DATE_TIME_FORMAT,
} from '@/util/constants';
import s from './style.module.less';

const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

const formatDate = (value: Value, field: Field): string => {
  if (typeof value === 'string') {
    return moment(
      value,
      field.dateTimeFormat ??
        (field.editorType === 'date'
          ? DEFAULT_DATE_FORMAT
          : DEFAULT_DATE_TIME_FORMAT),
      true,
    ).format(field.editorType === 'date' ? DATE_FORMAT : DATE_TIME_FORMAT);
  }
  return moment(value, true).format(
    field.editorType === 'date' ? DATE_FORMAT : DATE_TIME_FORMAT,
  );
};
const getMinMax = (
  field: Field,
  selector: (f: Field) => number | string | Date | undefined,
): string | undefined =>
  selector(field) ? formatDate(selector(field), field) : undefined;

export const DateTimeEditor = React.memo(
  ({ field, textValue, onChanged }: EditorComponentProps) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      inputRef?.current?.focus();
    }, []);

    const handleChange = useDynamicCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = moment(
          event.currentTarget.value,
          field.editorType === 'date' ? DATE_FORMAT : DATE_TIME_FORMAT,
          true,
        ).toDate();
        const label = moment(newValue, true).format(
          field.dateTimeFormat ??
            (field.editorType === 'date'
              ? DEFAULT_DATE_FORMAT
              : DEFAULT_DATE_TIME_FORMAT),
        );
        onChanged({ text: label, value: newValue }, true);
      },
    );

    return (
      <input
        ref={inputRef}
        className={s.textInput}
        type={field.editorType === 'date' ? 'date' : 'datetime-local'}
        value={formatDate(textValue.value, field)}
        onChange={handleChange}
        min={getMinMax(field, (f) => f.min)}
        max={getMinMax(field, (f) => f.max)}
      />
    );
  },
);
