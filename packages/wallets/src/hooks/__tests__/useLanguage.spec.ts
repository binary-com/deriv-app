import { getInitialLanguage } from '@deriv-com/translations';
import { act, renderHook } from '@testing-library/react-hooks';
import useLanguage from '../useLanguage';

describe('useLanguage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (getInitialLanguage as jest.Mock).mockReturnValue('AR');
    });

    it('returns "EN" if no preferred language is provided', () => {
        const { result } = renderHook(() => useLanguage(null));
        expect(result.current).toBe('EN');
    });

    it('returns the preferred language if provided on initial render', () => {
        const { result } = renderHook(() => useLanguage('EN'));
        expect(result.current).toBe('EN');
    });

    it('keeps the preferred language on rerender if preferred language does not change', () => {
        const { rerender, result } = renderHook(({ lang }) => useLanguage(lang), {
            initialProps: { lang: 'EN' as const },
        });

        expect(result.current).toBe('EN');

        act(() => {
            rerender({ lang: 'EN' });
        });

        expect(result.current).toBe('EN');
        expect(getInitialLanguage).toHaveBeenCalledTimes(2);
    });

    it('updates to new preferred language if it changes', () => {
        const { rerender, result } = renderHook(({ lang }) => useLanguage(lang), {
            initialProps: { lang: 'EN' as 'AR' | 'EN' },
        });

        expect(result.current).toBe('EN');

        act(() => {
            rerender({ lang: 'AR' });
        });

        expect(result.current).toBe('AR');
    });

    it('does not update language if preferred language is null', () => {
        const { rerender, result } = renderHook(({ lang }) => useLanguage(lang), { initialProps: { lang: null } });

        expect(result.current).toBe('EN');

        act(() => {
            rerender({ lang: null });
        });

        expect(result.current).toBe('EN');
    });
});
