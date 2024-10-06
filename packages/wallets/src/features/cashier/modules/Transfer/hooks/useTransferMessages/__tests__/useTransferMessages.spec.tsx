import { useActiveWalletAccount, usePOI, useTradingPlatformStatus } from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import useTransferMessages from '../useTransferMessages';
import {
    cumulativeAccountLimitsMessageFn,
    insufficientBalanceMessageFn,
    lifetimeAccountLimitsBetweenWalletsMessageFn,
    tradingPlatformStatusMessageFn,
} from '../utils';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(() => ({ data: { mockWallets } })),
    usePOI: jest.fn(() => ({ data: { is_verified: true } })),
    useTradingPlatformStatus: jest.fn(() => ({
        data: [{ platform: 'mt5', status: 'active' }],
        getPlatformStatus: jest.fn(),
    })),
    useWalletAccountsList: jest.fn(() => ({ data: [{ mockWallets }, { mockTrading }] })),
}));

jest.mock('../utils/cumulativeAccountLimitsMessageFn', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('../utils/insufficientBalanceMessageFn', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('../utils/lifetimeAccountLimitsBetweenWalletsMessageFn', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('../utils/tradingPlatformStatusMessageFn', () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockWallets = {
    account_category: 'wallet' as const,
    account_type: 'doughflow' as const,
    accountName: 'USD Wallet',
    balance: '10000.00',
    currency: 'USD',
    currencyConfig: {
        code: 'USD',
        display_code: 'USD',
        fractional_digits: 1,
        is_AUD: false,
        is_BTC: false,
        is_BUSD: false,
        is_crypto: false,
        is_DAI: false,
        is_deposit_suspended: 0 as const,
        is_ETH: false,
        is_EUR: false,
        is_EURS: false,
        is_eUSDT: false,
        is_fiat: true,
        is_GBP: false,
        is_IDK: false,
        is_LTC: false,
        is_PAX: false,
        is_suspended: 0 as const,
        is_TUSD: false,
        is_tUSDT: false,
        is_USB: false,
        is_USD: true,
        is_USDC: false,
        is_USDK: false,
        is_USDT: false,
        is_withdrawal_suspended: 0 as const,
        name: 'US Dollar',
        platform: { cashier: ['doughflow'] as const, ramp: [] },
        stake_default: 0.1,
        transfer_between_accounts: {
            fees: {},
            limits: { max: 0.1, min: 0.1 },
            limits_ctrader: { max: 0.1, min: 0.1 },
            limits_derivez: { max: 0.1, min: 0.1 },
            limits_dxtrade: { max: 0.1, min: 0.1 },
            limits_mt5: { max: 0.1, min: 0.1 },
        },
        type: 'fiat' as const,
    },
    demo_account: 0 as const,
    displayBalance: '10000.00 USD',
    landingCompanyName: 'svg' as const,
    loginid: '',
    transfer: 'all',
};

const mockTrading = {
    account_category: 'trading' as const,
    account_type: 'ctrader' as const,
    accountName: 'Deriv cTrader',
    balance: '0.00',
    currency: 'USD',
    currencyConfig: {
        code: 'USD',
        display_code: 'USD',
        fractional_digits: 1,
        is_AUD: false,
        is_BTC: false,
        is_BUSD: false,
        is_crypto: false,
        is_DAI: false,
        is_deposit_suspended: 0 as const,
        is_ETH: false,
        is_EUR: false,
        is_EURS: false,
        is_eUSDT: false,
        is_fiat: true,
        is_GBP: false,
        is_IDK: false,
        is_LTC: false,
        is_PAX: false,
        is_suspended: 0 as const,
        is_TUSD: false,
        is_tUSDT: false,
        is_USB: false,
        is_USD: true,
        is_USDC: false,
        is_USDK: false,
        is_USDT: false,
        is_withdrawal_suspended: 0 as const,
        name: 'US Dollar',
        platform: { cashier: ['doughflow'] as const, ramp: [] },
        stake_default: 0.1,
        transfer_between_accounts: {
            fees: {},
            limits: { max: 0.1, min: 0.1 },
            limits_ctrader: { max: 0.1, min: 0.1 },
            limits_derivez: { max: 0.1, min: 0.1 },
            limits_dxtrade: { max: 0.1, min: 0.1 },
            limits_mt5: { max: 0.1, min: 0.1 },
        },
        type: 'fiat' as const,
    },
    demo_account: 0 as const,
    displayBalance: '0.00 USD',
    landingCompanyName: 'svg' as const,
    loginid: '',
    transfer: 'all',
};

const mockWalletsTransfer = {
    accountLimits: {},
    activeWalletExchangeRates: {},
    formData: { fromAmount: 100, toAmount: 200 },
    fromAccount: mockWallets,
    toAccount: mockWallets,
    USDExchangeRates: {},
};

describe('useTransferMessages', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return correct message and type for insufficientBalanceMessageFn', () => {
        const mockInsufficientBalanceTransfer = {
            accountLimits: {},
            activeWalletExchangeRates: {},
            formData: { fromAmount: 100, toAmount: 200 },
            fromAccount: mockTrading,
            toAccount: mockWallets,
            USDExchangeRates: {},
        };
        (insufficientBalanceMessageFn as jest.Mock).mockReturnValueOnce({
            message: 'insufficientBalanceMessageFn',
            type: 'error',
        });
        (tradingPlatformStatusMessageFn as jest.Mock).mockReturnValueOnce({
            message: 'tradingPlatformStatusMessageFn',
            type: 'warning',
        });
        const { result } = renderHook(() => useTransferMessages(mockInsufficientBalanceTransfer));

        expect(result.current).toEqual([
            {
                message: 'insufficientBalanceMessageFn',
                type: 'error',
            },
        ]);
    });

    test('should render correct message and type for lifetimeAccountLimitsBetweenWalletsMessageFn', () => {
        (usePOI as jest.Mock).mockReturnValueOnce({ data: { is_verified: false } });
        (lifetimeAccountLimitsBetweenWalletsMessageFn as jest.Mock).mockReturnValueOnce({
            message: 'lifetimeAccountLimitsBetweenWalletsMessageFn',
            type: 'error',
        });

        const { result } = renderHook(() => useTransferMessages(mockWalletsTransfer));

        expect(result.current).toEqual([
            {
                message: 'lifetimeAccountLimitsBetweenWalletsMessageFn',
                type: 'error',
            },
        ]);
    });

    test('should render correct message and type for tradingPlatformStatusMessageFn', () => {
        (tradingPlatformStatusMessageFn as jest.Mock).mockReturnValueOnce({
            message: 'tradingPlatformStatusMessageFn',
            type: 'warning',
        });

        const { result } = renderHook(() => useTradingPlatformStatus());

        expect(result.current).toEqual({
            data: [{ platform: 'mt5', status: 'active' }],
            getPlatformStatus: expect.any(Function),
        });
    });

    test('should render correct message and type for cumulativeAccountLimitsMessageFn', () => {
        (usePOI as jest.Mock).mockReturnValueOnce({ data: { is_verified: false } });
        const mockWalletsToTradingTransfer = {
            accountLimits: {},
            activeWalletExchangeRates: {},
            formData: { fromAmount: 100, toAmount: 200 },
            fromAccount: mockWallets,
            toAccount: mockTrading,
            USDExchangeRates: {},
        };
        (cumulativeAccountLimitsMessageFn as jest.Mock).mockReturnValueOnce({
            message: 'cumulativeAccountLimitsMessageFn',
            type: 'info',
        });
        const { result } = renderHook(() => useTransferMessages(mockWalletsToTradingTransfer));

        expect(result.current).toEqual([
            {
                message: 'cumulativeAccountLimitsMessageFn',
                type: 'info',
            },
        ]);
    });

    test('should not render transfer messages when active wallet is null', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: null });

        const { result } = renderHook(() => useTransferMessages(mockWalletsTransfer));

        expect(result.current).toEqual([]);
    });
});
