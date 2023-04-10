import { useStore } from '@deriv/stores';

/**
 * we can use this hook to get the exchange rate for the given currency.
 * exchange_rates comes from store and inclueds the rates for all currencies based on USD.
 * @example const exchange_rate = useCurrencyExchangeRate('EUR');
 * @returns 1.2
 */
const useCurrencyExchangeRate = (currency: string) => {
    const { exchange_rates } = useStore();
    const rate = exchange_rates.data?.rates?.[currency] || 1;

    return rate;
};

export default useCurrencyExchangeRate;
