import { getInitialLanguage } from '@deriv-com/translations';
import { renderHook } from '@testing-library/react-hooks';
import useIsRtl from '../useIsRtl';

jest.mock('@deriv-com/translations', () => ({
    ...jest.requireActual('@deriv-com/translations'),
    getInitialLanguage: jest.fn(),
}));

describe('useIsRtl', () => {
    beforeEach(() => {
        (getInitialLanguage as jest.Mock).mockReturnValue('EN');
    });

    it('returns true when current language is AR', () => {
        (getInitialLanguage as jest.Mock).mockReturnValue('AR');
        const { result } = renderHook(() => useIsRtl());

        expect(result.current).toBe(true);
    });

    it('returns false when current language is EN', () => {
        const { result } = renderHook(() => useIsRtl());

        expect(result.current).toBe(false);
    });

    it('returns false when current language is not set', () => {
        (getInitialLanguage as jest.Mock).mockReturnValue(null);
        const { result } = renderHook(() => useIsRtl());

        expect(result.current).toBe(false);
    });

    it('updates isRtl when current language changes', () => {
        const { rerender, result } = renderHook(() => useIsRtl());

        expect(result.current).toBe(false);

        (getInitialLanguage as jest.Mock).mockReturnValue('AR');
        rerender();

        expect(result.current).toBe(true);
    });

    it('updates isRtl when language changes from AR to EN', () => {
        (getInitialLanguage as jest.Mock).mockReturnValue('AR');
        const { rerender, result } = renderHook(() => useIsRtl());

        expect(result.current).toBe(true);

        (getInitialLanguage as jest.Mock).mockReturnValue('EN');
        rerender();

        expect(result.current).toBe(false);
    });
});
