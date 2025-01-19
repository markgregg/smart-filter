import React from 'react';
import { TiTick, TiTimes } from 'react-icons/ti';
import { Field, Value } from '@/types';
import { TextEditor } from './TextEditor';
import { DateTimeEditor } from './DateEditor';
import { Button } from '@/components/common/Button';
import { NumberEditor } from './NumberEditor';
import { SearchEditor } from './SearchEditor';
import { Colours } from '@/util/colours';
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

export const Editor = React.memo(
  ({
    matcherKey,
    field,
    textValue,
    unset,
    onChanged,
    onCancel,
  }: EditorProps) => {
    const [valid, setValid] = React.useState<boolean>(true);
    const [tempTextValue, setTempTextValue] =
      React.useState<TextValue>(textValue);

    React.useEffect(() => {
      setTempTextValue(textValue);
    }, [textValue]);

    const ContentEditor = React.useMemo(() => {
      if (field.editComponent) {
        return field.editComponent;
      }
      if (field.editorType === 'date' || field.editorType === 'datetime' ||
        field.editorType === 'dateString' || field.editorType === 'datetimeString') {
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

    const handleChanged = React.useCallback(
      (newTextValue: TextValue, isValid: boolean) => {
        if (isValid && newTextValue.value === tempTextValue.value) {
          onChanged(tempTextValue.text, tempTextValue.value);
          return;
        }
        setTempTextValue(newTextValue);
        setValid(isValid);
      },
      [onChanged, tempTextValue, setTempTextValue, setValid],
    );

    const handleCancel = React.useCallback(() => {
      onCancel();
    }, [onCancel]);

    const handleValueChoosen = React.useCallback(() => {
      onChanged(tempTextValue.text, tempTextValue.value);
    }, [onChanged, tempTextValue]);

    return (
      <div className={s.textEditor}>
        <ContentEditor
          matcherKey={matcherKey}
          field={field}
          textValue={tempTextValue}
          onChanged={handleChanged}
        />
        <Button
          id="sf-editor-close"
          onClick={handleCancel}
          height={12}
          width={12}
          color={Colours.buttons.editor}
          hoverColor={Colours.buttons.editorHover}
          backgroundColor={Colours.buttons.editorBackground}
          hoverBackgroundColor={Colours.buttons.editorHoverBackground}
          style={{
            alignSelf: 'center',
            marginLeft: '3px',
            paddingBlock: 0,
            paddingInline: 0,
          }}
        >
          <TiTimes />
        </Button>
        {valid && (!unset || tempTextValue.value !== null) && (
          <Button
            id="sf-editor-accept"
            onClick={handleValueChoosen}
            height={12}
            width={12}
            color="white"
            hoverColor="black"
            backgroundColor="transparent"
            hoverBackgroundColor="white"
            style={{
              alignSelf: 'center',
              marginLeft: '3px',
              paddingBlock: 0,
              paddingInline: 0,
            }}
          >
            <TiTick />
          </Button>
        )}
      </div>
    );
  },
);
