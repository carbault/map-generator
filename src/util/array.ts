/**
 * Indexes an array of objects using of its attributes.
 * This functions doesn't handle duplicates values of
 * that attribute.
 */
export function indexBy<
  T extends { [key in K]: V },
  K extends keyof T,
  V extends string | number | symbol,
>(arr: T[], key: K): Record<T[K], T> {
  const record = {} as Record<T[K], T>;
  arr.forEach((value: T) => {
    record[value[key]] = value;
  });
  return record;
}

/**
 * Returns the object in array with the lowest
 * value for a given number attribute
 */
export function minBy<T extends { [key in K]: number }, K extends keyof T>(
  arr: T[],
  key: K
): T {
  return arr.reduce(
    (acc, current) => (acc[key] > current[key] ? current : acc),
    arr[0]
  );
}
