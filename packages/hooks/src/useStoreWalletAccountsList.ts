import { useMemo } from 'react';
import { useStore } from '@deriv/stores';

const currency_to_icon_mapper: Record<string, Record<'light' | 'dark', string>> = {
    Demo: {
        dark: 'IcWalletDerivDemoDark',
        light: 'IcWalletDerivDemoLight',
    },
    USD: {
        dark: 'IcWalletCurrencyUsd',
        light: 'IcWalletCurrencyUsd',
    },
    EUR: {
        dark: 'IcWalletCurrencyEur',
        light: 'IcWalletCurrencyEur',
    },
    AUD: {
        dark: 'IcWalletCurrencyAud',
        light: 'IcWalletCurrencyAud',
    },
    GBP: {
        dark: 'IcWalletCurrencyGbp',
        light: 'IcWalletCurrencyGbp',
    },
    BTC: {
        dark: 'IcWalletBitcoinDark',
        light: 'IcWalletBitcoinLight',
    },
    ETH: {
        dark: 'IcWalletEthereumDark',
        light: 'IcWalletEthereumLight',
    },
    USDT: {
        dark: 'IcWalletTetherDark',
        light: 'IcWalletTetherLight',
    },
    eUSDT: {
        dark: 'IcWalletTetherDark',
        light: 'IcWalletTetherLight',
    },
    tUSDT: {
        dark: 'IcWalletTetherDark',
        light: 'IcWalletTetherLight',
    },
    UST: {
        dark: 'IcWalletTetherDark',
        light: 'IcWalletTetherLight',
    },
    LTC: {
        dark: 'IcWalletLiteCoinDark',
        light: 'IcWalletLiteCoinLight',
    },
    USDC: {
        dark: 'IcWalletUsdCoinDark',
        light: 'IcWalletUsdCoinLight',
    },
    XRP: {
        dark: 'IcWalletXrpDark',
        light: 'IcWalletXrpLight',
    },
};

/** A custom hook to get the list of wallets for the current user. */
const useStoreWalletAccountsList = () => {
    const { client } = useStore();
    const { accounts, is_crypto } = client;

    // Add additional information to each wallet.
    const wallets = useMemo(() => {
        return Object.keys(accounts)
            ?.filter(id => accounts?.[id].account_category === 'wallet')
            ?.map(id => {
                const wallet = accounts?.[id];

                const loginid = id;
                const currency = wallet.currency;
                const is_disabled = Boolean(wallet.is_disabled);
                const is_virtual = Boolean(wallet.is_virtual);

                const fiat_or_crypto = is_crypto(currency) ? 'crypto' : 'fiat';
                const icon_type = is_virtual ? 'demo' : fiat_or_crypto;
                const landing_company_name = wallet.landing_company_name?.replace('maltainvest', 'malta');
                const is_malta_wallet = landing_company_name === 'malta';
                const dtrade_loginid = wallet?.linked_to?.find(account => account?.platform === 'dtrade')?.loginid;
                const dtrade_balance = accounts?.[dtrade_loginid ?? '']?.balance;
                const is_dtrader_account_disabled = Boolean(accounts?.[dtrade_loginid ?? '']?.is_disabled);

                const wallet_currency_type = is_virtual ? 'Demo' : currency || '';
                const icons = currency_to_icon_mapper[wallet_currency_type];

                const gradients = {
                    /** The gradient class name for the wallet header background. */
                    header: {
                        dark: `wallet-header__${wallet_currency_type.toLowerCase()}-bg--dark`,
                        light: `wallet-header__${wallet_currency_type.toLowerCase()}-bg`,
                    },
                    /** The gradient class name for the wallet card background. */
                    card: {
                        dark: `wallet-card__${wallet_currency_type.toLowerCase()}-bg--dark`,
                        light: `wallet-card__${wallet_currency_type.toLowerCase()}-bg`,
                    },
                };

                return {
                    ...wallet,
                    dtrade_loginid,
                    dtrade_balance,
                    icons,
                    icon_type,
                    is_disabled,
                    is_virtual,
                    is_malta_wallet,
                    landing_company_name,
                    loginid,
                    gradients,
                    is_dtrader_account_disabled,
                } as const;
            });
    }, [accounts, is_crypto]);

    // Sort wallet accounts alphabetically by fiat, crypto, then virtual.
    const sorted_wallets = useMemo(() => {
        if (!wallets) return;

        return [...wallets].sort((a, b) => {
            if (a.is_virtual !== b.is_virtual) {
                return a.is_virtual ? 1 : -1;
            } else if (is_crypto(a.currency) !== is_crypto(b.currency)) {
                return is_crypto(a.currency) ? 1 : -1;
            }

            return (a.currency || 'USD').localeCompare(b.currency || 'USD');
        });
    }, [is_crypto, wallets]);

    return {
        /** List of wallets for current user. */
        data: sorted_wallets,
        /** Indicating whether the user has a wallet */
        has_wallet: sorted_wallets && sorted_wallets.length > 0,
    };
};

export default useStoreWalletAccountsList;
