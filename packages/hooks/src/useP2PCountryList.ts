import { useQuery } from '@deriv/api';

/**
 * A custom hook that returns an object containing the list of countries available for P2P trading.
 *
 * For returning details of a specific country, the country code can be passed in the payload.
 * @example: useCountryList({ country: 'id' })
 *
 */
const useP2PCountryList = (payload?: NonNullable<Parameters<typeof useQuery<'p2p_country_list'>>[1]>['payload']) => {
    const { data, ...rest } = useQuery('p2p_country_list', {
        payload,
        options: { refetchOnWindowFocus: false },
    });

    return {
        p2p_country_list: data?.p2p_country_list,
        ...rest,
    };
};

export default useP2PCountryList;
