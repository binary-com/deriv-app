import { TMarketTypes, TMT5LandingCompanyName, TWalletLandingCompanyName } from '../hooks/types';

export const walletIconMapper = {
    AUD: {
        dark: 'IcWalletCurrencyAud',
        light: 'IcWalletCurrencyAud',
    },
    BTC: {
        dark: 'IcWalletBitcoinDark',
        light: 'IcWalletBitcoinLight',
    },
    Demo: {
        dark: 'IcWalletDerivDemoDark',
        light: 'IcWalletDerivDemoLight',
    },
    ETH: {
        dark: 'IcWalletEthereumDark',
        light: 'IcWalletEthereumLight',
    },
    EUR: {
        dark: 'IcWalletCurrencyEur',
        light: 'IcWalletCurrencyEur',
    },
    eUST: {
        dark: 'IcWalletTetherDark',
        light: 'IcWalletTetherLight',
    },
    GBP: {
        dark: 'IcWalletCurrencyGbp',
        light: 'IcWalletCurrencyGbp',
    },
    LTC: {
        dark: 'IcWalletLiteCoinDark',
        light: 'IcWalletLiteCoinLight',
    },
    tUST: {
        dark: 'IcWalletTetherDark',
        light: 'IcWalletTetherLight',
    },
    USD: {
        dark: 'IcWalletCurrencyUsd',
        light: 'IcWalletCurrencyUsd',
    },
    USDC: {
        dark: 'IcWalletUsdCoinDark',
        light: 'IcWalletUsdCoinLight',
    },
    UST: {
        dark: 'IcWalletTetherDark',
        light: 'IcWalletTetherLight',
    },
} as const;

type TDefinedMT5LandingCompanyName = Exclude<TMT5LandingCompanyName, 'malta' | 'seychelles' | undefined>;

interface TDefinedMT5LandingCompanyDetails {
    name: TDefinedMT5LandingCompanyName;
    shortcode: string;
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

interface TWalletLandingCompanyDetails {
    icon: {
        dark: string;
        light: string;
    };
    name: TWalletLandingCompanyName;
    title: string;
}

interface TMT5MarketTypeDetails {
    icon?: {
        dark: string;
        light: string;
    };
    landingCompany?: Record<TWalletLandingCompanyName, TWalletLandingCompanyDetails>;
    name: TMarketTypes.All;
    title: string;
}

export const MT5MarketTypeDetails: Record<TMarketTypes.All, TMT5MarketTypeDetails> = {
    all: {
        icon: {
            dark: 'IcWalletMt5All',
            light: 'IcWalletMt5All',
        },
        name: 'all',
        title: 'MT5 Swap-Free',
    },
    financial: {
        landingCompany: {
            malta: {
                icon: {
                    dark: 'IcWalletMt5CFDs',
                    light: 'IcWalletMt5CFDs',
                },
                name: 'malta',
                title: 'MT5 CFDs',
            },
            svg: {
                icon: {
                    dark: 'IcWalletMt5Financial',
                    light: 'IcWalletMt5Financial',
                },
                name: 'svg',
                title: 'MT5 Financial',
            },
            virtual: {
                icon: {
                    dark: 'IcWalletMt5Financial',
                    light: 'IcWalletMt5Financial',
                },
                name: 'virtual',
                title: 'MT5 CFDs',
            },
        },
        name: 'financial',
        title: 'MT5 Financial',
    },
    synthetic: {
        icon: {
            dark: 'IcWalletMt5Derived',
            light: 'IcWalletMt5Derived',
        },
        name: 'synthetic',
        title: 'MT5 Derived',
    },
} as const;

export const PlatformDetails = {
    binary: {
        icon: {
            dark: 'IcWalletOptionsDark',
            light: 'IcWalletOptionsLight',
        },
        name: 'binary',
        title: 'BinaryBot',
    },
    ctrader: {
        icon: {
            dark: 'IcWalletCTrader',
            light: 'IcWalletCTrader',
        },
        name: 'ctrader',
        title: 'Deriv cTrader',
    },
    derivez: {
        icon: {
            dark: 'IcWalletDerivEZ',
            light: 'IcWalletDerivEZ',
        },
        name: 'derivez',
        title: 'DerivEZ',
    },
    dxtrade: {
        icon: {
            dark: 'IcWalletDerivX',
            light: 'IcWalletDerivX',
        },
        name: 'dxtrade',
        title: 'Deriv X',
    },
    mt5: {
        marketType: { ...MT5MarketTypeDetails },
        name: 'mt5',
        title: 'Deriv MT5',
    },
    standard: {
        icon: {
            dark: 'IcWalletOptionsDark',
            light: 'IcWalletOptionsLight',
        },
        name: 'standard',
        title: 'Deriv Apps',
    },
} as const;
