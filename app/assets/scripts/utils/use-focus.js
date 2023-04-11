import { useRef } from 'react';

/**
 * Helper hook to auto focus inputs in case `autofocus` cannot be applied.
 * @param {*} delay time to trigger focus
 */
export function useFocus(delay = 0) {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    setTimeout(() => {
      htmlElRef.current && htmlElRef.current.focus();
    }, delay);
  };

  return [htmlElRef, setFocus];
}
