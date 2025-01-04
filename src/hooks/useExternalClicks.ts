import * as React from 'react';

export const useExternalClicks = (
  divRef: HTMLDivElement | null,
  callback: () => void,
) => {
  React.useEffect(() => {
    const mouseClick = (mouseEvent: MouseEvent) => {
      if (divRef && mouseEvent.target) {
        if (!divRef.contains(mouseEvent.target as Node)) {
          callback();
        }
      }
    };

    document.addEventListener('mousedown', mouseClick);
    return () => document.removeEventListener('mousedown', mouseClick);
  }, [divRef, callback]);
};
