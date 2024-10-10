import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import * as React from 'react';
import useGetMFAccountStatus from '../useGetMFAccountStatus';

describe('useGetMFAccountStatus', () => {
    it('should return needs verification status if all the statuses are none', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    authentication: {
                        identity: {
                            services: {
                                onfido: {
                                    status: 'none',
                                },
                                manual: {
                                    status: 'none',
                                },
                            },
                        },
                        document: {
                            status: 'none',
                        },
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useGetMFAccountStatus(), {
            wrapper,
        });

        expect(result.current.mf_account_status).toBe('needs_verification');
        expect(result.current.kyc_status).toStrictEqual({ poa_status: 'none', poi_status: 'verified', valid_tin: 1 });
    });

    it('should return failed if either POI or POA is failed', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    authentication: {
                        identity: {
                            services: {
                                onfido: {
                                    status: 'pending',
                                },
                                manual: {
                                    status: 'rejected',
                                },
                            },
                            status: 'rejected',
                        },
                        document: {
                            status: 'suspected',
                        },
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useGetMFAccountStatus(), {
            wrapper,
        });

        expect(result.current).toStrictEqual({
            kyc_status: { poa_status: 'suspected', poi_status: 'rejected', valid_tin: 1 },
            mf_account_status: 'failed',
        });
    });

    it('should return pending if POA status is verified and POI is pending', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    authentication: {
                        identity: {
                            services: {
                                onfido: {
                                    status: 'pending',
                                },
                                manual: {
                                    status: 'none',
                                },
                            },
                            status: 'pending',
                        },
                        document: {
                            status: 'verified',
                        },
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useGetMFAccountStatus(), {
            wrapper,
        });

        expect(result.current).toStrictEqual({
            kyc_status: { poa_status: 'verified', poi_status: 'pending', valid_tin: 1 },
            mf_account_status: 'pending',
        });
    });
});
