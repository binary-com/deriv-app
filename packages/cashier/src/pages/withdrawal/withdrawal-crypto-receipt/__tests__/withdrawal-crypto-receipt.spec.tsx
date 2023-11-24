import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import WithdrawalCryptoReceipt from '../withdrawal-crypto-receipt';
import CashierProviders from '../../../../cashier-providers';
import { mockStore } from '@deriv/stores';

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
});
