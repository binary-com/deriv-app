import React from 'react';
import { useWS } from '@deriv/shared';
import { act, renderHook } from '@testing-library/react-hooks';
import APIProvider from '../APIProvider';
import AuthProvider from '../AuthProvider';
import useSubscription from '../useSubscription';

jest.mock('./../useAPI', () => ({
    __esModule: true,
    default() {
        return {
            subscribe() {
                return {
                    subscribe: async (onData: (response: unknown) => void, onError: (response: unknown) => void) => {
                        const delay = (ms: number) => new Promise<never>(resolve => setTimeout(resolve, ms));
                        await delay(500);
                        onData({ p2p_order_info: { status: 'pending' } });
                        await delay(500);
                        onData({ p2p_order_info: { status: 'buyer-confirmed' } });
                        await delay(500);
                        onData({ p2p_order_info: { status: 'disputed' } });
                        await delay(500);
                        onError({ error: { code: 'Foo', message: 'Error message' } });
                        await delay(500);
                        onData({ p2p_order_info: { status: 'completed' } });
                        return { unsubscribe: () => Promise.resolve() };
                    },
                };
            },
        };
    },
}));

describe('useSubscription', () => {
    test('should subscribe to p2p_order_info and get the order updates', async () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <AuthProvider>{children}</AuthProvider>
            </APIProvider>
        );

        const { result, waitForNextUpdate } = renderHook(() => useSubscription('p2p_order_info'), { wrapper });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.isIdle).toBe(false);
        expect(result.current.error).toBe(undefined);
        expect(result.current.data?.p2p_order_info).toBe(undefined);

        act(() => {
            result.current.subscribe({ payload: { id: '2' } });
        });

        await waitForNextUpdate();
        expect(result.current.data?.p2p_order_info).toStrictEqual({ status: 'pending' });
        await waitForNextUpdate();
        expect(result.current.data?.p2p_order_info).toStrictEqual({ status: 'buyer-confirmed' });
        await waitForNextUpdate();
        expect(result.current.data?.p2p_order_info).toStrictEqual({ status: 'disputed' });
        await waitForNextUpdate();
        expect(result.current.error).toStrictEqual({ code: 'Foo', message: 'Error message' });
        await waitForNextUpdate();
        expect(result.current.data?.p2p_order_info).toStrictEqual({ status: 'completed' });
    });
});
