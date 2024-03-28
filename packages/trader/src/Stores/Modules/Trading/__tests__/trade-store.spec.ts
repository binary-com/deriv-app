import moment from 'moment';
import { waitFor } from '@testing-library/react';
import { Analytics, TEvents } from '@deriv-com/analytics';
import { mockStore } from '@deriv/stores';
import TradeStore from '../trade-store';
import { configure } from 'mobx';
import { ContractType } from '../Helpers/contract-type';

configure({ safeDescriptors: false });

const symbol = '1HZ100V';
const activeSymbols = [
    {
        allow_forward_starting: 1,
        display_name: 'Volatility 100 (1s) Index',
        display_order: 3,
        exchange_is_open: 1,
        is_trading_suspended: 0,
        market: 'synthetic_index',
        market_display_name: 'Derived',
        pip: 0.01,
        subgroup: 'synthetics',
        subgroup_display_name: 'Synthetics',
        submarket: 'random_index',
        submarket_display_name: 'Continuous Indices',
        symbol,
        symbol_type: 'stockindex',
    },
];

jest.mock('@deriv/shared', () => {
    const commonRiseFallProperties = {
        barrier_category: 'euro_atm',
        barriers: 0,
        exchange_name: 'RANDOM',
        market: 'synthetic_index',
        submarket: 'random_index',
        underlying_symbol: symbol,
    };
    const commonNonEqualProperties = {
        contract_category: 'callput',
        contract_category_display: 'Up/Down',
    };
    const commonEqualProperties = {
        contract_category: 'callputequal',
        contract_category_display: 'Rise/Fall Equal',
    };
    const commonRiseProperties = {
        contract_display: 'Higher',
        sentiment: 'up',
    };
    const commonFallProperties = {
        contract_display: 'Lower',
        sentiment: 'down',
    };
    const forwardStartingOptions = [
        {
            close: '1708991999',
            date: '1708905600',
            open: '1708905600',
        },
        {
            close: '1709078399',
            date: '1708992000',
            open: '1708992000',
        },
        {
            close: '1709164799',
            date: '1709078400',
            open: '1709078400',
        },
    ];
    const commonForwardStartingProperties = {
        expiry_type: 'intraday',
        forward_starting_options: forwardStartingOptions,
        max_contract_duration: '1d',
        min_contract_duration: '2m',
        start_type: 'forward',
    };
    const commonDailyExpiryProperties = {
        expiry_type: 'daily',
        max_contract_duration: '365d',
        min_contract_duration: '1d',
        start_type: 'spot',
    };
    const commonIntradayExpiryProperties = {
        expiry_type: 'intraday',
        max_contract_duration: '1d',
        min_contract_duration: '15s',
        start_type: 'spot',
    };
    const commonTickExpiryProperties = {
        expiry_type: 'tick',
        max_contract_duration: '10t',
        min_contract_duration: '1t',
        start_type: 'spot',
    };
    const riseFallProperties = {
        ...commonRiseFallProperties,
        ...commonNonEqualProperties,
    };
    const riseFallEqualProperties = {
        ...commonRiseFallProperties,
        ...commonEqualProperties,
    };
    const contractsForResponse = {
        contracts_for: {
            available: [
                {
                    ...riseFallProperties,
                    ...commonRiseProperties,
                    ...commonDailyExpiryProperties,
                    contract_type: 'CALL',
                },
                {
                    ...riseFallProperties,
                    ...commonFallProperties,
                    ...commonDailyExpiryProperties,
                    contract_type: 'PUT',
                },
                {
                    ...riseFallProperties,
                    ...commonRiseProperties,
                    ...commonForwardStartingProperties,
                    contract_type: 'CALL',
                },
                {
                    ...riseFallProperties,
                    ...commonFallProperties,
                    ...commonForwardStartingProperties,
                    contract_type: 'PUT',
                },
                {
                    ...riseFallProperties,
                    ...commonRiseProperties,
                    ...commonIntradayExpiryProperties,
                    contract_type: 'CALL',
                },
                {
                    ...riseFallProperties,
                    ...commonFallProperties,
                    ...commonIntradayExpiryProperties,
                    contract_type: 'PUT',
                },
                {
                    ...riseFallProperties,
                    ...commonRiseProperties,
                    ...commonTickExpiryProperties,
                    contract_type: 'CALL',
                },
                {
                    ...riseFallProperties,
                    ...commonFallProperties,
                    ...commonTickExpiryProperties,
                    contract_type: 'PUT',
                },
                {
                    ...riseFallEqualProperties,
                    ...commonRiseProperties,
                    ...commonDailyExpiryProperties,
                    contract_type: 'CALLE',
                },
                {
                    ...riseFallEqualProperties,
                    ...commonFallProperties,
                    ...commonDailyExpiryProperties,
                    contract_type: 'PUTE',
                },
                {
                    ...riseFallEqualProperties,
                    ...commonRiseProperties,
                    ...commonForwardStartingProperties,
                    contract_type: 'CALLE',
                },
                {
                    ...riseFallEqualProperties,
                    ...commonFallProperties,
                    ...commonForwardStartingProperties,
                    contract_type: 'PUTE',
                },
                {
                    ...riseFallEqualProperties,
                    ...commonRiseProperties,
                    ...commonIntradayExpiryProperties,
                    contract_type: 'CALLE',
                },
                {
                    ...riseFallEqualProperties,
                    ...commonFallProperties,
                    ...commonIntradayExpiryProperties,
                    contract_type: 'PUTE',
                },
                {
                    ...riseFallEqualProperties,
                    ...commonRiseProperties,
                    ...commonTickExpiryProperties,
                    contract_type: 'CALLE',
                },
                {
                    ...riseFallEqualProperties,
                    ...commonFallProperties,
                    ...commonTickExpiryProperties,
                    contract_type: 'PUTE',
                },
            ],
            close: 1708991999,
            feed_license: 'realtime',
            hit_count: 72,
            non_available: [
                {
                    contract_category: 'accumulator',
                    contract_display_name: 'Accumulator Up',
                    contract_type: 'ACCU',
                },
            ],
            open: 1708905600,
            spot: 10412.03,
        },
        echo_req: {
            contracts_for: symbol,
            req_id: 31,
        },
        msg_type: 'contracts_for',
        req_id: 31,
    };
    return {
        ...jest.requireActual('@deriv/shared'),
        pickDefaultSymbol: jest.fn(() => Promise.resolve(symbol)),
        WS: {
            authorized: {
                activeSymbols: () => Promise.resolve({ active_symbols: activeSymbols }),
            },
            contractsFor: () => Promise.resolve(contractsForResponse),
            storage: {
                contractsFor: () => Promise.resolve(contractsForResponse),
            },
            subscribeProposal: jest.fn(),
            wait: (...payload: []) => Promise.resolve([...payload]),
        },
    };
});

let mockedTradeStore: TradeStore;

beforeAll(async () => {
    mockedTradeStore = new TradeStore({
        root_store: mockStore({
            common: {
                server_time: moment('2024-02-26T11:59:59.488Z'),
            },
        }),
    });
    await ContractType.buildContractTypesConfig(symbol);
    mockedTradeStore.onMount();
});

describe('TradeStore', () => {
    describe('sendTradeParamsAnalytics', () => {
        const action = 'change_parameter_value';
        const passThrough = {
            action,
            parameter_field_type: 'dropdown',
            parameter_type: 'duration_type',
        } as Partial<TEvents['ce_contracts_set_up_form']>;
        const payload = { ...passThrough, durationUnit: 'm' };

        it('should send form_name, trade type & provided payload with ce_contracts_set_up_form event', async () => {
            const spyTrackEvent = jest.spyOn(Analytics, 'trackEvent');
            const spyDebouncedFunction = jest.spyOn(mockedTradeStore, 'debouncedSendTradeParamsAnalytics');

            mockedTradeStore.sendTradeParamsAnalytics(payload);
            await waitFor(() => {
                expect(spyTrackEvent).toHaveBeenCalledWith('ce_contracts_set_up_form', {
                    ...passThrough,
                    form_name: 'default',
                    trade_type_name: 'Rise/Fall',
                    duration_type: 'minutes',
                });
                expect(spyDebouncedFunction).not.toHaveBeenCalled();
            });
        });
        it('should send analytics using debouncedSendTradeParamsAnalytics function when isDebounced is true', async () => {
            const spyTrackEvent = jest.spyOn(Analytics, 'trackEvent');
            const spyDebouncedFunction = jest.spyOn(mockedTradeStore, 'debouncedSendTradeParamsAnalytics');

            mockedTradeStore.sendTradeParamsAnalytics(payload, true);
            await waitFor(() => {
                expect(spyTrackEvent).toHaveBeenCalledWith('ce_contracts_set_up_form', {
                    ...passThrough,
                    form_name: 'default',
                    trade_type_name: 'Rise/Fall',
                    duration_type: 'minutes',
                });
                expect(spyDebouncedFunction).toHaveBeenCalled();
            });
        });
        it('should not send "change_parameter_value" analytics when isDebounced is true, & payload has no duration_type or parameter_value', async () => {
            jest.clearAllMocks();
            const spyTrackEvent = jest.spyOn(Analytics, 'trackEvent');
            const payloadWithEmptyValue = {
                action,
                input_type: 'manual',
                parameter_field_type: 'number',
                parameter_type: 'stake_value',
                parameter_value: '',
            } as Partial<TEvents['ce_contracts_set_up_form']>;

            mockedTradeStore.sendTradeParamsAnalytics(payloadWithEmptyValue, true);
            await waitFor(() => expect(spyTrackEvent).not.toHaveBeenCalled());
        });
    });
});
