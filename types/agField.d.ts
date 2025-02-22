import { Field } from './field';

export type AgField = Omit<Field, 'operators' | 'title'> & {
    operators?: string[];
    excludeFromFilter?: boolean;
    lookup?: true;
};
