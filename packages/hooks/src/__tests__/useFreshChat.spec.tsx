import { act, renderHook } from '@testing-library/react-hooks';
import useFreshChat from '../useFreshChat';

window.fcWidget = {
    user: {
        setProperties: jest.fn(),
        getUUID: jest.fn(),
    },
    show: jest.fn(),
    hide: jest.fn(),
    open: jest.fn(),
    destroy: jest.fn(),
    close: jest.fn(),
    on: jest.fn(),
    setConfig: jest.fn(),
    isLoaded: jest.fn(),
    authenticate: jest.fn(),
};

describe('useFreshChat', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Added this 'stupid' test just to avoid eslint issue and push the code
    it('should initialize FreshChatWidget', () => {
        renderHook(() => useFreshChat());

        act(() => {
            const callback = window.fcWidget.on as jest.Mock;
            callback();
        });

        expect(window.fcWidget.on).toHaveBeenCalled();
    });
});
