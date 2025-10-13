import { describe, it, expect } from 'vitest';
import { validateArrayElements } from '../src/validateArrayElements.js';

describe('validateArrayElements', () => {
  describe('Numbers', () => {
    it('valida números pares', () => {
      const out = validateArrayElements([2,3,4,5], n => n % 2 === 0);
      expect(out).toEqual([
        { value: 2, isValid: true },
        { value: 3, isValid: false },
        { value: 4, isValid: true },
        { value: 5, isValid: false },
      ]);
    });
  });

  // <<< Objects do enunciado >>>
  describe('Objects', () => {
    it('valida produtos com category não vazia', () => {
      const products = [
        { name: 'Laptop', category: 'Electronics' },
        { name: 'Shirt',  category: '' },
        { name: 'Chair',  category: 'Furniture' },
      ];
      const out = validateArrayElements(products, p => p.category?.length > 0);

      expect(out).toEqual([
        { value: products[0], isValid: true },
        { value: products[1], isValid: false },
        { value: products[2], isValid: true },
      ]);
    });
  });
});
