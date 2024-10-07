/* eslint-disable camelcase */
import React, { PropsWithChildren } from 'react';
import { APIProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
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

const mockCurrencyConfig = {
    BTC: {
        display_code: 'BTC',
        fractional_digits: 8,
    },
    USD: {
        display_code: 'USD',
        fractional_digits: 2,
    },
};

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useCurrencyConfig: jest.fn(() => ({
        getConfig: (currency: 'BTC' | 'USD') => mockCurrencyConfig[currency],
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

jest.mock('../../../../../../../hooks/useAllBalanceSubscription', () =>
    jest.fn(() => ({
        data: undefined,
        isLoading: false,
    }))
);

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
        const { container } = render(<TransferReceipt />, { wrapper });

        expect(container).toHaveTextContent('10,000.00 USD (100.00000000 BTC)');
        expect(container).toHaveTextContent('Transfer fees: 100 USD');
    });
    it('Should render the correct from and to card labels', () => {
        render(<TransferReceipt />, { wrapper });

        const fromCard = screen.getByTestId('dt_wallets_app_card');
        const toCard = screen.getByTestId('dt_wallets_wallet_card');

        expect(fromCard).toHaveTextContent('-10,000.00 USD');
        expect(toCard).toHaveTextContent('+100.00000000 BTC');
    });
    it('Should invoke reset transfer when the reset button is clicked', async () => {
        render(<TransferReceipt />, { wrapper });

        const resetBtn = screen.getByRole('button', {
            name: 'Make a new transfer',
        });

        await userEvent.click(resetBtn);
        expect(mockResetTransfer).toBeCalled();
    });
});
