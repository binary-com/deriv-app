import { renderHook } from '@testing-library/react-hooks';
import {
    CONTRACT_TYPES,
    TContractInfo,
    getCardLabelsV2,
    mockContractInfo,
    getStartTime,
    hasForwardContractStarted,
    isForwardStarting,
} from '@deriv/shared';
import useOrderDetails from '../useOrderDetails';

jest.mock('@deriv/translations', () => ({
    localize: jest.fn(text => text),
    Localize: jest.fn(text => text),
}));

jest.mock('@deriv/shared', () => ({
    getDurationPeriod: jest.fn(),
    getDurationUnitText: jest.fn(),
    getGrowthRatePercentage: jest.fn(() => '10'),
    isAccumulatorContract: jest.fn(),
    isResetContract: jest.fn(),
    addComma: jest.fn(),
    ...jest.requireActual('@deriv/shared'),
    isForwardStarting: jest.fn(),
    getStartTime: jest.fn(),
    hasForwardContractStarted: jest.fn(),
}));

jest.mock('App/Components/Elements/PositionsDrawer/helpers', () => ({
    getBarrierValue: jest.fn(),
}));

const mockData: TContractInfo = mockContractInfo({
    transaction_ids: { buy: 12345, sell: 67890 },
    buy_price: 100,
    currency: 'USD',
    tick_count: 5,
    tick_passed: 3,
    contract_type: '',
    display_number_of_contracts: '1',
    commission: 5,
    limit_order: {
        take_profit: { order_amount: 200 },
        stop_loss: { order_amount: 50 },
        stop_out: { order_amount: 30 },
    },
    barrier: '1000',
    growth_rate: 10,
    entry_spot_display_value: '1000',
    is_expired: 1,
    multiplier: 3,
    reset_time: 1725422585,
    is_sold: 1,
    high_barrier: '20',
    low_barrier: '10',
    selected_tick: 3,
});

describe('useOrderDetails', () => {
    const CARD_LABELS = getCardLabelsV2();

    it('should return correct details for multiplier contract', () => {
        mockData.contract_type = CONTRACT_TYPES.MULTIPLIER.UP;
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details).toEqual({
            [CARD_LABELS.REFERENCE_ID]: ['12345 (Buy)', '67890 (Sell)'],
            [CARD_LABELS.MULTIPLIER]: 'x3',
            [CARD_LABELS.STAKE]: '100.00 USD',
            [CARD_LABELS.COMMISSION]: '5.00 USD',
            [CARD_LABELS.TAKE_PROFIT]: '200.00 USD',
            [CARD_LABELS.STOP_LOSS]: '50.00 USD',
            [CARD_LABELS.STOP_OUT_LEVEL]: '30.00 USD',
        });
    });

    it('should return correct details for Rise contract', () => {
        mockData.contract_type = CONTRACT_TYPES.CALL;
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details).toEqual({
            [CARD_LABELS.REFERENCE_ID]: ['12345 (Buy)', '67890 (Sell)'],
            [CARD_LABELS.DURATION]: '5 Ticks',
            [CARD_LABELS.BARRIER]: '1000',
            [CARD_LABELS.STAKE]: '100.00 USD',
            [CARD_LABELS.POTENTIAL_PAYOUT]: 19.55,
        });
    });

    it('should return correct barriers details for Forward starting contract', () => {
        (isForwardStarting as jest.Mock).mockReturnValue(true);
        (hasForwardContractStarted as jest.Mock).mockReturnValue(false);
        (getStartTime as jest.Mock).mockReturnValue(124525522);
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details[CARD_LABELS.BARRIER]).toEqual('TBD');
    });

    it('should return correct details for Turbos contract', () => {
        mockData.contract_type = CONTRACT_TYPES.TURBOS.LONG;
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details).toEqual({
            [CARD_LABELS.REFERENCE_ID]: ['12345 (Buy)', '67890 (Sell)'],
            [CARD_LABELS.DURATION]: '5 Ticks',
            [CARD_LABELS.BARRIER]: '1000',
            [CARD_LABELS.PAYOUT_PER_POINT]: '1 USD',
            [CARD_LABELS.STAKE]: '100.00 USD',
            [CARD_LABELS.TAKE_PROFIT]: '200.00 USD',
        });
    });

    it('should return correct details for Matcher contract', () => {
        mockData.contract_type = CONTRACT_TYPES.MATCH_DIFF.MATCH;
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details).toEqual({
            [CARD_LABELS.REFERENCE_ID]: ['12345 (Buy)', '67890 (Sell)'],
            [CARD_LABELS.DURATION]: '5 ticks',
            [CARD_LABELS.TARGET]: undefined,
            [CARD_LABELS.STAKE]: '100.00 USD',
            [CARD_LABELS.POTENTIAL_PAYOUT]: 19.55,
        });
    });

    it('should return correct details for Accumulator contract', () => {
        mockData.contract_type = CONTRACT_TYPES.ACCUMULATOR;
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details).toEqual({
            [CARD_LABELS.REFERENCE_ID]: ['12345 (Buy)', '67890 (Sell)'],
            [CARD_LABELS.DURATION]: '3/5 Ticks',
            [CARD_LABELS.GROWTH_RATE]: '1000%',
            [CARD_LABELS.STAKE]: '100.00 USD',
            [CARD_LABELS.TAKE_PROFIT]: '200.00 USD',
        });
    });

    it('should return correct details for Vanilla contract', () => {
        mockData.contract_type = CONTRACT_TYPES.VANILLA.CALL;
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details).toEqual({
            [CARD_LABELS.REFERENCE_ID]: ['12345 (Buy)', '67890 (Sell)'],
            [CARD_LABELS.STRIKE_PRICE]: ' - ',
            [CARD_LABELS.DURATION]: '5 minutes',
            [CARD_LABELS.PAYOUT_PER_POINT]: '1 USD',
            [CARD_LABELS.STAKE]: '100.00 USD',
        });
    });

    it('should return correct details for RUN_HIGH_LOW contract', () => {
        mockData.contract_type = CONTRACT_TYPES.RUN_HIGH_LOW.LOW;
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details).toEqual({
            [CARD_LABELS.REFERENCE_ID]: ['12345 (Buy)', '67890 (Sell)'],
            [CARD_LABELS.DURATION]: '5 Ticks',
            [CARD_LABELS.POTENTIAL_PAYOUT]: '19.55 USD',
            [CARD_LABELS.STAKE]: '100.00 USD',
        });
    });

    it('should return correct details for Lookback contract', () => {
        mockData.contract_type = CONTRACT_TYPES.LB_CALL;
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details).toEqual({
            [CARD_LABELS.REFERENCE_ID]: ['12345 (Buy)', '67890 (Sell)'],
            [CARD_LABELS.DURATION]: '5 Ticks',
            [CARD_LABELS.MULTIPLIER]: 3,
            [CARD_LABELS.LOW_SPOT]: '1000',
            [CARD_LABELS.STAKE]: '100.00 USD',
        });
    });

    it('should return correct details for HighLook Lookback contract', () => {
        mockData.contract_type = CONTRACT_TYPES.LB_HIGH_LOW;
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details).toEqual({
            [CARD_LABELS.REFERENCE_ID]: ['12345 (Buy)', '67890 (Sell)'],
            [CARD_LABELS.DURATION]: '5 Ticks',
            [CARD_LABELS.MULTIPLIER]: 3,
            [CARD_LABELS.LOW_SPOT]: '10',
            [CARD_LABELS.HIGH_SPOT]: '20',
            [CARD_LABELS.STAKE]: '100.00 USD',
        });
    });

    it('should return correct details for Reset contract', () => {
        mockData.contract_type = CONTRACT_TYPES.RESET.CALL;
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details).toEqual({
            [CARD_LABELS.REFERENCE_ID]: ['12345 (Buy)', '67890 (Sell)'],
            [CARD_LABELS.DURATION]: [
                '5 Ticks',
                {
                    caption: expect.any(Object),
                },
            ],
            [CARD_LABELS.BARRIER]: '1000',
            [CARD_LABELS.POTENTIAL_PAYOUT]: '19.55 USD',
            [CARD_LABELS.STAKE]: '100.00 USD',
            [CARD_LABELS.RESET_TIME]: ['04 Sept 2024', '04:03:05 GMT'],
        });
    });

    it('should return correct details for Asian contract', () => {
        mockData.contract_type = CONTRACT_TYPES.ASIAN.UP;
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details).toEqual({
            [CARD_LABELS.REFERENCE_ID]: ['12345 (Buy)', '67890 (Sell)'],
            [CARD_LABELS.DURATION]: '5 Ticks',
            [CARD_LABELS.BARRIER]: '1000',
            [CARD_LABELS.STAKE]: '100.00 USD',
            [CARD_LABELS.POTENTIAL_PAYOUT]: '19.55 USD',
        });
    });

    it('should return correct details for HighLow contract', () => {
        mockData.contract_type = CONTRACT_TYPES.TICK_HIGH_LOW.HIGH;
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details).toEqual({
            [CARD_LABELS.REFERENCE_ID]: ['12345 (Buy)', '67890 (Sell)'],
            [CARD_LABELS.DURATION]: '5 Ticks',
            [CARD_LABELS.STAKE]: '100.00 USD',
            [CARD_LABELS.POTENTIAL_PAYOUT]: '19.55 USD',
            [CARD_LABELS.SELECTED_TICK]: [
                3,
                {
                    caption: '1000',
                },
            ],
        });
    });

    it('should return default details for unknown contract type', () => {
        mockData.contract_type = 'unknown';
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current?.details).toEqual({});
    });

    it('should handle missing contract type', () => {
        mockData.contract_type = '';
        const { result } = renderHook(() => useOrderDetails(mockData));
        expect(result.current).toBeUndefined();
    });

    it('should handle contracts without limit_order', () => {
        const modifiedData = { ...mockData, limit_order: undefined };
        modifiedData.contract_type = CONTRACT_TYPES.MULTIPLIER.UP;
        const { result } = renderHook(() => useOrderDetails(modifiedData));
        expect(result.current?.details).toEqual({
            [CARD_LABELS.REFERENCE_ID]: ['12345 (Buy)', '67890 (Sell)'],
            [CARD_LABELS.MULTIPLIER]: 'x3',
            [CARD_LABELS.STAKE]: '100.00 USD',
            [CARD_LABELS.COMMISSION]: '5.00 USD',
            [CARD_LABELS.TAKE_PROFIT]: 'Not set',
            [CARD_LABELS.STOP_LOSS]: 'Not set',
            [CARD_LABELS.STOP_OUT_LEVEL]: '',
        });
    });
});
