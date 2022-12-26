export const excludeKey = <T, K extends keyof T>(
  data: T,
  keys: K[],
): Omit<T, K> => {
  for (let key of keys) {
    delete data[key];
  }
  return data;
};
