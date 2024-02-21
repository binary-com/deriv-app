import * as React from 'react';
import { useSubscription } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useP2PCompletedOrdersNotification from '../useP2PCompletedOrdersNotification';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useSubscription: jest.fn(),
}));

const mockUseSubscription = useSubscription as jest.MockedFunction<typeof useSubscription<'p2p_order_list'>>;

describe('useP2PCompletedOrdersNotification', () => {
    test('should not subscribe to p2p_order_list if user is not logged in', () => {
        const mock = mockStore({
            client: {
                is_authorize: false,
                is_p2p_enabled: true,
                currency: 'USD',
            },
            notifications: {
                p2p_completed_orders: [],
            },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useSubscription
        mockUseSubscription.mockReturnValue({
            subscribe: jest.fn(),
            unsubscribeAll: jest.fn(),
            isSubscribed: false,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        renderHook(() => useP2PCompletedOrdersNotification(), { wrapper });
        expect(mockUseSubscription('p2p_order_list').subscribe).not.toBeCalled();
        expect(mock.notifications.p2p_completed_orders).toEqual([]);
    });

    test('should not subscribe to p2p_order_list if user p2p is disabled', () => {
        const mock = mockStore({
            client: {
                is_authorize: true,
                is_p2p_enabled: false,
                currency: 'EUR',
            },
            notifications: {
                p2p_completed_orders: [],
            },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useSubscription
        mockUseSubscription.mockReturnValue({
            subscribe: jest.fn(),
            unsubscribeAll: jest.fn(),
            isSubscribed: false,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        renderHook(() => useP2PCompletedOrdersNotification(), { wrapper });

        expect(mockUseSubscription('p2p_order_list').subscribe).not.toBeCalled();
        expect(mock.notifications.p2p_completed_orders).toEqual([]);
    });

    test('should not call unsubscribeAll from p2p_order_list if user is logged in and p2p is enabled but list is not subscribed', () => {
        const mock = mockStore({
            client: {
                is_authorize: true,
                is_p2p_enabled: true,
                currency: 'USD',
            },
            notifications: {
                p2p_completed_orders: [],
            },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useSubscription
        mockUseSubscription.mockReturnValue({
            subscribe: jest.fn(),
            unsubscribeAll: jest.fn(),
            isSubscribed: false,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { unmount } = renderHook(() => useP2PCompletedOrdersNotification(), { wrapper });

        unmount();
        expect(mockUseSubscription('p2p_order_list').unsubscribeAll).not.toBeCalled();
        expect(mock.notifications.p2p_completed_orders).toEqual([]);
    });

    test('should unsubscribeAll from p2p_order_list if user is logged in and p2p is enabled and list is subscribed', () => {
        const mock = mockStore({
            client: {
                is_authorize: true,
                is_p2p_enabled: true,
                currency: 'USD',
            },
            notifications: {
                p2p_completed_orders: [],
            },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useSubscription
        mockUseSubscription.mockReturnValue({
            subscribe: jest.fn(),
            unsubscribeAll: jest.fn(),
            isSubscribed: true,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { unmount } = renderHook(() => useP2PCompletedOrdersNotification(), { wrapper });

        unmount();
        expect(mockUseSubscription('p2p_order_list').unsubscribeAll).toBeCalled();
        expect(mock.notifications.p2p_completed_orders).toEqual([]);
    });

    test('should subscribe to completed p2p_order_list', () => {
        const mock = mockStore({
            client: {
                is_authorize: true,
                is_p2p_enabled: true,
                currency: 'USD',
            },
            notifications: {
                p2p_completed_orders: [],
            },
        });

        const mock_p2p_order_list = [
            {
                account_currency: 'USD',
                advert_details: {
                    block_trade: 0,
                    description: 'Created by script. Please call me 02203400',
                    id: '75',
                    payment_method: 'bank_transfer',
                    type: 'sell',
                },
                advertiser_details: {
                    first_name: 'QA script',
                    id: '38',
                    is_online: 1,
                    last_name: 'farhanCpsta',
                    last_online_time: 1696519153,
                    loginid: 'CR90000238',
                    name: 'client CR90000238',
                },
                amount: 0.1,
                amount_display: '0.10',
                chat_channel_url: 'p2porder_CR_52_1696518979',
                client_details: {
                    first_name: 'QA script',
                    id: '39',
                    is_online: 1,
                    is_recommended: null,
                    last_name: 'farhansrjta',
                    last_online_time: 1696519090,
                    loginid: 'CR90000239',
                    name: 'client CR90000239',
                },
                completion_time: 1696518988,
                contact_info: 'Created by script. Please call me 02203400',
                created_time: 1696518977,
                dispute_details: {
                    dispute_reason: null,
                    disputer_loginid: null,
                },
                expiry_time: 1696522577,
                id: '52',
                is_incoming: 1,
                is_reviewable: 1,
                local_currency: 'IDR',
                payment_info: 'Transfer to account 000-1111',
                price: 1350,
                price_display: '1350.00',
                rate: 13500,
                rate_display: '13500.00',
                status: 'completed',
                type: 'buy',
            },
        ];

        mockUseSubscription.mockReturnValue({
            data: {
                p2p_order_list: {
                    // @ts-expect-error need to come up with a way to mock the return type of useSubscription
                    list: mock_p2p_order_list,
                },
            },
            subscribe: jest.fn(),
            unsubscribeAll: jest.fn(),
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        renderHook(() => useP2PCompletedOrdersNotification(), { wrapper });

        expect(mockUseSubscription('p2p_order_list').subscribe).toBeCalledWith({
            payload: {
                active: 0,
            },
        });
        expect(mock.notifications.p2p_completed_orders).toEqual(mock_p2p_order_list);
    });
});
