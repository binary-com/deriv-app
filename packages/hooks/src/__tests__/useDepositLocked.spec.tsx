import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useDepositLocked from '../useDepositLocked';
import useIsTNCNeeded from '../useIsTNCNeeded';

jest.mock('../useIsTNCNeeded', () => jest.fn(() => false));

describe('useDepositLocked', () => {
    test('should be false if none of the conditions are met', () => {
        const mock = mockStore({
            client: {
                landing_company_shortcode: 'svg',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useDepositLocked(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should be true if is_deposit_lock is true', async () => {
        const mock = mockStore({
            client: {
                is_deposit_lock: true,
                landing_company_shortcode: 'svg',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useDepositLocked(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should be true if is_tnc_needed is true', async () => {
        (useIsTNCNeeded as jest.Mock).mockReturnValue(true);

        const mock = mockStore({
            client: {
                is_eu: true,
                landing_company_shortcode: 'svg',
                mt5_login_list: [
                    {
                        account_type: 'real',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useDepositLocked(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should be true if is_need_financial_assessment is true', async () => {
        const mock = mockStore({
            client: {
                is_financial_account: true,
                is_financial_information_incomplete: true,
                landing_company_shortcode: 'svg',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useDepositLocked(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should be true if is_need_authentication is true', async () => {
        const mock = mockStore({
            client: {
                is_authentication_needed: true,
                is_eu: true,
                landing_company_shortcode: 'svg',
                mt5_login_list: [
                    {
                        account_type: 'real',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
            traders_hub: {
                is_low_risk_cr_eu_real: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useDepositLocked(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should be true if is_need_financial_assessment is true and landing_company_shortcode as svg', async () => {
        const mock = mockStore({
            client: {
                is_financial_account: true,
                is_financial_information_incomplete: true,
                landing_company_shortcode: 'svg',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useDepositLocked(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should be true if is_trading_experience_incomplete is true and landing_company_shortcode as maltainvest', async () => {
        const mock = mockStore({
            client: {
                is_trading_experience_incomplete: true,
                landing_company_shortcode: 'maltainvest',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial',
                    },
                ],
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useDepositLocked(), { wrapper });

        expect(result.current).toBe(true);
    });
});
