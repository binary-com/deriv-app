import { localize } from '@deriv-com/translations';
import {
    TMarketTypes,
    TMT5LandingCompanyName,
    TProductForMarketDetails,
    TWalletLandingCompanyName,
} from '../../../types';

type TDefinedMT5LandingCompanyName = Exclude<TMT5LandingCompanyName, 'malta' | 'seychelles' | undefined>;

interface TDefinedMT5LandingCompanyDetails {
    name: TDefinedMT5LandingCompanyName;
    shortcode: string;
}

interface TMT5MarketTypeDetails extends TMT5MarketTypeDetailsCommon {
    landingCompany?: Record<TWalletLandingCompanyName, TWalletLandingCompanyDetails>;
    product?: Record<TProductForMarketDetails, TMT5MarketTypeDetailsCommon>;
}

interface TMT5MarketTypeDetailsCommon {
    name: TMarketTypes.All;
    title: string;
}

interface TWalletLandingCompanyDetails {
    name: TWalletLandingCompanyName;
    title: string;
}

export const LandingCompanyDetails: Record<TDefinedMT5LandingCompanyName, TDefinedMT5LandingCompanyDetails> = {
    bvi: {
        name: 'bvi',
        shortcode: 'BVI',
    },
    labuan: {
        name: 'labuan',
        shortcode: 'Labuan',
    },
    maltainvest: {
        name: 'maltainvest',
        shortcode: 'Maltainvest',
    },
    svg: {
        name: 'svg',
        shortcode: 'SVG',
    },
    vanuatu: {
        name: 'vanuatu',
        shortcode: 'Vanuatu',
    },
} as const;

export const MT5MarketTypeDetails: Record<TMarketTypes.All, TMT5MarketTypeDetails> = {
    all: {
        name: 'all',
        product: {
            swap_free: {
                name: 'all',
                title: 'MT5 Swap-Free',
            },
            zero_spread: {
                name: 'all',
                title: 'MT5 Zero Spread',
            },
        },
        title: 'MT5 Swap-Free',
    },
    financial: {
        landingCompany: {
            malta: {
                name: 'malta',
                title: 'MT5 CFDs',
            },
            svg: {
                name: 'svg',
                title: 'MT5 Financial',
            },
            virtual: {
                name: 'virtual',
                title: 'MT5 CFDs',
            },
        },
        name: 'financial',
        title: 'MT5 Financial',
    },
    synthetic: {
        name: 'synthetic',
        title: 'MT5 Standard',
    },
} as const;

export const PlatformDetails = {
    ctrader: {
        name: 'ctrader',
        title: 'Deriv cTrader',
    },
    derivez: {
        name: 'derivez',
        title: 'DerivEZ',
    },
    dxtrade: {
        name: 'dxtrade',
        title: 'Deriv X',
    },
    mt5: {
        marketType: { ...MT5MarketTypeDetails },
        name: 'mt5',
        title: 'Deriv MT5',
    },
    standard: {
        name: 'standard',
        title: localize('Options'),
    },
} as const;
