import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import Withdrawal from '../withdrawal';
import CashierProviders from '../../../cashier-providers';
import { mockStore } from '@deriv/stores';
import { APIProvider } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(() => ({
        data: {
            website_status: {
                currencies_config: {
                    USD: { type: 'fiat', name: 'US Dollar' },
                    AUD: { type: 'fiat', name: 'Australian Dollar' },
                    BTC: { type: 'crypto', name: 'Bitcoin' },
                },
            },
        },
    })),
}));

jest.mock('../withdrawal-locked', () => jest.fn(() => 'WithdrawalLocked'));
jest.mock('Components/no-balance', () => jest.fn(() => 'NoBalance'));
jest.mock('Components/error', () => jest.fn(() => 'Error'));
jest.mock('../withdrawal-fiat', () => jest.fn(() => 'WithdrawalFiat'));
jest.mock('../withdrawal-crypto-form', () => jest.fn(() => 'WithdrawalCryptoForm'));
jest.mock('../withdrawal-crypto-receipt', () => jest.fn(() => 'WithdrawalCryptoReceipt'));
jest.mock('Components/transactions-crypto-history', () => jest.fn(() => 'TransactionsCryptoHistory'));
jest.mock('../withdrawal-verification-email', () => jest.fn(() => 'WithdrawalVerificationEmail'));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

const cashier_mock = {
    general_store: {
        is_crypto: false,
        setActiveTab: jest.fn(),
    },
    iframe: {
        iframe_url: '',
    },
    transaction_history: {
        is_transactions_crypto_visible: false,
    },
    withdraw: {
        check10kLimit: jest.fn(),
        is_10k_withdrawal_limit_reached: false,
        is_withdraw_confirmed: false,
        is_withdrawal_locked: false,
        error: {
            setErrorMessage: jest.fn(),
        },
        verification: {
            error: {},
        },
        willMountWithdraw: jest.fn(),
    },
};

describe('<Withdrawal />', () => {
    const mockWithdrawal = (mock_root_store: ReturnType<typeof mockStore>) => {
        return (
            <APIProvider>
                <CashierProviders store={mock_root_store}>
                    <Router history={createBrowserHistory()}>
                        <Withdrawal />
                    </Router>
                </CashierProviders>
            </APIProvider>
        );
    };

    it('should render <Loading /> component', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '1000',
                currency: 'USD',
                is_authorize: true,
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    withdraw: {
                        ...cashier_mock.withdraw,
                        is_10k_withdrawal_limit_reached: undefined,
                    },
                },
            },
        });
        render(mockWithdrawal(mock_root_store));

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should render <WithdrawalLocked /> component', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '1000',
                currency: 'USD',
                is_authorize: true,
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    withdraw: {
                        ...cashier_mock.withdraw,
                        is_withdrawal_locked: true,
                    },
                },
            },
        });
        const { rerender } = render(mockWithdrawal(mock_root_store));

        expect(screen.getByText('WithdrawalLocked')).toBeInTheDocument();

        mock_root_store.modules.cashier.withdraw.is_10k_withdrawal_limit_reached = true;
        rerender(mockWithdrawal(mock_root_store));

        expect(screen.getByText('WithdrawalLocked')).toBeInTheDocument();
    });

    it('should render <NoBalance /> component', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '0',
                currency: 'USD',
                is_authorize: true,
            },
            modules: { cashier: cashier_mock },
        });
        render(mockWithdrawal(mock_root_store));

        expect(screen.getByText('NoBalance')).toBeInTheDocument();
    });

    it('should render <Error /> component', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '1000',
                currency: 'USD',
                is_authorize: true,
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    withdraw: {
                        ...cashier_mock.withdraw,
                        error: {
                            is_show_full_page: true,
                            message: 'Error message',
                            setErrorMessage: jest.fn(),
                        },
                    },
                },
            },
        });
        const { rerender } = render(mockWithdrawal(mock_root_store));

        expect(screen.getByText('Error')).toBeInTheDocument();

        mock_root_store.modules.cashier.withdraw.verification.error = { message: 'Error message' };
        rerender(mockWithdrawal(mock_root_store));

        expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should render <WithdrawalFiat /> component', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '1000',
                currency: 'USD',
                verification_code: { payment_withdraw: 'verification_code' },
                is_authorize: true,
            },
            modules: { cashier: cashier_mock },
        });

        const { rerender } = render(mockWithdrawal(mock_root_store));
        expect(screen.getByText('WithdrawalFiat')).toBeInTheDocument();

        mock_root_store.modules.cashier.iframe.iframe_url = 'coiframe_urlde';
        rerender(mockWithdrawal(mock_root_store));

        expect(screen.getByText('WithdrawalFiat')).toBeInTheDocument();
    });

    it('should render <WithdrawalCryptoForm /> component', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '1000',
                currency: 'BTC',
                verification_code: { payment_withdraw: 'verification_code' },
                is_authorize: true,
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    general_store: {
                        is_crypto: true,
                        setActiveTab: jest.fn(),
                    },
                },
            },
        });
        render(mockWithdrawal(mock_root_store));

        expect(screen.getByText('WithdrawalCryptoForm')).toBeInTheDocument();
    });

    it('should render <WithdrawalCryptoReceipt /> component', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '1000',
                currency: 'USD',
                is_authorize: true,
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    withdraw: {
                        ...cashier_mock.withdraw,
                        is_withdraw_confirmed: true,
                    },
                },
            },
        });
        render(mockWithdrawal(mock_root_store));

        expect(screen.getByText('WithdrawalCryptoReceipt')).toBeInTheDocument();
    });

    it('should render <TransactionsCryptoHistory /> component', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '1000',
                currency: 'USD',
                is_authorize: true,
            },
            modules: {
                cashier: {
                    ...cashier_mock,
                    transaction_history: {
                        is_transactions_crypto_visible: true,
                    },
                },
            },
        });
        render(mockWithdrawal(mock_root_store));

        expect(screen.getByText('TransactionsCryptoHistory')).toBeInTheDocument();
    });

    it('should render <WithdrawalVerificationEmail /> component', () => {
        const mock_root_store = mockStore({
            client: {
                balance: '1000',
                currency: 'USD',
                is_authorize: true,
            },
            modules: { cashier: cashier_mock },
        });
        render(mockWithdrawal(mock_root_store));

        expect(screen.getByText('WithdrawalVerificationEmail')).toBeInTheDocument();
    });
});
