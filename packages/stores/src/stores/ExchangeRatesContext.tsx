import { createContext } from 'react';

type TRate = Record<string, Record<string, number>>;

type TExchangeRatesContext = {
    exchange_rates: TRate;
    getExchangeRate: (base_currency: string, target_currency: string) => number;
    handleSubscription: (base_currency: string, target_currency: string) => void;
    unsubscribe: (payload: { base_currency: string; target_currency: string }) => void;
    unsubscribeAll: () => void;
};

const ExchangeRatesContext = createContext<TExchangeRatesContext | null>(null);

export default ExchangeRatesContext;
