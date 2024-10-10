import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { mockStore, StoreProvider } from '@deriv/stores';
import useIsSelectedMT5AccountCreated from '../useIsSelectedMT5AccountCreated';
import { CFD_PLATFORMS, MT5_ACCOUNT_STATUS } from '@deriv/shared';

describe('useIsSelectedMT5AccountCreated', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it('should return account details and status when MT5 account is created', () => {
        const mock = mockStore({
            common: { platform: CFD_PLATFORMS.MT5 },
            client: {
                mt5_login_list: [
                    { landing_company_short: 'svg', product: 'financial', status: 'proof_failed', login: '123' },
                ],
                updateMT5AccountDetails: jest.fn(),
                trading_platform_available_accounts: [{ shortcode: 'svg', product: 'financial' }],
            },

            modules: { cfd: { jurisdiction_selected_shortcode: 'svg', product: 'financial' } },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useIsSelectedMT5AccountCreated(), { wrapper });

        expect(result.current.is_selected_MT5_account_created).toBe(true);
        expect(result.current.existing_account).toEqual({
            landing_company_short: 'svg',
            product: 'financial',
            status: 'proof_failed',
            login: '123',
        });
        expect(result.current.existing_account_status).toBe(MT5_ACCOUNT_STATUS.FAILED);
        expect(result.current.available_account_to_create).toBeNull();
    });
    it('should return account details and status when MT5 account is not created', () => {
        const mock = mockStore({
            common: { platform: CFD_PLATFORMS.MT5 },
            client: {
                mt5_login_list: [
                    { landing_company_short: 'svg', product: 'financial', status: 'proof_failed', login: '123' },
                ],
                updateMT5AccountDetails: jest.fn(),
                trading_platform_available_accounts: [
                    { shortcode: 'svg', product: 'financial' },
                    { shortcode: 'bvi', product: 'zero_spread' },
                ],
            },

            modules: { cfd: { jurisdiction_selected_shortcode: 'bvi', product: 'zero_spread' } },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useIsSelectedMT5AccountCreated(), { wrapper });

        expect(result.current.is_selected_MT5_account_created).toBe(false);
        expect(result.current.existing_account).toBeNull();
        expect(result.current.existing_account_status).toBeNull();
        expect(result.current.available_account_to_create).toEqual({
            shortcode: 'bvi',
            product: 'zero_spread',
        });
    });

    it('should return the correct status when account status "verification_pending"', () => {
        const mock = mockStore({
            client: {
                mt5_login_list: [{ landing_company_short: 'svg', product: 'standard', status: 'verification_pending' }],
                trading_platform_available_accounts: [{ shortcode: 'svg', product: 'standard' }],
                updateMT5AccountDetails: jest.fn(),
            },
            modules: {
                cfd: {
                    jurisdiction_selected_shortcode: 'svg',
                    product: 'standard',
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useIsSelectedMT5AccountCreated(), { wrapper });

        expect(result.current.existing_account_status).toBe(MT5_ACCOUNT_STATUS.PENDING);
    });

    it('should handle cases where mt5_login_list and trading_platform_available_accounts are empty', () => {
        const mock = mockStore({
            client: {
                mt5_login_list: [],
                trading_platform_available_accounts: [],
                updateMT5AccountDetails: jest.fn(),
            },
            modules: {
                cfd: {
                    jurisdiction_selected_shortcode: 'svg',
                    product: 'standard',
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useIsSelectedMT5AccountCreated(), { wrapper });

        expect(result.current.is_selected_MT5_account_created).toBe(false);
        expect(result.current.existing_account).toBeNull();
        expect(result.current.existing_account_status).toBeNull();
    });
});
