const clamp = (number: number, min: number, max: number): number =>
  Math.max(min, Math.min(number, max));
const clone = <T>(arr: T[]): T[] => ([] as T[]).concat(arr);

export const uniqueArray = <T>(arr: T[]): T[] => [...new Set(arr)];
export const removeFromArray = <T>(arr: T[], index: number): T[] =>
  arr.filter((_, i) => i !== index);

export const updateInArray = <T>(_arr: T[], index: number, data: T): T[] => {
  const arr = clone(_arr);

  arr.splice(index, 1, data);

  return arr;
};

export const isOccupied = (arr: any): boolean =>
  Array.isArray(arr) && arr.length > 0;

export const shiftItem = <T>(
  arr: T[],
  index: number,
  positions: number
): T[] => {
  const _arr = clone(arr);
  const toIndex = clamp(index + positions, 0, arr.length);
  const element = _arr[index];

  _arr.splice(index, 1);
  _arr.splice(toIndex, 0, element);

  return _arr;
};
