/**
 * checkItemsExist(validItems, key) -> (items) => boolean
 * Verifica se todos os items existem em validItems com base na propriedade 'key'.
 */
export function checkItemsExist(validItems, key) {
  if (!Array.isArray(validItems)) {
    throw new TypeError('Expected first argument to be an array of valid items');
  }
  if (typeof key !== 'string' || key.length === 0) {
    throw new TypeError('Expected second argument to be a non-empty string key');
  }

  // Pré-processamento: conjunto de chaves válidas
  const validKeys = new Set(validItems.map(v => v?.[key]));

  // Função retornada que verifica um array de items
  return function verify(items) {
    if (!Array.isArray(items)) {
      throw new TypeError('Expected items to be an array');
    }
    return items.every(it => validKeys.has(it?.[key]));
  };
}
