import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { StoreProvider, mockStore } from '@deriv/stores';
import useWalletMigration from '../useWalletMigration';

describe('useWalletMigration', () => {
    const wrapper = (mock: ReturnType<typeof mockStore>) => {
        const Component = ({ children }: { children: JSX.Element }) => {
            return <StoreProvider store={mock}>{children}</StoreProvider>;
        };
        return Component;
    };

    test('should return wallet migration state', () => {
        const mock = mockStore({ client: { wallet_migration_state: 'eligible' } });

        const { result } = renderHook(() => useWalletMigration(), { wrapper: wrapper(mock) });

        expect(result.current.state).toBe('eligible');
    });

    test('should send start wallet migration request', () => {
        const startWalletMigration = jest.fn();
        const mock = mockStore({ client: { startWalletMigration } });

        const { result } = renderHook(() => useWalletMigration(), { wrapper: wrapper(mock) });

        result.current.startMigration();

        expect(startWalletMigration).toBeCalled();
    });

    test('should send reset wallet migration request', () => {
        const resetWalletMigration = jest.fn();
        const mock = mockStore({ client: { resetWalletMigration } });

        const { result } = renderHook(() => useWalletMigration(), { wrapper: wrapper(mock) });

        result.current.resetMigration();

        expect(resetWalletMigration).toBeCalled();
    });
});
