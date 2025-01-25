import { Field, Matcher, PasteOptions } from '../../../../../../../src/types';

export declare const getMatchersFromText: (text: string, fieldMap: Map<string, Field>, pasteOptions?: PasteOptions) => Matcher | Matcher[] | null;
