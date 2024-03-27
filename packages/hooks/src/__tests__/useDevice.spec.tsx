import { renderHook } from '@testing-library/react-hooks';
import useDevice from '../useDevice';

const mockWindowSize = jest.fn();
jest.mock('usehooks-ts', () => ({
    useWindowSize: () => mockWindowSize(),
}));

describe('useDevice', () => {
    it('should correctly identify a desktop device', () => {
        mockWindowSize.mockReturnValue({ width: 1280 });
        const { result } = renderHook(() => useDevice());
        expect(result.current.isDesktop).toBe(true);
        expect(result.current.isMobile).toBe(false);
        expect(result.current.isTablet).toBe(false);
    });

    it('should correctly identify a mobile device', () => {
        mockWindowSize.mockReturnValue({ width: 599 });
        const { result } = renderHook(() => useDevice());
        expect(result.current.isMobile).toBe(true);
        expect(result.current.isDesktop).toBe(false);
        expect(result.current.isTablet).toBe(false);
    });

    it('should correctly identify a tablet device', () => {
        mockWindowSize.mockReturnValue({ width: 768 });
        const { result } = renderHook(() => useDevice());
        expect(result.current.isTablet).toBe(true);
        expect(result.current.isDesktop).toBe(false);
        expect(result.current.isMobile).toBe(false);
    });
});
