export const uniqueArray = <T>(arr: T[]): T[] => [...new Set(arr)];
export const removeFromArray = <T>(arr: T[], index: number): T[] =>
  arr.filter((_, i) => i !== index);

export const updateInArray = <T>(arr: T[], index: number, data: T): T[] =>
  arr.splice(index, 1, data) && arr;

export const isOccupied = (arr: any): boolean =>
  Array.isArray(arr) && arr.length > 0;
