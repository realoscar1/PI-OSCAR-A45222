
export function validateAndCorrectArray(arr, elementValidator, elementCorrector) {
  // Validação dos tipos de argumentos
  if (!Array.isArray(arr)) {
    throw new TypeError('Expected first argument to be an array');
  }
  if (typeof elementValidator !== 'function') {
    throw new TypeError('Expected second argument to be a function');
  }
  if (typeof elementCorrector !== 'function') {
    throw new TypeError('Expected third argument to be a function');
  }

  // Geração do novo array
  return arr.map((value, index) => {
    const isValid = !!elementValidator(value, index, arr);
    const corrected = isValid ? value : elementCorrector(value, index, arr);

    return { value, corrected, isValid };
  });
}
