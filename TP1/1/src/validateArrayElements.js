
export function validateArrayElements(arr, elementValidator) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Expected first argument to be an array');
  }
  if (typeof elementValidator !== 'function') {
    throw new TypeError('Expected second argument to be a function');
  }

  
  return arr.map((value, index) => ({
    value,
    isValid: !!elementValidator(value, index, arr),
  }));
}
