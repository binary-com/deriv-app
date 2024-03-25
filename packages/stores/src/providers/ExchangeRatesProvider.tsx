import React from 'react';
import { ExchangeRatesResponse } from '@deriv/api-types';
import { useWS } from '@deriv/shared';
import ExchangeRatesContext from '../stores/ExchangeRatesContext';

// Implement this type to prevent install @deriv/deriv-api to this package
type DerivAPIBasicSubscribe = {
    unsubscribe: () => void;
};
type TUnsubscribeFunction = (id: string) => void;
type TRate = Record<string, Record<string, number>>;
type TPayload = {
    base_currency: string;
    target_currency: string;
};
type TExchangeRatesProvider = {
    children: React.ReactNode;
};

const ExchangeRatesProvider = ({ children }: TExchangeRatesProvider) => {
    const WS = useWS();
    const [exchangeRates, setExchangeRates] = React.useState<TRate>({});
    const isMounted = React.useRef(false);
    const subscriptions = React.useRef<Record<string, DerivAPIBasicSubscribe>>();
    const subscriptionsId = React.useRef<Record<string, string>>();
    const exchangeRatesSubscriptions = React.useRef<string[]>([]);

    const subscribeToCurrencyRate = React.useCallback(
        async (payload: TPayload) => {
            const id = JSON.stringify(payload);
            const matchingSubscription = subscriptions.current?.[id];
            if (matchingSubscription) return { id, subscription: matchingSubscription };

            const subscription = WS?.subscribe({
                exchange_rates: 1,
                subscribe: 1,
                ...(payload ?? {}),
            });

            subscriptions.current = { ...(subscriptions.current ?? {}), ...{ [id]: subscription } };
            return { id, subscription };
        },
        [WS]
    );

    const unsubscribeFromCurrencyById: TUnsubscribeFunction = React.useCallback(
        id => {
            const matchingSubscription = subscriptions.current?.[id];
            if (matchingSubscription) WS?.forget(subscriptionsId.current?.[id]);
        },
        [WS]
    );

    const handleSubscription = React.useCallback(
        async (base_currency: string, target_currency: string) => {
            if (base_currency === '' || target_currency === '' || base_currency === target_currency) return;
            if (exchangeRates[base_currency]?.[target_currency]) return;

            const { id, subscription } = await subscribeToCurrencyRate({
                base_currency,
                target_currency,
            });

            if (!exchangeRatesSubscriptions.current.includes(id)) {
                exchangeRatesSubscriptions.current.push(id);
                subscription.subscribe((response: ExchangeRatesResponse) => {
                    const rates = response.exchange_rates?.rates;
                    const subscriptionId = String(response.subscription?.id);

                    if (rates && isMounted.current) {
                        subscriptionsId.current = { ...(subscriptionsId.current ?? {}), ...{ [id]: subscriptionId } };

                        setExchangeRates(prev => {
                            const currentData = { ...(prev ?? {}) };
                            if (currentData) {
                                currentData[base_currency] = { ...currentData[base_currency], ...rates };
                                return currentData;
                            }
                            return { [base_currency]: rates };
                        });
                    }
                });
            }
        },
        [exchangeRates, subscribeToCurrencyRate]
    );

    const unsubscribe = React.useCallback(
        (payload: TPayload) => {
            if (payload) {
                const id = JSON.stringify(payload);
                exchangeRatesSubscriptions.current = exchangeRatesSubscriptions.current.filter(s => s !== id);
                unsubscribeFromCurrencyById(id);
                if (isMounted.current)
                    setExchangeRates(prev => {
                        const currData = { ...(prev ?? {}) };
                        delete currData[payload.base_currency];
                        return currData;
                    });
            }
        },
        [unsubscribeFromCurrencyById]
    );

    const unsubscribeAll = React.useCallback(() => {
        exchangeRatesSubscriptions.current.forEach(s => unsubscribeFromCurrencyById(s));
    }, [unsubscribeFromCurrencyById]);

    const getExchangeRate = React.useCallback(
        (base: string, target: string) => {
            if (exchangeRates) {
                return exchangeRates?.[base]?.[target] ?? 1;
            }
            return 1;
        },
        [exchangeRates]
    );

    React.useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
            const currentSubscriptions = subscriptions.current;
            const currentSubscriptionsIds = subscriptionsId?.current;

            if (currentSubscriptions && currentSubscriptionsIds) {
                Object.keys(currentSubscriptions).forEach(key => {
                    WS?.forget(currentSubscriptionsIds?.[key]);
                });
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = React.useMemo(
        () => ({
            handleSubscription,
            exchange_rates: exchangeRates,
            getExchangeRate,
            unsubscribe,
            unsubscribeAll,
        }),
        [exchangeRates, getExchangeRate, handleSubscription, unsubscribe, unsubscribeAll]
    );

    return <ExchangeRatesContext.Provider value={value}>{children}</ExchangeRatesContext.Provider>;
};

export default ExchangeRatesProvider;
