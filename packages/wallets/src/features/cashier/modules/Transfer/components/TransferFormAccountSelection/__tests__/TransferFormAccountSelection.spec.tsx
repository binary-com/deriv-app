import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useModal } from '../../../../../../../components/ModalProvider';
import useDevice from '../../../../../../../hooks/useDevice';
import TransferFormAccountSelection from '../TransferFormAccountSelection';

jest.mock('../../../../../../../hooks/useDevice', () => jest.fn());

jest.mock('../../../../../../../components/ModalProvider', () => ({
    useModal: jest.fn(),
}));

describe('TransferFormAccountSelection', () => {
    const mockModalHide = jest.fn();
    const mockOnSelect = jest.fn();

    const props = {
        accountsList: {
            tradingAccounts: [
                { accountName: 'Account 1', currencyConfig: { display_code: 'USD' }, loginid: 'CR123' },
                { accountName: 'Account 2', currencyConfig: { display_code: 'EUR' }, loginid: 'CR124' },
            ],
            wallets: [{ accountName: 'Wallet 1', currencyConfig: { display_code: 'GBP' }, loginid: 'CRW123' }],
        },
        activeWallet: { accountName: 'Active Wallet', currencyConfig: { display_code: 'USD' }, loginid: 'CR123' },
        label: 'Transfer from',
        onSelect: mockOnSelect,
        selectedAccount: { loginid: 'CR123' },
    };

    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        (useModal as jest.Mock).mockReturnValue({ hide: mockModalHide });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render without crashing', () => {
        const emptyProps = {
            accountsList: {
                tradingAccounts: [undefined],
            },
            activeWallet: undefined,
            fromAccount: undefined,
            label: 'Transfer to',
            onSelect: mockOnSelect,
            selectedAccount: undefined,
            toAccount: undefined,
        };

        render(
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            <TransferFormAccountSelection {...emptyProps} />
        );

        expect(screen.getByText('Transfer to')).toBeInTheDocument();
        expect(screen.queryByText('Account 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Account 2')).not.toBeInTheDocument();
        expect(screen.getByTestId('dt_wallets_transfer_form_account_selection_account')).toBeInTheDocument();
    });

    it('should render content for empty accounts list correctly', () => {
        const emptyProps = {
            accountsList: { tradingAccounts: [] },
        };

        render(
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            <TransferFormAccountSelection {...emptyProps} />
        );

        expect(screen.queryByText('Account 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Account 2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('dt_wallets_transfer_form_account_selection_account')).not.toBeInTheDocument();
    });

    it('should render content with accounts correctly', () => {
        render(
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            <TransferFormAccountSelection {...props} />
        );

        expect(screen.getByText('Transfer from')).toBeInTheDocument();
        expect(screen.getByText('Account 1')).toBeInTheDocument();
        expect(screen.getByText('Account 2')).toBeInTheDocument();
        expect(screen.getAllByTestId('dt_wallets_transfer_form_account_selection_account')[0]).toBeInTheDocument();
    });

    it('should handle account selection and modal close on click of account', () => {
        render(
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            <TransferFormAccountSelection {...props} />
        );

        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[1]);
        expect(mockOnSelect).toHaveBeenCalledWith(props.accountsList.tradingAccounts[0]);
        expect(mockModalHide).toHaveBeenCalled();
    });

    it('should display conditional transfer hint when label is "Transfer to"', () => {
        const newProps = {
            ...props,
            activeWallet: { accountName: 'Active Wallet', currencyConfig: undefined, loginid: 'CR123' },
            fromAccount: { accountName: 'Source Account' },
            label: 'Transfer to',
            toAccount: { accountName: 'Linked Account', loginid: 'CR123' },
        };

        render(
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            <TransferFormAccountSelection {...newProps} />
        );

        expect(
            screen.getByText(/You can only transfers funds from the Source Account to the linked Active Wallet./)
        ).toBeInTheDocument();
    });

    it('should render title for wallets only accounts list correctly', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        const newProps = {
            ...props,
            accountsList: {
                wallets: [{ accountName: 'Wallet 1', loginid: 'CRW123' }],
            },
        };

        render(
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            <TransferFormAccountSelection {...newProps} />
        );

        expect(screen.getByText('Wallets')).toBeInTheDocument();
        expect(screen.queryByText(/Trading/)).not.toBeInTheDocument();
    });

    it('should render content for mobile correctly', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            <TransferFormAccountSelection {...props} />
        );

        expect(screen.getByText('Trading accounts linked with USD Wallet')).toBeInTheDocument();
        expect(screen.getAllByTestId('dt_wallets_transfer_form_account_selection_title_line')[0]).toBeInTheDocument();
    });

    it('should close modal on click of close button', () => {
        render(
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            <TransferFormAccountSelection {...props} />
        );

        fireEvent.click(screen.getByTestId('dt_wallets_transfer_form_account_selection_close_button'));
        expect(mockModalHide).toBeCalled();
    });

    it('should render dividers between account groups when more than one group is present and not mobile', () => {
        render(
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            <TransferFormAccountSelection {...props} />
        );

        const groups = screen.getAllByTestId('dt_wallets_transfer_form_account_selection_accounts_group');
        expect(groups).toHaveLength(2);
        expect(groups[0]).toHaveClass('wallets-transfer-form-account-selection__accounts-group--divider');
        expect(groups[1]).not.toHaveClass('wallets-transfer-form-account-selection__accounts-group--divider');
    });

    it('should not render dividers when there is only one group of accounts', () => {
        const singleGroupProps = {
            ...props,
            accountsList: {
                tradingAccounts: [{ accountName: 'Account 1', currencyConfig: {} }],
            },
        };

        render(
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            <TransferFormAccountSelection {...singleGroupProps} />
        );

        const groups = screen.getAllByTestId('dt_wallets_transfer_form_account_selection_accounts_group');
        expect(groups[0]).not.toHaveClass('wallets-transfer-form-account-selection__accounts-group--divider');
        expect(screen.queryByText('Trading accounts linked with USD Wallet')).toBeInTheDocument();
        expect(screen.queryByText('Wallets')).not.toBeInTheDocument();
    });
});
