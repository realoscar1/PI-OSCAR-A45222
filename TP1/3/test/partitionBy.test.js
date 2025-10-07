import { describe, it, expect } from 'vitest';
import { partitionBy } from '../src/partitionBy.js';

describe('partitionBy (função)', () => {
  it('particiona pares/ímpares', () => {
    const [evens, odds] = partitionBy([1,2,3,4,5], n => n % 2 === 0);
    expect(evens).toEqual([2,4]);
    expect(odds).toEqual([1,3,5]);
  });
});
