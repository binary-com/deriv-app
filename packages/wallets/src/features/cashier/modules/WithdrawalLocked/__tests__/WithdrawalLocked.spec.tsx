import React from 'react';
import {
    useAccountLimits,
    useAccountStatus,
    useActiveWalletAccount,
    useAuthentication,
    useCashierValidation,
    useCryptoConfig,
    useCurrencyConfig,
} from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WithdrawalLocked from '../WithdrawalLocked';

jest.mock('@deriv/api-v2', () => ({
    useAccountLimits: jest.fn(),
    useAccountStatus: jest.fn(),
    useActiveWalletAccount: jest.fn(),
    useAuthentication: jest.fn(),
    useCashierValidation: jest.fn(),
    useCryptoConfig: jest.fn(),
    useCurrencyConfig: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    Loader: jest.fn(() => <div>Loading...</div>),
}));

jest.mock('../WithdrawalLockedContent', () => ({
    __esModule: true,
    default: jest.fn(() => 'Locked Description'),
    getWithdrawalLimitReachedDesc: jest.fn(() => 'Locked Description'),
}));

const mockActiveWalletData = { currency: 'USD', currency_config: { is_crypto: false } };
const mockCryptoConfigData = { minimum_withdrawal: 10 };
const mockAuthenticationData = {
    is_poa_needed: false,
    is_poi_needed: false,
};
const mockCashierValidationData = {
    ask_authenticate: false,
    ask_financial_risk_approval: false,
    ask_fix_details: false,
    financial_assessment_required: false,
    no_withdrawal_or_trading_status: false,
    withdrawal_locked_status: false,
};

describe('WithdrawalLocked', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render loader when currency config is loading', () => {
        const mockStatusData = { is_withdrawal_locked: false };
        const mockAccountLimitsData = { remainder: 20 };

        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: mockActiveWalletData });
        (useAccountLimits as jest.Mock).mockReturnValueOnce({ data: mockAccountLimitsData });
        (useAuthentication as jest.Mock).mockReturnValueOnce({ data: mockAuthenticationData });
        (useCashierValidation as jest.Mock).mockReturnValueOnce({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValueOnce({ data: mockStatusData });
        (useCryptoConfig as jest.Mock).mockReturnValueOnce({ data: mockCryptoConfigData });
        (useCurrencyConfig as jest.Mock).mockReturnValueOnce({ isLoading: true });

        render(
            <WithdrawalLocked>
                <div>Test Child Component</div>
            </WithdrawalLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render loader when no account status data', () => {
        const mockAccountLimitsData = { remainder: 20 };

        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: mockActiveWalletData });
        (useAccountLimits as jest.Mock).mockReturnValueOnce({ data: mockAccountLimitsData });
        (useAuthentication as jest.Mock).mockReturnValueOnce({ data: mockAuthenticationData });
        (useCashierValidation as jest.Mock).mockReturnValueOnce({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValueOnce({ data: null });
        (useCryptoConfig as jest.Mock).mockReturnValueOnce({ data: mockCryptoConfigData });
        (useCurrencyConfig as jest.Mock).mockReturnValueOnce({ isLoading: false });

        render(
            <WithdrawalLocked>
                <div>Test Child Component</div>
            </WithdrawalLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render locked screen for withdrawal locked when in a locked state', () => {
        const mockLockedStatusData = { is_withdrawal_locked: true };
        const mockAccountLimitsData = { remainder: 20 };

        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: mockActiveWalletData });
        (useAccountLimits as jest.Mock).mockReturnValueOnce({ data: mockAccountLimitsData });
        (useAuthentication as jest.Mock).mockReturnValueOnce({ data: mockAuthenticationData });
        (useCashierValidation as jest.Mock).mockReturnValueOnce({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValueOnce({ data: mockLockedStatusData });
        (useCryptoConfig as jest.Mock).mockReturnValueOnce({ data: mockCryptoConfigData });
        (useCurrencyConfig as jest.Mock).mockReturnValueOnce({ isLoading: false });

        render(
            <WithdrawalLocked>
                <div>Test Child Component</div>
            </WithdrawalLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Locked Description')).toBeInTheDocument();
        expect(screen.getByText('Withdrawals from your USD Wallet are temporarily locked.')).toBeInTheDocument();
    });

    it('should render locked screen for withdrawal limit reached when in a locked state', () => {
        const mockStatusData = { is_withdrawal_locked: false };
        const mockLockedAccountLimitsData = { remainder: 0 };

        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: mockActiveWalletData });
        (useAccountLimits as jest.Mock).mockReturnValueOnce({ data: mockLockedAccountLimitsData });
        (useAuthentication as jest.Mock).mockReturnValueOnce({ data: mockAuthenticationData });
        (useCashierValidation as jest.Mock).mockReturnValueOnce({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValueOnce({ data: mockStatusData });
        (useCryptoConfig as jest.Mock).mockReturnValueOnce({ data: mockCryptoConfigData });
        (useCurrencyConfig as jest.Mock).mockReturnValueOnce({ isLoading: false });

        render(
            <WithdrawalLocked>
                <div>Test Child Component</div>
            </WithdrawalLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Locked Description')).toBeInTheDocument();
        expect(screen.getByText('Withdrawals from your USD Wallet are temporarily locked.')).toBeInTheDocument();
    });

    it('should render children when not in a locked state', () => {
        const mockStatusData = { is_withdrawal_locked: false };
        const mockAccountLimitsData = { remainder: 20 };

        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: mockActiveWalletData });
        (useAccountLimits as jest.Mock).mockReturnValueOnce({ data: mockAccountLimitsData });
        (useAuthentication as jest.Mock).mockReturnValueOnce({ data: mockAuthenticationData });
        (useCashierValidation as jest.Mock).mockReturnValueOnce({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValueOnce({ data: mockStatusData });
        (useCryptoConfig as jest.Mock).mockReturnValueOnce({ data: mockCryptoConfigData });
        (useCurrencyConfig as jest.Mock).mockReturnValueOnce({ isLoading: false });

        render(
            <WithdrawalLocked>
                <div>Test Child Component</div>
            </WithdrawalLocked>
        );

        expect(screen.getByText('Test Child Component')).toBeInTheDocument();
    });
});
