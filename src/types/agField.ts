import { Field } from './field';

export type AgField = Omit<Field, 'operators'> & {
  operators?: string[];
  excludeFromFilter?: boolean;
};
