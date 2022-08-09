type Falsy = false | 0 | "" | null | undefined;

// this is a type predicate - if x is `truthy`, then it's T
export const isTruthy = <T>(x: T | Falsy): x is T => !!x;
