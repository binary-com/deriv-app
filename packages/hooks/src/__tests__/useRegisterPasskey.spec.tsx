import React from 'react';
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

    beforeEach(() => {
        (WS.send as jest.Mock).mockResolvedValue({
            passkeys_register_options: { publicKey: { name: 'test publicKey' } },
        });
    });

    it('should start passkey registration and create passkey', async () => {
        const { result } = renderHook(() => useRegisterPasskey(), { wrapper });

        expect(result.current.is_passkey_registered).toBe(false);

        await act(async () => {
            await result.current.startPasskeyRegistration();
        });

        expect(WS.send).toHaveBeenCalledWith({ passkeys_register_options: 1 });

        (WS.send as jest.Mock).mockResolvedValue({ passkeys_register: { properties: { name: 'test passkey name' } } });

        expect(result.current.is_passkey_registration_started).toBe(true);

        await act(async () => {
            await result.current.createPasskey();
        });

        expect(WS.send).toHaveBeenCalledWith({
            passkeys_register: 1,
            publicKeyCredential: 'authenticator_response',
        });

        expect(mockInvalidate).toHaveBeenCalled();
        expect(result.current.is_passkey_registered).toBe(true);
    });

    it('should start passkey registration and cancel', async () => {
        const { result } = renderHook(() => useRegisterPasskey(), { wrapper });

        expect(result.current.is_passkey_registered).toBe(false);

        await act(async () => {
            await result.current.startPasskeyRegistration();
        });

        expect(WS.send).toHaveBeenCalledWith({ passkeys_register_options: 1 });

        (WS.send as jest.Mock).mockResolvedValue({ passkeys_register: { properties: { name: 'test passkey name' } } });

        expect(result.current.is_passkey_registration_started).toBe(true);

        await act(async () => {
            result.current.cancelPasskeyRegistration();
        });

        expect(result.current.is_passkey_registration_started).toBe(false);
    });

    it('should handle passkey registration error', async () => {
        (WS.send as jest.Mock).mockRejectedValue(ws_error);

        const { result } = renderHook(() => useRegisterPasskey(), { wrapper });

        await act(async () => {
            await result.current.startPasskeyRegistration();
        });

        expect(result.current.passkey_registration_error).toBe(ws_error);

        await act(async () => {
            result.current.clearPasskeyRegistrationError();
        });

        expect(result.current.passkey_registration_error).toBe(null);
    });

    it('should handle passkey creation error', async () => {
        const { result } = renderHook(() => useRegisterPasskey(), { wrapper });

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

        await act(async () => {
            result.current.clearPasskeyRegistrationError();
        });

        expect(result.current.passkey_registration_error).toBe(null);
    });

    it('should handle passkey creation authenticator error', async () => {
        const { result } = renderHook(() => useRegisterPasskey(), { wrapper });

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

        await act(async () => {
            result.current.clearPasskeyRegistrationError();
        });

        expect(result.current.passkey_registration_error).toBe(null);
    });
});
