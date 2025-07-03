// import { useEffect, useRef, useCallback } from 'react';

type AnyFunction = (...args: any[]) => any;

/*
export function useDebounce<T extends AnyFunction>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(func);

  useEffect(() => {
    callbackRef.current = func;
  }, [func]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
}
*/

export function useDebounce(callback: AnyFunction, delay: number) {
  let timeoutId: NodeJS.Timeout;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}
