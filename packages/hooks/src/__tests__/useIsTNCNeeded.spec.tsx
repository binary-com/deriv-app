import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useIsTNCNeeded from '../useIsTNCNeeded';

describe('useIsTNCNeeded', () => {
    it('should return true if current landing company is svg and tnc_status for svg is 0', () => {
        const mock = mockStore({
            client: {
                account_settings: {
                    tnc_status: {
                        svg: 0,
                    },
                },
                landing_company_shortcode: 'svg',
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useIsTNCNeeded(), { wrapper });

        expect(result.current).toBe(true);
    });

    it('should return false if current landing company is svg and tnc_status for svg is 1', () => {
        const mock = mockStore({
            client: {
                account_settings: {
                    tnc_status: {
                        svg: 1,
                    },
                },
                landing_company_shortcode: 'svg',
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useIsTNCNeeded(), { wrapper });

        expect(result.current).toBe(false);
    });

    it('should return true if current landing company is maltainvest and tnc_status for maltainvest is 0', () => {
        const mock = mockStore({
            client: {
                account_settings: {
                    tnc_status: {
                        maltainvest: 0,
                    },
                },
                landing_company_shortcode: 'maltainvest',
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useIsTNCNeeded(), { wrapper });

        expect(result.current).toBe(true);
    });

    it('should return false if current landing company is maltainvest and tnc_status for maltainvest is 1', () => {
        const mock = mockStore({
            client: {
                account_settings: {
                    tnc_status: {
                        maltainvest: 1,
                    },
                },
                landing_company_shortcode: 'maltainvest',
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useIsTNCNeeded(), { wrapper });

        expect(result.current).toBe(false);
    });
});
