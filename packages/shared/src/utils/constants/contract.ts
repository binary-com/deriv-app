import React from 'react';

import { localize } from '@deriv/translations';

import { shouldShowCancellation, shouldShowExpiration, CONTRACT_TYPES, TRADE_TYPES } from '../contract';
import { TContractOptions } from '../contract/contract-types';
import { cloneObject } from '../object';
import { LocalStore } from '../storage';

export const getLocalizedBasis = () =>
    ({
        accumulator: localize('Accumulators'),
        current_stake: localize('Current stake'),
        multiplier: localize('Multiplier'),
        max_payout: localize('Max payout'),
        payout_per_pip: localize('Payout per pip'),
        payout_per_point: localize('Payout per point'),
        payout: localize('Payout'),
        stake: localize('Stake'),
        turbos: localize('Turbos'),
    } as const);

/**
 * components can be undef or an array containing any of: 'start_date', 'barrier', 'last_digit'
 *     ['duration', 'amount'] are omitted, as they're available in all contract types
 */
type TContractTypesConfig = {
    title: string;
    trade_types: string[];
    basis: string[];
    components: string[];
    barrier_count?: number;
    config?: { hide_duration?: boolean; default_stake?: number };
};

type TGetContractTypesConfig = (symbol?: string) => Record<string, TContractTypesConfig>;

type TContractConfig = {
    button_name?: React.ReactNode;
    feature_flag?: string;
    name: React.ReactNode;
    position: string;
    main_title?: JSX.Element;
};

type TGetSupportedContracts = keyof ReturnType<typeof getSupportedContracts>;

export type TTextValueStrings = {
    text: string;
    value: string;
};

export type TTradeTypesCategories = {
    [key: string]: {
        name: string;
        categories: Array<string | TTextValueStrings>;
    };
};

export const getContractTypesConfig: TGetContractTypesConfig = symbol => ({
    [TRADE_TYPES.RISE_FALL]: {
        title: localize('Rise/Fall'),
        trade_types: [CONTRACT_TYPES.CALL, CONTRACT_TYPES.PUT],
        basis: ['stake', 'payout'],
        components: ['start_date'],
        barrier_count: 0,
    },
    [TRADE_TYPES.RISE_FALL_EQUAL]: {
        title: localize('Rise/Fall'),
        trade_types: [CONTRACT_TYPES.CALLE, CONTRACT_TYPES.PUTE],
        basis: ['stake', 'payout'],
        components: ['start_date'],
        barrier_count: 0,
    },
    [TRADE_TYPES.HIGH_LOW]: {
        title: localize('Higher/Lower'),
        trade_types: [CONTRACT_TYPES.CALL, CONTRACT_TYPES.PUT],
        basis: ['stake', 'payout'],
        components: ['barrier'],
        barrier_count: 1,
    },
    [TRADE_TYPES.TOUCH]: {
        title: localize('Touch/No Touch'),
        trade_types: [CONTRACT_TYPES.TOUCH.ONE_TOUCH, CONTRACT_TYPES.TOUCH.NO_TOUCH],
        basis: ['stake', 'payout'],
        components: ['barrier'],
    },
    [TRADE_TYPES.END]: {
        title: localize('Ends In/Ends Out'),
        trade_types: [CONTRACT_TYPES.END.IN, CONTRACT_TYPES.END.OUT],
        basis: ['stake', 'payout'],
        components: ['barrier'],
    },
    [TRADE_TYPES.STAY]: {
        title: localize('Stays In/Goes Out'),
        trade_types: [CONTRACT_TYPES.STAY.IN, CONTRACT_TYPES.STAY.OUT],
        basis: ['stake', 'payout'],
        components: ['barrier'],
    },
    [TRADE_TYPES.ASIAN]: {
        title: localize('Asian Up/Asian Down'),
        trade_types: [CONTRACT_TYPES.ASIAN.UP, CONTRACT_TYPES.ASIAN.DOWN],
        basis: ['stake', 'payout'],
        components: [],
    },
    [TRADE_TYPES.MATCH_DIFF]: {
        title: localize('Matches/Differs'),
        trade_types: [CONTRACT_TYPES.MATCH_DIFF.MATCH, CONTRACT_TYPES.MATCH_DIFF.DIFF],
        basis: ['stake', 'payout'],
        components: ['last_digit'],
    },
    [TRADE_TYPES.EVEN_ODD]: {
        title: localize('Even/Odd'),
        trade_types: [CONTRACT_TYPES.EVEN_ODD.ODD, CONTRACT_TYPES.EVEN_ODD.EVEN],
        basis: ['stake', 'payout'],
        components: [],
    },
    [TRADE_TYPES.OVER_UNDER]: {
        title: localize('Over/Under'),
        trade_types: [CONTRACT_TYPES.OVER_UNDER.OVER, CONTRACT_TYPES.OVER_UNDER.UNDER],
        basis: ['stake', 'payout'],
        components: ['last_digit'],
    },
    [TRADE_TYPES.LB_CALL]: {
        title: localize('Close-to-Low'),
        trade_types: [CONTRACT_TYPES.LB_CALL],
        basis: ['multiplier'],
        components: [],
    },
    [TRADE_TYPES.LB_PUT]: {
        title: localize('High-to-Close'),
        trade_types: [CONTRACT_TYPES.LB_PUT],
        basis: ['multiplier'],
        components: [],
    },
    [TRADE_TYPES.LB_HIGH_LOW]: {
        title: localize('High-to-Low'),
        trade_types: [CONTRACT_TYPES.LB_HIGH_LOW],
        basis: ['multiplier'],
        components: [],
    },
    [TRADE_TYPES.TICK_HIGH_LOW]: {
        title: localize('High Tick/Low Tick'),
        trade_types: [CONTRACT_TYPES.TICK_HIGH_LOW.HIGH, CONTRACT_TYPES.TICK_HIGH_LOW.LOW],
        basis: [],
        components: [],
    },
    [TRADE_TYPES.RUN_HIGH_LOW]: {
        title: localize('Only Ups/Only Downs'),
        trade_types: [CONTRACT_TYPES.RUN_HIGH_LOW.HIGH, CONTRACT_TYPES.RUN_HIGH_LOW.LOW],
        basis: [],
        components: [],
    },
    [TRADE_TYPES.RESET]: {
        title: localize('Reset Up/Reset Down'),
        trade_types: [CONTRACT_TYPES.RESET.CALL, CONTRACT_TYPES.RESET.PUT],
        basis: [],
        components: [],
    },
    [TRADE_TYPES.CALL_PUT_SPREAD]: {
        title: localize('Spread Up/Spread Down'),
        trade_types: [CONTRACT_TYPES.CALL_PUT_SPREAD.CALL, CONTRACT_TYPES.CALL_PUT_SPREAD.PUT],
        basis: [],
        components: [],
    },
    [TRADE_TYPES.ACCUMULATOR]: {
        title: localize('Accumulators'),
        trade_types: [CONTRACT_TYPES.ACCUMULATOR],
        basis: ['stake'],
        components: ['take_profit', 'accumulator', 'accu_info_display'],
        barrier_count: 2,
        config: { hide_duration: true },
    },
    [TRADE_TYPES.MULTIPLIER]: {
        title: localize('Multipliers'),
        trade_types: [CONTRACT_TYPES.MULTIPLIER.UP, CONTRACT_TYPES.MULTIPLIER.DOWN],
        basis: ['stake'],
        components: [
            'take_profit',
            'stop_loss',
            ...(shouldShowCancellation(symbol) ? ['cancellation'] : []),
            ...(shouldShowExpiration(symbol) ? ['expiration'] : []),
        ],
        config: { hide_duration: true },
    }, // hide Duration for Multiplier contracts for now
    [TRADE_TYPES.TURBOS.LONG]: {
        title: localize('Turbos'),
        trade_types: [CONTRACT_TYPES.TURBOS.LONG],
        basis: ['stake'],
        barrier_count: 1,
        components: ['trade_type_tabs', 'payout_selector', 'take_profit'],
    },
    [TRADE_TYPES.TURBOS.SHORT]: {
        title: localize('Turbos'),
        trade_types: [CONTRACT_TYPES.TURBOS.SHORT],
        basis: ['stake'],
        barrier_count: 1,
        components: ['trade_type_tabs', 'payout_selector', 'take_profit'],
    },
    [TRADE_TYPES.VANILLA.CALL]: {
        title: localize('Call/Put'),
        trade_types: [CONTRACT_TYPES.VANILLA.CALL],
        basis: ['stake'],
        components: ['duration', 'strike', 'amount', 'trade_type_tabs'],
        barrier_count: 1,
    },
    [TRADE_TYPES.VANILLA.PUT]: {
        title: localize('Call/Put'),
        trade_types: [CONTRACT_TYPES.VANILLA.PUT],
        basis: ['stake'],
        components: ['duration', 'strike', 'amount', 'trade_type_tabs'],
        barrier_count: 1,
    },
});

// Config for rendering trade options
export const getContractCategoriesConfig = () =>
    ({
        Turbos: { name: localize('Turbos'), categories: [TRADE_TYPES.TURBOS.LONG, TRADE_TYPES.TURBOS.SHORT] },
        Multipliers: { name: localize('Multipliers'), categories: [TRADE_TYPES.MULTIPLIER] },
        'Ups & Downs': {
            name: localize('Ups & Downs'),
            categories: [
                TRADE_TYPES.RISE_FALL,
                TRADE_TYPES.RISE_FALL_EQUAL,
                TRADE_TYPES.HIGH_LOW,
                TRADE_TYPES.RUN_HIGH_LOW,
                TRADE_TYPES.RESET,
                TRADE_TYPES.ASIAN,
                TRADE_TYPES.CALL_PUT_SPREAD,
            ],
        },
        'Highs & Lows': {
            name: localize('Highs & Lows'),
            categories: [TRADE_TYPES.TOUCH, TRADE_TYPES.TICK_HIGH_LOW],
        },
        'Ins & Outs': { name: localize('Ins & Outs'), categories: [TRADE_TYPES.END, TRADE_TYPES.STAY] },
        'Look Backs': {
            name: localize('Look Backs'),
            categories: [TRADE_TYPES.LB_HIGH_LOW, TRADE_TYPES.LB_PUT, TRADE_TYPES.LB_CALL],
        },
        Digits: {
            name: localize('Digits'),
            categories: [TRADE_TYPES.MATCH_DIFF, TRADE_TYPES.EVEN_ODD, TRADE_TYPES.OVER_UNDER],
        },
        Vanillas: { name: localize('Vanillas'), categories: [TRADE_TYPES.VANILLA.CALL, TRADE_TYPES.VANILLA.PUT] },
        Accumulators: { name: localize('Accumulators'), categories: [TRADE_TYPES.ACCUMULATOR] },
    } as const);

export const unsupported_contract_types_list = [
    // TODO: remove these once all contract types are supported
    TRADE_TYPES.CALL_PUT_SPREAD,
    TRADE_TYPES.RUN_HIGH_LOW,
    TRADE_TYPES.RESET,
    TRADE_TYPES.ASIAN,
    TRADE_TYPES.TICK_HIGH_LOW,
    TRADE_TYPES.END,
    TRADE_TYPES.STAY,
    TRADE_TYPES.LB_CALL,
    TRADE_TYPES.LB_PUT,
    TRADE_TYPES.LB_HIGH_LOW,
] as const;

export const getCardLabels = () =>
    ({
        APPLY: localize('Apply'),
        BARRIER: localize('Barrier:'),
        BUY_PRICE: localize('Buy price:'),
        CANCEL: localize('Cancel'),
        CLOSE: localize('Close'),
        CLOSED: localize('Closed'),
        COMMISSION: localize('Commission'),
        CONTRACT_COST: localize('Contract cost:'),
        CONTRACT_VALUE: localize('Contract value:'),
        CURRENT_STAKE: localize('Current stake:'),
        DAY: localize('day'),
        DAYS: localize('days'),
        DEAL_CANCEL_FEE: localize('Deal cancel. fee:'),
        DECREMENT_VALUE: localize('Decrement value'),
        DONT_SHOW_THIS_AGAIN: localize("Don't show this again"),
        DURATION: localize('Duration'),
        ENTRY_SPOT: localize('Entry spot:'),
        GROWTH_RATE: localize('Growth rate'),
        INCREMENT_VALUE: localize('Increment value'),
        INDICATIVE_PRICE: localize('Indicative price:'),
        INITIAL_STAKE: localize('Initial stake:'),
        LOST: localize('Lost'),
        MULTIPLIER: localize('Multiplier:'),
        NOT_AVAILABLE: localize('N/A'),
        NOT_SET: localize('Not set'),
        PAYOUT: localize('Sell price:'),
        PAYOUT_PER_POINT: localize('Payout per point'),
        POTENTIAL_PAYOUT: localize('Potential payout:'),
        POTENTIAL_PROFIT_LOSS: localize('Potential profit/loss:'),
        PROFIT_LOSS: localize('Profit/Loss:'),
        PURCHASE_PRICE: localize('Buy price:'),
        REFERENCE_ID: localize('Reference ID'),
        RESALE_NOT_OFFERED: localize('Resale not offered'),
        SELL: localize('Sell'),
        STAKE: localize('Stake:'),
        STOP_LOSS: localize('Stop loss:'),
        STOP_OUT_LEVEL: localize('Stop out level'),
        STRIKE: localize('Strike:'),
        STRIKE_PRICE: localize('Strike Price'),
        TAKE_PROFIT: localize('Take profit:'),
        TAKE_PROFIT_IS_NOT_AVAILABLE: localize("Take profit can't be adjusted for ongoing accumulator contracts."),
        TAKE_PROFIT_LOSS_NOT_AVAILABLE: localize(
            'Take profit and/or stop loss are not available while deal cancellation is active.'
        ),
        TARGET: localize('Target'),
        TICK: localize('Tick'),
        TICKS: localize('Ticks'),
        TOTAL_PROFIT_LOSS: localize('Total profit/loss:'),
        WON: localize('Won'),
    } as const);

export const getCardLabelsV2 = () =>
    ({
        APPLY: localize('Apply'),
        BARRIER: localize('Barrier'),
        HIGH_BARRIER: localize('High Barrier'),
        LOW_BARRIER: localize('Low Barrier'),
        BUY_PRICE: localize('Buy price'),
        BUY: localize('Buy'),
        CANCEL: localize('Cancel'),
        CLOSE: localize('Close'),
        CLOSED: localize('Closed'),
        COMMISSION: localize('Commission'),
        CONTRACT_COST: localize('Contract cost'),
        CONTRACT_VALUE: localize('Contract value'),
        CURRENT_STAKE: localize('Current stake'),
        DAY: localize('day'),
        DAYS: localize('days'),
        DEAL_CANCEL_FEE: localize('Deal cancellation fees'),
        DECREMENT_VALUE: localize('Decrement value'),
        DONT_SHOW_THIS_AGAIN: localize("Don't show this again"),
        DURATION: localize('Duration'),
        ENTRY_SPOT: localize('Entry spot'),
        GROWTH_RATE: localize('Growth rate'),
        INCREMENT_VALUE: localize('Increment value'),
        INDICATIVE_PRICE: localize('Indicative price'),
        INDICATIVE_HIGH_SPOT: localize('Indicative high spot'),
        INDICATIVE_LOW_SPOT: localize('Indicative low spot'),
        HIGH_SPOT: localize('High spot'),
        LOW_SPOT: localize('Low spot'),
        INITIAL_STAKE: localize('Initial stake'),
        LOST: localize('Lost'),
        MULTIPLIER: localize('Multiplier'),
        NOT_AVAILABLE: localize('N/A'),
        NOT_SET: localize('Not set'),
        PAYOUT: localize('Sell price'),
        ACTIVE: localize('active'),
        EXECUTED: localize('executed'),
        EXPIRED: localize('expired'),
        PAYOUT_PER_POINT: localize('Payout per point'),
        POTENTIAL_PAYOUT: localize('Potential payout'),
        POTENTIAL_PROFIT_LOSS: localize('Potential profit/loss'),
        PROFIT_LOSS: localize('Profit/Loss'),
        PURCHASE_PRICE: localize('Buy price'),
        REFERENCE_ID: localize('Reference ID'),
        RESALE_NOT_OFFERED: localize('Resale not offered'),
        SELL: localize('Sell'),
        STAKE: localize('Stake'),
        STOP_LOSS: localize('Stop loss'),
        STOP_OUT_LEVEL: localize('Stop out level'),
        STRIKE: localize('Strike'),
        STRIKE_PRICE: localize('Strike Price'),
        TAKE_PROFIT: localize('Take profit'),
        TAKE_PROFIT_IS_NOT_AVAILABLE: localize("Take profit can't be adjusted for ongoing accumulator contracts."),
        TAKE_PROFIT_LOSS_NOT_AVAILABLE: localize(
            'Take profit and/or stop loss are not available while deal cancellation is active.'
        ),
        TARGET: localize('Target'),
        TICK: localize('Tick'),
        TICKS: localize('Ticks'),
        TOTAL_PROFIT_LOSS: localize('Total profit/loss'),
        WON: localize('Won'),
        RESET_BARRIER: localize('Reset barrier'),
        RESET_TIME: localize('Reset time'),
        SELECTED_TICK: localize('Selected tick'),
    } as const);

export const getMarketNamesMap = () =>
    ({
        FRXAUDCAD: localize('AUD/CAD'),
        FRXAUDCHF: localize('AUD/CHF'),
        FRXAUDJPY: localize('AUD/JPY'),
        FRXAUDNZD: localize('AUD/NZD'),
        FRXAUDPLN: localize('AUD/PLN'),
        FRXAUDUSD: localize('AUD/USD'),
        FRXBROUSD: localize('Oil/USD'),
        FRXEURAUD: localize('EUR/AUD'),
        FRXEURCAD: localize('EUR/CAD'),
        FRXEURCHF: localize('EUR/CHF'),
        FRXEURGBP: localize('EUR/GBP'),
        FRXEURJPY: localize('EUR/JPY'),
        FRXEURNZD: localize('EUR/NZD'),
        FRXEURUSD: localize('EUR/USD'),
        FRXGBPAUD: localize('GBP/AUD'),
        FRXGBPCAD: localize('GBP/CAD'),
        FRXGBPCHF: localize('GBP/CHF'),
        FRXGBPJPY: localize('GBP/JPY'),
        FRXGBPNOK: localize('GBP/NOK'),
        FRXGBPUSD: localize('GBP/USD'),
        FRXNZDJPY: localize('NZD/JPY'),
        FRXNZDUSD: localize('NZD/USD'),
        FRXUSDCAD: localize('USD/CAD'),
        FRXUSDCHF: localize('USD/CHF'),
        FRXUSDJPY: localize('USD/JPY'),
        FRXUSDNOK: localize('USD/NOK'),
        FRXUSDPLN: localize('USD/PLN'),
        FRXUSDSEK: localize('USD/SEK'),
        FRXXAGUSD: localize('Silver/USD'),
        FRXXAUUSD: localize('Gold/USD'),
        FRXXPDUSD: localize('Palladium/USD'),
        FRXXPTUSD: localize('Platinum/USD'),
        OTC_AEX: localize('Netherlands 25'),
        OTC_AS51: localize('Australia 200'),
        OTC_DJI: localize('Wall Street 30'),
        OTC_FCHI: localize('France 40'),
        OTC_FTSE: localize('UK 100'),
        OTC_GDAXI: localize('Germany 40'),
        OTC_HSI: localize('Hong Kong 50'),
        OTC_IBEX35: localize('Spanish Index'),
        OTC_N225: localize('Japan 225'),
        OTC_NDX: localize('US Tech 100'),
        OTC_SPC: localize('US 500'),
        OTC_SSMI: localize('Swiss 20'),
        OTC_SX5E: localize('Euro 50'),
        R_10: localize('Volatility 10 Index'),
        R_25: localize('Volatility 25 Index'),
        R_50: localize('Volatility 50 Index'),
        R_75: localize('Volatility 75 Index'),
        R_100: localize('Volatility 100 Index'),
        BOOM300N: localize('Boom 300 Index'),
        BOOM500: localize('Boom 500 Index'),
        BOOM1000: localize('Boom 1000 Index'),
        CRASH300N: localize('Crash 300 Index'),
        CRASH500: localize('Crash 500 Index'),
        CRASH1000: localize('Crash 1000 Index'),
        RDBEAR: localize('Bear Market Index'),
        RDBULL: localize('Bull Market Index'),
        STPRNG: localize('Step 100 Index'),
        STPRNG2: localize('Step 200 Index'),
        STPRNG3: localize('Step 300 Index'),
        STPRNG4: localize('Step 400 Index'),
        STPRNG5: localize('Step 500 Index'),
        WLDAUD: localize('AUD Basket'),
        WLDEUR: localize('EUR Basket'),
        WLDGBP: localize('GBP Basket'),
        WLDXAU: localize('Gold Basket'),
        WLDUSD: localize('USD Basket'),
        '1HZ10V': localize('Volatility 10 (1s) Index'),
        '1HZ25V': localize('Volatility 25 (1s) Index'),
        '1HZ50V': localize('Volatility 50 (1s) Index'),
        '1HZ75V': localize('Volatility 75 (1s) Index'),
        '1HZ100V': localize('Volatility 100 (1s) Index'),
        '1HZ150V': localize('Volatility 150 (1s) Index'),
        '1HZ200V': localize('Volatility 200 (1s) Index'),
        '1HZ250V': localize('Volatility 250 (1s) Index'),
        '1HZ300V': localize('Volatility 300 (1s) Index'),
        JD10: localize('Jump 10 Index'),
        JD25: localize('Jump 25 Index'),
        JD50: localize('Jump 50 Index'),
        JD75: localize('Jump 75 Index'),
        JD100: localize('Jump 100 Index'),
        JD150: localize('Jump 150 Index'),
        JD200: localize('Jump 200 Index'),
        CRYBCHUSD: localize('BCH/USD'),
        CRYBNBUSD: localize('BNB/USD'),
        CRYBTCLTC: localize('BTC/LTC'),
        CRYIOTUSD: localize('IOT/USD'),
        CRYNEOUSD: localize('NEO/USD'),
        CRYOMGUSD: localize('OMG/USD'),
        CRYTRXUSD: localize('TRX/USD'),
        CRYBTCETH: localize('BTC/ETH'),
        CRYZECUSD: localize('ZEC/USD'),
        CRYXMRUSD: localize('ZMR/USD'),
        CRYXMLUSD: localize('XLM/USD'),
        CRYXRPUSD: localize('XRP/USD'),
        CRYBTCUSD: localize('BTC/USD'),
        CRYDSHUSD: localize('DSH/USD'),
        CRYETHUSD: localize('ETH/USD'),
        CRYEOSUSD: localize('EOS/USD'),
        CRYLTCUSD: localize('LTC/USD'),
    } as const);

export const getUnsupportedContracts = () =>
    ({
        CALLSPREAD: {
            name: localize('Spread Up'),
            position: 'top',
        },
        PUTSPREAD: {
            name: localize('Spread Down'),
            position: 'bottom',
        },
    } as const);

/**
 * // Config to display details such as trade buttons, their positions, and names of trade types
 *
 * @param {Boolean} is_high_low
 * @returns { object }
 */
export const getSupportedContracts = (is_high_low?: boolean) =>
    ({
        [CONTRACT_TYPES.ACCUMULATOR]: {
            button_name: localize('Buy'),
            name: localize('Accumulators'),
            position: 'top',
        },
        [CONTRACT_TYPES.CALL]: {
            name: is_high_low ? localize('Higher') : localize('Rise'),
            position: 'top',
        },
        [CONTRACT_TYPES.PUT]: {
            name: is_high_low ? localize('Lower') : localize('Fall'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.CALLE]: {
            name: localize('Rise'),
            position: 'top',
        },
        [CONTRACT_TYPES.PUTE]: {
            name: localize('Fall'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.MATCH_DIFF.MATCH]: {
            name: localize('Matches'),
            position: 'top',
        },
        [CONTRACT_TYPES.MATCH_DIFF.DIFF]: {
            name: localize('Differs'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.EVEN_ODD.EVEN]: {
            name: localize('Even'),
            position: 'top',
        },
        [CONTRACT_TYPES.EVEN_ODD.ODD]: {
            name: localize('Odd'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.OVER_UNDER.OVER]: {
            name: localize('Over'),
            position: 'top',
        },
        [CONTRACT_TYPES.OVER_UNDER.UNDER]: {
            name: localize('Under'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.TOUCH.ONE_TOUCH]: {
            name: localize('Touch'),
            position: 'top',
        },
        [CONTRACT_TYPES.TOUCH.NO_TOUCH]: {
            name: localize('No Touch'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.MULTIPLIER.UP]: {
            name: localize('Up'),
            position: 'top',
            main_title: localize('Multipliers'),
        },
        [CONTRACT_TYPES.MULTIPLIER.DOWN]: {
            name: localize('Down'),
            position: 'bottom',
            main_title: localize('Multipliers'),
        },
        [CONTRACT_TYPES.TURBOS.LONG]: {
            name: localize('Up'),
            position: 'top',
            main_title: localize('Turbos'),
        },
        [CONTRACT_TYPES.TURBOS.SHORT]: {
            name: localize('Down'),
            position: 'bottom',
            main_title: localize('Turbos'),
        },
        [CONTRACT_TYPES.VANILLA.CALL]: {
            name: localize('Call'),
            position: 'top',
            main_title: localize('Vanillas'),
        },
        [CONTRACT_TYPES.VANILLA.PUT]: {
            name: localize('Put'),
            position: 'bottom',
            main_title: localize('Vanillas'),
        },
        [CONTRACT_TYPES.RUN_HIGH_LOW.HIGH]: {
            name: localize('Only Ups'),
            position: 'top',
        },
        [CONTRACT_TYPES.RUN_HIGH_LOW.LOW]: {
            name: localize('Only Downs'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.END.OUT]: {
            name: localize('Ends Outside'),
            position: 'top',
        },
        [CONTRACT_TYPES.END.IN]: {
            name: localize('Ends Between'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.STAY.IN]: {
            name: localize('Stays Between'),
            position: 'top',
        },
        [CONTRACT_TYPES.STAY.OUT]: {
            name: localize('Goes Outside'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.ASIAN.UP]: {
            name: localize('Asian Up'),
            position: 'top',
        },
        [CONTRACT_TYPES.ASIAN.DOWN]: {
            name: localize('Asian Down'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.TICK_HIGH_LOW.HIGH]: {
            name: localize('High Tick'),
            position: 'top',
        },
        [CONTRACT_TYPES.TICK_HIGH_LOW.LOW]: {
            name: localize('Low Tick'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.RESET.CALL]: {
            name: localize('Reset Call'),
            position: 'top',
        },
        [CONTRACT_TYPES.RESET.PUT]: {
            name: localize('Reset Put'),
            position: 'bottom',
        },
        [CONTRACT_TYPES.LB_CALL]: {
            name: localize('Close-Low'),
            position: 'top',
        },
        [CONTRACT_TYPES.LB_PUT]: {
            name: localize('High-Close'),
            position: 'top',
        },
        [CONTRACT_TYPES.LB_HIGH_LOW]: {
            name: localize('High-Low'),
            position: 'top',
        },
        // To add a feature flag for a new trade_type, please add 'feature_flag' to its config here:
        // SHARKFIN: {
        //     feature_flag: 'sharkfin',
        //     name: localize('Sharkfin'),
        //     position: 'top',
        // }
        // and also to DTRADER_FLAGS in FeatureFlagsStore, e.g.: sharkfin: false,
    } as const);

export const TRADE_FEATURE_FLAGS = ['sharkfin', 'dtrader_v2'];

export const getCleanedUpCategories = (categories: TTradeTypesCategories) => {
    const categories_copy: TTradeTypesCategories = cloneObject(categories);
    const hidden_trade_types = Object.entries(LocalStore.getObject('FeatureFlagsStore')?.data ?? {})
        .filter(([key, value]) => TRADE_FEATURE_FLAGS.includes(key) && !value)
        .map(([key]) => key);

    return Object.keys(categories_copy).reduce((acc, key) => {
        const category = categories_copy[key].categories?.filter(item => {
            return (
                typeof item === 'object' &&
                // hide trade types with disabled feature flag:
                hidden_trade_types?.every(hidden_type => !item.value.startsWith(hidden_type))
            );
        });
        if (category?.length === 0) {
            delete acc[key];
        } else {
            acc[key].categories = category;
        }
        return acc;
    }, categories_copy);
};

export const getContractConfig = (is_high_low?: boolean) => ({
    ...getSupportedContracts(is_high_low),
    ...getUnsupportedContracts(),
});

export const getContractTypeDisplay = (type: string, options: TContractOptions = {}) => {
    const { isHighLow = false, showButtonName = false, showMainTitle = false } = options;

    const contract_config = getContractConfig(isHighLow)[type as TGetSupportedContracts] as TContractConfig;
    if (showMainTitle) return contract_config?.main_title ?? '';
    return (showButtonName && contract_config?.button_name) || contract_config?.name || '';
};

export const getContractTypeFeatureFlag = (type: string, is_high_low = false) => {
    const contract_config = getContractConfig(is_high_low)[type as TGetSupportedContracts] as TContractConfig;
    return contract_config?.feature_flag ?? '';
};

export const getContractTypePosition = (type: TGetSupportedContracts, is_high_low = false) =>
    getContractConfig(is_high_low)?.[type]?.position || 'top';

export const isCallPut = (trade_type: 'rise_fall' | 'rise_fall_equal' | 'high_low'): boolean =>
    trade_type === TRADE_TYPES.RISE_FALL ||
    trade_type === TRADE_TYPES.RISE_FALL_EQUAL ||
    trade_type === TRADE_TYPES.HIGH_LOW;
