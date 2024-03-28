import { useRef, useState } from 'react';
import { TSocketRequestPayload, TSocketResponseData } from '../../types';
import { ObjectUtils } from '@deriv-com/utils';
import { useAPIContext } from '../APIProvider';

type TCurrencyPayload = Exclude<
    NonNullable<TSocketRequestPayload<'exchange_rates'>>['payload']['target_currency'],
    undefined
>;
type TCurrencyRateData = NonNullable<TSocketResponseData<'exchange_rates'>['exchange_rates']>['rates'];
type TCurrencyExchangeSubscribeFunction<T> = { base_currency: T; target_currencies: T[] };

const useExchangeRates = <T extends TCurrencyPayload>() => {
    const { subscribe: _subscribe, unsubscribe: _unsubscribe } = useAPIContext();
    const exchangeRatesSubscriptions = useRef<string[]>([]);
    const [data, setData] = useState<Record<TCurrencyPayload, TCurrencyRateData>>();

    const subscribe = async ({ base_currency, target_currencies }: TCurrencyExchangeSubscribeFunction<T>) => {
        await Promise.all(
            target_currencies.map(async c => {
                const { id, subscription } = await _subscribe('exchange_rates', {
                    payload: { base_currency, target_currency: c },
                });
                if (!exchangeRatesSubscriptions.current.includes(id)) {
                    exchangeRatesSubscriptions.current.push(id);
                    subscription.subscribe((response: TSocketResponseData<'exchange_rates'>) => {
                        const rates = response.exchange_rates?.rates;
                        if (rates) {
                            setData(prev => {
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
            })
        );
    };

    const unsubscribe = async (payload: TCurrencyExchangeSubscribeFunction<T>) => {
        if (payload) {
            const id = await ObjectUtils.hashObject({ name: 'exchange_rates', payload });
            exchangeRatesSubscriptions.current = exchangeRatesSubscriptions.current.filter(s => s !== id);
            _unsubscribe(id);
            setData(prev => {
                const currData = { ...(prev ?? {}) };
                delete currData[payload.base_currency];
                return currData;
            });
            return;
        }
        exchangeRatesSubscriptions.current.forEach(s => _unsubscribe(s));
    };

    const getExchangeRate = (base: string, target: string) => {
        if (data) {
            return data?.[base]?.[target] ?? 1;
        }
        return 1;
    };

    return { data, subscribe, unsubscribe, getExchangeRate };
};

export default useExchangeRates;
