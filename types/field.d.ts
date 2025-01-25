import { IconType } from 'react-icons';
import { FieldMatch } from './fieldMatches';
import { Value } from './matcher';
import { DisplayComponentProps } from '../../../../../../src/components/Pill/Content/Display';
import { EditorComponentProps } from '../../../../../../src/components/Pill/Content/Editor';

export type ValueType = 'bool' | 'integer' | 'float' | 'text' | 'date' | 'datetime' | 'dateString' | 'datetimeString';
export type FieldDisplay = 'icon' | 'text' | 'both';
export interface Field {
    name: string;
    title: string;
    operators: string[];
    defaultComparison?: string;
    editorType?: ValueType;
    fieldMatchers?: FieldMatch[];
    dateTimeFormat?: string;
    min?: number | string | Date;
    max?: number | string | Date;
    increments?: number;
    precedence?: number;
    instanceLimit?: number;
    allowList?: boolean;
    allowRange?: boolean;
    allowBlanks?: boolean;
    excludeFromSorting?: boolean;
    iconMap?: Map<Value, IconType>;
    display?: FieldDisplay;
    textGetter?: (item: object) => string;
    valueGetter?: (item: object) => Value;
    displayComponent?: React.ComponentType<DisplayComponentProps>;
    editComponent?: React.ComponentType<EditorComponentProps>;
}
