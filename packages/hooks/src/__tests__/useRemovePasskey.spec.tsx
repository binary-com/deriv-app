import { renderHook, act } from '@testing-library/react-hooks';
import APIProvider from '@deriv/api/src/APIProvider';
import { WS } from '@deriv/shared';
import useRemovePasskey from '../useRemovePasskey';

const mockInvalidate = jest.fn();
jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useInvalidateQuery: jest.fn(() => mockInvalidate),
}));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        send: jest.fn(() => ({
            passkeys_revoke: 1,
            passkeys_options: {
                publicKey: {},
            },
        })),
    },
}));
jest.mock('@simplewebauthn/browser', () => ({
    ...jest.requireActual('@simplewebauthn/browser'),
    startAuthentication: jest.fn(() => Promise.resolve('authenticator_response')),
}));

describe('useRemovePasskey', () => {
    const ws_error = { message: 'Test error' };
    const mockOnSuccess = jest.fn();

    const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should remove passkey', async () => {
        const { result } = renderHook(() => useRemovePasskey({ onSuccess: mockOnSuccess }), {
            wrapper,
        });

        expect(mockOnSuccess).not.toHaveBeenCalled();

        await act(async () => {
            result.current.removePasskey(123, 'test_id');
        });

        expect(WS.send).toHaveBeenCalledWith({ passkeys_options: 1, passkey_id: 'test_id' });
        expect(WS.send).toHaveBeenCalledWith({
            passkeys_revoke: 1,
            publicKeyCredential: 'authenticator_response',
            id: 123,
        });
        expect(mockInvalidate).toHaveBeenCalled();
        expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('should throw passkey removing error', async () => {
        (WS.send as jest.Mock).mockRejectedValue(ws_error);

        const { result } = renderHook(() => useRemovePasskey({ onSuccess: mockOnSuccess }), { wrapper });

        expect(mockOnSuccess).not.toHaveBeenCalled();

        await act(async () => {
            result.current.removePasskey(123, 'test_id');
        });

        expect(WS.send).toHaveBeenCalledWith({ passkeys_options: 1, passkey_id: 'test_id' });
        expect(result.current.passkey_removing_error).toBe(ws_error);
        expect(mockOnSuccess).not.toHaveBeenCalled();
    });
});
