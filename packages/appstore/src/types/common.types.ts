import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { useStore } from '@deriv/stores';
import { PlatformIcons } from 'Assets/svgs/trading-platform';
import { RegionAvailability } from 'Constants/platform-config';

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
    ? ElementType
    : never;

export type RequiredAndNotNull<T> = {
    [P in keyof T]-?: Exclude<T[P], null | undefined>;
};

export type TRegionAvailability = 'Non-EU' | 'EU' | 'All';
export type TAccountCategory = 'real' | 'demo';
export type TPlatform = 'dxtrade' | 'mt5' | 'trader' | 'dbot' | 'smarttrader' | 'go' | 'ctrader';

export type TBrandData = {
    name: string;
    icon?: string;
    availability?: TRegionAvailability;
};

export type TBrandConfig = Record<TPlatform, TBrandData>;
export type TMarketType = 'financial' | 'synthetic' | 'all';
export type TVisibilityChecker = (platform: TPlatform) => boolean;

export type TMissingRealAccount = {
    onClickSignup: VoidFunction;
};

export type TMt5StatusServerType = Record<'all' | 'platform' | 'server_number', number>;
export type TMt5StatusServer = Record<TAccountCategory, TMt5StatusServerType[]>;
export type TObjectCFDAccount = { category: string; type: string; set_password?: number; platform?: string };

export type TOpenAccountTransferMeta = {
    category: string;
    type?: string;
};

export type TStandPoint = {
    financial_company: string;
    gaming_company: string;
    maltainvest: boolean;
    svg: boolean;
};

export type TCategotyTypes = Record<TAccountCategory, boolean>;

export type TJurisdictionData = Record<
    'jurisdiction',
    'bvi' | 'labuan' | 'svg' | 'vanuatu' | 'maltainvest' | 'malta' | 'seychelles' | undefined
>;

export type TDetailsOfEachMT5Loginid = DetailsOfEachMT5Loginid & {
    account_id?: string;
    display_login?: string;
    short_code_and_region?: string;
    mt5_acc_auth_status?: string | null;
    selected_mt5_jurisdiction?: TOpenAccountTransferMeta &
        TJurisdictionData & {
            platform?: string;
            product?: string;
        };
    platform?: TPlatform;
    product?: 'swap_free' | 'zero_spread' | 'derivx' | 'ctrader';
    market_type: NonNullable<TTradingPlatformAvailableAccount['market_type']> | TMarketType;
};

export type TTradingPlatformAvailableAccount = {
    market_type: 'financial' | 'gaming' | 'all';
    name: string;
    requirements: {
        after_first_deposit: {
            financial_assessment: string[];
        };
        compliance: {
            mt5: string[];
            tax_information: string[];
        };
        signup: string[];
    };
    shortcode: 'bvi' | 'labuan' | 'svg' | 'vanuatu' | 'maltainvest';
    sub_account_type: string;
    max_count?: number;
    available_count?: number;
};

export type TCFDAccountsProps = {
    isStandardVisible: TVisibilityChecker;
    isFinancialVisible: TVisibilityChecker;
    has_cfd_account_error: (platform: TPlatform) => boolean;
    current_list: Record<string, TDetailsOfEachMT5Loginid>;
    available_accounts: Array<TTradingPlatformAvailableAccount>;
    has_real_account?: boolean;
};

export type TCFDPlatforms = 'Standard' | 'Financial' | 'Deriv X' | 'CFDs';

export type TStaticAccountProps = {
    name: 'Standard' | 'Financial' | 'Deriv X' | 'CFDs';
    description: string;
    is_visible: boolean;
    disabled: boolean;
    platform: TPlatform;
    type: TMarketType;
};

export type TIconTypes =
    | 'Standard'
    | 'Financial'
    | 'DBot'
    | 'Demo'
    | 'DerivGo'
    | 'DerivGoBlack'
    | 'DerivLogo'
    | 'DerivTradingLogo'
    | 'DerivX'
    | 'DropDown'
    | 'DTrader'
    | 'Options'
    | 'SmartTrader'
    | 'SmartTraderBlue'
    | 'CFDs';
export interface AvailableAccount {
    name: string;
    is_item_blurry?: boolean;
    has_applauncher_account?: boolean;
    sub_title?: string;
    description?: string;
    is_visible?: boolean;
    is_disabled?: boolean;
    platform?: TPlatform;
    market_type?: 'all' | 'financial' | 'synthetic';
    icon: keyof typeof PlatformIcons;
    availability: RegionAvailability;
    short_code_and_region?: string;
    login?: string;
}

export type Currency =
    | 'AUD'
    | 'BCH'
    | 'BTC'
    | 'BUSD'
    | 'DAI'
    | 'ETH'
    | 'EURCHECK'
    | 'EUR'
    | 'EURS'
    | 'EUSDT'
    | 'GBP'
    | 'IDK'
    | 'LTC'
    | 'PAX'
    | 'TUSD'
    | 'TUSDT'
    | 'UNKNOWN'
    | 'USD'
    | 'USDC'
    | 'USDK'
    | 'UST'
    | 'VIRTUAL';

export interface AccountListDetail {
    icon: Currency;
    is_disabled: boolean;
    is_virtual: boolean;
    loginid: string;
    title: string;
}

export type TAccountStatus = 'pending' | 'failed' | 'need_verification' | '';
export type TWalletCurrency =
    | Extract<Currency, 'USD' | 'EUR' | 'AUD' | 'BTC' | 'ETH' | 'LTC' | 'USDC'>
    | 'USDT'
    | 'eUSDT'
    | 'tUSDT';
export type TWalletShortcode = Extract<TJurisdictionData['jurisdiction'], 'svg' | 'malta'>;
export type TLinkedTo = {
    loginid?: string;
    platform?: string;
    balance?: string;
    currency?: string;
};

export type TTransferAccount = {
    active_wallet_icon: string | undefined;
    account_type?: 'wallet' | 'trading' | 'dxtrade' | 'mt5' | 'binary' | 'ctrader';
    balance: number;
    currency?: string;
    display_currency_code: string | undefined;
    gradient_class?: `wallet-card__${string}`;
    icon?: string;
    is_demo: boolean;
    loginid?: string;
    mt5_market_type?: 'all' | 'financial' | 'synthetic';
    shortcode: string | undefined;
    type: 'fiat' | 'crypto' | 'demo';
};

export type TMessageItem =
    | {
          variant: 'base';
          key: string;
          type: 'info' | 'error' | 'success';
          message: string | JSX.Element;
      }
    | {
          variant: 'with-action-button';
          onClickHandler: VoidFunction;
          button_label: string;
          key: string;
          type: 'info' | 'error' | 'success';
          message: string | JSX.Element;
      };

export type TWalletButton = {
    name: Parameters<ReturnType<typeof useStore>['traders_hub']['setWalletModalActiveTab']>[0];
    text: string;
    icon: string;
    action: VoidFunction;
};

export type TWalletSteps = {
    handleBack: VoidFunction;
    handleClose: VoidFunction;
    handleNext: VoidFunction;
    is_migrating: boolean;
    upgradeToWallets: (value: boolean) => void;
};

export type TRealWalletsUpgradeSteps = {
    wallet_upgrade_steps: TWalletSteps & {
        current_step: number;
    };
};

export type TTrustpilotWidgetData = {
    stars: number;
    trustScore: number;
    numberOfReviews: string;
    error?: string;
};
