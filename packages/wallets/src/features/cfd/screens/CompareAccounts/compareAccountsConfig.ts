import { useTranslations } from '@deriv-com/translations';
import getInstrumentsIcons from '../../../../public/images/tradingInstruments';
import { THooks, TPlatforms } from '../../../../types';
import { CFD_PLATFORMS, MARKET_TYPE, PRODUCT } from '../../constants';
import { JURISDICTION, MARKET_TYPE_SHORTCODE } from './constants';

type THighlightedIconLabel = {
    highlighted: boolean;
    icon: keyof ReturnType<typeof getInstrumentsIcons>;
    isAsterisk?: boolean;
    text: string;
};

type TMarketTypes = THooks.AvailableMT5Accounts['market_type'];
type TShortCode = THooks.AvailableMT5Accounts['shortcode'];

const getHighlightedIconLabel = (
    platform: TPlatforms.All,
    isEuRegion: boolean,
    localize: ReturnType<typeof useTranslations>['localize'],
    marketType: TMarketTypes,
    shortCode: TShortCode,
    product?: THooks.AvailableMT5Accounts['product']
): THighlightedIconLabel[] => {
    const marketTypeShortCode =
        platform === CFD_PLATFORMS.MT5 && marketType === 'all'
            ? `${marketType}_${product}_${shortCode}`
            : marketType?.concat('_', shortCode ?? '');

    const forexLabel = (() => {
        if (isEuRegion) {
            return localize('Forex');
        } else if (marketTypeShortCode === MARKET_TYPE_SHORTCODE.FINANCIAL_LABUAN) {
            return localize('Forex: standard/exotic');
        } else if (
            (platform === CFD_PLATFORMS.MT5 && marketTypeShortCode === MARKET_TYPE_SHORTCODE.ALL_SWAP_FREE_SVG) ||
            platform === CFD_PLATFORMS.CTRADER
        ) {
            return localize('Forex: major/minor');
        } else if (
            marketType === MARKET_TYPE.SYNTHETIC ||
            (platform === CFD_PLATFORMS.MT5 && marketTypeShortCode === MARKET_TYPE_SHORTCODE.ALL_ZERO_SPREAD_BVI)
        ) {
            return localize('Forex: standard');
        }
        return localize('Forex: standard/micro');
    })();

    switch (marketType) {
        case MARKET_TYPE.SYNTHETIC:
            return [
                { highlighted: true, icon: 'Forex', text: forexLabel },
                { highlighted: true, icon: 'Stocks', text: localize('Stocks') },
                { highlighted: true, icon: 'StockIndices', text: localize('Stock indices') },
                { highlighted: true, icon: 'Commodities', text: localize('Commodities') },
                { highlighted: true, icon: 'Cryptocurrencies', text: localize('Cryptocurrencies') },
                { highlighted: true, icon: 'ETF', text: localize('ETFs') },
                { highlighted: true, icon: 'Synthetics', text: localize('Synthetic indices') },
                { highlighted: true, icon: 'Baskets', text: localize('Basket indices') },
                { highlighted: true, icon: 'DerivedFX', text: localize('Derived FX') },
            ];
        case MARKET_TYPE.FINANCIAL:
            switch (shortCode) {
                case JURISDICTION.MALTAINVEST:
                    return [
                        { highlighted: true, icon: 'Forex', text: forexLabel },
                        { highlighted: true, icon: 'Stocks', text: localize('Stocks') },
                        { highlighted: true, icon: 'StockIndices', text: localize('Stock indices') },
                        { highlighted: true, icon: 'Commodities', text: localize('Commodities') },
                        { highlighted: true, icon: 'Cryptocurrencies', text: localize('Cryptocurrencies') },
                        {
                            highlighted: true,
                            icon: 'Synthetics',
                            isAsterisk: true,
                            text: localize('Synthetic indices'),
                        },
                    ];
                case JURISDICTION.LABUAN:
                    return [
                        { highlighted: true, icon: 'Forex', text: forexLabel },
                        { highlighted: false, icon: 'Stocks', text: localize('Stocks') },
                        { highlighted: false, icon: 'StockIndices', text: localize('Stock indices') },
                        { highlighted: false, icon: 'Commodities', text: localize('Commodities') },
                        { highlighted: true, icon: 'Cryptocurrencies', text: localize('Cryptocurrencies') },
                        { highlighted: false, icon: 'ETF', text: localize('ETFs') },
                        { highlighted: false, icon: 'Synthetics', text: localize('Synthetic indices') },
                        { highlighted: false, icon: 'Baskets', text: localize('Basket indices') },
                        { highlighted: false, icon: 'DerivedFX', text: localize('Derived FX') },
                    ];
                default:
                    return [
                        { highlighted: true, icon: 'Forex', text: forexLabel },
                        { highlighted: true, icon: 'Stocks', text: localize('Stocks') },
                        { highlighted: true, icon: 'StockIndices', text: localize('Stock indices') },
                        { highlighted: true, icon: 'Commodities', text: localize('Commodities') },
                        { highlighted: true, icon: 'Cryptocurrencies', text: localize('Cryptocurrencies') },
                        { highlighted: true, icon: 'ETF', text: localize('ETFs') },
                        { highlighted: false, icon: 'Synthetics', text: localize('Synthetic indices') },
                        { highlighted: false, icon: 'Baskets', text: localize('Basket indices') },
                        { highlighted: false, icon: 'DerivedFX', text: localize('Derived FX') },
                    ];
            }
        case MARKET_TYPE.ALL:
        default:
            if (platform === CFD_PLATFORMS.MT5) {
                if (product === PRODUCT.ZEROSPREAD) {
                    return [
                        { highlighted: true, icon: 'Forex', text: forexLabel },
                        { highlighted: false, icon: 'Stocks', text: localize('Stocks') },
                        { highlighted: true, icon: 'StockIndices', text: localize('Stock indices') },
                        { highlighted: true, icon: 'Commodities', text: localize('Commodities') },
                        { highlighted: true, icon: 'Cryptocurrencies', text: localize('Cryptocurrencies') },
                        { highlighted: false, icon: 'ETF', text: localize('ETFs') },
                        { highlighted: true, icon: 'Synthetics', text: localize('Synthetic indices') },
                        { highlighted: true, icon: 'Baskets', text: localize('Basket indices') },
                        { highlighted: true, icon: 'DerivedFX', text: localize('Derived FX') },
                    ];
                }
                return [
                    { highlighted: true, icon: 'Forex', text: forexLabel },
                    { highlighted: true, icon: 'Stocks', text: localize('Stocks') },
                    { highlighted: true, icon: 'StockIndices', text: localize('Stock indices') },
                    { highlighted: true, icon: 'Commodities', text: localize('Commodities') },
                    { highlighted: true, icon: 'Cryptocurrencies', text: localize('Cryptocurrencies') },
                    { highlighted: true, icon: 'ETF', text: localize('ETFs') },
                    { highlighted: true, icon: 'Synthetics', text: localize('Synthetics indices') },
                    { highlighted: false, icon: 'Baskets', text: localize('Basket indices') },
                    { highlighted: false, icon: 'DerivedFX', text: localize('Derived FX') },
                ];
            }
            return [
                { highlighted: true, icon: 'Forex', text: forexLabel },
                { highlighted: true, icon: 'Stocks', text: localize('Stocks') },
                { highlighted: true, icon: 'StockIndices', text: localize('Stock indices') },
                { highlighted: true, icon: 'Commodities', text: localize('Commodities') },
                { highlighted: true, icon: 'Cryptocurrencies', text: localize('Cryptocurrencies') },
                { highlighted: true, icon: 'ETF', text: localize('ETFs') },
                { highlighted: true, icon: 'Synthetics', text: localize('Synthetic indices') },
                { highlighted: true, icon: 'Baskets', text: localize('Basket indices') },
                { highlighted: true, icon: 'DerivedFX', text: localize('Derived FX') },
            ];
    }
};

const getPlatformType = (platform: TPlatforms.All) => {
    switch (platform) {
        case CFD_PLATFORMS.MT5:
            return 'MT5';
        case CFD_PLATFORMS.CTRADER:
            return 'CTrader';
        case CFD_PLATFORMS.DXTRADE:
            return 'DerivX';
        default:
            return 'OtherCFDs';
    }
};

const cfdConfig = (localize: ReturnType<typeof useTranslations>['localize']) => ({
    counterparty_company: localize('Deriv (SVG) LLC'),
    counterparty_company_description: localize('Counterparty company'),
    jurisdiction: localize('St. Vincent & Grenadines'),
    jurisdiction_description: localize('Jurisdiction'),
    leverage: localize('Up to 1:1000'),
    leverage_description: localize('Maximum leverage'),
    regulator: localize('Financial Commission'),
    regulator_description: localize('Regulator/External dispute resolution'),
    regulator_license: '',
    spread: localize('0.5 pips'),
    spread_description: localize('Spreads from'),
});

const getJurisdictionDescription = (localize: ReturnType<typeof useTranslations>['localize'], shortcode?: string) => {
    switch (shortcode) {
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_BVI:
        case MARKET_TYPE_SHORTCODE.FINANCIAL_BVI:
            return {
                ...cfdConfig(localize),
                counterparty_company: localize('Deriv (BVI) Ltd'),
                jurisdiction: localize('British Virgin Islands'),
                regulator: localize('British Virgin Islands Financial Services Commission'),
                regulator_description: localize('Regulator/External dispute resolution'),
                regulator_license: localize('(License no. SIBA/L/18/1114)'),
            };
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_VANUATU:
        case MARKET_TYPE_SHORTCODE.FINANCIAL_VANUATU:
            return {
                ...cfdConfig(localize),
                counterparty_company: localize('Deriv (V) Ltd'),
                jurisdiction: localize('Vanuatu'),
                regulator: localize('Vanuatu Financial Services Commission'),
                regulator_description: localize('Regulator/External dispute resolution'),
                regulator_license: '',
            };
        case MARKET_TYPE_SHORTCODE.FINANCIAL_LABUAN:
            return {
                ...cfdConfig(localize),
                counterparty_company: localize('Deriv (FX) Ltd'),
                jurisdiction: localize('Labuan'),
                leverage: localize('Up to 1:100'),
                regulator: localize('Labuan Financial Services Authority'),
                regulator_description: localize('Regulator/External dispute resolution'),
                regulator_license: localize('(License no. MB/18/0024)'),
                spread: localize('0.6 pips'),
            };
        case MARKET_TYPE_SHORTCODE.FINANCIAL_MALTAINVEST:
            return {
                ...cfdConfig(localize),
                counterparty_company: localize('Deriv Investments (Europe) Limited'),
                jurisdiction: localize('Malta'),
                leverage: localize('Up to 1:30'),
                regulator: localize('Financial Commission'),
                regulator_description: '',
                regulator_license: localize(
                    'Regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156)'
                ),
            };
        case MARKET_TYPE_SHORTCODE.ALL_ZERO_SPREAD_BVI:
            return {
                ...cfdConfig(localize),
                counterparty_company: localize('Deriv (BVI) Ltd'),
                jurisdiction: localize('British Virgin Islands'),
                regulator: localize('British Virgin Islands Financial Services Commission'),
                regulator_license: localize('(License no. SIBA/L/18/1114)'),
                spread: localize('0.0 pips'),
            };
        case MARKET_TYPE_SHORTCODE.ALL_DXTRADE:
        case MARKET_TYPE_SHORTCODE.ALL_SVG:
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_SVG:
        case MARKET_TYPE_SHORTCODE.FINANCIAL_SVG:
        default:
            return cfdConfig(localize);
    }
};

const acknowledgedStatus = ['pending', 'verified'];

const getPoiAcknowledgedForMaltainvest = (authenticationInfo?: THooks.Authentication) => {
    const services = authenticationInfo?.identity?.services ?? {};
    const { manual: { status: manualStatus } = {}, onfido: { status: onfidoStatus } = {} } = services;

    return [onfidoStatus, manualStatus].some(status => acknowledgedStatus.includes(status ?? ''));
};

const getPoiAcknowledgedForBviLabuanVanuatu = (authenticationInfo?: THooks.Authentication) => {
    const services = authenticationInfo?.identity?.services ?? {};
    const riskClassification = authenticationInfo?.risk_classification ?? '';
    const {
        idv: { status: idvStatus } = {},
        manual: { status: manualStatus } = {},
        onfido: { status: onfidoStatus } = {},
    } = services;

    if (riskClassification === 'high') {
        return Boolean(onfidoStatus && acknowledgedStatus.includes(onfidoStatus));
    }
    return [idvStatus, onfidoStatus, manualStatus].some(status => acknowledgedStatus.includes(status ?? ''));
};

const shouldRestrictBviAccountCreation = (mt5Accounts: THooks.MT5AccountsList[]) =>
    !!mt5Accounts.filter(item => item?.landing_company_short === 'bvi' && item?.status === 'poa_failed').length;

const shouldRestrictVanuatuAccountCreation = (mt5Accounts: THooks.MT5AccountsList[]) =>
    !!mt5Accounts.filter(item => item?.landing_company_short === 'vanuatu' && item?.status === 'poa_failed').length;

const getAccountVerificationStatus = (
    shortCode: THooks.AvailableMT5Accounts['shortcode'],
    shouldRestrictBviAccountCreation: boolean,
    shouldRestrictVanuatuAccountCreation: boolean,
    hasSubmittedPersonalDetails: boolean,
    authenticationInfo?: THooks.Authentication,
    isDemo?: boolean
) => {
    const {
        has_poa_been_attempted: hasPoaBeenAttempted,
        has_poi_been_attempted: hasPoiBeenAttempted,
        poa_status: poaStatus,
    } = authenticationInfo || {};
    const poiOrPoaNotSubmitted = !hasPoaBeenAttempted || !hasPoiBeenAttempted;
    const poaAcknowledged = acknowledgedStatus.includes(poaStatus ?? '');

    const poiAcknowledgedForMaltainvest = getPoiAcknowledgedForMaltainvest(authenticationInfo);
    const poiAcknowledgedForBviLabuanVanuatu = getPoiAcknowledgedForBviLabuanVanuatu(authenticationInfo);

    if (shortCode === JURISDICTION.SVG) {
        return true;
    }
    if (shortCode === JURISDICTION.BVI) {
        return (
            poiAcknowledgedForBviLabuanVanuatu &&
            !poiOrPoaNotSubmitted &&
            !shouldRestrictBviAccountCreation &&
            hasSubmittedPersonalDetails &&
            poaAcknowledged
        );
    }
    if (shortCode === JURISDICTION.VANUATU) {
        return (
            poiAcknowledgedForBviLabuanVanuatu &&
            !poiOrPoaNotSubmitted &&
            !shouldRestrictVanuatuAccountCreation &&
            hasSubmittedPersonalDetails &&
            poaAcknowledged
        );
    }
    if (shortCode === JURISDICTION.LABUAN) {
        return poiAcknowledgedForBviLabuanVanuatu && poaAcknowledged && hasSubmittedPersonalDetails;
    }
    if (shortCode === JURISDICTION.MALTAINVEST) {
        return (poiAcknowledgedForMaltainvest && poaAcknowledged) || isDemo;
    }
};

const isMt5AccountAdded = (
    list: THooks.MT5AccountsList[],
    marketType: TMarketTypes,
    companyShortCode: string,
    isDemo?: boolean
) =>
    list.some(item => {
        const currentAccountType = isDemo ? 'demo' : 'real';
        return (
            item.account_type === currentAccountType &&
            item.market_type === marketType &&
            item.landing_company_short === companyShortCode &&
            item.platform === CFD_PLATFORMS.MT5
        );
    });

const isDxtradeAccountAdded = (list: THooks.DxtradeAccountsList[], isDemo?: boolean) =>
    list.some(item => {
        const currentAccountType = isDemo ? 'demo' : 'real';
        return item.account_type === currentAccountType && item.platform === CFD_PLATFORMS.DXTRADE;
    });

const isCTraderAccountAdded = (list: THooks.CtraderAccountsList[], isDemo?: boolean) =>
    list.some(item => {
        const currentAccountType = isDemo ? 'demo' : 'real';
        return item.account_type === currentAccountType && item.platform === CFD_PLATFORMS.CTRADER;
    });

export {
    getAccountVerificationStatus,
    getHighlightedIconLabel,
    getJurisdictionDescription,
    getPlatformType,
    isCTraderAccountAdded,
    isDxtradeAccountAdded,
    isMt5AccountAdded,
    shouldRestrictBviAccountCreation,
    shouldRestrictVanuatuAccountCreation,
};
