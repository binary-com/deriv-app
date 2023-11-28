export const CFD_PLATFORMS = {
    CFD: 'cfd',
    CFDS: 'CFDs',
    CTRADER: 'ctrader',
    DERIVEZ: 'derivez',
    DXTRADE: 'dxtrade',
    MT5: 'mt5',
} as const;

export const MARKET_TYPE = {
    ALL: 'all',
    FINANCIAL: 'financial',
    SYNTHETIC: 'synthetic',
} as const;

// Get the Account Icons based on the market type
export const accountIcon = {
    [MARKET_TYPE.SYNTHETIC]: 'Derived',
    [MARKET_TYPE.FINANCIAL]: 'Financial',
    [MARKET_TYPE.ALL]: 'SwapFree',
    [CFD_PLATFORMS.DXTRADE]: 'DerivX',
    [CFD_PLATFORMS.CTRADER]: 'CTrader',
    default: 'CFDs',
} as const;

export const MARKET_TYPE_SHORTCODE = {
    ALL_DXTRADE: 'all_',
    ALL_SVG: 'all_svg',
    FINANCIAL_BVI: 'financial_bvi',
    FINANCIAL_LABUAN: 'financial_labuan',
    FINANCIAL_MALTA_INVEST: 'financial_maltainvest',
    FINANCIAL_SVG: 'financial_svg',
    FINANCIAL_VANUATU: 'financial_vanuatu',
    GAMING: 'gaming',
    SYNTHETIC_BVI: 'synthetic_bvi',
    SYNTHETIC_SVG: 'synthetic_svg',
    SYNTHETIC_VANUATU: 'synthetic_vanuatu',
} as const;

export const JURISDICTION = {
    BVI: 'bvi',
    LABUAN: 'labuan',
    MALTA_INVEST: 'maltainvest',
    SVG: 'svg',
    VANUATU: 'vanuatu',
} as const;

export const REGION = {
    EU: 'EU',
    NON_EU: 'Non-EU',
} as const;

export const platformLabel = {
    MT5: 'MT5 Platform',
    OtherCFDs: 'Other CFDs Platform',
};

export const headerColor = {
    MT5: 'blue',
    OtherCFDs: 'green',
};
