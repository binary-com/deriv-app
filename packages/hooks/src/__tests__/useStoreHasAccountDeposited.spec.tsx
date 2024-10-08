import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useStoreHasAccountDeposited from '../useStoreHasAccountDeposited';

describe('useStoreHasAccountDeposited', () => {
    const default_mock = mockStore({});

    const wrapper = (mock: ReturnType<typeof mockStore> = default_mock) => {
        const Component = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        return Component;
    };

    it('should return count and transaction length = 0 for empty statement', () => {
        const { result } = renderHook(() => useStoreHasAccountDeposited(), { wrapper: wrapper() });

        expect(result.current.count).toEqual(0);
        expect(result.current.transactions).toHaveLength(0);
        expect(result.current.hasDeposited).toEqual(false);
        expect(result.current.hasTransferred).toEqual(false);
        expect(result.current.isLoaded).toEqual(false);
    });

    it('should return count, transaction length and hasDeposited correct #1', () => {
        const mock = mockStore({
            client: {
                statement: {
                    count: 1,
                    transactions: [{ action_type: 'transfer', amount: 10 }],
                },
            },
        });
        const { result } = renderHook(() => useStoreHasAccountDeposited(), { wrapper: wrapper(mock) });

        expect(result.current.count).toEqual(1);
        expect(result.current.transactions).toHaveLength(1);
        expect(result.current.hasDeposited).toEqual(false);
        expect(result.current.hasTransferred).toEqual(true);
        expect(result.current.isLoaded).toEqual(true);
    });

    it('should return count, transaction length and hasDeposited correct #2', () => {
        const mock = mockStore({
            client: {
                statement: {
                    count: 2,
                    transactions: [
                        { action_type: 'transfer', amount: 10 },
                        { action_type: 'deposit', amount: 1000 },
                    ],
                },
            },
        });
        const { result } = renderHook(() => useStoreHasAccountDeposited(), { wrapper: wrapper(mock) });

        expect(result.current.count).toEqual(2);
        expect(result.current.transactions).toHaveLength(2);
        expect(result.current.hasDeposited).toEqual(true);
        expect(result.current.hasTransferred).toEqual(true);
        expect(result.current.isLoaded).toEqual(true);
    });
});
