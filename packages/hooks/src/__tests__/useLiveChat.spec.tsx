import { act, renderHook } from '@testing-library/react-hooks';
import useLiveChat from '../useLiveChat';

jest.mock('js-cookie', () => ({
    get: jest.fn(() =>
        JSON.stringify({
            utm_source: 'source',
            utm_medium: 'medium',
            utm_campaign: 'campaign',
        })
    ),
}));
jest.mock('@deriv-com/utils', () => ({
    URLUtils: {
        getQueryParameter: jest.fn(() => null),
    },
}));
jest.mock('@deriv/api', () => ({
    useRemoteConfig: jest.fn(() => ({ data: { cs_chat_livechat: true } })),
}));
jest.mock('usehooks-ts', () => ({
    useIsMounted: jest.fn(() => () => true),
}));

window.LiveChatWidget = {
    init: jest.fn(),
    on: jest.fn(),
    call: jest.fn(),
    get: jest.fn(),
};

describe('useLiveChat', () => {
    const mockClientInfo = {
        is_client_store_initialized: true,
        is_logged_in: true,
        loginid: 'test_loginid',
        landing_company_shortcode: 'test_landing_company_shortcode',
        currency: 'USD',
        residence: 'US',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
    };

    const mockClientInfoNotLoggedIn = {
        is_client_store_initialized: true,
        is_logged_in: false,
        loginid: '',
        landing_company_shortcode: '',
        currency: '',
        residence: '',
        email: '',
        first_name: '',
        last_name: '',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize LiveChatWidget if client is initialized and cs_chat_livechat is available', () => {
        renderHook(() => useLiveChat(mockClientInfo));

        expect(window.LiveChatWidget.init).toHaveBeenCalled();
    });

    it('should set session variables and customer info on LiveChatWidget when ready event is triggered', () => {
        renderHook(() => useLiveChat(mockClientInfo));

        act(() => {
            const callback = (window.LiveChatWidget.on as jest.Mock).mock.calls[0][1];
            callback({ state: { visibility: 'minimized' } });
        });

        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('hide');
        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('set_session_variables', {
            is_logged_in: 'true',
            utm_source: 'source',
            utm_medium: 'medium',
            utm_campaign: 'campaign',
            loginid: 'test_loginid',
            landing_company_shortcode: 'test_landing_company_shortcode',
            currency: 'USD',
            residence: 'US',
            email: 'test@example.com',
        });
        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('set_customer_email', 'test@example.com');
        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('set_customer_name', 'John Doe');
    });

    it('should set session variables and customer info on LiveChatWidget when ready event is triggered for not logged-in user', () => {
        renderHook(() => useLiveChat(mockClientInfoNotLoggedIn));

        act(() => {
            const callback = (window.LiveChatWidget.on as jest.Mock).mock.calls[0][1];
            callback({ state: { visibility: 'minimized' } });
        });

        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('hide');
        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('set_session_variables', {
            is_logged_in: 'false',
            utm_source: 'source',
            utm_medium: 'medium',
            utm_campaign: 'campaign',
            loginid: ' ',
            landing_company_shortcode: ' ',
            currency: ' ',
            residence: ' ',
            email: ' ',
        });
        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('set_customer_email', ' ');
        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('set_customer_name', ' ');
    });
});
