import { useCallback, useMemo } from 'react';
import { useFetch } from '@deriv/api';

/** @deprecated Use `useCurrencyConfig` from `@deriv/api` package instead. */
const useCurrencyConfig = () => {
    const { data: website_status_data, ...rest } = useFetch('website_status');

    const currencies_config = useMemo(() => {
        if (!website_status_data?.website_status?.currencies_config) return undefined;

        const website_status_currencies_config = website_status_data.website_status.currencies_config;

        const modified_currencies_config = Object.keys(website_status_currencies_config).map(currency => {
            const currency_config = website_status_currencies_config[currency];

            return {
                ...currency_config,
                /** determine if the currency is a `crypto` currency */
                is_crypto: currency_config?.type === 'crypto',
                /** determine if the currency is a `fiat` currency */
                is_fiat: currency_config?.type === 'fiat',
                /** determine if the currency is `Australian Dollar` */
                is_AUD: currency === 'AUD',
                /** determine if the currency is `US Dollar` */
                is_USD: currency === 'USD',
                /** determine if the currency is `Euro` */
                is_EUR: currency === 'EUR',
                /** determine if the currency is `Pound Sterling` */
                is_GBP: currency === 'GBP',
                /** determine if the currency is `Bitcoin` */
                is_BTC: currency === 'BTC',
                /** determine if the currency is `Ethereum` */
                is_ETH: currency === 'ETH',
                /** determine if the currency is `Litecoin` */
                is_LTC: currency === 'LTC',
                /** determine if the currency is `Multi-Collateral DAI` */
                is_DAI: currency === 'DAI',
                /** determine if the currency is `IDK` */
                is_IDK: currency === 'IDK',
                /** determine if the currency is `Paxos Standard` */
                is_PAX: currency === 'PAX',
                /** determine if the currency is `Binary Coin` */
                is_USB: currency === 'USB',
                /** determine if the currency is `Tether Omni` */
                is_USDT: currency === 'UST',
                /** determine if the currency is `True USD` */
                is_TUSD: currency === 'TUSD',
                /** determine if the currency is `Binance USD` */
                is_BUSD: currency === 'BUSD',
                /** determine if the currency is `STATIS Euro` */
                is_EURS: currency === 'EURS',
                /** determine if the currency is `Tether ERC20` */
                is_eUSDT: currency === 'eUSDT',
                /** determine if the currency is `Tether TRC20` */
                is_tUSDT: currency === 'tUSDT',
                /** determine if the currency is `USD Coin` */
                is_USDC: currency === 'USDC',
                /** determine if the currency is `USDK` */
                is_USDK: currency === 'USDK',
                /** Currency code */
                code: currency,
                /** Currency display code */
                display_code: currency === 'UST' ? 'USDT' : currency,
                /** Local asset name for the currency icon. ex: `IcCurrencyUsd` for `USD` */
                icon: `IcCurrency${currency[0].toUpperCase() + currency.slice(1).toLowerCase()}`,
                /** Platforms with providers */
                platform: currency_config?.platform,
            };
        });

        return modified_currencies_config.reduce<Record<string, typeof modified_currencies_config[number]>>(
            (previous, current) => ({ ...previous, [current.code]: current }),
            {}
        );
    }, [website_status_data?.website_status?.currencies_config]);

    const getConfig = useCallback((currency: string) => currencies_config?.[currency], [currencies_config]);

    return {
        /** Returns the currency config object for the given currency */
        getConfig,
        /** Available currencies and their information */
        currencies_config,
        ...rest,
    };
};

export default useCurrencyConfig;
