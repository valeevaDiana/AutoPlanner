import { useEffect } from 'react';

export const useEscapeKey = (callback: () => void, isActive: boolean = true) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    if (isActive) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [callback, isActive]);
};