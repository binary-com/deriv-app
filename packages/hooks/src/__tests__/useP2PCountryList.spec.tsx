import React from 'react';
import { APIProvider, useQuery } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';
import useP2PCountryList from '../useP2PCountryList';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useQuery: jest.fn(),
}));

const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;
const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery<'p2p_country_list'>>;

describe('useP2PCountryList', () => {
    it('should return undefined when there is no response', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useQuery
        mockUseQuery.mockReturnValue({ data: {} });
        const { result } = renderHook(() => useP2PCountryList(), { wrapper });
        expect(result.current.p2p_country_list).toBeUndefined();
    });

    it('should return country list with the correct details', () => {
        const mockQueryData = {
            p2p_country_list: {
                ai: {
                    country_name: 'Anguilla',
                    cross_border_ads_enabled: 1,
                    fixed_rate_adverts: 'enabled',
                    float_rate_adverts: 'disabled',
                    float_rate_offset_limit: 10,
                    local_currency: 'XCD',
                    payment_methods: {
                        alipay: {
                            display_name: 'Alipay',
                            fields: {
                                account: {
                                    display_name: 'Alipay ID',
                                    required: 1,
                                    type: 'text',
                                },
                                instructions: {
                                    display_name: 'Instructions',
                                    required: 0,
                                    type: 'memo',
                                },
                            },
                            type: 'ewallet',
                        },
                    },
                },
            },
        };
        // @ts-expect-error need to come up with a way to mock the return type of useQuery
        mockUseQuery.mockReturnValue({
            data: mockQueryData,
        });

        const { result } = renderHook(() => useP2PCountryList(), { wrapper });
        const { p2p_country_list } = result.current;
        if (p2p_country_list) {
            expect(p2p_country_list).toEqual(mockQueryData.p2p_country_list);
        }
    });
    it('should call the useQuery with parameters if passed', () => {
        renderHook(() => useP2PCountryList({ country: 'id' }), { wrapper });
        expect(mockUseQuery).toHaveBeenCalledWith('p2p_country_list', {
            payload: { country: 'id' },
            options: { refetchOnWindowFocus: false },
        });
    });
    it('should call the useQuery with default parameters if not passed', () => {
        renderHook(() => useP2PCountryList(), { wrapper });
        expect(mockUseQuery).toHaveBeenCalledWith('p2p_country_list', {
            payload: undefined,
            options: { refetchOnWindowFocus: false },
        });
    });
});
