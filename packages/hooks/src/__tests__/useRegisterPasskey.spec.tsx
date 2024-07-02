import { renderHook, act } from '@testing-library/react-hooks';
import APIProvider from '@deriv/api/src/APIProvider';
import { WS } from '@deriv/shared';
import useRegisterPasskey from '../useRegisterPasskey';
import { startRegistration } from '@simplewebauthn/browser';

jest.mock('@simplewebauthn/browser', () => ({
    ...jest.requireActual('@simplewebauthn/browser'),
    startRegistration: jest.fn(() => Promise.resolve('authenticator_response')),
}));
const mockInvalidate = jest.fn();
jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useInvalidateQuery: jest.fn(() => mockInvalidate),
}));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        send: jest.fn(),
    },
}));

describe('useRegisterPasskey', () => {
    const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;

    const ws_error = { message: 'Test connection error' };
    const authenticator_error = { message: 'Test authenticator error' };
    const mockOnSuccess = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (WS.send as jest.Mock).mockResolvedValue({
            passkeys_register_options: { publicKey: { name: 'test publicKey' } },
        });
    });

    it('should start passkey registration and create passkey', async () => {
        const { result } = renderHook(() => useRegisterPasskey({ onSuccess: mockOnSuccess }), { wrapper });

        expect(mockOnSuccess).not.toHaveBeenCalled();

        await act(async () => {
            await result.current.startPasskeyRegistration();
        });

        expect(WS.send).toHaveBeenCalledWith({ passkeys_register_options: 1 });

        (WS.send as jest.Mock).mockResolvedValue({ passkeys_register: { properties: { name: 'test passkey name' } } });

        await act(async () => {
            await result.current.createPasskey();
        });

        expect(WS.send).toHaveBeenCalledWith({
            passkeys_register: 1,
            publicKeyCredential: 'authenticator_response',
        });

        expect(mockInvalidate).toHaveBeenCalled();
        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });

    it('should throw passkey registration error', async () => {
        (WS.send as jest.Mock).mockRejectedValue(ws_error);

        const { result } = renderHook(() => useRegisterPasskey({ onSuccess: mockOnSuccess }), { wrapper });

        await act(async () => {
            await result.current.startPasskeyRegistration();
        });

        expect(result.current.passkey_registration_error).toBe(ws_error);
        expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should throw passkey creation error', async () => {
        const { result } = renderHook(() => useRegisterPasskey({ onSuccess: mockOnSuccess }), { wrapper });

        await act(async () => {
            await result.current.startPasskeyRegistration();
        });

        expect(WS.send).toHaveBeenCalledWith({ passkeys_register_options: 1 });

        expect(result.current.passkey_registration_error).toBe(null);

        (WS.send as jest.Mock).mockRejectedValue(ws_error);

        await act(async () => {
            await result.current.createPasskey();
        });

        expect(result.current.passkey_registration_error).toBe(ws_error);
        expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should throw passkey creation authenticator error', async () => {
        const { result } = renderHook(() => useRegisterPasskey({ onSuccess: mockOnSuccess }), { wrapper });

        await act(async () => {
            await result.current.startPasskeyRegistration();
        });

        expect(WS.send).toHaveBeenCalledWith({ passkeys_register_options: 1 });

        expect(result.current.passkey_registration_error).toBe(null);

        (startRegistration as jest.Mock).mockRejectedValue(authenticator_error);

        await act(async () => {
            await result.current.createPasskey();
        });

        expect(result.current.passkey_registration_error).toBe(authenticator_error);
        expect(mockOnSuccess).not.toHaveBeenCalled();
    });
});
