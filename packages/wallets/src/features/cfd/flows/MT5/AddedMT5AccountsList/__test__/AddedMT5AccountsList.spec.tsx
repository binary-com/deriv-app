import React from 'react';
import { useJurisdictionStatus, useTradingPlatformStatus } from '@deriv/api-v2';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModal } from '../../../../../../components/ModalProvider';
import { MT5TradeModal, TradingPlatformStatusModal, VerificationFailedModal } from '../../../../modals';
import AddedMT5AccountsList from '../AddedMT5AccountsList';

jest.mock('@deriv/api-v2', () => ({
    useJurisdictionStatus: jest.fn(),
    useTradingPlatformStatus: jest.fn(),
}));

jest.mock('../../../../../../components/ModalProvider', () => ({
    useModal: jest.fn(),
}));

describe('AddedMT5AccountsList', () => {
    const mockAccount = {
        display_balance: 'USD 1000.00',
        display_login: '12345678',
        landing_company_short: 'svg',
        market_type: 'financial',
        platform: 'mt5',
        product: 'standard',
        status: 'active',
    };

    const mockShow = jest.fn();

    beforeEach(() => {
        (useJurisdictionStatus as jest.Mock).mockReturnValue({
            getVerificationStatus: jest.fn().mockReturnValue({ is_failed: false, is_pending: false }),
        });
        (useTradingPlatformStatus as jest.Mock).mockReturnValue({
            getPlatformStatus: jest.fn().mockReturnValue('active'),
        });
        (useModal as jest.Mock).mockReturnValue({ show: mockShow });
    });

    it('renders added mt5 accounts list with correct account details', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AddedMT5AccountsList account={mockAccount} />);

        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(screen.getByText('USD 1000.00')).toBeInTheDocument();
        expect(screen.getByText('12345678')).toBeInTheDocument();
    });

    it('shows MT5TradeModal when list is clicked and status is active', async () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AddedMT5AccountsList account={mockAccount} />);

        await userEvent.click(screen.getByTestId('dt_wallets_trading_account_card'));

        await waitFor(() => {
            expect(mockShow).toHaveBeenCalledWith(
                // @ts-expect-error - since this is a mock, we only need partial properties of the account
                <MT5TradeModal marketType='financial' mt5Account={mockAccount} platform='mt5' />
            );
        });
    });

    it('shows TradingPlatformStatusModal when platform is under maintenance', async () => {
        (useTradingPlatformStatus as jest.Mock).mockReturnValue({
            getPlatformStatus: jest.fn().mockReturnValue('maintenance'),
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AddedMT5AccountsList account={mockAccount} />);

        await userEvent.click(screen.getByTestId('dt_wallets_trading_account_card'));

        await waitFor(() => {
            expect(mockShow).toHaveBeenCalledWith(<TradingPlatformStatusModal isServerMaintenance={true} />, {
                defaultRootId: 'wallets_modal_root',
            });
        });
    });

    it('shows VerificationFailedModal when verification has failed', async () => {
        (useJurisdictionStatus as jest.Mock).mockReturnValue({
            getVerificationStatus: jest.fn().mockReturnValue({ is_failed: true, is_pending: false }),
        });
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AddedMT5AccountsList account={mockAccount} />);

        await userEvent.click(screen.getByTestId('dt_wallets_trading_account_card'));

        await waitFor(() => {
            expect(mockShow).toHaveBeenCalledWith(<VerificationFailedModal selectedJurisdiction='svg' />, {
                defaultRootId: 'wallets_modal_root',
            });
        });
    });

    it('displays pending verification message when status is pending', () => {
        (useJurisdictionStatus as jest.Mock).mockReturnValue({
            getVerificationStatus: jest.fn().mockReturnValue({ is_failed: false, is_pending: true }),
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AddedMT5AccountsList account={mockAccount} />);

        expect(screen.getByText('Pending verification')).toBeInTheDocument();
    });

    it('displays verification failed message when verification has failed', () => {
        (useJurisdictionStatus as jest.Mock).mockReturnValue({
            getVerificationStatus: jest.fn().mockReturnValue({ is_failed: true, is_pending: false }),
        });
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AddedMT5AccountsList account={mockAccount} />);

        expect(screen.getByText('Verification failed')).toBeInTheDocument();
        expect(screen.getByText('Why?')).toBeInTheDocument();
    });

    it('displays VerificationFailedModal when "Why?" link is clicked', async () => {
        (useJurisdictionStatus as jest.Mock).mockReturnValue({
            getVerificationStatus: jest.fn().mockReturnValue({ is_failed: true, is_pending: false }),
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AddedMT5AccountsList account={mockAccount} />);

        const link = screen.getByText('Why?');
        await userEvent.click(link);

        await waitFor(() => {
            expect(mockShow).toHaveBeenCalledWith(<VerificationFailedModal selectedJurisdiction='svg' />, {
                defaultRootId: 'wallets_modal_root',
            });
        });
    });
});
