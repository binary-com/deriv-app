import { screen, render } from '@testing-library/react';
import * as ContractUtils from '../contract';
import { TContractStore, TDigitsInfo, TTickItem } from '../contract-types';
import { CONTRACT_TYPES } from '../contract';
import { mockContractInfo } from '../contract-info';

describe('getFinalPrice', () => {
    it("should return sell_price as final price when it's available", () => {
        const contract_info = mockContractInfo({
            sell_price: 12345,
            bid_price: 0,
        });
        expect(ContractUtils.getFinalPrice(contract_info)).toEqual(12345);
    });
    it('should return sell_price as final price when sell_price && bid_price are available', () => {
        const contract_info = mockContractInfo({
            sell_price: 12345,
            bid_price: 789,
        });
        expect(ContractUtils.getFinalPrice(contract_info)).toEqual(12345);
    });
    it('should return bid_price as final price when sell_price is not available and bid_price is available', () => {
        const contract_info = mockContractInfo({
            sell_price: 0,
            bid_price: 789,
        });
        expect(ContractUtils.getFinalPrice(contract_info)).toEqual(789);
    });
    it('should return 0 as final price when sell_price and bid_price are empty', () => {
        const contract_info = mockContractInfo({
            sell_price: 0,
            bid_price: 0,
        });
        expect(ContractUtils.getFinalPrice(contract_info)).toEqual(0);
    });
});

describe('getIndicativePrice', () => {
    it('should return getFinalPrice if it has final price and contract is ended', () => {
        const contract_info = mockContractInfo({
            sell_price: 12345,
            bid_price: 0,
            status: 'sold',
        });
        expect(ContractUtils.getIndicativePrice(contract_info)).toEqual(12345);
    });
    it("should return zero if it doesn't have final price, bid_price and contract is not ended", () => {
        const contract_info = mockContractInfo({
            status: 'open',
            sell_price: 0,
            bid_price: 0,
        });
        expect(ContractUtils.getIndicativePrice(contract_info)).toEqual(0);
    });
    it("should return bid_price if it doesn't have final price, has bid_price and contract is not ended", () => {
        const contract_info = mockContractInfo({
            status: 'open',
            bid_price: 12345,
            sell_price: 0,
        });
        expect(ContractUtils.getIndicativePrice(contract_info)).toEqual(12345);
    });
});

describe('isEnded', () => {
    it("should return false when there is status and it's equal to open in contract info", () => {
        const contract_info = mockContractInfo({
            status: 'open',
        });
        expect(ContractUtils.isEnded(contract_info)).toEqual(false);
    });
    it("should return true when there is status and it's not equal to open in contract info", () => {
        const contract_info = mockContractInfo({
            status: 'sold',
        });
        expect(ContractUtils.isEnded(contract_info)).toEqual(true);
    });
    it('should return true when contract is expired', () => {
        const contract_info = mockContractInfo({
            status: 'open',
            is_expired: 1,
        });
        expect(ContractUtils.isEnded(contract_info)).toEqual(true);
    });
    it('should return true when contract is settleable', () => {
        const contract_info = mockContractInfo({
            status: 'open',
            is_expired: 0,
            is_settleable: 1,
        });
        expect(ContractUtils.isEnded(contract_info)).toEqual(true);
    });
    it('should return true when contract is not expired', () => {
        const contract_info = mockContractInfo({
            status: 'open',
            is_expired: 0,
        });
        expect(ContractUtils.isEnded(contract_info)).toEqual(false);
    });
    it('should return true when contract does not have is_settleable, is_expired and status', () => {
        const contract_info = mockContractInfo({
            is_settleable: undefined,
            is_expired: undefined,
            status: undefined,
        });
        expect(ContractUtils.isEnded(contract_info)).toEqual(false);
    });
});

describe('isUserSold', () => {
    it("should return true if contract's status is sold", () => {
        const contract_info = mockContractInfo({
            status: 'sold',
        });
        expect(ContractUtils.isUserSold(contract_info)).toEqual(true);
    });
    it("should return false if contract's status is not sold", () => {
        const contract_info = mockContractInfo({
            status: 'open',
        });
        expect(ContractUtils.isUserSold(contract_info)).toEqual(false);
    });
});

describe('isValidToSell', () => {
    it('should return true if contract is not ended and is not sold and contract is valid to_sell', () => {
        const contract_info = mockContractInfo({
            status: 'open',
            is_valid_to_sell: 1,
        });
        expect(ContractUtils.isValidToSell(contract_info)).toEqual(true);
    });
    it('should return false if contract is ended and is sold and contract is valid to sell', () => {
        const contract_info = mockContractInfo({
            status: 'sold',
            is_valid_to_sell: 1,
        });
        expect(ContractUtils.isValidToSell(contract_info)).toEqual(false);
    });
    it('should return false if contract is ended and is not sold and contract is valid to sell', () => {
        const contract_info = mockContractInfo({
            status: 'won',
            is_valid_to_sell: 1,
        });
        expect(ContractUtils.isValidToSell(contract_info)).toEqual(false);
    });
    it('should return false if contract is ended and is sold and contract is not valid to sell', () => {
        const contract_info = mockContractInfo({
            status: 'sold',
            is_valid_to_sell: 0,
        });
        expect(ContractUtils.isValidToSell(contract_info)).toEqual(false);
    });
    it('should return false if contract is ended and is not sold and contract is not valid to sell', () => {
        const contract_info = mockContractInfo({
            status: 'won',
            is_valid_to_sell: 0,
        });
        expect(ContractUtils.isValidToSell(contract_info)).toEqual(false);
    });
    it('should return false if contract is not ended and is not sold and contract is not valid to sell', () => {
        const contract_info = mockContractInfo({
            status: 'open',
            is_valid_to_sell: 0,
        });
        expect(ContractUtils.isValidToSell(contract_info)).toEqual(false);
    });
});

describe('getLastTickFromTickStream', () => {
    it('should return the last tick in the tick_stream array', () => {
        const tick_stream: TTickItem[] = [
            {
                tick: 766.53,
                epoch: 1000001,
            },
            {
                tick: 800.23,
                epoch: 1000002,
            },
        ];
        expect(ContractUtils.getLastTickFromTickStream(tick_stream)).toMatchObject({
            tick: 800.23,
            epoch: 1000002,
        });
    });
    it('should return an empty object if the tick_stream array is empty', () => {
        const tick_stream: TTickItem[] = [];
        expect(ContractUtils.getLastTickFromTickStream(tick_stream)).toEqual({});
    });
});

describe('isDigitContract', () => {
    it('should return true if contract is digits', () => {
        expect(ContractUtils.isDigitContract(CONTRACT_TYPES.MATCH_DIFF.MATCH)).toEqual(true);
    });

    it('should return false if contract is not digits', () => {
        expect(ContractUtils.isDigitContract('CALLPUT')).toEqual(false);
    });
});

describe('isTurbosContract', () => {
    it('should return true if contract_type includes TURBOS', () => {
        expect(ContractUtils.isTurbosContract(CONTRACT_TYPES.TURBOS.LONG)).toEqual(true);
    });
    it('should return false if contract_type does not include TURBOS', () => {
        expect(ContractUtils.isTurbosContract(CONTRACT_TYPES.CALL)).toEqual(false);
    });
});

describe('getDigitInfo', () => {
    it('should return an empty object when tick_stream is not in contract_info', () => {
        const contract_info = mockContractInfo({ tick_stream: undefined });
        expect(ContractUtils.getDigitInfo({}, contract_info)).toEqual({});
    });
    it('should return an empty object if tick_stream data is already in digits_info', () => {
        const contract_info = mockContractInfo({
            entry_tick_time: 1544707342,
            entry_tick: 123.99,
            current_spot_time: 10000000,
            current_spot: 456.99,
            exit_tick_time: 10000001,
            contract_type: CONTRACT_TYPES.MATCH_DIFF.MATCH,
            barrier: '9',
            tick_stream: [
                {
                    tick: 123.456,
                    tick_display_value: '123.456',
                    epoch: 1544707344,
                },
            ],
        });
        const digits_info: TDigitsInfo = {
            1544707344: {
                digit: 6,
                spot: '123.456',
            },
        };
        expect(ContractUtils.getDigitInfo(digits_info, contract_info)).toEqual({});
    });
    it('should return a digits_info object with the latest tick_stream array data', () => {
        const contract_info = mockContractInfo({
            tick_stream: [
                {
                    tick: 123.456,
                    tick_display_value: '123.456',
                    epoch: 1544707344,
                },
                {
                    tick: 456.993,
                    tick_display_value: '456.993',
                    epoch: 1544707346,
                },
            ],
        });
        const digits_info: TDigitsInfo = {
            1544707346: {
                digit: 3,
                spot: '456.993',
            },
        };
        expect(ContractUtils.getDigitInfo({}, contract_info)).toEqual(digits_info);
    });
});

describe('getDisplayStatus', () => {
    it('should return won if contract is ended and profit is more than zero', () => {
        const contract_info = mockContractInfo({
            status: 'sold',
            buy_price: 0,
            bid_price: 100,
        });
        expect(ContractUtils.getDisplayStatus(contract_info)).toEqual('won');
    });
    it('should return lost if contract is ended and profit is less than zero', () => {
        const contract_info = mockContractInfo({
            status: 'sold',
            buy_price: 100,
            bid_price: 0,
        });
        expect(ContractUtils.getDisplayStatus(contract_info)).toEqual('lost');
    });
    it('should return won if contract is ended and profit is zero', () => {
        const contract_info = mockContractInfo({
            status: 'sold',
            buy_price: 100,
            bid_price: 100,
        });
        expect(ContractUtils.getDisplayStatus(contract_info)).toEqual('won');
    });
    it('should return purchased if contract is not ended', () => {
        const contract_info = mockContractInfo({
            status: 'open',
            buy_price: 0,
            bid_price: 100,
        });
        expect(ContractUtils.getDisplayStatus(contract_info)).toEqual('purchased');
    });
});

describe('isAccumulatorContract', () => {
    it('should return true if contract_type includes CONTRACT_TYPES.ACCUMULATOR', () => {
        expect(ContractUtils.isAccumulatorContract(CONTRACT_TYPES.ACCUMULATOR)).toEqual(true);
    });
    it('should return false if contract_type is not CONTRACT_TYPES.ACCUMULATOR', () => {
        expect(ContractUtils.isAccumulatorContract(CONTRACT_TYPES.CALL)).toEqual(false);
    });
});

describe('isTicksContract', () => {
    it('should return true if contract_type includes CONTRACT_TYPES.TICK_HIGH_LOW.HIGH', () => {
        expect(ContractUtils.isTicksContract(CONTRACT_TYPES.TICK_HIGH_LOW.HIGH)).toEqual(true);
    });
    it('should return false if contract_type is not CONTRACT_TYPES.TICK', () => {
        expect(ContractUtils.isTicksContract(CONTRACT_TYPES.ACCUMULATOR)).toEqual(false);
    });
});

describe('isAccumulatorContractOpen', () => {
    it('should return true if contract_type includes CONTRACT_TYPES.ACCUMULATOR, status is open, and current spot has NOT crossed barriers', () => {
        const contract_info = mockContractInfo({
            contract_type: CONTRACT_TYPES.ACCUMULATOR,
            current_spot: 1232.44,
            high_barrier: '1232.555',
            low_barrier: '1232.222',
            status: 'open',
        });
        expect(ContractUtils.isAccumulatorContractOpen(contract_info)).toEqual(true);
    });
    it('should return false if contract_type is not CONTRACT_TYPES.ACCUMULATOR', () => {
        const contract_info = mockContractInfo({
            contract_type: CONTRACT_TYPES.CALL,
            current_spot: 1232.44,
            high_barrier: '1232.555',
            low_barrier: '1232.222',
            status: 'open',
        });
        expect(ContractUtils.isAccumulatorContractOpen(contract_info)).toEqual(false);
    });
    it('should return false if status is not open', () => {
        const contract_info = mockContractInfo({
            contract_type: CONTRACT_TYPES.ACCUMULATOR,
            current_spot: 1232.44,
            high_barrier: '1232.555',
            low_barrier: '1232.222',
            status: 'lost',
        });
        expect(ContractUtils.isAccumulatorContractOpen(contract_info)).toEqual(false);
    });
    it('should return false if exit_tick_time is present', () => {
        const contract_info = mockContractInfo({
            contract_type: CONTRACT_TYPES.ACCUMULATOR,
            current_spot: 1232.44,
            high_barrier: '1232.555',
            low_barrier: '1232.333',
            status: 'open',
            exit_tick_time: 10000001,
        });
        expect(ContractUtils.isAccumulatorContractOpen(contract_info)).toEqual(false);
    });
});

describe('isOpen', () => {
    it('isOpen returns true for an open contract', () => {
        expect(
            ContractUtils.isOpen({
                contract_type: CONTRACT_TYPES.CALL,
                exit_tick_time: undefined,
                profit: undefined,
                status: 'open',
            })
        ).toBe(true);
    });
    it('isOpen returns false for a closed contract', () => {
        expect(
            ContractUtils.isOpen({
                contract_type: CONTRACT_TYPES.CALL,
                exit_tick_time: 1608098748,
                profit: 10,
                status: 'won',
            })
        ).toBe(false);
    });
    it('isOpen returns false for an accumulator contract that has recently lost', () => {
        expect(
            ContractUtils.isOpen({
                contract_type: CONTRACT_TYPES.ACCUMULATOR,
                exit_tick_time: 1608098748,
                profit: -10,
                status: 'open',
            })
        ).toBe(false);
    });
    it('isOpen returns false for an accumulator contract that has recently won', () => {
        expect(
            ContractUtils.isOpen({
                contract_type: CONTRACT_TYPES.ACCUMULATOR,
                exit_tick_time: 1608098748,
                profit: 10,
                status: 'open',
            })
        ).toBe(false);
    });
});

describe('getAccuBarriersDefaultTimeout', () => {
    it('should return DELAY_TIME_1S_SYMBOL * 2 if symbols_2s array includes current symbol', () => {
        expect(ContractUtils.getAccuBarriersDefaultTimeout(ContractUtils.symbols_2s[0])).toEqual(
            ContractUtils.DELAY_TIME_1S_SYMBOL * 2
        );
    });
    it('should return DELAY_TIME_1S_SYMBOL if symbols_2s array does NOT include current symbol', () => {
        expect(ContractUtils.getAccuBarriersDefaultTimeout('1HZ10V')).toEqual(ContractUtils.DELAY_TIME_1S_SYMBOL);
    });
});

describe('getAccuBarriersDTraderTimeout', () => {
    const interval = 250; // interval between receivals of tick data and barriers data
    const shorter_interval = 50;
    const has_default_timeout = false;
    const tick_update_timestamp = 1234567890800;
    const barriers_update_timestamp = tick_update_timestamp + interval;
    const symbol_1_sec = '1HZ10V';
    const symbol_2_sec = 'R_100';

    const getTargetTime = (underlying: string) => {
        return (
            tick_update_timestamp +
            ContractUtils.getAccuBarriersDefaultTimeout(underlying) +
            ContractUtils.ANIMATION_CORRECTION_TIME
        );
    };

    it('should return a timeout equal to difference between target time and current barriers receival time for 2-second symbol', () => {
        const sooner_barriers_receival_timestamp = tick_update_timestamp + shorter_interval;
        expect(
            ContractUtils.getAccuBarriersDTraderTimeout({
                barriers_update_timestamp,
                has_default_timeout,
                tick_update_timestamp,
                underlying: symbol_2_sec,
            })
        ).toEqual(getTargetTime(symbol_2_sec) - barriers_update_timestamp);
        expect(
            ContractUtils.getAccuBarriersDTraderTimeout({
                barriers_update_timestamp: sooner_barriers_receival_timestamp,
                has_default_timeout,
                tick_update_timestamp,
                underlying: symbol_2_sec,
            })
        ).toEqual(getTargetTime(symbol_2_sec) - sooner_barriers_receival_timestamp);
    });
    it('should return a timeout equal to difference between target time and current barriers receival time for 1-second symbol', () => {
        const sooner_barriers_receival_timestamp = tick_update_timestamp + shorter_interval;
        expect(
            ContractUtils.getAccuBarriersDTraderTimeout({
                barriers_update_timestamp,
                has_default_timeout,
                tick_update_timestamp,
                underlying: symbol_1_sec,
            })
        ).toEqual(getTargetTime(symbol_1_sec) - barriers_update_timestamp);
        expect(
            ContractUtils.getAccuBarriersDTraderTimeout({
                barriers_update_timestamp: sooner_barriers_receival_timestamp,
                has_default_timeout,
                tick_update_timestamp,
                underlying: symbol_1_sec,
            })
        ).toEqual(getTargetTime(symbol_1_sec) - sooner_barriers_receival_timestamp);
    });
    it('should return a default timeout when has_default_timeout is true, or when tick_update_timestamp is null', () => {
        expect(
            ContractUtils.getAccuBarriersDTraderTimeout({
                barriers_update_timestamp,
                has_default_timeout: true,
                tick_update_timestamp,
                underlying: symbol_2_sec,
            })
        ).toEqual(ContractUtils.getAccuBarriersDefaultTimeout(symbol_2_sec));
        expect(
            ContractUtils.getAccuBarriersDTraderTimeout({
                barriers_update_timestamp,
                has_default_timeout,
                tick_update_timestamp: null,
                underlying: symbol_2_sec,
            })
        ).toEqual(ContractUtils.getAccuBarriersDefaultTimeout(symbol_2_sec));
    });
    it('should return 0 timeout when current barriers receival happens too late (after/at target time) and timeout is no longer applicable', () => {
        expect(
            ContractUtils.getAccuBarriersDTraderTimeout({
                barriers_update_timestamp: getTargetTime(symbol_1_sec) + 100,
                has_default_timeout,
                tick_update_timestamp,
                underlying: symbol_1_sec,
            })
        ).toEqual(0);
        expect(
            ContractUtils.getAccuBarriersDTraderTimeout({
                barriers_update_timestamp: getTargetTime(symbol_1_sec),
                has_default_timeout,
                tick_update_timestamp,
                underlying: symbol_1_sec,
            })
        ).toEqual(0);
    });
});

describe('getAccuBarriersForContractDetails', () => {
    const mocked_contract_info = mockContractInfo({
        contract_type: CONTRACT_TYPES.ACCUMULATOR,
        high_barrier: '1232.666',
        low_barrier: '1232.222',
        status: 'open',
    });
    const previous_spot_barriers = {
        accu_high_barrier: mocked_contract_info.high_barrier,
        accu_low_barrier: mocked_contract_info.low_barrier,
    };
    it('should return an object { accu_high_barrier: current_spot_high_barrier, accu_low_barrier: current_spot_low_barrier } while ACCUMULATOR contract is open', () => {
        const contract_info = mockContractInfo({
            ...mocked_contract_info,
            current_spot: 1232.555,
            current_spot_high_barrier: '1232.777',
            current_spot_low_barrier: '1232.333',
        });
        expect(ContractUtils.getAccuBarriersForContractDetails(contract_info)).toEqual({
            accu_high_barrier: contract_info.current_spot_high_barrier,
            accu_low_barrier: contract_info.current_spot_low_barrier,
        });
    });
    it('should return an object { accu_high_barrier: high_barrier, accu_low_barrier: low_barrier } if status is not open', () => {
        const contract_info = mockContractInfo({
            ...mocked_contract_info,
            current_spot: 1232.555,
            current_spot_high_barrier: '1232.777',
            current_spot_low_barrier: '1232.333',
            status: 'lost',
        });
        expect(ContractUtils.getAccuBarriersForContractDetails(contract_info)).toEqual(previous_spot_barriers);
    });
    it('should return an object { accu_high_barrier: high_barrier, accu_low_barrier: low_barrier } if exit_tick_time is present', () => {
        const contract_info = mockContractInfo({
            ...mocked_contract_info,
            current_spot: 1232.555,
            current_spot_high_barrier: '1232.777',
            current_spot_low_barrier: '1232.333',
            exit_tick_time: 10000001,
        });
        expect(ContractUtils.getAccuBarriersForContractDetails(contract_info)).toEqual(previous_spot_barriers);
    });
    it('should return an empty object if contract type is not ACCUMULATOR', () => {
        const contract_info = mockContractInfo({
            contract_type: CONTRACT_TYPES.CALL,
            current_spot: 1232.555,
        });
        expect(ContractUtils.getAccuBarriersForContractDetails(contract_info)).toEqual({});
    });
});

describe('getContractStatus', () => {
    it('should return original status for non-accumulator contracts', () => {
        expect(
            ContractUtils.getContractStatus({
                contract_type: CONTRACT_TYPES.CALL,
                exit_tick_time: 0,
                profit: 100,
                status: 'lost',
            })
        ).toBe('lost');
    });
    it('should return "open" for accumulator contracts without exit_tick_time and with open status', () => {
        expect(
            ContractUtils.getContractStatus({
                contract_type: CONTRACT_TYPES.ACCUMULATOR,
                profit: 0,
                status: 'open',
            })
        ).toBe('open');
    });
    it('should return "lost" for accumulator contracts with profit less than 0 and exit_tick_time present', () => {
        expect(
            ContractUtils.getContractStatus({
                contract_type: CONTRACT_TYPES.ACCUMULATOR,
                exit_tick_time: 10000001,
                profit: -100,
                status: 'open',
            })
        ).toBe('lost');
    });
    it('should return "won" for accumulator contracts with profit >= 0 and status !== "open"', () => {
        expect(
            ContractUtils.getContractStatus({
                contract_type: CONTRACT_TYPES.ACCUMULATOR,
                exit_tick_time: 10000001,
                profit: 100,
                status: 'won',
            })
        ).toBe('won');
    });
});

describe('getLastContractMarkerIndex', () => {
    let markers: TContractStore[];
    beforeEach(() => {
        markers = [
            {
                contract_info: mockContractInfo({
                    date_start: 1001,
                }),
            },
            {
                contract_info: mockContractInfo({
                    date_start: 1000,
                }),
            },
        ] as TContractStore[];
    });
    it('should return index of a marker that has the biggest date_start', () => {
        expect(ContractUtils.getLastContractMarkerIndex(markers)).toEqual(0);
    });
    it('should return index of the last marker if a marker with the biggest date_start is not found', () => {
        delete markers[0].contract_info.date_start;
        delete markers[1].contract_info.date_start;
        expect(ContractUtils.getLastContractMarkerIndex(markers)).toEqual(1);
    });
});

describe('getLocalizedTurbosSubtype', () => {
    it('should return an empty string for non-turbos contracts', () => {
        render(ContractUtils.getLocalizedTurbosSubtype(CONTRACT_TYPES.CALL) as JSX.Element);
        expect(screen.queryByText('Up')).not.toBeInTheDocument();
        expect(screen.queryByText('Down')).not.toBeInTheDocument();
        expect(ContractUtils.getLocalizedTurbosSubtype(CONTRACT_TYPES.CALL)).toBe('');
    });
    it('should render "Up" for CONTRACT_TYPES.TURBOS.LONG contract', () => {
        render(ContractUtils.getLocalizedTurbosSubtype(CONTRACT_TYPES.TURBOS.LONG) as JSX.Element);
        expect(screen.getByText('Up')).toBeInTheDocument();
    });
    it('should render "Down" for CONTRACT_TYPES.TURBOS.SHORT contract', () => {
        render(ContractUtils.getLocalizedTurbosSubtype(CONTRACT_TYPES.TURBOS.SHORT) as JSX.Element);
        expect(screen.getByText('Down')).toBeInTheDocument();
    });
});

describe('getSortedTradeTypes', () => {
    it('should return an unchanged array if it does not contain turbos or multipliers', () => {
        const array = [ContractUtils.TRADE_TYPES.RISE_FALL, ContractUtils.TRADE_TYPES.HIGH_LOW];
        expect(ContractUtils.getSortedTradeTypes(array)).toEqual(array);
    });
    it('should return an array with accumulators as the 1st element if multipliers are not present', () => {
        const sortedArrayWithTurbos = ContractUtils.getSortedTradeTypes([
            ContractUtils.TRADE_TYPES.RISE_FALL,
            ContractUtils.TRADE_TYPES.ACCUMULATOR,
        ]);
        expect(sortedArrayWithTurbos).toEqual([
            ContractUtils.TRADE_TYPES.ACCUMULATOR,
            ContractUtils.TRADE_TYPES.RISE_FALL,
        ]);
    });
    it('should return an array with multipliers as the 1st element if accumulators is not present', () => {
        const sortedArrayWithMultipliers = ContractUtils.getSortedTradeTypes([
            ContractUtils.TRADE_TYPES.RISE_FALL,
            ContractUtils.TRADE_TYPES.MULTIPLIER,
        ]);
        expect(sortedArrayWithMultipliers).toEqual([
            ContractUtils.TRADE_TYPES.MULTIPLIER,
            ContractUtils.TRADE_TYPES.RISE_FALL,
        ]);
    });
    it('should return an array with accumulators as the 1st element and disregard multipliers', () => {
        const sortedArrayWithTurbosAndMultipliers = ContractUtils.getSortedTradeTypes([
            ContractUtils.TRADE_TYPES.TURBOS.LONG,
            ContractUtils.TRADE_TYPES.ACCUMULATOR,
            ContractUtils.TRADE_TYPES.MULTIPLIER,
        ]);
        expect(sortedArrayWithTurbosAndMultipliers).toEqual([
            ContractUtils.TRADE_TYPES.ACCUMULATOR,
            ContractUtils.TRADE_TYPES.TURBOS.LONG,
            ContractUtils.TRADE_TYPES.MULTIPLIER,
        ]);
    });
    it('should return an empty array if called with empty arguments or an empty array', () => {
        expect(ContractUtils.getSortedTradeTypes()).toEqual([]);
        expect(ContractUtils.getSortedTradeTypes([])).toEqual([]);
    });
});

describe('isSmartTraderContract', () => {
    it('should return true if contract_type is RUN|EXPIRY|RANGE|UPORDOWN|ASIAN|RESET|TICK|LB', () => {
        expect(ContractUtils.isSmartTraderContract(CONTRACT_TYPES.EXPIRYRANGEE)).toBe(true);
        expect(ContractUtils.isSmartTraderContract(CONTRACT_TYPES.TICK_HIGH_LOW.HIGH)).toBe(true);
        expect(ContractUtils.isSmartTraderContract(CONTRACT_TYPES.LB_PUT)).toBe(true);
    });
    it('should return false if contract_type is not RUN|EXPIRY|RANGE|UPORDOWN|ASIAN|RESET|TICK|LB', () => {
        expect(ContractUtils.isSmartTraderContract(CONTRACT_TYPES.VANILLA.CALL)).toBe(false);
    });
    it('should return false if contract_type was not passed', () => {
        expect(ContractUtils.isSmartTraderContract('')).toBe(false);
    });
});

describe('isResetContract', () => {
    it('should return true if contract_type is RESET', () => {
        expect(ContractUtils.isResetContract(CONTRACT_TYPES.RESET.CALL)).toBe(true);
    });
    it('should return false if contract_type is not RESET', () => {
        expect(ContractUtils.isResetContract(CONTRACT_TYPES.ASIAN.DOWN)).toBe(false);
    });
    it('should return false if contract_type was not passed', () => {
        expect(ContractUtils.isResetContract('')).toBe(false);
    });
});

describe('isAsiansContract', () => {
    it('should return true if contract_type is ASIAN', () => {
        expect(ContractUtils.isAsiansContract(CONTRACT_TYPES.ASIAN.DOWN)).toBe(true);
    });
    it('should return false if contract_type is not ASIAN', () => {
        expect(ContractUtils.isAsiansContract(CONTRACT_TYPES.TURBOS.LONG)).toBe(false);
    });
    it('should return false if contract_type was not passed', () => {
        expect(ContractUtils.isAsiansContract('')).toBe(false);
    });
});

describe('hasTwoBarriers', () => {
    it('should return true if contract_type is EXPIRY|RANGE|UPORDOWN', () => {
        expect(ContractUtils.hasTwoBarriers(CONTRACT_TYPES.EXPIRYRANGEE)).toBe(true);
    });
    it('should return false if contract_type is not EXPIRY', () => {
        expect(ContractUtils.hasTwoBarriers(CONTRACT_TYPES.TURBOS.LONG)).toBe(false);
    });
    it('should return false if contract_type was not passed', () => {
        expect(ContractUtils.hasTwoBarriers('')).toBe(false);
    });
});

describe('isLookBacksContract', () => {
    it('should return true if contract_type is LB', () => {
        expect(ContractUtils.isLookBacksContract(CONTRACT_TYPES.LB_HIGH_LOW)).toBe(true);
    });
    it('should return false if contract_type is not LB', () => {
        expect(ContractUtils.isLookBacksContract(CONTRACT_TYPES.TURBOS.LONG)).toBe(false);
    });
    it('should return false if contract_type was not passed', () => {
        expect(ContractUtils.isLookBacksContract('')).toBe(false);
    });
});

describe('isTicksContract', () => {
    it('should return true if contract_type is TICK', () => {
        expect(ContractUtils.isTicksContract(CONTRACT_TYPES.TICK_HIGH_LOW.HIGH)).toBe(true);
    });
    it('should return false if contract_type is not TICK', () => {
        expect(ContractUtils.isTicksContract(CONTRACT_TYPES.TURBOS.LONG)).toBe(false);
    });
    it('should return false if contract_type was not passed', () => {
        expect(ContractUtils.isTicksContract('')).toBe(false);
    });
});

describe('isForwardStartingBuyTransaction', () => {
    const forwardStartingShortcode = 'CALL_1HZ10V_19.54_1710485400F_1710486300_S0P_0';
    const transactionTime = 12316253761253;

    it('should return true if transaction type is buy and it is forward starting contract', () => {
        expect(ContractUtils.isForwardStartingBuyTransaction('buy', forwardStartingShortcode, transactionTime)).toBe(
            true
        );
    });
    it('should return false if transaction type is not buy', () => {
        expect(ContractUtils.isForwardStartingBuyTransaction('sell', forwardStartingShortcode, transactionTime)).toBe(
            false
        );
    });
    it('should return false if transaction type is buy and but it is not forward starting contract', () => {
        expect(
            ContractUtils.isForwardStartingBuyTransaction(
                'buy',
                'CALL_1HZ10V_19.54_1710485400_1710486300_S0P_0',
                transactionTime
            )
        ).toBe(false);
    });
});
