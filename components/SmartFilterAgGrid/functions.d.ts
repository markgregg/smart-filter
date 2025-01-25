import { ClientApi } from '../../../../../../../src/aggrid/ClientApi';
import { Field } from '../../../../../../../src/types';
import { AgField } from '../../../../../../../src/types/agField';
import { ScalarAdvancedFilterModelType, TextAdvancedFilterModelType } from '../../../../../../../src/types/agGrid';

export declare const textComparisonMap: Map<string, TextAdvancedFilterModelType>;
export declare const scalarComparisonMap: Map<string, ScalarAdvancedFilterModelType>;
export declare const getComparisons: (type?: string | boolean, filter?: string) => string[];
export declare const getPrecedence: (filter?: string) => number;
export declare const getDefaultComparison: (type?: string | boolean, filter?: string) => string;
export declare const useLists: (filter?: string) => boolean;
export declare const useRanges: (type?: string | boolean, filter?: string) => boolean;
export declare const convertToheader: (field?: string) => string;
export declare const constructFields: (agClientApi: ClientApi | null, fields?: AgField[], dateFormats?: string[], displayDateFormat?: string, returnAllOptions?: boolean) => Field[] | null;
