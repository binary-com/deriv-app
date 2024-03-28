import React from 'react';
import { APIProvider, useQuery, useMutation } from '@deriv/api';
import { renderHook } from '@testing-library/react-hooks';
import { StoreProvider, mockStore } from '@deriv/stores';
import useWalletMigration from '../useWalletMigration';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useQuery: jest.fn(),
    useMutation: jest.fn(() => ({ mutate: jest.fn() })),
}));

const mockUseFetch = useQuery as jest.MockedFunction<typeof useQuery<'wallet_migration'>>;
const mockUseRequest = useMutation as jest.MockedFunction<typeof useMutation<'wallet_migration'>>;

describe('useWalletMigration', () => {
    const mock = mockStore({});
    const wrapper = (mock: ReturnType<typeof mockStore>) => {
        const Component = ({ children }: { children: JSX.Element }) => {
            return (
                <APIProvider>
                    <StoreProvider store={mock}>{children}</StoreProvider>
                </APIProvider>
            );
        };
        return Component;
    };

    test('should return wallet migration state', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue({ data: { wallet_migration: { state: 'eligible' } } });

        const { result } = renderHook(() => useWalletMigration(), { wrapper: wrapper(mock) });

        expect(result.current.state).toBe('eligible');
    });

    test('should send start wallet migration request', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValue({ mutate: jest.fn() });

        const { result } = renderHook(() => useWalletMigration(), { wrapper: wrapper(mock) });

        result.current.startMigration();

        expect(mockUseRequest('wallet_migration').mutate).toBeCalledWith({ payload: { wallet_migration: 'start' } });
    });

    test('should send reset wallet migration request', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValue({ mutate: jest.fn() });

        const { result } = renderHook(() => useWalletMigration(), { wrapper: wrapper(mock) });

        result.current.resetMigration();

        expect(mockUseRequest('wallet_migration').mutate).toBeCalledWith({ payload: { wallet_migration: 'reset' } });
    });
});
