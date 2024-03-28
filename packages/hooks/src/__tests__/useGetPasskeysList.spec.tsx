import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useQuery } from '@deriv/api';
import useGetPasskeysList from '../useGetPasskeysList';
import { mockStore, StoreProvider } from '@deriv/stores';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useQuery: jest.fn(),
}));

describe('useGetPasskeysList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mock = mockStore({
        client: { is_passkey_supported: true, is_logged_in: true },
    });

    const wrapper = ({ children }: { children: JSX.Element }) => <StoreProvider store={mock}>{children}</StoreProvider>;

    it('calls useQuery when is_logged_in and is_passkey_supported are true', () => {
        (useQuery as jest.Mock).mockReturnValue({ data: { passkeys_list: [] } });

        const { result } = renderHook(() => useGetPasskeysList(), { wrapper });

        expect(useQuery).toHaveBeenCalledWith('passkeys_list', { options: { enabled: true } });
        expect(result.current.passkeys_list).toEqual([]);
    });
    it('calls useQuery with enabled set to false when is_logged_in is false', () => {
        (useQuery as jest.Mock).mockReturnValue({ data: { passkeys_list: undefined } });
        mock.client.is_logged_in = false;

        const { result } = renderHook(() => useGetPasskeysList(), { wrapper });

        expect(useQuery).toHaveBeenCalledWith('passkeys_list', { options: { enabled: false } });
        expect(result.current.passkeys_list).toEqual(undefined);
    });
    it('calls useQuery with enabled set to false when is_passkey_supported is false', () => {
        (useQuery as jest.Mock).mockReturnValue({ data: { passkeys_list: undefined } });
        mock.client.is_passkey_supported = false;
        mock.client.is_logged_in = true;

        const { result } = renderHook(() => useGetPasskeysList(), { wrapper });

        expect(useQuery).toHaveBeenCalledWith('passkeys_list', { options: { enabled: false } });
        expect(result.current.passkeys_list).toEqual(undefined);
    });
});
