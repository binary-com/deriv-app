import { renderHook, act } from '@testing-library/react-hooks';
import useIsLiveChatWidgetAvailable from '../useIsLiveChatWidgetAvailable';

window.LiveChatWidget = {
    on: jest.fn(),
    call: jest.fn(),
    get: jest.fn(),
    init: jest.fn(),
};

describe('useIsLiveChatWidgetAvailable', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return initial state correctly', () => {
        const { result } = renderHook(() => useIsLiveChatWidgetAvailable());

        expect(result.current.is_livechat_available).toBe(false);
    });

    it('should update state when LiveChatWidget.on is triggered', async () => {
        const { result } = renderHook(() => useIsLiveChatWidgetAvailable());

        act(() => {
            const callback = (window.LiveChatWidget.on as jest.Mock).mock.calls[0][1];
            callback({ state: { availability: 'online' } });
        });

        expect(result.current.is_livechat_available).toBe(true);
    });
});
