import React from 'react';

type AnyFunction = (...args: any) => any;

export function useDynamicCallback(this: ThisParameterType<AnyFunction>, callback: AnyFunction) {
  const ref = React.useRef<AnyFunction>();
  ref.current = callback;
  return React.useCallback((...args: Parameters<AnyFunction>) => ref.current?.apply(this, args), []);
}