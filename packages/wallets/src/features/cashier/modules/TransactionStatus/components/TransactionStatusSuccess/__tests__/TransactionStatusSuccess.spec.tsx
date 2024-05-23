import React from 'react';
import { useHistory } from 'react-router-dom';
import { APIProvider } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../../../../../AuthProvider';
import { ModalProvider } from '../../../../../../../components/ModalProvider';
import TransactionStatusSuccess from '../TransactionStatusSuccess';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));
const mockUseHistory = useHistory as jest.Mock;

const mockTransactions = [
    {
        address_hash: '',
        address_url: '',
        amount: 0.0001,
        description: '',
        formatted_address_hash: '',
        formatted_amount: '0.00010000 BTC',
        formatted_confirmations: '',
        formatted_transaction_hash: '',
        id: '',
        is_deposit: false,
        is_valid_to_cancel: 1 as const,
        is_withdrawal: true,
        status_code: 'LOCKED' as const,
        status_message: '',
        status_name: '',
        submit_date: 123456,
        transaction_type: 'withdrawal' as const,
    },
];

const mockWallet = {
    account_category: 'wallet' as const,
    account_type: '',
    balance: 1,
    broker: '',
    created_at: new Date('01/01/1970'),
    currency: '',
    currency_config: {
        code: '',
        display_code: '',
        fractional_digits: 1,
        is_AUD: false,
        is_BTC: true,
        is_BUSD: false,
        is_crypto: true,
        is_DAI: false,
        is_deposit_suspended: 0 as const,
        is_ETH: false,
        is_EUR: false,
        is_EURS: false,
        is_eUSDT: false,
        is_fiat: false,
        is_GBP: false,
        is_IDK: false,
        is_LTC: false,
        is_PAX: false,
        is_suspended: 0 as const,
        is_TUSD: false,
        is_tUSDT: false,
        is_USB: false,
        is_USD: false,
        is_USDC: false,
        is_USDK: false,
        is_USDT: false,
        is_withdrawal_suspended: 0 as const,
        name: '',
        stake_default: 0.1,
        transfer_between_accounts: {
            fees: {},
            limits: { max: 0.1, min: 0.1 },
            limits_ctrader: { max: 0.1, min: 0.1 },
            limits_derivez: { max: 0.1, min: 0.1 },
            limits_dxtrade: { max: 0.1, min: 0.1 },
            limits_mt5: { max: 0.1, min: 0.1 },
        },
        type: 'crypto' as const,
    },
    display_balance: '',
    dtrade_loginid: undefined,
    excluded_until: undefined,
    is_active: true,
    is_crypto: true,
    is_disabled: false,
    is_linked_account_active: false,
    is_malta_wallet: false,
    is_mf: false,
    is_trading: false,
    is_virtual: false,
    is_wallet: true,
    landing_company_name: '',
    linked_to: [],
    loginid: '',
    platform: 'deriv' as const,
    wallet_currency_type: '',
};

describe('TransactionStatusSuccess', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render winthdrawal info for withdrawal transactions', () => {
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <ModalProvider>
                        <TransactionStatusSuccess
                            transactionType='withdrawal'
                            transactions={mockTransactions}
                            wallet={mockWallet}
                        />
                    </ModalProvider>
                </WalletsAuthProvider>
            </APIProvider>
        );

        expect(screen.getByText('Withdrawal')).toBeInTheDocument();
        expect(screen.getByText('0.00010000 BTC')).toBeInTheDocument();
        expect(screen.queryByText('No recent transactions.')).not.toBeInTheDocument();
        expect(screen.queryByText('View more')).not.toBeInTheDocument();
    });

    it('should render deposit info for deposit transactions', () => {
        const mockDeposit = [
            {
                address_hash: '',
                address_url: '',
                amount: 0.0001,
                description: '',
                formatted_address_hash: '',
                formatted_amount: '0.00010000 BTC',
                formatted_confirmations: '',
                formatted_transaction_hash: '',
                id: '',
                is_deposit: true,
                is_valid_to_cancel: 1 as const,
                is_withdrawal: false,
                status_code: 'LOCKED' as const,
                status_message: '',
                status_name: '',
                submit_date: 123456,
                transaction_type: 'withdrawal' as const,
            },
        ];

        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <ModalProvider>
                        <TransactionStatusSuccess
                            transactionType='deposit'
                            transactions={mockDeposit}
                            wallet={mockWallet}
                        />
                    </ModalProvider>
                </WalletsAuthProvider>
            </APIProvider>
        );

        expect(screen.getByText('Deposit')).toBeInTheDocument();
        expect(screen.getByText('0.00010000 BTC')).toBeInTheDocument();
        expect(screen.queryByText('No recent transactions.')).not.toBeInTheDocument();
        expect(screen.queryByText('View more')).not.toBeInTheDocument();
    });

    it('should render "No recent transactions" when there are no transactions', () => {
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <ModalProvider>
                        <TransactionStatusSuccess transactions={[]} wallet={mockWallet} />
                    </ModalProvider>
                </WalletsAuthProvider>
            </APIProvider>
        );

        expect(screen.getByText('No recent transactions.')).toBeInTheDocument();
        expect(screen.queryByText('Deposit')).not.toBeInTheDocument();
        expect(screen.queryByText('Withdrawal')).not.toBeInTheDocument();
        expect(screen.queryByText('View more')).not.toBeInTheDocument();
    });

    it('should render correct elements when there are more than 3 transactions', () => {
        const pushMock = jest.fn();
        mockUseHistory.mockReturnValue({ push: pushMock });

        for (let i = 0; i < 5; i++) {
            const newTransaction = {
                address_hash: '',
                address_url: '',
                amount: 0.0001,
                description: '',
                formatted_address_hash: '',
                formatted_amount: '',
                formatted_confirmations: '',
                formatted_transaction_hash: '',
                id: `transaction_${i}`,
                is_deposit: false,
                is_valid_to_cancel: 1 as const,
                is_withdrawal: true,
                status_code: 'LOCKED' as const,
                status_message: '',
                status_name: '',
                submit_date: 123456,
                transaction_type: 'withdrawal' as const,
            };

            mockTransactions.push(newTransaction);
        }

        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <ModalProvider>
                        <TransactionStatusSuccess
                            transactionType='withdrawal'
                            transactions={mockTransactions}
                            wallet={mockWallet}
                        />
                    </ModalProvider>
                </WalletsAuthProvider>
            </APIProvider>
        );

        expect(screen.queryByText('No recent transactions.')).not.toBeInTheDocument();
        expect(screen.getAllByText('Withdrawal')[0]).toBeInTheDocument();
        expect(screen.getAllByText('0.00010000 BTC')[0]).toBeInTheDocument();
        expect(screen.getByText('View more')).toBeInTheDocument();

        fireEvent.click(screen.getByText('View more'));
        expect(pushMock).toHaveBeenCalledWith('/wallets/cashier/transactions', {
            showPending: true,
            transactionType: 'withdrawal',
        });
    });
});
