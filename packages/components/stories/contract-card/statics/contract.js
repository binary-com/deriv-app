import { localize } from '@deriv/translations';

export const getCardLabels = () => ({
    APPLY: 'Apply',
    BARRIER: 'Barrier:',
    STAKE: 'Stake:',
    CLOSE: 'Close',
    CANCEL: 'Cancel',
    CURRENT_STAKE: 'Current stake:',
    DEAL_CANCEL_FEE: 'Deal cancel. fee:',
    TAKE_PROFIT: 'Take profit:',
    BUY_PRICE: 'Buy price:',
    STOP_LOSS: 'Stop loss:',
    TOTAL_PROFIT_LOSS: 'Total profit/loss:',
    PROFIT_LOSS: 'Profit/Loss:',
    POTENTIAL_PROFIT_LOSS: 'Potential profit/loss:',
    INDICATIVE_PRICE: 'Indicative price:',
    PAYOUT: 'Sell price:',
    PURCHASE_PRICE: 'Buy price:',
    POTENTIAL_PAYOUT: 'Payout limit:',
    TICK: 'Tick ',
    TICKS: 'Ticks',
    DAYS: 'Days',
    DAY: 'Day',
    SELL: 'Sell',
    INCREMENT_VALUE: 'Increment value',
    DECREMENT_VALUE: 'Decrement value',
    TAKE_PROFIT_LOSS_NOT_AVAILABLE: 'Take profit and/or stop loss are not available while deal cancellation is active.',
    DONT_SHOW_THIS_AGAIN: "Don't show this again",
    RESALE_NOT_OFFERED: 'Resale not offered',
});

export const getMarketNamesMap = () => ({
    FRXAUDCAD: 'AUD/CAD',
    FRXAUDCHF: 'AUD/CHF',
    FRXAUDJPY: 'AUD/JPY',
    FRXAUDNZD: 'AUD/NZD',
    FRXAUDPLN: 'AUD/PLN',
    FRXAUDUSD: 'AUD/USD',
    FRXBROUSD: 'Oil/USD',
    FRXEURAUD: 'EUR/AUD',
    FRXEURCAD: 'EUR/CAD',
    FRXEURCHF: 'EUR/CHF',
    FRXEURGBP: 'EUR/GBP',
    FRXEURJPY: 'EUR/JPY',
    FRXEURNZD: 'EUR/NZD',
    FRXEURUSD: 'EUR/USD',
    FRXGBPAUD: 'GBP/AUD',
    FRXGBPCAD: 'GBP/CAD',
    FRXGBPCHF: 'GBP/CHF',
    FRXGBPJPY: 'GBP/JPY',
    FRXGBPNOK: 'GBP/NOK',
    FRXGBPUSD: 'GBP/USD',
    FRXNZDJPY: 'NZD/JPY',
    FRXNZDUSD: 'NZD/USD',
    FRXUSDCAD: 'USD/CAD',
    FRXUSDCHF: 'USD/CHF',
    FRXUSDJPY: 'USD/JPY',
    FRXUSDNOK: 'USD/NOK',
    FRXUSDPLN: 'USD/PLN',
    FRXUSDSEK: 'USD/SEK',
    FRXXAGUSD: 'Silver/USD',
    FRXXAUUSD: 'Gold/USD',
    FRXXPDUSD: 'Palladium/USD',
    FRXXPTUSD: 'Platinum/USD',
    OTC_AEX: 'Netherlands 25',
    OTC_AS51: 'Australia 200',
    OTC_DJI: 'Wall Street 30',
    OTC_FCHI: 'France 40',
    OTC_FTSE: 'UK 100',
    OTC_GDAXI: 'Germany 40',
    OTC_HSI: 'Hong Kong 50',
    OTC_IBEX35: 'Spanish Index',
    OTC_N225: 'Japan 225',
    OTC_NDX: 'US Tech 100',
    OTC_SPC: 'US 500',
    OTC_SSMI: 'Swiss 20',
    OTC_SX5E: 'Euro 50',
    R_10: 'Volatility 10 Index',
    R_25: 'Volatility 25 Index',
    R_50: 'Volatility 50 Index',
    R_75: 'Volatility 75 Index',
    R_100: 'Volatility 100 Index',
    BOOM300N: localize('Boom 300 Index'),
    BOOM500: localize('Boom 500 Index'),
    BOOM1000: localize('Boom 1000 Index'),
    CRASH300N: localize('Crash 300 Index'),
    CRASH500: localize('Crash 500 Index'),
    CRASH1000: localize('Crash 1000 Index'),
    RDBEAR: 'Bear Market Index',
    RDBULL: 'Bull Market Index',
    WLDAUD: 'AUD Basket',
    WLDEUR: 'EUR Basket',
    WLDGBP: 'GBP Basket',
    WLDXAU: 'Gold Basket',
    WLDUSD: 'USD Basket',
    '1HZ10V': 'Volatility 10 (1s) Index',
    '1HZ100V': 'Volatility 100 (1s) Index',
    '1HZ150V': 'Volatility 150 (1s) Index',
    '1HZ200V': 'Volatility 200 (1s) Index',
    '1HZ250V': 'Volatility 250 (1s) Index',
    '1HZ300V': 'Volatility 300 (1s) Index',
    JD10: localize('Jump 10 Index'),
    JD25: localize('Jump 25 Index'),
    JD50: localize('Jump 50 Index'),
    JD75: localize('Jump 75 Index'),
    JD100: localize('Jump 100 Index'),
    JD150: localize('Jump 150 Index'),
    JD200: localize('Jump 200 Index'),
});

export const getUnsupportedContracts = () => ({
    CALLSPREAD: {
        name: 'Spread Up',
        position: 'top',
    },
    PUTSPREAD: {
        name: 'Spread Down',
        position: 'bottom',
    },
});

export const getSupportedContracts = is_high_low => ({
    ACCU: {
        button_name: 'Buy',
        name: 'Accumulators',
        position: 'top',
    },
    CALL: {
        name: is_high_low ? 'Higher' : 'Rise',
        position: 'top',
    },
    PUT: {
        name: is_high_low ? 'Lower' : 'Fall',
        position: 'bottom',
    },
    CALLE: {
        name: 'Rise',
        position: 'top',
    },
    PUTE: {
        name: 'Fall',
        position: 'bottom',
    },
    DIGITMATCH: {
        name: 'Matches',
        position: 'top',
    },
    DIGITDIFF: {
        name: 'Differs',
        position: 'bottom',
    },
    DIGITEVEN: {
        name: 'Even',
        position: 'top',
    },
    DIGITODD: {
        name: 'Odd',
        position: 'bottom',
    },
    DIGITOVER: {
        name: 'Over',
        position: 'top',
    },
    DIGITUNDER: {
        name: 'Under',
        position: 'bottom',
    },
    ONETOUCH: {
        name: 'Touch',
        position: 'top',
    },
    NOTOUCH: {
        name: 'No Touch',
        position: 'bottom',
    },
    MULTUP: {
        name: 'Up',
        position: 'top',
    },
    MULTDOWN: {
        name: 'Down',
        position: 'bottom',
    },
    TURBOSLONG: {
        name: 'Up',
        position: 'top',
    },
    TURBOSSHORT: {
        name: 'Down',
        position: 'bottom',
    },
    RUNHIGH: {
        name: 'Only Ups',
        position: 'top',
    },
    RUNLOW: {
        name: 'Only Downs',
        position: 'bottom',
    },
    EXPIRYMISS: {
        name: 'Ends Outside',
        position: 'top',
    },
    EXPIRYRANGE: {
        name: 'Ends Between',
        position: 'bottom',
    },
    RANGE: {
        name: 'Stays Between',
        position: 'top',
    },
    UPORDOWN: {
        name: 'Goes Outside',
        position: 'bottom',
    },
    ASIANU: {
        name: 'Asian Up',
        position: 'top',
    },
    ASIAND: {
        name: 'Asian Down',
        position: 'bottom',
    },
    RESETCALL: {
        name: 'Reset Call',
        position: 'top',
    },
    RESETPUT: {
        name: 'Reset Put',
        position: 'bottom',
    },
    LBFLOATCALL: {
        name: 'Close-Low',
        position: 'top',
    },
    LBFLOATPUT: {
        name: 'High-Close',
        position: 'top',
    },
    LBHIGHLOW: {
        name: 'High-Low',
        position: 'top',
    },
    TICKHIGH: {
        name: 'High Tick',
        position: 'top',
    },
    TICKLOW: {
        name: 'Low Tick',
        position: 'bottom',
    },
});

export const getContractConfig = is_high_low => ({
    ...getSupportedContracts(is_high_low),
    ...getUnsupportedContracts(),
});

export const getContractTypeDisplay = (type, is_high_low = false, show_button_name = false) => {
    const contract_config = getContractConfig(is_high_low)[type];
    return (show_button_name && contract_config.button_name) || contract_config.name || '';
};

export const getContractTypePosition = (type, is_high_low = false) =>
    getContractConfig(is_high_low)[type] ? getContractConfig(is_high_low)[type.toUpperCase()].position : 'top';
