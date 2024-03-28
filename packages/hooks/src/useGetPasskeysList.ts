import { useQuery } from '@deriv/api';
import { useStore } from '@deriv/stores';

const useGetPasskeysList = () => {
    const { client, ui } = useStore();
    const { is_passkey_supported, is_logged_in } = client;

    const { data, error, isLoading, refetch, ...rest } = useQuery('passkeys_list', {
        options: {
            enabled: is_passkey_supported && is_logged_in,
        },
    });

    return {
        passkeys_list: data?.passkeys_list,
        passkeys_list_error: error?.error ?? null,
        reloadPasskeysList: refetch,
        is_passkeys_list_loading: isLoading,
        ...rest,
    };
};

export default useGetPasskeysList;
