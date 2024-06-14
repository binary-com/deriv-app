import { renderHook } from '@testing-library/react-hooks';
import { MAX_MOBILE_WIDTH, MIN_DESKTOP_WIDTH, useDevice } from '..';

describe('useDevice', () => {
    const TEST_DESKTOP_WIDTH = 1300;
    it('should return correct is_mobile value', () => {
        window.innerWidth = TEST_DESKTOP_WIDTH;
        const { result: desktop_result } = renderHook(() => useDevice());
        expect(desktop_result.current.is_mobile).toEqual(false);

        window.innerWidth = MIN_DESKTOP_WIDTH;
        const { result: tablet_result } = renderHook(() => useDevice());
        expect(tablet_result.current.is_mobile).toEqual(false);

        window.innerWidth = MAX_MOBILE_WIDTH;
        const { result: mobile_result } = renderHook(() => useDevice());
        expect(mobile_result.current.is_mobile).toEqual(true);
    });
    it('should return correct is_tablet value', () => {
        window.innerWidth = TEST_DESKTOP_WIDTH;
        const { result: desktop_result } = renderHook(() => useDevice());
        expect(desktop_result.current.is_tablet).toEqual(false);

        window.innerWidth = MIN_DESKTOP_WIDTH;
        const { result: tablet_result } = renderHook(() => useDevice());
        expect(tablet_result.current.is_tablet).toEqual(false);

        window.innerWidth = MAX_MOBILE_WIDTH;
        const { result: mobile_result } = renderHook(() => useDevice());
        expect(mobile_result.current.is_tablet).toEqual(false);
    });
    it('should return correct is_desktop value', () => {
        window.innerWidth = TEST_DESKTOP_WIDTH;
        const { result: desktop_result } = renderHook(() => useDevice());
        expect(desktop_result.current.is_desktop).toEqual(true);

        window.innerWidth = MIN_DESKTOP_WIDTH;
        const { result: tablet_result } = renderHook(() => useDevice());
        expect(tablet_result.current.is_desktop).toEqual(true);

        window.innerWidth = MAX_MOBILE_WIDTH;
        const { result: mobile_result } = renderHook(() => useDevice());
        expect(mobile_result.current.is_desktop).toEqual(false);
    });
});
