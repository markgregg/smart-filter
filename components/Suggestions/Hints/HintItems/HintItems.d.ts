import { default as React } from '../../../../../node_modules/react';
import { Hint } from '../../../../../../../../../src/types';

export interface HintItemsProps {
    field: string;
    hintSource: Hint[] | (() => Hint[]);
    showAll?: boolean;
}
export declare const HintItems: React.MemoExoticComponent<({ field, hintSource, showAll }: HintItemsProps) => import("react/jsx-runtime").JSX.Element>;
