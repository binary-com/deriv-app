import { useQuery } from '@deriv/api';
import { useStore } from '@deriv/stores';
import useAuthorize from './useAuthorize';

const useGetPasskeysList = () => {
    const { client } = useStore();
    const { isSuccess } = useAuthorize();
    const { is_passkey_supported } = client;

    const { data, error, isLoading, isFetching, ...rest } = useQuery('passkeys_list', {
        options: {
            enabled: is_passkey_supported && isSuccess,
            retry: 0,
        },
    });

    return {
        passkeys_list: data?.passkeys_list,
        passkeys_list_error: error ?? null,
        is_passkeys_list_loading: isLoading || isFetching,
        ...rest,
    };
};

export default useGetPasskeysList;
