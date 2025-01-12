import { Matcher } from "./matcher";

export interface FieldPasteMatchPatterns {
  field: string;
  patterns: (RegExp | ((text: string) => boolean)) | (RegExp | ((text: string) => boolean))[];
}

export type CustomPasteParser = (text: string) => Partial<Matcher>[] | null;

export interface PasteOptions {
  fieldPasteMatchPatterns?: FieldPasteMatchPatterns[];
  customParsers?: CustomPasteParser[];
}
