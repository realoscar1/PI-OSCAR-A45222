import { describe, it, expect } from 'vitest';
import { checkItemsExist } from '../src/checkItemsExist.js';

describe('checkItemsExist', () => {
  it('true quando todos os SKUs existem (exemplo do enunciado)', () => {
    const validProducts = [
      { sku: 'A123', name: 'Laptop' },
      { sku: 'B456', name: 'Mouse' },
      { sku: 'C789', name: 'Keyboard' },
    ];
    const check = checkItemsExist(validProducts, 'sku');

    expect(check([{ sku: 'A123' }, { sku: 'B456' }])).toBe(true);
  });

  it('false quando pelo menos um SKU não existe (exemplo do enunciado)', () => {
    const validProducts = [
      { sku: 'A123', name: 'Laptop' },
      { sku: 'B456', name: 'Mouse' },
      { sku: 'C789', name: 'Keyboard' },
    ];
    const check = checkItemsExist(validProducts, 'sku');

    expect(check([{ sku: 'A123' }, { sku: 'X999' }])).toBe(false);
  });

  it('true para items vazio (vacuamente verdadeiro)', () => {
    const valid = [{ id: 1 }, { id: 2 }];
    const check = checkItemsExist(valid, 'id');
    expect(check([])).toBe(true);
  });

  it('false quando item não tem a key', () => {
    const valid = [{ id: 1 }, { id: 2 }];
    const check = checkItemsExist(valid, 'id');
    expect(check([{}, { id: 1 }])).toBe(false);
  });

  it('aceita valores duplicados em validItems (set trata)', () => {
    const valid = [{ id: 1 }, { id: 1 }, { id: 2 }];
    const check = checkItemsExist(valid, 'id');
    expect(check([{ id: 2 }, { id: 1 }])).toBe(true);
  });

  it('lança TypeError com argumentos inválidos', () => {
    expect(() => checkItemsExist('not-array', 'id')).toThrow(TypeError);
    expect(() => checkItemsExist([], '')).toThrow(TypeError);

    const check = checkItemsExist([], 'id');
    expect(() => check('not-array')).toThrow(TypeError);
  });
});
