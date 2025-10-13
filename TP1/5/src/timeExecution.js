// Util: relógio de alta resolução com fallback
function now() {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }
  return Date.now(); // fallback (ms)
}

/**
 * timeExecution(target[, methodName])
 *  - timeExecution(fn) -> wrapper que mede fn(...args)
 *  - timeExecution(obj, 'method') -> wrapper que mede obj.method(...args) preservando this
 *
 * @returns {Function} wrapper (...args) => { result, timeMs } | Promise<{ result, timeMs }>
 */
export function timeExecution(target, maybeMethodName) {
  let fn;
  let ctx = undefined;

  if (typeof target === 'function' && maybeMethodName === undefined) {
    // modo função solta
    fn = target;
  } else if (
    typeof target === 'object' &&
    target !== null &&
    typeof maybeMethodName === 'string'
  ) {
    // modo método de objeto
    if (typeof target[maybeMethodName] !== 'function') {
      throw new TypeError(`Property "${maybeMethodName}" is not a function on the provided object`);
    }
    ctx = target;
    fn = target[maybeMethodName];
  } else {
    throw new TypeError('Invalid arguments. Use timeExecution(fn) or timeExecution(obj, "methodName")');
  }

  // wrapper medidor (preserva this quando em modo método)
  return function timedWrapper(...args) {
    const t0 = now();
    const out = fn.apply(ctx ?? this, args); // se for usado como método encadeado, this é preservado

    // Se devolver Promise, mede até resolver/rejeitar
    if (out && typeof out.then === 'function') {
      return out.then(
        (res) => ({ result: res, timeMs: now() - t0 }),
        (err) => {
          // ainda assim reporta o tempo e propaga o erro
          const elapsed = now() - t0;
          err.timeMs = elapsed;
          throw err;
        }
      );
    }

    // Sincrono
    return { result: out, timeMs: now() - t0 };
  };
}
