import { renderHook } from '@testing-library/react-hooks';
import { useQuery } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import useGetPasskeysList from '../useGetPasskeysList';
import useAuthorize from '../useAuthorize';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useQuery: jest.fn(),
}));

jest.mock('../useAuthorize', () => jest.fn(() => ({ isSuccess: true })));

describe('useGetPasskeysList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mock = mockStore({
        client: { is_passkey_supported: true },
    });

    const wrapper = ({ children }: { children: JSX.Element }) => <StoreProvider store={mock}>{children}</StoreProvider>;

    it('calls useQuery when is_logged_in and is_passkey_supported are true', () => {
        (useQuery as jest.Mock).mockReturnValue({ data: { passkeys_list: [] } });

        const { result } = renderHook(() => useGetPasskeysList(), { wrapper });

        expect(useQuery).toHaveBeenCalledWith('passkeys_list', { options: { enabled: true, retry: 0 } });
        expect(result.current.passkeys_list).toEqual([]);
    });

    it('calls useQuery with enabled set to false when is_logged_in is false', () => {
        (useQuery as jest.Mock).mockReturnValue({ data: { passkeys_list: undefined } });
        (useAuthorize as jest.Mock).mockReturnValueOnce({ isSuccess: false });

        const { result } = renderHook(() => useGetPasskeysList(), { wrapper });

        expect(useQuery).toHaveBeenCalledWith('passkeys_list', { options: { enabled: false, retry: 0 } });
        expect(result.current.passkeys_list).toEqual(undefined);
    });

    it('calls useQuery with enabled set to false when is_passkey_supported is false', () => {
        (useQuery as jest.Mock).mockReturnValue({ data: { passkeys_list: undefined } });
        mock.client.is_passkey_supported = false;

        const { result } = renderHook(() => useGetPasskeysList(), { wrapper });

        expect(useQuery).toHaveBeenCalledWith('passkeys_list', { options: { enabled: false, retry: 0 } });
        expect(result.current.passkeys_list).toEqual(undefined);
    });
});
