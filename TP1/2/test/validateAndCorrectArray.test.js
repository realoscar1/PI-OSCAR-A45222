import { describe, it, expect } from 'vitest';
import { validateAndCorrectArray } from '../src/validateAndCorrectArray.js';

describe('validateAndCorrectArray', () => {
  describe('Numbers', () => {
    it('corrige ímpares para pares', () => {
      const out = validateAndCorrectArray(
        [1,2,3,4],
        n => n % 2 === 0,
        n => n + 1
      );
      expect(out).toEqual([
        { value: 1, corrected: 2, isValid: false },
        { value: 2, corrected: 2, isValid: true  },
        { value: 3, corrected: 4, isValid: false },
        { value: 4, corrected: 4, isValid: true  },
      ]);
    });
  });

  // <<< Objects do enunciado >>>
  describe('Objects', () => {
    it('corrige category vazia para "N/A"', () => {
      const products = [
        { name: 'Laptop', category: 'Electronics' },
        { name: 'Shirt',  category: '' },
      ];

      const out = validateAndCorrectArray(
        products,
        p => p.category?.length > 0,                  // válido se category não for vazia
        p => ({ ...p, category: p.category || 'N/A' }) // se vazio, corrige para 'N/A'
      );

      expect(out).toEqual([
        {
          value: products[0],
          corrected: { name: 'Laptop', category: 'Electronics' },
          isValid: true
        },
        {
          value: products[1],
          corrected: { name: 'Shirt', category: 'N/A' },
          isValid: false
        },
      ]);
    });
  });
});
