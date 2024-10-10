import { DetailsOfEachMT5Loginid, GetAccountStatus, LandingCompany } from '@deriv/api-types';
import { localize } from '@deriv/translations';
import { CFD_PLATFORMS } from '../platform';
import { Jurisdiction, JURISDICTION_MARKET_TYPES } from '../constants';

let CFD_text_translated: { [key: string]: () => void };

export const CFD_text: { [key: string]: string } = {
    dxtrade: 'Deriv X',
    mt5: 'MT5',
    mt5_cfds: 'MT5 CFDs',
    cfd: 'CFDs',
    ctrader: 'Deriv cTrader',
    synthetic: 'Standard',
    synthetic_demo: 'Standard Demo',
    synthetic_bvi: 'Standard BVI',
    synthetic_svg: 'Standard SVG',
    synthetic_v: 'Standard Vanuatu',
    financial: 'Financial',
    financial_demo: 'Financial Demo',
    financial_bvi: 'Financial BVI',
    financial_fx: 'Financial Labuan',
    financial_v: 'Financial Vanuatu',
    financial_svg: 'Financial SVG',
    all_swap_free_demo: 'Swap-Free Demo',
    all_zero_spread_demo: 'Zero Spread Demo',
    all_swap_free_svg: 'Swap-Free SVG',
    all_zero_spread_bvi: 'Zero Spread BVI',
    stp: 'Financial Labuan',
} as const;

export const CFD_PRODUCTS_TITLE = {
    ZEROSPREAD: 'Zero Spread',
    SWAPFREE: 'Swap-Free',
} as const;

export const getMT5Title = (account_type: string) => {
    if (account_type === 'synthetic') {
        return CFD_text.synthetic;
    }
    if (account_type === 'all') {
        return CFD_text.all;
    }
    return CFD_text.financial;
};

type TProduct = 'financial' | 'synthetic' | 'swap_free' | 'zero_spread' | 'cTrader' | 'derivx' | 'stp';
export type TPlatform = 'dxtrade' | 'mt5' | 'ctrader';
type TMarketType = 'financial' | 'synthetic' | 'gaming' | 'all' | undefined;
type TShortcode = 'svg' | 'bvi' | 'labuan' | 'vanuatu' | 'malta' | 'maltainvest';
type TGetAccount = {
    market_type: TMarketType;
    sub_account_type?: TAccount['sub_account_type'];
    platform: TPlatform;
};
type TGetCFDAccountKey = TGetAccount & {
    shortcode?: TShortcode;
    product?: TProduct;
};

export const PRODUCT = {
    SWAPFREE: 'swap_free',
    ZEROSPREAD: 'zero_spread',
    CTRADER: 'ctrader',
    DERIVX: 'derivx',
    STP: 'stp',
    FINANCIAL: 'financial',
    STANDARD: 'standard',
} as const;

// * mt5_login_list returns these:
// market_type: "financial" | "gaming"
// sub_account_type: "financial" | "financial_stp" | "swap_free"
// *
// sub_account_type financial_stp only happens in "financial" market_type
// dxrade and swap_free both have market_type "all" so check for platform is neccessary
export const getCFDAccountKey = ({
    market_type,
    sub_account_type,
    platform,
    shortcode,
    product,
}: TGetCFDAccountKey) => {
    if (platform === CFD_PLATFORMS.MT5 && market_type === 'all') {
        switch (product) {
            case 'swap_free':
                if (shortcode) {
                    return 'all_swap_free_svg';
                }
                return 'all_swap_free_demo';

            case 'zero_spread':
                if (shortcode) {
                    return 'all_zero_spread_bvi';
                }
                return 'all_zero_spread_demo';

            default:
                return 'all_demo';
        }
    }
    if (market_type === 'all') {
        switch (platform) {
            case CFD_PLATFORMS.CTRADER:
                return 'ctrader';
            default:
                return 'dxtrade';
        }
    }

    if (market_type === 'gaming' || market_type === 'synthetic') {
        if (platform === CFD_PLATFORMS.DXTRADE || sub_account_type === 'financial') {
            switch (shortcode) {
                case 'svg':
                    return 'synthetic_svg';
                case 'bvi':
                    return 'synthetic_bvi';
                case 'vanuatu':
                    return 'synthetic_v';
                default:
                    return 'synthetic_demo';
            }
        }
    }
    if (market_type === 'financial') {
        if (product === PRODUCT.STP && sub_account_type === 'financial_stp') {
            return 'stp';
        } else if (platform === CFD_PLATFORMS.DXTRADE || sub_account_type === 'financial') {
            switch (shortcode) {
                case 'svg':
                    return 'financial_svg';
                case 'bvi':
                    return 'financial_bvi';

                case 'vanuatu':
                    return 'financial_v';
                case 'maltainvest':
                    return 'financial';
                default:
                    return 'financial_demo';
            }
        }
    }
    return undefined;
};

/**
 * Generate the enum for API request.
 *
 * @param {string} category [real, demo]
 * @param {string} type [synthetic, financial, financial_stp]
 * @return {string}
 */

type TGetAccountTypeFields = {
    category: 'real' | 'demo';
    type: 'financial' | 'synthetic' | 'all';
};

type TAccountType = {
    account_type: string;
    mt5_account_type?: string;
};

type TAccountTypes = Record<TGetAccountTypeFields['type'], TAccountType>;

type TMapMode = Record<TGetAccountTypeFields['category'], TAccountTypes>;

export const getAccountTypeFields = ({ category, type }: TGetAccountTypeFields) => {
    const map_mode: TMapMode = {
        real: {
            synthetic: {
                account_type: 'gaming',
            },
            financial: {
                account_type: 'financial',
                mt5_account_type: 'financial',
            },
            all: {
                account_type: 'all',
            },
        },
        demo: {
            synthetic: {
                account_type: 'demo',
            },
            financial: {
                account_type: 'demo',
                mt5_account_type: 'financial',
            },
            all: {
                account_type: 'demo',
            },
        },
    };

    return map_mode[category][type];
};

type TGetCFDAccountDisplay = TGetCFDAccountKey & {
    is_eu: boolean;
    is_mt5_trade_modal?: boolean;
    is_transfer_form?: boolean;
};

export const getCFDAccountDisplay = ({
    market_type,
    sub_account_type,
    platform,
    is_eu,
    product,
    shortcode,
    is_mt5_trade_modal,
    is_transfer_form = false,
}: TGetCFDAccountDisplay) => {
    const cfd_account_key = getCFDAccountKey({ market_type, sub_account_type, platform, shortcode, product });
    if (!cfd_account_key) return undefined;

    if (is_mt5_trade_modal && is_eu) {
        switch (cfd_account_key) {
            case 'financial':
                return localize('CFDs');
            case 'financial_demo':
            default:
                return localize('CFDs Demo');
        }
    }

    const cfd_account_display = CFD_text_translated[cfd_account_key]();

    // TODO condition will be changed when card 74063 is merged
    if (market_type === 'synthetic' && platform === CFD_PLATFORMS.DXTRADE) return localize('Synthetic');
    if (market_type === 'all' && platform === CFD_PLATFORMS.DXTRADE && is_transfer_form) return '';
    if (market_type === 'all' && platform === CFD_PLATFORMS.CTRADER && is_transfer_form) return '';
    if (platform === CFD_PLATFORMS.CTRADER) return cfd_account_display;

    return cfd_account_display;
};

type TGetCFDAccount = TGetAccount & {
    is_eu?: boolean;
    is_transfer_form?: boolean;
    product?: TProduct;
};

type TGetMT5Icon = {
    market_type: TMarketType;
    is_eu?: boolean;
};

export const getCFDAccount = ({
    market_type,
    sub_account_type,
    platform,
    is_eu,
    is_transfer_form = false,
    product,
}: TGetCFDAccount) => {
    let cfd_account_key = getCFDAccountKey({ market_type, sub_account_type, platform, product });
    if (!cfd_account_key) return undefined;

    if (cfd_account_key === 'financial_demo' && is_eu) {
        cfd_account_key = 'cfd';
    }

    if (cfd_account_key === 'ctrader' && is_transfer_form) return 'Ctrader';

    return CFD_text[cfd_account_key as keyof typeof CFD_text];
};

export const getMT5Icon = ({ market_type, is_eu }: TGetMT5Icon) => {
    if (market_type === 'all' && !is_eu) return 'SwapFree';
    if (market_type === 'financial' && is_eu) return 'CFDs';
    return market_type;
};

export const setSharedCFDText = (all_shared_CFD_text: { [key: string]: () => void }) => {
    CFD_text_translated = all_shared_CFD_text;
};

type TAccount = DetailsOfEachMT5Loginid & { platform: string; product?: TProduct };
export const getAccountListKey = (account: TAccount, platform: TPlatform, shortcode?: TShortcode) => {
    return `${account.platform || platform}.${account.account_type}.${getCFDAccountKey({
        market_type: account.market_type,
        sub_account_type: account.sub_account_type,
        platform,
        shortcode,
        product: account.product,
    })}@${
        platform === CFD_PLATFORMS.DXTRADE || platform === CFD_PLATFORMS.CTRADER ? account.market_type : account.server
    }`;
};

export const getCFDPlatformLabel = (platform: TPlatform) => {
    switch (platform) {
        case CFD_PLATFORMS.MT5:
            return 'Deriv MT5';
        case CFD_PLATFORMS.DXTRADE:
            return 'Deriv X';
        case CFD_PLATFORMS.CTRADER:
            return 'Deriv cTrader';
        default:
            return '';
    }
};

export const getCFDPlatformNames = (platform: TPlatform) => {
    switch (platform) {
        case CFD_PLATFORMS.MT5:
            return 'MT5';
        case CFD_PLATFORMS.DXTRADE:
            return 'Deriv X';
        case CFD_PLATFORMS.CTRADER:
            return 'cTrader';
        default:
            return '';
    }
};

type TIsLandingCompanyEnabled = {
    landing_companies: LandingCompany;
    platform: TPlatform;
    type: TMarketType | 'financial_stp';
};

export const isLandingCompanyEnabled = ({ landing_companies, platform, type }: TIsLandingCompanyEnabled) => {
    if (platform === CFD_PLATFORMS.MT5) {
        if (type === 'gaming') return !!landing_companies?.mt_gaming_company?.financial;
        if (type === 'financial') return !!landing_companies?.mt_financial_company?.financial;
        if (type === 'financial_stp') return !!landing_companies?.mt_financial_company?.financial_stp;
    } else if (platform === CFD_PLATFORMS.DXTRADE) {
        if (type === 'all') return !!landing_companies?.dxtrade_all_company?.standard;
        if (type === 'gaming') return !!landing_companies?.dxtrade_gaming_company?.standard;
        if (type === 'financial') return !!landing_companies?.dxtrade_financial_company?.standard;
    }
    return false;
};

// Define the AuthenticationStatusInfo type
type TAuthenticationStatusInfo = {
    poa_status?: string;
    poi_status?: string;
    idv_status?: string;
    onfido_status?: string;
    manual_status?: string;
    acknowledged_status: string[];
    poi_acknowledged_for_maltainvest: boolean;
    poi_poa_verified_for_bvi_labuan_vanuatu: boolean;
    poa_acknowledged: boolean;
    poi_poa_verified_for_maltainvest: boolean;
    need_poa_submission: boolean;
    poi_verified_for_maltainvest: boolean;
    poi_acknowledged_for_bvi_labuan_vanuatu: boolean;
    poi_verified_for_bvi_labuan_vanuatu: boolean;
    poa_verified: boolean;
    poi_or_poa_not_submitted: boolean;
    need_poa_resubmission: boolean;
    poi_and_poa_not_submitted: boolean;
    poa_not_submitted: boolean;
    poi_not_submitted: boolean;
    need_poi_for_maltainvest: boolean;
    need_poi_for_bvi_labuan_vanuatu: boolean;
    poi_not_submitted_for_maltainvest: boolean;
    poi_pending_for_bvi_labuan_vanuatu: boolean;
    poi_pending_for_maltainvest: boolean;
    poi_resubmit_for_maltainvest: boolean;
    poi_resubmit_for_bvi_labuan_vanuatu: boolean;
    poa_pending: boolean;
    is_idv_revoked: boolean;
};

export const getAuthenticationStatusInfo = (account_status: GetAccountStatus): TAuthenticationStatusInfo => {
    const risk_classification = account_status?.risk_classification;

    const poa_status: string = account_status?.authentication?.document?.status || '';
    const poi_status: string = account_status?.authentication?.identity?.status || '';

    const services = account_status?.authentication?.identity?.services ?? {};
    const {
        idv: { status: idv_status } = {},
        onfido: { status: onfido_status } = {},
        manual: { status: manual_status } = {},
    } = services;

    const is_idv_revoked = account_status?.status?.includes('idv_revoked');

    const acknowledged_status: string[] = ['pending', 'verified'];
    const failed_cases: string[] = ['rejected', 'expired', 'suspected'];

    const poa_not_submitted: boolean = poa_status === 'none';
    const need_poa_submission = !acknowledged_status.includes(poa_status);
    const need_poa_resubmission: boolean = failed_cases.includes(poa_status);
    const poa_verified: boolean = poa_status === 'verified';
    const poa_pending: boolean = poa_status === 'pending';
    const poa_acknowledged: boolean = acknowledged_status.includes(poa_status);

    const poi_not_submitted: boolean = poi_status === 'none';
    const poi_or_poa_not_submitted: boolean = poa_not_submitted || poi_not_submitted;
    const poi_and_poa_not_submitted: boolean = poa_not_submitted && poi_not_submitted;

    //maltainvest

    // mf = maltainvest: only require onfido and manual
    const mf_jurisdiction_statuses: string[] = [onfido_status, manual_status].filter(
        (status: string | undefined) => status
    ) as string[];
    // bvi_labuan_vanuatu jurisdictions: require idv, onfido and manual
    const bvi_labuan_vanuatu_jurisdiction_statuses: string[] = [idv_status, onfido_status, manual_status].filter(
        status => status
    ) as string[];

    const poi_verified_for_maltainvest: boolean = mf_jurisdiction_statuses.includes('verified');
    const poi_acknowledged_for_maltainvest: boolean = mf_jurisdiction_statuses.some(status =>
        acknowledged_status.includes(status)
    );
    const poi_pending_for_maltainvest: boolean =
        mf_jurisdiction_statuses.some(status => status === 'pending') && !poi_verified_for_maltainvest;

    const need_poi_for_maltainvest = !poi_acknowledged_for_maltainvest;
    const poi_not_submitted_for_maltainvest: boolean = mf_jurisdiction_statuses.every(status => status === 'none');

    const poi_resubmit_for_maltainvest: boolean =
        !poi_pending_for_maltainvest && !poi_not_submitted_for_maltainvest && !poi_verified_for_maltainvest;

    const poi_poa_verified_for_maltainvest = poi_verified_for_maltainvest && poa_verified;

    //bvi-labuan-vanuatu
    let poi_acknowledged_for_bvi_labuan_vanuatu: boolean = bvi_labuan_vanuatu_jurisdiction_statuses.some(status =>
        acknowledged_status.includes(status)
    );
    if (risk_classification === 'high') {
        poi_acknowledged_for_bvi_labuan_vanuatu = Boolean(onfido_status && acknowledged_status.includes(onfido_status));
    } else {
        poi_acknowledged_for_bvi_labuan_vanuatu = bvi_labuan_vanuatu_jurisdiction_statuses.some(status =>
            acknowledged_status.includes(status)
        );
    }
    const need_poi_for_bvi_labuan_vanuatu = !poi_acknowledged_for_bvi_labuan_vanuatu;
    const poi_not_submitted_for_bvi_labuan_vanuatu: boolean = bvi_labuan_vanuatu_jurisdiction_statuses.every(
        status => status === 'none'
    );

    const poi_verified_for_bvi_labuan_vanuatu: boolean = bvi_labuan_vanuatu_jurisdiction_statuses.includes('verified');

    const poi_pending_for_bvi_labuan_vanuatu: boolean =
        bvi_labuan_vanuatu_jurisdiction_statuses.includes('pending') && !poi_verified_for_bvi_labuan_vanuatu;

    const poi_resubmit_for_bvi_labuan_vanuatu: boolean =
        !poi_pending_for_bvi_labuan_vanuatu &&
        !poi_not_submitted_for_bvi_labuan_vanuatu &&
        !poi_verified_for_bvi_labuan_vanuatu;

    const poi_poa_verified_for_bvi_labuan_vanuatu: boolean = poi_verified_for_bvi_labuan_vanuatu && poa_verified;

    return {
        poa_status,
        poi_status,
        idv_status,
        onfido_status,
        manual_status,
        acknowledged_status,
        poi_acknowledged_for_maltainvest,
        poi_poa_verified_for_bvi_labuan_vanuatu,
        poa_acknowledged,
        poi_poa_verified_for_maltainvest,
        need_poa_submission,
        poi_verified_for_maltainvest,
        poi_acknowledged_for_bvi_labuan_vanuatu,
        poi_verified_for_bvi_labuan_vanuatu,
        poa_verified,
        poi_or_poa_not_submitted,
        need_poa_resubmission,
        poi_and_poa_not_submitted,
        poa_not_submitted,
        poi_not_submitted,
        need_poi_for_maltainvest,
        need_poi_for_bvi_labuan_vanuatu,
        poi_not_submitted_for_maltainvest,
        poi_pending_for_bvi_labuan_vanuatu,
        poi_pending_for_maltainvest,
        poi_resubmit_for_maltainvest,
        poi_resubmit_for_bvi_labuan_vanuatu,
        poa_pending,
        is_idv_revoked,
    };
};

export const mt5_community_url =
    'https://community.deriv.com/t/mt5-new-server-name-and-mobile-app-re-login-guide/70617';

export const mt5_help_centre_url = '/help-centre/dmt5/#log-in-to-my-Deriv-MT5-account';

export const getFormattedJurisdictionCode = (jurisdiction_code?: typeof Jurisdiction[keyof typeof Jurisdiction]) => {
    let formatted_label = '';

    switch (jurisdiction_code) {
        case Jurisdiction.SVG:
            formatted_label = localize('SVG');
            break;
        case Jurisdiction.BVI:
            formatted_label = localize('BVI');
            break;
        case Jurisdiction.LABUAN:
            formatted_label = localize('Labuan');
            break;
        case Jurisdiction.VANUATU:
            formatted_label = localize('Vanuatu');
            break;
        case Jurisdiction.MALTA_INVEST:
            formatted_label = localize('Malta');
            break;
        default:
            break;
    }
    return formatted_label;
};

export const getFormattedJurisdictionMarketTypes = (
    jurisdiction_market_type: typeof JURISDICTION_MARKET_TYPES[keyof typeof JURISDICTION_MARKET_TYPES] | TMarketType
) => {
    let formatted_market_type = '';

    switch (jurisdiction_market_type) {
        case 'synthetic': // need to remove this once we have the correct market type from BE
        case JURISDICTION_MARKET_TYPES.DERIVED:
            formatted_market_type = localize('Standard');
            break;
        case JURISDICTION_MARKET_TYPES.FINANCIAL:
            formatted_market_type = localize('Financial');
            break;
        default:
            break;
    }
    return formatted_market_type;
};

type TGetMT5AccountTitle = {
    account_type: typeof JURISDICTION_MARKET_TYPES[keyof typeof JURISDICTION_MARKET_TYPES];
    jurisdiction: typeof Jurisdiction[keyof typeof Jurisdiction];
};

//returns the title for the MT5 account - e.g.  MT5 Financial Vanuatu
export const getMT5AccountTitle = ({ account_type, jurisdiction }: TGetMT5AccountTitle) => {
    return `${getCFDPlatformNames(CFD_PLATFORMS.MT5)} ${getFormattedJurisdictionMarketTypes(
        account_type
    )} ${getFormattedJurisdictionCode(jurisdiction)}`;
};
