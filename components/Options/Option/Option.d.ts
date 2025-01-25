import { default as React } from '../../../../node_modules/react';
import { Option as OptionType } from '../../../../../../../../src/types';

export interface OptionProps {
    option: OptionType;
    active: boolean;
}
export declare const Option: React.MemoExoticComponent<({ option, active }: OptionProps) => import("react/jsx-runtime").JSX.Element>;
