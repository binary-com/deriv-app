import { useCallback } from 'react';

type ScrollElementToTop = (rootEl: HTMLElement, targetEl: HTMLElement, offset: number) => void;

export const useScrollElementToTop = (): ScrollElementToTop => {
    const scrollElementToTop: ScrollElementToTop = useCallback((rootEl, targetEl, offset = 0) => {
        if (rootEl && targetEl) {
            rootEl.scrollTo({
                top: targetEl.offsetTop - offset,
                behavior: 'smooth',
            });
        }
    }, []);

    return scrollElementToTop;
};
