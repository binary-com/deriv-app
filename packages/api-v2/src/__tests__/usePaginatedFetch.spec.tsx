import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { TSocketResponse } from '../../types';
import APIProvider from '../APIProvider';
import AuthProvider from '../AuthProvider';
import usePaginatedFetch from '../usePaginatedFetch';

jest.mock('./../useAPI', () => ({
    __esModule: true,
    default() {
        return {
            send: async () => {
                return {
                    p2p_advert_list: {
                        list: [
                            {
                                amount: 50,
                                account_currency: 'USD',
                                amount_display: '50.00',
                            },
                        ],
                    },
                } as any;
            },
        };
    },
}));

describe('usePaginatedFetch', () => {
    it('should call p2p_advert_list and get data in response', async () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );

        const { result, waitFor } = renderHook(() => usePaginatedFetch('p2p_advert_list'), { wrapper });

        await waitFor(() => result.current.isSuccess, { timeout: 10000 });

        // const adverts_list = result.current.data?.p2p_advert_list?.list;

        // expect(adverts_list).toHaveLength(1);
        // expect(adverts_list?.[0].amount).toBe(50);
        // expect(adverts_list?.[0].account_currency).toBe('USD');
        // expect(adverts_list?.[0].amount_display).toBe('50.00');
    });
});
