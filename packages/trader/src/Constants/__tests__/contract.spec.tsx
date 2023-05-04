import React from 'react';
import { localize, Localize } from '@deriv/translations';
import {
    getCardLabels,
    getMarketNamesMap,
    getUnsupportedContracts,
    getSupportedContracts,
    getContractConfig,
    getContractTypeDisplay,
    getContractTypePosition,
} from '../contract';

const card_labels = {
    APPLY: localize('Apply'),
    BUY_PRICE: localize('Buy price:'),
    CANCEL: localize('Cancel'),
    CLOSE: localize('Close'),
    CONTRACT_VALUE: localize('Contract value:'),
    CURRENT_STAKE: localize('Current stake:'),
    DAY: localize('day'),
    DAYS: localize('days'),
    DEAL_CANCEL_FEE: localize('Deal cancel. fee:'),
    DECREMENT_VALUE: localize('Decrement value'),
    DONT_SHOW_THIS_AGAIN: localize("Don't show this again"),
    ENTRY_SPOT: localize('Entry spot:'),
    INCREMENT_VALUE: localize('Increment value'),
    NOT_AVAILABLE: localize('N/A'),
    RESALE_NOT_OFFERED: localize('Resale not offered'),
    SELL: localize('Sell'),
    STAKE: localize('Stake:'),
    STOP_LOSS: localize('Stop loss:'),
    STRIKE: localize('Strike:'),
    TICK: localize('Tick '),
    TICKS: localize('Ticks'),
    TOTAL_PROFIT_LOSS: localize('Total profit/loss:'),
    PROFIT_LOSS: localize('Profit/Loss:'),
    POTENTIAL_PROFIT_LOSS: localize('Potential profit/loss:'),
    INDICATIVE_PRICE: localize('Indicative price:'),
    LOST: localize('Lost'),
    PAYOUT: localize('Sell price:'),
    PURCHASE_PRICE: localize('Buy price:'),
    POTENTIAL_PAYOUT: localize('Payout limit:'),
    TAKE_PROFIT: localize('Take profit:'),
    TAKE_PROFIT_LOSS_NOT_AVAILABLE: localize(
        'Take profit and/or stop loss are not available while deal cancellation is active.'
    ),
    WON: localize('Won'),
};
const markets_names = {
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
    STPRNG: localize('Step Index'),
    WLDAUD: localize('AUD Basket'),
    WLDEUR: localize('EUR Basket'),
    WLDGBP: localize('GBP Basket'),
    WLDXAU: localize('Gold Basket'),
    WLDUSD: localize('USD Basket'),
    '1HZ10V': localize('Volatility 10 (1s) Index'),
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
};
const unsupported_contracts = {
    EXPIRYMISS: {
        name: <Localize i18n_default_text='Ends Outside' />,
        position: 'top',
    },
    EXPIRYRANGE: {
        name: <Localize i18n_default_text='Ends Between' />,
        position: 'bottom',
    },
    RANGE: {
        name: <Localize i18n_default_text='Stays Between' />,
        position: 'top',
    },
    UPORDOWN: {
        name: <Localize i18n_default_text='Goes Outside' />,
        position: 'bottom',
    },
    RESETCALL: {
        name: <Localize i18n_default_text='Reset Call' />,
        position: 'top',
    },
    RESETPUT: {
        name: <Localize i18n_default_text='Reset Put' />,
        position: 'bottom',
    },
    TICKHIGH: {
        name: <Localize i18n_default_text='High Tick' />,
        position: 'top',
    },
    TICKLOW: {
        name: <Localize i18n_default_text='Low Tick' />,
        position: 'bottom',
    },
    ASIANU: {
        name: <Localize i18n_default_text='Asian Up' />,
        position: 'top',
    },
    ASIAND: {
        name: <Localize i18n_default_text='Asian Down' />,
        position: 'bottom',
    },
    LBFLOATCALL: {
        name: <Localize i18n_default_text='Close-to-Low' />,
        position: 'top',
    },
    LBFLOATPUT: {
        name: <Localize i18n_default_text='High-to-Close' />,
        position: 'top',
    },
    LBHIGHLOW: {
        name: <Localize i18n_default_text='High-to-Low' />,
        position: 'top',
    },
    CALLSPREAD: {
        name: <Localize i18n_default_text='Spread Up' />,
        position: 'top',
    },
    PUTSPREAD: {
        name: <Localize i18n_default_text='Spread Down' />,
        position: 'bottom',
    },
    RUNHIGH: {
        name: <Localize i18n_default_text='Only Ups' />,
        position: 'top',
    },
    RUNLOW: {
        name: <Localize i18n_default_text='Only Downs' />,
        position: 'bottom',
    },
};
const supported_contracts = {
    ACCU: {
        button_name: <Localize i18n_default_text='Buy' />,
        name: <Localize i18n_default_text='Accumulator' />,
        position: 'top',
    },
    CALLE: {
        name: <Localize i18n_default_text='Rise' />,
        position: 'top',
    },
    PUTE: {
        name: <Localize i18n_default_text='Fall' />,
        position: 'bottom',
    },
    DIGITMATCH: {
        name: <Localize i18n_default_text='Matches' />,
        position: 'top',
    },
    DIGITDIFF: {
        name: <Localize i18n_default_text='Differs' />,
        position: 'bottom',
    },
    DIGITEVEN: {
        name: <Localize i18n_default_text='Even' />,
        position: 'top',
    },
    DIGITODD: {
        name: <Localize i18n_default_text='Odd' />,
        position: 'bottom',
    },
    DIGITOVER: {
        name: <Localize i18n_default_text='Over' />,
        position: 'top',
    },
    DIGITUNDER: {
        name: <Localize i18n_default_text='Under' />,
        position: 'bottom',
    },
    ONETOUCH: {
        name: <Localize i18n_default_text='Touch' />,
        position: 'top',
    },
    NOTOUCH: {
        name: <Localize i18n_default_text='No Touch' />,
        position: 'bottom',
    },
    MULTUP: {
        name: <Localize i18n_default_text='Up' />,
        position: 'top',
    },
    MULTDOWN: {
        name: <Localize i18n_default_text='Down' />,
        position: 'bottom',
    },
    VANILLALONGCALL: {
        name: <Localize i18n_default_text='Call' />,
        position: 'top',
    },
    VANILLALONGPUT: {
        name: <Localize i18n_default_text='Put' />,
        position: 'bottom',
    },
};
const supported_hight_low = {
    CALL: {
        name: <Localize i18n_default_text='Higher' />,
        position: 'top',
    },
    PUT: {
        name: <Localize i18n_default_text='Lower' />,
        position: 'bottom',
    },
};
const not_supported_hight_low = {
    CALL: {
        name: <Localize i18n_default_text='Rise' />,
        position: 'top',
    },
    PUT: {
        name: <Localize i18n_default_text='Fall' />,
        position: 'bottom',
    },
};

describe('getCardLabels', () => {
    it('should return object with card labels', () => {
        expect(getCardLabels()).toEqual(card_labels);
    });
});

describe('getMarketNamesMap', () => {
    it('should return object with markets names', () => {
        expect(getMarketNamesMap()).toEqual(markets_names);
    });
});

describe('getUnsupportedContracts', () => {
    it('should return object with unsupported contracts', () => {
        expect(getUnsupportedContracts()).toEqual(unsupported_contracts);
    });
});

describe('getSupportedContracts', () => {
    it('should return object with proper supported contracts if is_high_low === true', () => {
        expect(getSupportedContracts(true)).toEqual({ ...supported_contracts, ...supported_hight_low });
    });

    it('should return object with proper supported contracts if is_high_low === false', () => {
        expect(getSupportedContracts(false)).toEqual({ ...supported_contracts, ...not_supported_hight_low });
    });
});

describe('getContractConfig', () => {
    it('should return object with proper contracts if is_high_low === true', () => {
        expect(getContractConfig(true)).toEqual({
            ...supported_contracts,
            ...supported_hight_low,
            ...unsupported_contracts,
        });
    });

    it('should return object with proper contracts if is_high_low === false', () => {
        expect(getContractConfig(false)).toEqual({
            ...supported_contracts,
            ...not_supported_hight_low,
            ...unsupported_contracts,
        });
    });
});

describe('getContractTypeDisplay', () => {
    it('should return button name if show_button_name === true and contract_config has button_name field', () => {
        expect(getContractTypeDisplay('ACCU', false, true)).toEqual(<Localize i18n_default_text='Buy' />);
    });
    it('should return contract name if show_button_name === false but contract_config has button_name field', () => {
        expect(getContractTypeDisplay('ACCU')).toEqual(<Localize i18n_default_text='Accumulator' />);
    });
    it('should return contract name if show_button_name === true but contract_config has no button_name field', () => {
        expect(getContractTypeDisplay('MULTDOWN', true, true)).toEqual(<Localize i18n_default_text='Down' />);
    });
    it('should return empty string if show_button_name === false and contract_config has no name field', () => {
        expect(getContractTypeDisplay('TEST', true, false)).toEqual('');
    });
    it('should return empty string if show_button_name === true and contract_config has no name field and button_name', () => {
        expect(getContractTypeDisplay('TEST', true, true)).toEqual('');
    });
});

describe('getContractTypePosition', () => {
    it('should return button position if such type exist', () => {
        expect(getContractTypePosition('NOTOUCH')).toEqual('bottom');
    });
    it('should return top position if such type does not exist', () => {
        expect(getContractTypePosition('TEST')).toEqual('top');
    });
});
