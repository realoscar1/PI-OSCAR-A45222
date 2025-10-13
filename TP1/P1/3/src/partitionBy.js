export function partitionBy(arr, predicate) {
  if (!Array.isArray(arr)) throw new TypeError('Expected first argument to be an array');
  if (typeof predicate !== 'function') throw new TypeError('Expected predicate to be a function');
  return arr.reduce((acc, v, i, a) => {
    (predicate(v, i, a) ? acc[0] : acc[1]).push(v);
    return acc;
  }, [[], []]);
}
