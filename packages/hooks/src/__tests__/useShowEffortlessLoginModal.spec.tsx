import { renderHook } from '@testing-library/react-hooks';
import useShowEffortlessLoginModal from '../useShowEffortlessLoginModal';
import useGetPasskeysList from '../useGetPasskeysList';
import { mockStore, StoreProvider } from '@deriv/stores';
import * as React from 'react';

jest.mock('../useGetPasskeysList');

describe('useShowEffortlessLoginModal', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    const mock = mockStore({
        client: { is_passkey_supported: true, is_logged_in: true },
        ui: { is_mobile: true },
    });

    const wrapper = ({ children }: { children: JSX.Element }) => <StoreProvider store={mock}>{children}</StoreProvider>;

    it('should return false when passkey is not supported', () => {
        mock.client.is_passkey_supported = false;
        (useGetPasskeysList as jest.Mock).mockReturnValue({ passkeys_list: [], is_passkeys_list_loading: false });

        const { result } = renderHook(() => useShowEffortlessLoginModal(), { wrapper });
        expect(result.current).toBe(false);
    });

    it('should return false when passkeys list is not empty', () => {
        mock.client.is_passkey_supported = true;

        (useGetPasskeysList as jest.Mock).mockReturnValue({
            passkeys_list: ['passkey1'],
            is_passkeys_list_loading: false,
        });

        const { result } = renderHook(() => useShowEffortlessLoginModal(), { wrapper });
        expect(result.current).toBe(false);
    });
    it('should return true when passkey is supported and passkeys list is empty', async () => {
        (useGetPasskeysList as jest.Mock).mockReturnValue({ passkeys_list: [], is_passkeys_list_loading: false });

        const { result } = renderHook(() => useShowEffortlessLoginModal(), { wrapper });

        expect(result.current).toBe(true);
    });
});
