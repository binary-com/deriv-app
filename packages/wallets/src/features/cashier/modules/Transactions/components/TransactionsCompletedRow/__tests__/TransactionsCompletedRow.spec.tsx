import React, { PropsWithChildren } from 'react';
import { APIProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../../../../../AuthProvider';
import { THooks } from '../../../../../../../types';
import TransactionsCompletedRow from '../TransactionsCompletedRow';

jest.mock('../components/TransactionsCompletedRowAccountDetails', () => ({
    TransactionsCompletedRowAccountDetails: () => <div data-testid='mock-account-details' />,
}));

jest.mock('../components/TransactionsCompletedRowTransferAccountDetails', () => ({
    TransactionsCompletedRowTransferAccountDetails: () => <div data-testid='mock-transfer-account-details' />,
}));

// @ts-expect-error - since this is a mock, we only need partial properties of the accounts
const mockAccounts: THooks.AllAccountsList = [
    {
        currency: 'USD',
        is_virtual: false,
        loginid: 'CRW1111',
    },
];

const mockWallet: THooks.ActiveWalletAccount = {
    account_type: 'real',
    currency: 'USD',
    // @ts-expect-error - since this is a mock, we only need partial properties of the wallet
    currency_config: {
        display_code: 'USD',
    },
    is_virtual: false,
    loginid: 'CRW1111',
};

const mockTransaction: THooks.Transactions = {
    action_type: 'deposit',
    amount: 100,
    display_amount: '100.00',
    display_balance_after: '200.00',
    from: {
        loginid: 'CRW1234',
    },
    to: {
        loginid: 'CRW1111',
    },
};

const wrapper = ({ children }: PropsWithChildren<unknown>) => {
    return (
        <APIProvider>
            <WalletsAuthProvider>{children}</WalletsAuthProvider>
        </APIProvider>
    );
};

describe('TransactionsCompletedRow', () => {
    it('renders deposit transaction details correctly', () => {
        render(<TransactionsCompletedRow accounts={mockAccounts} transaction={mockTransaction} wallet={mockWallet} />, {
            wrapper,
        });

        expect(screen.getByText('+100.00')).toBeInTheDocument();
        expect(screen.getByText('Balance: 200.00')).toBeInTheDocument();
        expect(screen.getByTestId('mock-account-details')).toBeInTheDocument();
    });

    it('renders transfer transaction details correctly', () => {
        const transferTransaction: THooks.Transactions = {
            ...mockTransaction,
            action_type: 'transfer',
        };

        render(
            <TransactionsCompletedRow accounts={mockAccounts} transaction={transferTransaction} wallet={mockWallet} />,
            { wrapper }
        );

        expect(screen.getByText('Balance: 200.00')).toBeInTheDocument();
        expect(screen.getByTestId('mock-transfer-account-details')).toBeInTheDocument();
    });

    it('renders withdrawal transaction details correctly', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        const mockWithdrawalWallet: THooks.ActiveWalletAccount = {
            is_virtual: true,
        };

        const withdrawalTransaction: THooks.Transactions = {
            ...mockTransaction,
            action_type: 'withdrawal',
            amount: -50,
            display_amount: '-50.00',
            display_balance_after: '150.00',
        };

        render(
            <TransactionsCompletedRow
                accounts={mockAccounts}
                transaction={withdrawalTransaction}
                wallet={mockWithdrawalWallet}
            />,
            { wrapper }
        );

        expect(screen.getByText('-50.00')).toBeInTheDocument();
        expect(screen.getByText('Balance: 150.00')).toBeInTheDocument();
        expect(screen.getByTestId('mock-account-details')).toBeInTheDocument();
    });

    it('renders nothing when transaction action type or amount is missing', () => {
        const incompleteTransaction: THooks.Transactions = {
            ...mockTransaction,
            action_type: undefined,
            amount: undefined,
        };

        const { container } = render(
            <TransactionsCompletedRow
                accounts={mockAccounts}
                transaction={incompleteTransaction}
                wallet={mockWallet}
            />,
            { wrapper }
        );

        expect(container).toBeEmptyDOMElement();
    });
});
