import InstrumentsIcons from '../../../../public/images/tradingInstruments';
import { THooks } from '../../../../types';
import { CFD_PLATFORMS, JURISDICTION, MARKET_TYPE, MARKET_TYPE_SHORTCODE, REGION } from './constants';

type THighlightedIconLabel = {
    highlighted: boolean;
    icon: keyof typeof InstrumentsIcons;
    isAsterisk?: boolean;
    text: string;
};

type TMarketTypes = typeof MARKET_TYPE[keyof typeof MARKET_TYPE];
type TPlatforms = typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS];

const getHighlightedIconLabel = (
    platform: TPlatforms,
    marketType?: TMarketTypes,
    shortCode?: string,
    selectedRegion?: string
): THighlightedIconLabel[] => {
    const marketTypeShortCode = marketType?.concat('_', shortCode || '');

    const forexLabel = (() => {
        if (selectedRegion === REGION.EU) {
            return 'Forex';
        } else if (marketTypeShortCode === MARKET_TYPE_SHORTCODE.FINANCIAL_LABUAN) {
            return 'Forex: standard/exotic';
        } else if (
            (platform === CFD_PLATFORMS.MT5 && marketTypeShortCode === MARKET_TYPE_SHORTCODE.ALL_SVG) ||
            platform === CFD_PLATFORMS.CTRADER
        ) {
            return 'Forex: major/minor';
        }
        return 'Forex: standard/micro';
    })();

    switch (marketType) {
        case MARKET_TYPE.SYNTHETIC:
            return [
                { highlighted: false, icon: 'Forex', text: forexLabel },
                { highlighted: false, icon: 'Stocks', text: 'Stocks' },
                { highlighted: false, icon: 'StockIndices', text: 'Stock indices' },
                { highlighted: false, icon: 'Commodities', text: 'Commodities' },
                { highlighted: false, icon: 'Cryptocurrencies', text: 'Cryptocurrencies' },
                { highlighted: false, icon: 'ETF', text: 'ETFs' },
                { highlighted: true, icon: 'Synthetics', text: 'Synthetic indices' },
                { highlighted: true, icon: 'Baskets', text: 'Basket indices' },
                { highlighted: true, icon: 'DerivedFX', text: 'Derived FX' },
            ];
        case MARKET_TYPE.FINANCIAL:
            switch (shortCode) {
                case JURISDICTION.MALTA_INVEST:
                    return [
                        { highlighted: true, icon: 'Forex', text: forexLabel },
                        { highlighted: true, icon: 'Stocks', text: 'Stocks' },
                        { highlighted: true, icon: 'StockIndices', text: 'Stock indices' },
                        { highlighted: true, icon: 'Commodities', text: 'Commodities' },
                        { highlighted: true, icon: 'Cryptocurrencies', text: 'Cryptocurrencies' },
                        { highlighted: true, icon: 'Synthetics', isAsterisk: true, text: 'Synthetic indices' },
                    ];
                case JURISDICTION.LABUAN:
                    return [
                        { highlighted: true, icon: 'Forex', text: forexLabel },
                        { highlighted: false, icon: 'Stocks', text: 'Stocks' },
                        { highlighted: false, icon: 'StockIndices', text: 'Stock indices' },
                        { highlighted: false, icon: 'Commodities', text: 'Commodities' },
                        { highlighted: true, icon: 'Cryptocurrencies', text: 'Cryptocurrencies' },
                        { highlighted: false, icon: 'ETF', text: 'ETFs' },
                        { highlighted: false, icon: 'Synthetics', text: 'Synthetic indices' },
                        { highlighted: false, icon: 'Baskets', text: 'Basket indices' },
                        { highlighted: false, icon: 'DerivedFX', text: 'Derived FX' },
                    ];
                default:
                    return [
                        { highlighted: true, icon: 'Forex', text: forexLabel },
                        { highlighted: true, icon: 'Stocks', text: 'Stocks' },
                        { highlighted: true, icon: 'StockIndices', text: 'Stock indices' },
                        { highlighted: true, icon: 'Commodities', text: 'Commodities' },
                        { highlighted: true, icon: 'Cryptocurrencies', text: 'Cryptocurrencies' },
                        { highlighted: true, icon: 'ETF', text: 'ETFs' },
                        { highlighted: false, icon: 'Synthetics', text: 'Synthetic indices' },
                        { highlighted: false, icon: 'Baskets', text: 'Basket indices' },
                        { highlighted: false, icon: 'DerivedFX', text: 'Derived FX' },
                    ];
            }
        case MARKET_TYPE.ALL:
        default:
            if (platform === CFD_PLATFORMS.MT5) {
                return [
                    { highlighted: true, icon: 'Forex', text: forexLabel },
                    { highlighted: true, icon: 'Stocks', text: 'Stocks' },
                    { highlighted: true, icon: 'StockIndices', text: 'Stock indices' },
                    { highlighted: true, icon: 'Commodities', text: 'Commodities' },
                    { highlighted: true, icon: 'Cryptocurrencies', text: 'Cryptocurrencies' },
                    { highlighted: true, icon: 'ETF', text: 'ETFs' },
                    { highlighted: true, icon: 'Synthetics', text: 'Synthetics indices' },
                    { highlighted: false, icon: 'Baskets', text: 'Basket indices' },
                    { highlighted: false, icon: 'DerivedFX', text: 'Derived FX' },
                ];
            }
            return [
                { highlighted: true, icon: 'Forex', text: forexLabel },
                { highlighted: true, icon: 'Stocks', text: 'Stocks' },
                { highlighted: true, icon: 'StockIndices', text: 'Stock indices' },
                { highlighted: true, icon: 'Commodities', text: 'Commodities' },
                { highlighted: true, icon: 'Cryptocurrencies', text: 'Cryptocurrencies' },
                { highlighted: true, icon: 'ETF', text: 'ETFs' },
                { highlighted: true, icon: 'Synthetics', text: 'Synthetic indices' },
                { highlighted: true, icon: 'Baskets', text: 'Basket indices' },
                { highlighted: true, icon: 'DerivedFX', text: 'Derived FX' },
            ];
    }
};

const getPlatformType = (platform: TPlatforms) => {
    switch (platform) {
        case CFD_PLATFORMS.DXTRADE:
        case CFD_PLATFORMS.CTRADER:
        case CFD_PLATFORMS.CFDS:
            return 'OtherCFDs';
        case CFD_PLATFORMS.MT5:
        default:
            return 'MT5';
    }
};

// Config for different Jurisdictions
const cfdConfig = {
    counterparty_company: 'Deriv (SVG) LLC',
    counterparty_company_description: 'Counterparty company',
    jurisdiction: 'St. Vincent & Grenadines',
    jurisdiction_description: 'Jurisdiction',
    leverage: '1:1000',
    leverage_description: 'Maximum leverage',
    regulator: 'Financial Commission',
    regulator_description: 'Regulator/External dispute resolution',
    regulator_license: '',
    spread: '0.5 pips',
    spread_description: 'Spreads from',
};

// Map the Jurisdictions with the config
const getJurisdictionDescription = (shortcode: string) => {
    switch (shortcode) {
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_BVI:
        case MARKET_TYPE_SHORTCODE.FINANCIAL_BVI:
            return {
                ...cfdConfig,
                counterparty_company: 'Deriv (BVI) Ltd',
                jurisdiction: 'British Virgin Islands',
                regulator: 'British Virgin Islands Financial Services Commission',
                regulator_description: 'Regulator/External dispute resolution',
                regulator_license: '(License no. SIBA/L/18/1114)',
            };
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_VANUATU:
        case MARKET_TYPE_SHORTCODE.FINANCIAL_VANUATU:
            return {
                ...cfdConfig,
                counterparty_company: 'Deriv (V) Ltd',
                jurisdiction: 'Vanuatu',
                regulator: 'Vanuatu Financial Services Commission',
                regulator_description: 'Regulator/External dispute resolution',
                regulator_license: '',
            };
        case MARKET_TYPE_SHORTCODE.FINANCIAL_LABUAN:
            return {
                ...cfdConfig,
                counterparty_company: 'Deriv (FX) Ltd',
                jurisdiction: 'Labuan',
                leverage: '1:100',
                regulator: 'Labuan Financial Services Authority',
                regulator_description: 'Regulator/External dispute resolution',
                regulator_license: '(License no. MB/18/0024)',
            };
        case MARKET_TYPE_SHORTCODE.FINANCIAL_MALTA_INVEST:
            return {
                ...cfdConfig,
                counterparty_company: 'Deriv Investments (Europe) Limited',
                jurisdiction: 'Malta',
                leverage: '1:30',
                regulator: 'Financial Commission',
                regulator_description: '',
                regulator_license: 'Regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156)',
            };
        // Dxtrade
        case MARKET_TYPE_SHORTCODE.ALL_DXTRADE:
        case MARKET_TYPE_SHORTCODE.ALL_SVG:
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_SVG:
        case MARKET_TYPE_SHORTCODE.FINANCIAL_SVG:
        default:
            return cfdConfig;
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
    shortCode: string,
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
    if (shortCode === JURISDICTION.MALTA_INVEST) {
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
