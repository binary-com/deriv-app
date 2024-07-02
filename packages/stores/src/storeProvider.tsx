import React, { useEffect, useMemo } from 'react';
import StoreContext from './storeContext';
import { FeatureFlagsStore } from './stores';
import type { TCoreStores, TStores } from '../types';

const StoreProvider = ({ children, store }: React.PropsWithChildren<{ store: TCoreStores }>) => {
    const memoizedValue: TStores = useMemo(() => {
        // If the store is mocked for testing purposes, then return the mocked value.
        if ('is_mock' in store && store.is_mock) return store as unknown as TStores;

        // Otherwise, instantiate store and return it.
        return {
            ...store,
            feature_flags: new FeatureFlagsStore(),
        };
    }, [store]);

    useEffect(() => {
        return () => {
            Object.values(memoizedValue).forEach(value => {
                if (typeof value === 'object' && 'unmount' in value) value.unmount();
            });
        };
    }, [memoizedValue]);

    return <StoreContext.Provider value={memoizedValue}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
