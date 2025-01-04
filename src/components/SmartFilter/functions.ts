export const isUnique = <T>(
  value: T,
  index: number,
  array: T[],
): boolean => array.indexOf(value) === index;

