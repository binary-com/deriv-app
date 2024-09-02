import { useQuery } from '@deriv/api';
import { TSocketRequestQueryOptions } from '@deriv/api/types';
/**
 * Custom hook to get states list for a particular country.
 * @returns an object with the states list and the options to manage API response.
 */
const useStatesList = (country: string, options?: TSocketRequestQueryOptions<'states_list'>) => {
    const { data, ...rest } = useQuery('states_list', {
        payload: { states_list: country },
        options: {
            enabled: !!country,
            staleTime: Infinity,
            ...options,
        },
    });

    return { ...rest, data: data?.states_list ?? [] };
};

export default useStatesList;
