/* eslint-disable camelcase */
import React, { PropsWithChildren } from 'react';
import { APIProvider } from '@deriv/api-v2';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletsAuthProvider from '../../../../../../../AuthProvider';
import { TransferProvider } from '../../../provider';
import { TAccount } from '../../../types';
import TransferReceipt from '../TransferReceipt';

const ACCOUNTS = [
    {
        account_category: 'wallet',
        account_type: 'doughflow',
        balance: '1000',
        currency: 'USD',
        currencyConfig: {
            fractional_digits: 2,
        },
    },
    {
        account_category: 'wallet',
        account_type: 'crypto',
        balance: '0.1',
        currency: 'BTC',
        currencyConfig: {
            fractional_digits: 8,
        },
    },
    {
        account_category: 'wallet',
        account_type: 'crypto',
        balance: '1',
        currency: 'ETH',
        currencyConfig: {
            fractional_digits: 8,
        },
    },
    {
        account_category: 'wallet',
        account_type: 'crypto',
        balance: '1',
        currency: 'LTC',
        currencyConfig: {
            fractional_digits: 8,
        },
    },
] as NonNullable<TAccount>[];

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useBalance: jest.fn(() => ({
        isLoading: false,
    })),
    useTransferBetweenAccounts: jest.fn(() => ({
        data: { accounts: ACCOUNTS },
    })),
}));

const mockResetTransfer = jest.fn();
jest.mock('../../../provider', () => ({
    ...jest.requireActual('../../../provider'),
    useTransfer: jest.fn(() => ({
        activeWallet: {
            account_category: 'wallet',
            account_type: 'doughflow',
            balance: '1000',
            currency: 'USD',
            currencyConfig: {
                display_code: 'USD',
                fractional_digits: 2,
            },
        },
        receipt: {
            feeAmount: 100,
            fromAccount: {
                account_category: 'trading',
                account_type: 'doughflow',
                accountName: 'fromAccount',
                balance: '1000',
                currency: 'USD',
                currencyConfig: {
                    display_code: 'USD',
                    fractional_digits: 2,
                },
            },
            fromAmount: 10000,
            toAccount: {
                account_category: 'wallet',
                account_type: 'crypto',
                accountName: 'toAccount',
                balance: '0.1',
                currency: 'BTC',
                currencyConfig: {
                    display_code: 'BTC',
                    fractional_digits: 8,
                },
            },
            toAmount: 100,
        },
        resetTransfer: mockResetTransfer,
    })),
}));

const wrapper = ({ children }: PropsWithChildren<unknown>) => {
    return (
        <APIProvider>
            <WalletsAuthProvider>
                <TransferProvider accounts={ACCOUNTS}>{children}</TransferProvider>
            </WalletsAuthProvider>
        </APIProvider>
    );
};

describe('TransferReceipt', () => {
    it('Should render the correct fee message and label', () => {
        render(<TransferReceipt />, { wrapper });

        expect(screen.queryByText('10000.00 USD (100.00000000 BTC)')).toBeInTheDocument();
        expect(screen.queryByText('Transfer fees: 100 USD')).toBeInTheDocument();
    });
    it('Should render the correct from and to card labels', () => {
        render(<TransferReceipt />, { wrapper });

        const fromCard = screen.getByTestId('dt_wallets_app_card');
        const toCard = screen.getByTestId('dt_wallets_wallet_card');

        expect(within(fromCard).getByText('-10000.00 USD')).toBeInTheDocument();
        expect(within(toCard).queryByText('+100.00000000 BTC')).toBeInTheDocument();
    });
    it('Should invoke reset transfer when the reset button is clicked', () => {
        render(<TransferReceipt />, { wrapper });

        const resetBtn = screen.getByRole('button', {
            name: 'Make a new transfer',
        });

        userEvent.click(resetBtn);
        expect(mockResetTransfer).toBeCalled();
    });
});
