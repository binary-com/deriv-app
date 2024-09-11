import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { mockStore, StoreProvider } from '@deriv/stores';
import useGetStatus from '../useGetStatus';
import useGetMFAccountStatus from '../useGetMFAccountStatus';
import useIsSelectedMT5AccountCreated from '../useIsSelectedMT5AccountCreated';
import { CFD_PLATFORMS, MT5_ACCOUNT_STATUS, ACCOUNT_BADGE_STATUS } from '@deriv/shared';

jest.mock('../useIsSelectedMT5AccountCreated');
jest.mock('../useGetMFAccountStatus', () => jest.fn());

const mockUseIsSelectedMT5AccountCreated = useIsSelectedMT5AccountCreated as jest.MockedFunction<
    typeof useIsSelectedMT5AccountCreated
>;
const mockUseGetMFAccountStatus = useGetMFAccountStatus as jest.MockedFunction<typeof useGetMFAccountStatus>;

describe('useGetStatus', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.resetAllMocks();
    });

    it('should return correct MT5 status when platform is MT5 and default jurisdiction is not created', () => {
        const mock = mockStore({
            common: { platform: CFD_PLATFORMS.MT5 },
            traders_hub: {
                selected_jurisdiction_kyc_status: {},
            },
            modules: { cfd: { jurisdiction_selected_shortcode: 'bvi' } },
        });
        mockUseGetMFAccountStatus.mockReturnValue({
            mf_account_status: null,
            kyc_status: {},
        });

        mockUseIsSelectedMT5AccountCreated.mockReturnValue({
            selected_mt5_account: {
                is_default_jurisdiction: true,
                requirements: {
                    after_first_deposit: {
                        financial_assessment: ['financial_information', 'trading_experience'],
                    },
                    compliance: {
                        mt5: ['fully_authenticated', 'expiration_check'],
                        tax_information: ['tax_residence', 'tax_identification_number'],
                    },
                    signup: ['phone', 'citizen', 'account_opening_reason'],
                },
                sub_account_type: 'standard',
                shortcode: 'bvi',
            },
            is_selected_MT5_account_created: false,
            selected_account_status: MT5_ACCOUNT_STATUS.PENDING,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useGetStatus(), { wrapper });
        expect(result.current).toEqual({
            status_badge: MT5_ACCOUNT_STATUS.PENDING,
            client_kyc_status: {},
        });
    });

    it('should return correct MT5 status when platform is MT5 and  jurisdictions is created', () => {
        const mock = mockStore({
            common: { platform: CFD_PLATFORMS.MT5 },
            traders_hub: {
                selected_jurisdiction_kyc_status: {},
            },
            modules: { cfd: { jurisdiction_selected_shortcode: 'vanautu' } },
        });
        mockUseGetMFAccountStatus.mockReturnValue({
            mf_account_status: null,
            kyc_status: {},
        });

        mockUseIsSelectedMT5AccountCreated.mockReturnValue({
            selected_mt5_account: {
                account_type: 'real',
                balance: 0,
                country: 'bh',
                currency: 'USD',
                display_balance: '0.00',
                group: 'real\\p01_ts01\\financial\\svg_std-hr_usd',
                landing_company_short: 'vanuatu',
                leverage: 1000,
                login: 'MTR9586832',
                market_type: 'financial',
                product: 'financial',
                status: 'verification_pending',
                requirements: {
                    client_kyc_status: {},
                },
            },
            is_selected_MT5_account_created: true,
            selected_account_status: MT5_ACCOUNT_STATUS.PENDING,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useGetStatus(), { wrapper });
        expect(result.current).toEqual({
            status_badge: MT5_ACCOUNT_STATUS.PENDING,
            client_kyc_status: {},
        });
    });

    it('should return correct account status when for deriv account', () => {
        const mock = mockStore({
            common: { platform: '' },
            traders_hub: {
                selected_jurisdiction_kyc_status: {},
            },
            modules: { cfd: { jurisdiction_selected_shortcode: '' } },
        });
        mockUseGetMFAccountStatus.mockReturnValue({
            mf_account_status: 'pending',
            kyc_status: {
                poi_status: 'pending',
                poa_status: 'verified',
            },
        });

        mockUseIsSelectedMT5AccountCreated.mockReturnValue({
            selected_mt5_account: {},
            is_selected_MT5_account_created: false,
            selected_account_status: MT5_ACCOUNT_STATUS.FAILED,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useGetStatus(), { wrapper });
        expect(result.current).toEqual({
            status_badge: MT5_ACCOUNT_STATUS.PENDING,
            client_kyc_status: {
                poi_status: 'pending',
                poa_status: 'verified',
            },
        });
    });

    it('should return empty requirements when fully verified', () => {
        const mock = mockStore({
            common: { platform: '' },
            traders_hub: {
                selected_jurisdiction_kyc_status: {},
            },
            modules: { cfd: { jurisdiction_selected_shortcode: '' } },
        });
        mockUseGetMFAccountStatus.mockReturnValue({
            mf_account_status: null,
            kyc_status: {},
        });

        mockUseIsSelectedMT5AccountCreated.mockReturnValue({
            selected_mt5_account: {},
            is_selected_MT5_account_created: false,
            selected_account_status: MT5_ACCOUNT_STATUS.PENDING,
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useGetStatus(), { wrapper });
        expect(result.current).toEqual({
            status_badge: null,
            client_kyc_status: {},
        });
    });
});
