import { default as React } from '../../../node_modules/react';
import { Field, Matcher } from '../../../../../../../src/types';

interface PillProps {
    matcher: Matcher;
    index: number;
}
export interface ContentProps {
    matcher: Matcher;
    field: Field | null;
}
export declare const Pill: React.MemoExoticComponent<({ matcher, index }: PillProps) => import("react/jsx-runtime").JSX.Element>;
export {};
