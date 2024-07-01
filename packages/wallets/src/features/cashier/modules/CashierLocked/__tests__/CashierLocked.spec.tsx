import React from 'react';
import { useAccountStatus, useActiveWalletAccount, useAuthentication, useCashierValidation } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import CashierLocked from '../CashierLocked';
import { getSystemMaintenanceContent } from '../CashierLockedContent';

jest.mock('@deriv/api-v2', () => ({
    useAccountStatus: jest.fn(),
    useActiveWalletAccount: jest.fn(),
    useAuthentication: jest.fn(),
    useCashierValidation: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    Loader: jest.fn(() => <div>Loading...</div>),
}));

jest.mock('../CashierLockedContent', () => ({
    __esModule: true,
    default: jest.fn(() => 'Locked Description'),
    getSystemMaintenanceContent: jest.fn(() => ({ description: 'Locked Description', title: 'Locked Title' })),
}));

const mockActiveWalletData = { is_crypto: false, is_virtual: false };
const mockAuthenticationData = { is_poa_needed: false, is_poi_needed: false };
const mockCashierValidationData = { system_maintenance: false };
const mockStatusData = { is_cashier_locked: false, is_deposit_locked: false, is_withdrawal_locked: false };

describe('CashierLocked', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render loader when no account status data', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: mockActiveWalletData });
        (useAuthentication as jest.Mock).mockReturnValueOnce({ data: mockAuthenticationData });
        (useCashierValidation as jest.Mock).mockReturnValueOnce({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValueOnce({ data: null });

        render(
            <CashierLocked>
                <div>Test Child Component</div>
            </CashierLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render locked screen for cashier locked system maintenance', () => {
        const mockLockedValidationData = { system_maintenance: true };
        const mockLockedStatusData = {
            is_cashier_locked: true,
            is_deposit_locked: false,
            is_withdrawal_locked: false,
        };
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWalletData });
        (useAuthentication as jest.Mock).mockReturnValueOnce({ data: mockAuthenticationData });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockLockedValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockLockedStatusData });

        render(
            <CashierLocked>
                <div>Test Child Component</div>
            </CashierLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Locked Description')).toBeInTheDocument();
        expect(screen.getByText('Locked Title')).toBeInTheDocument();
    });

    it('should render locked screen for deposit locked system maintenance', () => {
        const mockLockedValidationData = { system_maintenance: true };
        const mockLockedStatusData = {
            is_cashier_locked: false,
            is_deposit_locked: true,
            is_withdrawal_locked: false,
        };
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWalletData });
        (useAuthentication as jest.Mock).mockReturnValueOnce({ data: mockAuthenticationData });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockLockedValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockLockedStatusData });

        render(
            <CashierLocked module='deposit'>
                <div>Test Child Component</div>
            </CashierLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Locked Description')).toBeInTheDocument();
        expect(screen.getByText('Locked Title')).toBeInTheDocument();
    });

    it('should render locked screen for withdrawal locked system maintenance', () => {
        const mockLockedValidationData = { system_maintenance: true };
        const mockLockedStatusData = {
            is_cashier_locked: false,
            is_deposit_locked: false,
            is_withdrawal_locked: true,
        };
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWalletData });
        (useAuthentication as jest.Mock).mockReturnValueOnce({ data: mockAuthenticationData });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockLockedValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockLockedStatusData });

        render(
            <CashierLocked module='withdrawal'>
                <div>Test Child Component</div>
            </CashierLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Locked Description')).toBeInTheDocument();
        expect(screen.getByText('Locked Title')).toBeInTheDocument();
    });

    it('should render locked screen for cashier locked', () => {
        const mockLockedStatusData = { is_cashier_locked: true, is_deposit_locked: false, is_withdrawal_locked: false };
        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: mockActiveWalletData });
        (useAuthentication as jest.Mock).mockReturnValueOnce({ data: mockAuthenticationData });
        (useCashierValidation as jest.Mock).mockReturnValueOnce({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValueOnce({ data: mockLockedStatusData });

        render(
            <CashierLocked>
                <div>Test Child Component</div>
            </CashierLocked>
        );

        expect(screen.queryByText('Test Child Component')).not.toBeInTheDocument();
        expect(screen.getByText('Locked Description')).toBeInTheDocument();
        expect(screen.getByText('Your USD Wallet is temporarily locked.')).toBeInTheDocument();
    });

    it('should render children when not in a locked state', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: mockActiveWalletData });
        (useAuthentication as jest.Mock).mockReturnValueOnce({ data: mockAuthenticationData });
        (useCashierValidation as jest.Mock).mockReturnValueOnce({ data: mockCashierValidationData });
        (useAccountStatus as jest.Mock).mockReturnValueOnce({ data: mockStatusData });

        render(
            <CashierLocked>
                <div>Test Child Component</div>
            </CashierLocked>
        );

        expect(screen.getByText('Test Child Component')).toBeInTheDocument();
    });

    it('should render children when no description and title returned from getSystemMaintenanceContent', () => {
        const mockLockedValidationData = { system_maintenance: true };
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWalletData });
        (useAuthentication as jest.Mock).mockReturnValueOnce({ data: mockAuthenticationData });
        (useCashierValidation as jest.Mock).mockReturnValue({ data: mockLockedValidationData });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: mockStatusData });

        (getSystemMaintenanceContent as jest.Mock).mockReturnValue(null);

        render(
            <CashierLocked>
                <div>Test Child Component</div>
            </CashierLocked>
        );

        expect(screen.getByText('Test Child Component')).toBeInTheDocument();
    });
});
