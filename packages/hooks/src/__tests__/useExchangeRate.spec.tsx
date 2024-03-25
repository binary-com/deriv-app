import * as React from 'react';
import { mockStore, StoreProvider, ExchangeRatesProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useExchangeRate from '../useExchangeRate';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useContext: jest.fn(() => ({
        exchange_rates: {
            USD: {
                EUR: 1.3,
                GBP: 1.4,
                ETH: 0.0001,
            },
        },
    })),
}));

describe('useExchangeRate', () => {
    test('should return undefined if currency is not found', async () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>
                <ExchangeRatesProvider>{children}</ExchangeRatesProvider>
            </StoreProvider>
        );
        const { result } = renderHook(() => useExchangeRate(), { wrapper });
        const jyp_rate = result.current.exchange_rates.USD.JYP;
        expect(jyp_rate).toBe(undefined);
    });

    test('should return correct rate for the given currency other than USD', async () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>
                <ExchangeRatesProvider>{children}</ExchangeRatesProvider>
            </StoreProvider>
        );
        const { result } = renderHook(() => useExchangeRate(), { wrapper });
        const gbp_rate = result.current.exchange_rates.USD.GBP;
        expect(gbp_rate).toBe(1.4);
    });
});
