import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import WithdrawalCryptoReceipt from '../withdrawal-crypto-receipt';
import CashierProviders from '../../../../cashier-providers';
import { mockStore } from '@deriv/stores';

let mock_last_transaction = {
    address_hash: 'test_hash',
    address_url: 'test_url',
    amount: 0.2,
    id: '1',
    is_valid_to_cancel: 1,
    status_code: 'LOCKED',
    status_message: 'test_message',
    submit_date: 1,
    transaction_type: 'withdrawal',
    is_deposit: false,
    is_withdrawal: true,
};

jest.mock('@deriv/hooks', () => {
    return {
        ...jest.requireActual('@deriv/hooks'),
        useCryptoTransactions: jest.fn(() => ({
            last_transaction: mock_last_transaction,
        })),
    };
});

describe('<WithdrawalCryptoReceipt />', () => {
    let mockRootStore: ReturnType<typeof mockStore>;
    beforeEach(() => {
        mockRootStore = mockStore({
            client: {
                currency: 'BTC',
            },
            modules: {
                cashier: {
                    account_transfer: {
                        selected_from: {
                            balance: '1.00000000',
                            currency: 'BTC',
                            is_crypto: true,
                            is_dxtrade: false,
                            is_mt: false,
                            text: 'BTC',
                            value: 'CR90000118',
                        },
                    },
                    general_store: {
                        percentageSelectorSelectionStatus: jest.fn(),
                    },
                    transaction_history: {
                        setIsTransactionsCryptoVisible: jest.fn(),
                    },
                    withdraw: {
                        blockchain_address: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                        resetWithdrawForm: jest.fn(),
                        setIsWithdrawConfirmed: jest.fn(),
                        withdraw_amount: 0.0002,
                    },
                },
            },
            ui: {
                is_desktop: true,
                is_mobile_or_tablet: false,
            },
        });
    });

    const renderWithdrawalCryptoReceipt = () => {
        return render(
            <CashierProviders store={mockRootStore}>
                <WithdrawalCryptoReceipt />
            </CashierProviders>
        );
    };

    it('should show the proper text/messages', () => {
        renderWithdrawalCryptoReceipt();

        expect(screen.getByText('Your withdrawal will be processed within 24 hours')).toBeInTheDocument();
        expect(screen.getByText('In review')).toBeInTheDocument();
        expect(screen.getByText('0.0002 BTC')).toBeInTheDocument();
        expect(screen.getByText('BTC')).toBeInTheDocument();
        expect(screen.getByText('CR90000118')).toBeInTheDocument();
        expect(screen.getByText('BTC wallet')).toBeInTheDocument();
        expect(screen.getByText('tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt')).toBeInTheDocument();
        expect(screen.getByText('View transaction history')).toBeInTheDocument();
        expect(screen.getByText('Make a new withdrawal')).toBeInTheDocument();
    });

    it('should trigger onClick callback when the "View transaction history" button is clicked', () => {
        renderWithdrawalCryptoReceipt();

        const view_transaction_history_btn = screen.getByText('View transaction history');
        fireEvent.click(view_transaction_history_btn);
        expect(mockRootStore.modules.cashier.transaction_history.setIsTransactionsCryptoVisible).toHaveBeenCalledTimes(
            1
        );
    });

    it('should trigger onClick callback when the "Make a new withdrawal" button is clicked', () => {
        renderWithdrawalCryptoReceipt();

        const make_new_withdrawal_btn = screen.getByText('Make a new withdrawal');
        fireEvent.click(make_new_withdrawal_btn);
        expect(mockRootStore.modules.cashier.withdraw.setIsWithdrawConfirmed).toHaveBeenCalledTimes(1);
    });

    it('should show the status as "In process" if the transaction status is "PROCESSING"', () => {
        mock_last_transaction = {
            ...mock_last_transaction,
            status_code: 'PROCESSING',
        };
        renderWithdrawalCryptoReceipt();

        expect(screen.getByText('In process')).toBeInTheDocument();
    });

    it('should show the status as "Unsuccessful" if the transaction status is "ERROR"', () => {
        mock_last_transaction = {
            ...mock_last_transaction,
            status_code: 'ERROR',
        };
        renderWithdrawalCryptoReceipt();

        expect(screen.getByText('Unsuccessful')).toBeInTheDocument();
    });

    it('should show the status as "Successful" if the transaction status is "SENT"', () => {
        mock_last_transaction = {
            ...mock_last_transaction,
            status_code: 'SENT',
        };
        renderWithdrawalCryptoReceipt();

        expect(screen.getByText('Successful')).toBeInTheDocument();
    });
});
