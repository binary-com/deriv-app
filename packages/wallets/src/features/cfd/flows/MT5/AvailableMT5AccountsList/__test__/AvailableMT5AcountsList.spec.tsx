import React from 'react';
import { useActiveWalletAccount, useMT5AccountsList, useTradingPlatformStatus } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModal } from '../../../../../../components/ModalProvider';
import { ClientVerificationModal, MT5PasswordModal, TradingPlatformStatusModal } from '../../../../modals';
import AvailableMT5AccountsList from '../AvailableMT5AccountsList';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
    useMT5AccountsList: jest.fn(),
    useTradingPlatformStatus: jest.fn(),
}));

jest.mock('../../../../flows/ClientVerification/ClientVerification', () => ({
    ...jest.requireActual('../../../../flows/ClientVerification/ClientVerification'),
    ClientVerification: jest.fn(() => <div>ClientVerification</div>),
}));

jest.mock('../../../../../../components/ModalProvider', () => ({
    useModal: jest.fn(),
}));

describe('AvailableMT5AccountsList', () => {
    const mockShow = jest.fn();
    const mockSetModalState = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { is_virtual: false },
        });
        (useTradingPlatformStatus as jest.Mock).mockReturnValue({
            getPlatformStatus: jest.fn(() => 'active'),
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [],
        });
        (useModal as jest.Mock).mockReturnValue({
            setModalState: mockSetModalState,
            show: mockShow,
        });
    });

    const nonRegulatedAccount = {
        market_type: 'synthetic',
        platform: 'mt5',
        product: 'swap_free',
        shortcode: 'svg',
    };

    const regulatedVerifiedAccount = {
        client_kyc_status: {
            poi_status: 'verified',
            valid_tin: 1,
        },
        market_type: 'synthetic',
        platform: 'mt5',
        product: 'swap_free',
        shortcode: 'svg',
    };

    const regulatedUnverifiedAccount = {
        client_kyc_status: {
            poi_status: 'none',
            valid_tin: 0,
        },
        market_type: 'synthetic',
        platform: 'mt5',
        product: 'financial',
        shortcode: 'bvi',
    };

    it('renders default content for available mt5 account', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={nonRegulatedAccount} />);

        expect(screen.getByTestId('dt_wallets_trading_account_card')).toBeInTheDocument();
        expect(screen.getByText('Standard')).toBeInTheDocument();
    });

    it('handles button click when platform status is active for real wallet account', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={nonRegulatedAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        userEvent.click(button);

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        expect(mockShow).toHaveBeenCalledWith(<MT5PasswordModal account={nonRegulatedAccount} isVirtual={false} />);
        expect(mockSetModalState).toHaveBeenCalledWith('marketType', 'synthetic');
        expect(mockSetModalState).toHaveBeenCalledWith('selectedJurisdiction', 'svg');
    });

    it('shows TradingPlatformStatusModal when there is an unavailable account', () => {
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [{ status: 'unavailable' }],
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={nonRegulatedAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        userEvent.click(button);

        expect(mockShow).toHaveBeenCalledWith(<TradingPlatformStatusModal isServerMaintenance={false} />);
    });

    it('shows TradingPlatformStatusModal when there is an unavailable platform', () => {
        (useTradingPlatformStatus as jest.Mock).mockReturnValue({
            getPlatformStatus: jest.fn(() => 'unavailable'),
        });
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={nonRegulatedAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        userEvent.click(button);

        expect(mockShow).toHaveBeenCalledWith(<TradingPlatformStatusModal />);
    });

    it('shows TradingPlatformStatusModal with isServerMaintenance when platform status is maintenance', () => {
        (useTradingPlatformStatus as jest.Mock).mockReturnValue({
            getPlatformStatus: jest.fn(() => 'maintenance'),
        });
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={nonRegulatedAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        userEvent.click(button);

        expect(mockShow).toHaveBeenCalledWith(<TradingPlatformStatusModal isServerMaintenance={true} />);
    });

    it('shows MT5PasswordModal for non-regulated real accounts if client is verified', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: undefined,
        });
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={nonRegulatedAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        userEvent.click(button);

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        expect(mockShow).toHaveBeenCalledWith(<MT5PasswordModal account={nonRegulatedAccount} />);
    });

    it('shows ClientVerificationModal for regulated real accounts if client is unverified', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                is_virtual: false,
            },
        });
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={regulatedUnverifiedAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        userEvent.click(button);

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        expect(mockShow).toHaveBeenCalledWith(<ClientVerificationModal account={regulatedUnverifiedAccount} />);
    });

    it('shows MT5PasswordModal for demo accounts for verified clients', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                is_virtual: true,
            },
        });
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={regulatedVerifiedAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        userEvent.click(button);

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        expect(mockShow).toHaveBeenCalledWith(<MT5PasswordModal account={regulatedVerifiedAccount} isVirtual={true} />);
    });
});
