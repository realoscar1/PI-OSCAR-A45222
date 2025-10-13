import { describe, it, expect } from 'vitest';
import { timeExecution } from '../src/timeExecution.js';

describe('timeExecution', () => {
  it('mede função sincrónica e devolve {result, timeMs}', () => {
    const sum = (a, b) => a + b;
    const timedSum = timeExecution(sum);
    const { result, timeMs } = timedSum(10, 20);
    expect(result).toBe(30);
    expect(typeof timeMs).toBe('number');
    expect(timeMs).toBeGreaterThanOrEqual(0);
  });

  it('mede método de objeto preservando this', () => {
    const obj = {
      factor: 3,
      mul(n) { return this.factor * n; }
    };
    const timedMul = timeExecution(obj, 'mul');
    const { result } = timedMul(7);
    expect(result).toBe(21); // this preservado (factor=3)
  });

  it('mede função assíncrona (Promise) e resolve com {result, timeMs}', async () => {
    const fetchMock = async (x) => {
      await new Promise(r => setTimeout(r, 20));
      return x * 2;
    };
    const timedFetch = timeExecution(fetchMock);
    const { result, timeMs } = await timedFetch(5);
    expect(result).toBe(10);
    expect(timeMs).toBeGreaterThanOrEqual(18); // margem
  });

  it('anexa timeMs num erro de Promise rejeitada', async () => {
    const willFail = async () => {
      await new Promise(r => setTimeout(r, 10));
      throw new Error('boom');
    };
    const timedFail = timeExecution(willFail);
    await expect(timedFail()).rejects.toThrow('boom');
    try {
      await timedFail();
    } catch (e) {
      expect(typeof e.timeMs).toBe('number');
      expect(e.timeMs).toBeGreaterThanOrEqual(8);
    }
  });

  it('valida argumentos (modo função solta)', () => {
    expect(() => timeExecution(123)).toThrow(TypeError);
  });

  it('valida argumentos (modo método de objeto)', () => {
    expect(() => timeExecution({}, 'x')).toThrow(TypeError);
  });
});
