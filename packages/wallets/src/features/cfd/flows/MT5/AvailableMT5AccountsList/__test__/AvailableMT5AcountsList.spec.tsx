import React from 'react';
import { useActiveWalletAccount, useMT5AccountsList, useTradingPlatformStatus } from '@deriv/api-v2';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModal } from '../../../../../../components/ModalProvider';
import { JurisdictionModal, MT5PasswordModal, TradingPlatformStatusModal } from '../../../../modals';
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

    const defaultAccount = {
        market_type: 'synthetic',
        platform: 'mt5',
        product: 'swap_free',
        shortcode: 'svg',
    };

    it('renders default content for available mt5 account', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={defaultAccount} />);

        expect(screen.getByTestId('dt_wallets_trading_account_card')).toBeInTheDocument();
        expect(screen.getByText('Standard')).toBeInTheDocument();
    });

    it('handles button click when platform status is active for real wallet account', async () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={defaultAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        await userEvent.click(button);

        expect(mockShow).toHaveBeenCalledWith(
            <MT5PasswordModal isVirtual={false} marketType='synthetic' platform='mt5' product='swap_free' />
        );
        expect(mockSetModalState).toHaveBeenCalledWith('marketType', 'synthetic');
        expect(mockSetModalState).toHaveBeenCalledWith('selectedJurisdiction', 'svg');
    });

    it('shows TradingPlatformStatusModal when there is an unavailable account', async () => {
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [{ status: 'unavailable' }],
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={defaultAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        await userEvent.click(button);

        expect(mockShow).toHaveBeenCalledWith(<TradingPlatformStatusModal isServerMaintenance={false} />);
    });

    it('shows TradingPlatformStatusModal when there is an unavailable platform', async () => {
        (useTradingPlatformStatus as jest.Mock).mockReturnValue({
            getPlatformStatus: jest.fn(() => 'unavailable'),
        });
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={defaultAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        await userEvent.click(button);

        expect(mockShow).toHaveBeenCalledWith(<TradingPlatformStatusModal />);
    });

    it('shows JurisdictionModal by default when account is undefined', async () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: undefined,
        });
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={[]} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        await userEvent.click(button);

        expect(mockShow).toHaveBeenCalledWith(<JurisdictionModal />);
    });

    it('shows TradingPlatformStatusModal with isServerMaintenance when platform status is maintenance', async () => {
        (useTradingPlatformStatus as jest.Mock).mockReturnValue({
            getPlatformStatus: jest.fn(() => 'maintenance'),
        });
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={defaultAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        await userEvent.click(button);

        expect(mockShow).toHaveBeenCalledWith(<TradingPlatformStatusModal isServerMaintenance={true} />);
    });

    it('shows JurisdictionModal when product is neither swap-free nor zero-spread', async () => {
        const nonSwapAccount = { ...defaultAccount, product: 'ctrader' };
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={nonSwapAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        await userEvent.click(button);

        expect(mockShow).toHaveBeenCalledWith(<JurisdictionModal />);
    });

    it('shows ClientVerification when product is zero-spread', async () => {
        const zeroSpreadAccount = { ...defaultAccount, product: 'zero_spread' };
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={zeroSpreadAccount} />);

        expect(screen.getByText('NEW')).toBeInTheDocument();
        const button = screen.getByTestId('dt_wallets_trading_account_card');
        await userEvent.click(button);

        await waitFor(() => {
            expect(mockShow).toHaveBeenCalled();
        });
    });

    it('handles virtual wallet accounts correctly', async () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { is_virtual: true },
        });
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={defaultAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        await userEvent.click(button);

        expect(mockShow).toHaveBeenCalledWith(
            <MT5PasswordModal isVirtual={true} marketType='synthetic' platform='mt5' product='swap_free' />
        );
    });

    it('shows MT5PasswordModal after ClientVerification completion', async () => {
        const zeroSpreadAccount = { ...defaultAccount, product: 'zero_spread' };
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={zeroSpreadAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        await userEvent.click(button);

        await waitFor(() => {
            expect(mockShow).toHaveBeenCalled();
        });

        const lastCall = mockShow.mock.calls[mockShow.mock.calls.length - 1][0];
        // eslint-disable-next-line testing-library/no-node-access
        const { onCompletion } = lastCall.props.children.props; //required to access the function of lazy-loaded ClientVerification

        act(() => {
            onCompletion();
        });

        await waitFor(() => {
            expect(mockShow).toHaveBeenCalledWith(
                <MT5PasswordModal isVirtual={false} marketType='synthetic' platform='mt5' product='zero_spread' />
            );
        });
    });
});
