import React from 'react';
import dayjs from 'dayjs';
import { EditorComponentProps } from '../Editor';
import { Value, Field } from '@/types';
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_DATE_TIME_FORMAT,
} from '@/util/constants';
import s from './style.module.less';
import { useConfig } from '@/state/useState';

const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

const formatDate = (value: Value, field: Field): string => {
  if (typeof value === 'string') {
    return dayjs(
      value,
      field.dateTimeFormat ??
        (field.editorType === 'date' || field.editorType === 'dateString'
          ? DEFAULT_DATE_FORMAT
          : DEFAULT_DATE_TIME_FORMAT),
      true,
    ).format(
      field.editorType === 'date' || field.editorType === 'dateString'
        ? DATE_FORMAT
        : DATE_TIME_FORMAT,
    );
  }
  return dayjs(value, undefined, true).format(
    field.editorType === 'date' || field.editorType === 'dateString'
      ? DATE_FORMAT
      : DATE_TIME_FORMAT,
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
    const size = useConfig((state) => state.size);

    React.useEffect(() => {
      inputRef?.current?.focus();
    }, []);

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const tempValue = dayjs(
          event.currentTarget.value,
          field.editorType === 'date' || field.editorType === 'dateString'
            ? DATE_FORMAT
            : DATE_TIME_FORMAT,
          true,
        );
        const label = dayjs(tempValue, undefined, true).format(
          field.dateTimeFormat ??
            (field.editorType === 'date' || field.editorType === 'dateString'
              ? DEFAULT_DATE_FORMAT
              : DEFAULT_DATE_TIME_FORMAT),
        );
        const newValue =
          field.editorType === 'date' || field.editorType === 'datetime'
            ? tempValue.toDate()
            : tempValue.format(
                field.dateTimeFormat ??
                  (field.editorType === 'dateString'
                    ? DEFAULT_DATE_FORMAT
                    : DEFAULT_DATE_TIME_FORMAT),
              );
        onChanged({ text: label, value: newValue }, true);
      },
      [field],
    );

    return (
      <input
        id="sf-date-editor"
        ref={inputRef}
        className={[s.textInput, s[`font-${size}`]].join(' ')}
        type={
          field.editorType === 'date' || field.editorType === 'dateString'
            ? 'date'
            : 'datetime-local'
        }
        value={formatDate(textValue.value, field)}
        onChange={handleChange}
        min={getMinMax(field, (f) => f.min)}
        max={getMinMax(field, (f) => f.max)}
      />
    );
  },
);
