import React from 'react';
import { Localize } from '@deriv-com/translations';
import lifetimeAccountLimitsBetweenWalletsMessageFn from '../lifetimeAccountLimitsBetweenWalletsMessageFn';

const mockDisplayMoney = jest.fn((amount, currency, decimals) => `${amount.toFixed(decimals)} ${currency}`);

const fiatAccount = {
    account_category: 'wallet',
    account_type: 'doughflow',
    accountName: 'Fiat Account',
    currency: 'USD',
    currencyConfig: { display_code: 'USD', fractional_digits: 2 },
};

const cryptoAccount = {
    account_category: 'wallet',
    account_type: 'crypto',
    accountName: 'Crypto Account',
    currency: 'BTC',
    currencyConfig: { display_code: 'BTC', fractional_digits: 8 },
};

describe('lifetimeAccountLimitsBetweenWalletsMessageFn', () => {
    it('returns null if sourceAccount is not a wallet', () => {
        const result = lifetimeAccountLimitsBetweenWalletsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: { account_category: 'trading' },
        });
        expect(result).toBeNull();
    });

    it('returns null if targetAccount is not a wallet', () => {
        const result = lifetimeAccountLimitsBetweenWalletsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: { account_category: 'trading' },
        });
        expect(result).toBeNull();
    });

    it('handles reaching the lifetime limit for fiat transfers', () => {
        const result = lifetimeAccountLimitsBetweenWalletsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'USD' },
            activeWalletExchangeRates: { rates: { BTC: 0.00002, USD: 1 } },
            limits: {
                lifetime_transfers: {
                    crypto_to_fiat: {
                        allowed: 1000,
                        available: 0,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: cryptoAccount,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: fiatAccount,
        });
        expect(result).toEqual({
            action: {
                buttonLabel: <Localize i18n_default_text='Verify' />,
                navigateTo: '/account/proof-of-identity',
                shouldOpenInNewTab: true,
            },
            message: (
                <Localize
                    i18n_default_text="You've reached the lifetime transfer limit from your {{sourceAccountName}} to {{targetAccountName}}. Verify your account to upgrade the limit."
                    values={{
                        sourceAccountName: cryptoAccount.accountName,
                        targetAccountName: fiatAccount.accountName,
                    }}
                />
            ),
            type: 'error',
        });
    });

    it('handles reaching the lifetime limit for crypto transfers', () => {
        const result = lifetimeAccountLimitsBetweenWalletsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'USD' },
            activeWalletExchangeRates: { rates: { BTC: 0.00002, USD: 1 } },
            limits: {
                lifetime_transfers: {
                    fiat_to_crypto: {
                        allowed: 1000,
                        available: 0,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: fiatAccount,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: cryptoAccount,
        });
        expect(result).toEqual({
            action: {
                buttonLabel: <Localize i18n_default_text='Verify' />,
                navigateTo: '/account/proof-of-identity',
                shouldOpenInNewTab: true,
            },
            message: (
                <Localize
                    i18n_default_text="You've reached the lifetime transfer limit from your {{sourceAccountName}} to any cryptocurrency Wallet. Verify your account to upgrade the limit."
                    values={{ sourceAccountName: fiatAccount.accountName }}
                />
            ),
            type: 'error',
        });
    });

    it('handles available lifetime limit for crypto transfers', () => {
        const result = lifetimeAccountLimitsBetweenWalletsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'USD' },
            activeWalletExchangeRates: { rates: { BTC: 0.00002, USD: 1 } },
            displayMoney: mockDisplayMoney,
            limits: {
                lifetime_transfers: {
                    fiat_to_crypto: {
                        allowed: 1000,
                        available: 500,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: fiatAccount,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: cryptoAccount,
        });
        expect(result).toEqual({
            action: {
                buttonLabel: <Localize i18n_default_text='Verify' />,
                navigateTo: '/account/proof-of-identity',
                shouldOpenInNewTab: true,
            },
            message: (
                <Localize
                    i18n_default_text='Your remaining lifetime transfer limit from {{sourceAccountName}} to any cryptocurrency Wallets is {{formattedSourceCurrencyRemainder}}. Verify your account to upgrade the limit.'
                    values={{
                        formattedSourceCurrencyRemainder: '500.00 USD',
                        sourceAccountName: fiatAccount.accountName,
                    }}
                />
            ),
            type: 'success',
        });
    });

    it('handles available lifetime limit for crypto transfers with equal allowed and available sum', () => {
        const result = lifetimeAccountLimitsBetweenWalletsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'USD' },
            activeWalletExchangeRates: { rates: { BTC: 0.00002, USD: 1 } },
            displayMoney: mockDisplayMoney,
            limits: {
                lifetime_transfers: {
                    fiat_to_crypto: {
                        allowed: 1000,
                        available: 1000,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: fiatAccount,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: cryptoAccount,
        });
        expect(result).toEqual({
            message: (
                <Localize
                    i18n_default_text='The lifetime transfer limit from {{sourceAccountName}} to any cryptocurrency Wallets is up to {{formattedSourceCurrencyLimit}}.'
                    values={{ formattedSourceCurrencyLimit: '1000.00 USD', sourceAccountName: fiatAccount.accountName }}
                />
            ),
            type: 'success',
        });
    });

    it('handles available lifetime limit for fiat transfers', () => {
        const result = lifetimeAccountLimitsBetweenWalletsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'BTC' },
            activeWalletExchangeRates: { rates: { BTC: 1, USD: 60000 } },
            displayMoney: mockDisplayMoney,
            limits: {
                lifetime_transfers: {
                    crypto_to_fiat: {
                        allowed: 10,
                        available: 5,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: cryptoAccount,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: fiatAccount,
        });
        expect(result).toEqual({
            action: {
                buttonLabel: <Localize i18n_default_text='Verify' />,
                navigateTo: '/account/proof-of-identity',
                shouldOpenInNewTab: true,
            },
            message: (
                <Localize
                    i18n_default_text='Your remaining lifetime transfer limit from {{sourceAccountName}} to {{targetAccountName}} is {{formattedSourceCurrencyRemainder}} (Approximate to {{formattedSourceCurrencyRemainderInUSD}}). Verify your account to upgrade the limit.'
                    values={{
                        formattedSourceCurrencyRemainder: '5.00000000 BTC',
                        formattedSourceCurrencyRemainderInUSD: '300000.00 USD',
                        sourceAccountName: cryptoAccount.accountName,
                        targetAccountName: fiatAccount.accountName,
                    }}
                />
            ),
            type: 'success',
        });
    });

    it('handles lifetime limit for fiat transfers with equal allowed and available sum', () => {
        const result = lifetimeAccountLimitsBetweenWalletsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'BTC' },
            activeWalletExchangeRates: { rates: { BTC: 1, USD: 5 } },
            displayMoney: mockDisplayMoney,
            limits: {
                lifetime_transfers: {
                    crypto_to_fiat: {
                        allowed: 10,
                        available: 10,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: cryptoAccount,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: fiatAccount,
        });
        expect(result).toEqual({
            message: (
                <Localize
                    i18n_default_text='The lifetime transfer limit from {{sourceAccountName}} to {{targetAccountName}} is up to {{formattedSourceCurrencyLimit}} (Approximate to {{formattedSourceCurrencyLimitInUSD}}).'
                    values={{
                        formattedSourceCurrencyLimit: '10.00000000 BTC',
                        formattedSourceCurrencyLimitInUSD: '50.00 USD',
                        sourceAccountName: cryptoAccount.accountName,
                        targetAccountName: fiatAccount.accountName,
                    }}
                />
            ),
            type: 'success',
        });
    });

    it('handles available lifetime limit for crypto to crypto transfers', () => {
        const result = lifetimeAccountLimitsBetweenWalletsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'BTC' },
            activeWalletExchangeRates: { rates: { BTC: 1, USD: 60000 } },
            displayMoney: mockDisplayMoney,
            limits: {
                lifetime_transfers: {
                    crypto_to_crypto: {
                        allowed: 10,
                        available: 5,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: cryptoAccount,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: cryptoAccount,
        });
        expect(result).toEqual({
            action: {
                buttonLabel: <Localize i18n_default_text='Verify' />,
                navigateTo: '/account/proof-of-identity',
                shouldOpenInNewTab: true,
            },
            message: (
                <Localize
                    i18n_default_text='Your remaining lifetime transfer limit between cryptocurrency Wallets is {{formattedSourceCurrencyRemainder}} (Approximate to {{formattedSourceCurrencyRemainderInUSD}}). Verify your account to upgrade the limit.'
                    values={{
                        formattedSourceCurrencyRemainder: '5.00000000 BTC',
                        formattedSourceCurrencyRemainderInUSD: '300000.00 USD',
                    }}
                />
            ),
            type: 'success',
        });
    });

    it('handles lifetime limit for crypto to crypto transfers with equal allowed and available sum', () => {
        const result = lifetimeAccountLimitsBetweenWalletsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'BTC' },
            activeWalletExchangeRates: { rates: { BTC: 1, USD: 5 } },
            displayMoney: mockDisplayMoney,
            limits: {
                lifetime_transfers: {
                    crypto_to_crypto: {
                        allowed: 1000,
                        available: 1000,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: cryptoAccount,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: cryptoAccount,
        });
        expect(result).toEqual({
            message: (
                <Localize
                    i18n_default_text='The lifetime transfer limit between cryptocurrency Wallets is up to {{formattedSourceCurrencyLimit}} (Approximate to {{formattedSourceCurrencyLimitInUSD}}).'
                    values={{
                        formattedSourceCurrencyLimit: '1000.00000000 BTC',
                        formattedSourceCurrencyLimitInUSD: '5000.00 USD',
                    }}
                />
            ),
            type: 'success',
        });
    });

    it('handles lifetime limit for fiat transfers when source amount greater than available sum', () => {
        const resultCryptoToFiat = lifetimeAccountLimitsBetweenWalletsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'BTC' },
            activeWalletExchangeRates: { rates: { BTC: 1, USD: 60000 } },
            displayMoney: mockDisplayMoney,
            limits: {
                lifetime_transfers: {
                    crypto_to_fiat: {
                        allowed: 10,
                        available: 5,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: cryptoAccount,
            sourceAmount: 15,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: fiatAccount,
        });
        expect(resultCryptoToFiat).toEqual({
            action: {
                buttonLabel: <Localize i18n_default_text='Verify' />,
                navigateTo: '/account/proof-of-identity',
                shouldOpenInNewTab: true,
            },
            message: (
                <Localize
                    i18n_default_text='The lifetime transfer limit is up to {{formattedSourceCurrencyRemainder}} ({{formattedConvertedSourceCurrencyRemainder}}). Verify your account to upgrade the limit.'
                    values={{
                        formattedConvertedSourceCurrencyRemainder: '300000.00 USD',
                        formattedSourceCurrencyRemainder: '5.00000000 BTC',
                    }}
                />
            ),
            type: 'error',
        });

        const resultFiatToCrypto = lifetimeAccountLimitsBetweenWalletsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'USD' },
            activeWalletExchangeRates: { rates: { BTC: 0.00002, USD: 1 } },
            displayMoney: mockDisplayMoney,
            limits: {
                lifetime_transfers: {
                    fiat_to_crypto: {
                        allowed: 10000,
                        available: 5000,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: fiatAccount,
            sourceAmount: 7000,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: cryptoAccount,
        });
        expect(resultFiatToCrypto).toEqual({
            action: {
                buttonLabel: <Localize i18n_default_text='Verify' />,
                navigateTo: '/account/proof-of-identity',
                shouldOpenInNewTab: true,
            },
            message: (
                <Localize
                    i18n_default_text='The lifetime transfer limit is up to {{formattedSourceCurrencyRemainder}} ({{formattedConvertedSourceCurrencyRemainder}}). Verify your account to upgrade the limit.'
                    values={{
                        formattedConvertedSourceCurrencyRemainder: '0.10000000 BTC',
                        formattedSourceCurrencyRemainder: '5000.00 USD',
                    }}
                />
            ),
            type: 'error',
        });
    });

    it('handles lifetime limit for crypto to crypto transfers when source amount greater than available sum', () => {
        const result = lifetimeAccountLimitsBetweenWalletsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'BTC' },
            activeWalletExchangeRates: { rates: { BTC: 1, USD: 60000 } },
            displayMoney: mockDisplayMoney,
            limits: {
                lifetime_transfers: {
                    crypto_to_crypto: {
                        allowed: 10,
                        available: 5,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: cryptoAccount,
            sourceAmount: 15,
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: cryptoAccount,
        });
        expect(result).toEqual({
            action: {
                buttonLabel: <Localize i18n_default_text='Verify' />,
                navigateTo: '/account/proof-of-identity',
                shouldOpenInNewTab: true,
            },
            message: (
                <Localize
                    i18n_default_text='The lifetime transfer limit is up to {{formattedSourceCurrencyRemainder}} ({{formattedSourceCurrencyRemainderInUSD}}). Verify your account to upgrade the limit.'
                    values={{
                        formattedSourceCurrencyRemainder: '5.00000000 BTC',
                        formattedSourceCurrencyRemainderInUSD: '300000.00 USD',
                    }}
                />
            ),
            type: 'error',
        });
    });

    it('returns null if sourceAccount currency does not match activeWallet currency and no exchange rate', () => {
        const result = lifetimeAccountLimitsBetweenWalletsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'USD' },
            activeWalletExchangeRates: { rates: {} },
            displayMoney: mockDisplayMoney,
            limits: {
                lifetime_transfers: {
                    fiat_to_crypto: {
                        allowed: 1000,
                        available: 500,
                    },
                },
            },
            sourceAccount: {
                account_category: 'wallet',
                account_type: 'doughflow',
                currency: 'EUR',
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                currencyConfig: { display_code: 'EUR', fractional_digits: 2 },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            targetAccount: cryptoAccount,
        });
        expect(result).toBeNull();
    });

    it('returns null if targetAccount currency does not match activeWallet currency and no exchange rate', () => {
        const result = lifetimeAccountLimitsBetweenWalletsMessageFn({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: { currency: 'USD' },
            activeWalletExchangeRates: { rates: {} },
            displayMoney: mockDisplayMoney,
            limits: {
                lifetime_transfers: {
                    fiat_to_crypto: {
                        allowed: 1000,
                        available: 500,
                    },
                },
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            sourceAccount: fiatAccount,
            targetAccount: {
                account_category: 'wallet',
                account_type: 'crypto',
                currency: 'EUR',
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                currencyConfig: { display_code: 'EUR', fractional_digits: 2 },
            },
        });
        expect(result).toBeNull();
    });
});
