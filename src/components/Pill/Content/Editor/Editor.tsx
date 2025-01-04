import React from 'react';
import { Field, Value } from '@/types';
import { TextEditor } from './TextEditor';
import { DateTimeEditor } from './DateEditor';
import { Button } from '@/components/common/Button';
import { TiTick, TiTimes } from "react-icons/ti";
import { useDynamicCallback } from '@/hooks/useDynamicCallback';
import { NumberEditor } from './NumberEditor';
import { SearchEditor } from './SearchEditor';
import s from './style.module.less';

export interface TextValue {
  text: string;
  value: Value;
}

export interface EditorComponentProps {
  matcherKey: string;
  field: Field;
  textValue: TextValue;
  onChanged: (textValue: TextValue, valid: boolean) => void;
}

interface EditorProps {
  matcherKey: string;
  field: Field;
  textValue: TextValue;
  unset?: boolean;
  onChanged: (text: string, value: Value) => void;
  onCancel: () => void;
}

export const Editor = React.memo(({ matcherKey, field, textValue, unset, onChanged, onCancel }: EditorProps) => {
  const [valid, setValid] = React.useState<boolean>(true);
  const [tempTextValue, setTempTextValue] = React.useState<TextValue>(textValue);

  React.useEffect(() => {
    setTempTextValue(textValue);
  }, [textValue]);

  const Editor = React.useMemo(() => {
    if (field.editorType === 'date' || field.editorType === 'datetime') {
      return DateTimeEditor;
    }
    if (field.editorType === 'integer' || field.editorType === 'float') {
      return NumberEditor;
    }
    if (field.editorType === 'text') {
      return TextEditor;
    }
    return SearchEditor;
  }, [field]);

  const handleChanged = useDynamicCallback((newTextValue: TextValue, valid: boolean) => {
    setTempTextValue(newTextValue);
    setValid(valid)
  });

  const handleCancel = useDynamicCallback(() => {
    onCancel();
  });

  const handleValueChoosen = useDynamicCallback(() => {
    onChanged(tempTextValue.text, tempTextValue.value);
  });

  return (
    <div className={s.textEditor}>
      <Editor matcherKey={matcherKey} field={field} textValue={tempTextValue} onChanged={handleChanged} />
      <Button
        onClick={handleCancel}
        height={12}
        width={12}
        color='white'
        hoverColor='black'
        backgroundColor='transparent'
        hoverBackgroundColor='white'
        style={{
          alignSelf: 'center',
          marginLeft: '3px',
          paddingBlock: 0,
          paddingInline: 0,
        }}
      ><TiTimes /></Button>
      {
        valid && (!unset || tempTextValue.value !== null) &&
        <Button
          onClick={handleValueChoosen}
          height={12}
          width={12}
          color='white'
          hoverColor='black'
          backgroundColor='transparent'
          hoverBackgroundColor='white'
          style={{
            alignSelf: 'center',
            marginLeft: '3px',
            paddingBlock: 0,
            paddingInline: 0,
          }}
        ><TiTick /></Button>
      }
    </div>
  )
});