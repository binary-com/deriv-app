export const CFD_PLATFORMS = {
    MT5: 'mt5',
    DXTRADE: 'dxtrade',
    CTRADER: 'ctrader',
    CFD: 'cfd',
    CFDS: 'CFDs',
} as const;

export const CATEGORY = {
    DEMO: 'demo',
    REAL: 'real',
} as const;

export const MARKET_TYPE = {
    SYNTHETIC: 'synthetic',
    GAMING: 'gaming',
    FINANCIAL: 'financial',
    ALL: 'all',
} as const;

export const PRODUCT = {
    SWAPFREE: 'swap_free',
    ZEROSPREAD: 'zero_spread',
    CTRADER: 'ctrader',
    DERIVX: 'derivx',
    STP: 'stp',
} as const;

export const MOBILE_PLATFORMS = {
    IOS: 'ios',
    HAUWEI: 'huawei',
    ANDROID: 'android',
} as const;

export const DESKTOP_PLATFORMS = {
    WINDOWS: 'windows',
    LINUX: 'linux',
    MACOS: 'macos',
} as const;

export const REGION = {
    EU: 'EU',
    NON_EU: 'Non-EU',
} as const;

export const JURISDICTION = {
    SVG: 'svg',
    BVI: 'bvi',
    VANUATU: 'vanuatu',
    LABUAN: 'labuan',
    MALTA_INVEST: 'maltainvest',
} as const;

export const MARKET_TYPE_SHORTCODE = {
    SYNTHETIC: 'synthetic',
    GAMING: 'gaming',
    FINANCIAL: 'financial',
    FINANCIAL_LABUAN: 'financial_stp_labuan',
    FINANCIAL_MALTA_INVEST: 'financial_maltainvest',
    ALL_SWAP_FREE_SVG: 'all_swap_free_svg',
    ALL_ZERO_SPREAD_BVI: 'all_zero_spread_bvi',
    ALL_ZS_BVI: 'all_bvi',
    ALL_DXTRADE: 'all_',
} as const;

export const QUERY_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    IDLE: 'idle',
    LOADING: 'loading',
} as const;

export const PASSWORD_TYPE = {
    INVESTOR: 'investor',
} as const;
