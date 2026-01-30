import { useState, useCallback } from 'react';

/**
 * 平台状态管理 Hook
 */
export function usePlatformState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);

  const updateState = useCallback((updates: Partial<T>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  return { state, updateState, resetState, setState };
}
