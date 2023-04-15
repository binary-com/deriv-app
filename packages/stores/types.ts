import type {
    Authorize,
    DetailsOfEachMT5Loginid,
    GetAccountStatus,
    GetLimits,
    LogOutResponse,
    GetSettings,
    ResidenceList,
    LandingCompany,
    StatesList,
} from '@deriv/api-types';
import type { ElementType } from 'react';

import type { RouteComponentProps } from 'react-router';

type TAccount = NonNullable<Authorize['account_list']>[0];

type TAccountsList = {
    account?: {
        balance?: string | number;
        currency?: string;
        disabled?: boolean;
        error?: JSX.Element | string;
        is_crypto?: boolean;
        is_dxtrade?: boolean;
        is_mt?: boolean;
        market_type?: string;
        nativepicker_text?: string;
        platform_icon?: {
            Derived: React.SVGAttributes<SVGElement>;
            Financial: React.SVGAttributes<SVGElement>;
            Options: React.SVGAttributes<SVGElement>;
            CFDs: React.SVGAttributes<SVGAElement>;
        };
        text?: JSX.Element | string;
        value?: string;
    };
    icon?: string;
    idx?: string | number;
    is_dark_mode_on?: boolean;
    is_virtual?: boolean | number;
    loginid?: string;
    mt5_login_list?: DetailsOfEachMT5Loginid[];
    title?: string;
}[];

// balance is missing in @deriv/api-types
type TActiveAccount = TAccount & {
    balance?: number;
    landing_company_shortcode: 'svg' | 'costarica' | 'maltainvest' | 'malta' | 'iom';
    is_virtual: number;
};

type TAuthenticationStatus = { document_status: string; identity_status: string };

type TMenuItem = {
    icon: JSX.Element;
    id: string;
    link_to: string | boolean;
    login_only: boolean;
    onClick: boolean | (() => void);
    text: () => string;
};

type TButtonProps = {
    onClick: () => void;
    text: string;
};

type TNotificationMessage = {
    action?: {
        onClick: () => void;
        route?: string;
        text: string;
    };
    className?: string;
    cta_btn?: TButtonProps;
    header_popup?: string;
    header: string;
    img_alt?: string;
    img_src?: string;
    is_disposable?: boolean;
    is_persistent?: boolean;
    key: string;
    message_popup?: string;
    message: string | JSX.Element;
    platform?: string;
    primary_btn?: TButtonProps;
    secondary_btn?: TButtonProps;
    should_hide_close_btn?: boolean;
    timeout?: number;
    timeoutMessage?: (remaining: number | string) => string;
    type: string;
};

type TNotification =
    | TNotificationMessage
    | ((withdrawal_locked: boolean, deposit_locked: boolean) => TNotificationMessage)
    | ((excluded_until: number) => TNotificationMessage);

type TStandPoint = {
    financial_company: string;
    gaming_company: string;
    iom: boolean;
    malta: boolean;
    maltainvest: boolean;
    svg: boolean;
};

type TMt5StatusServerType = {
    all: number;
    platform: number;
    server_number: number;
    deposits?: number;
    withdrawals?: number;
};

type TDXTraderStatusServerType = Record<'all' | 'demo' | 'real', number>;

type TMt5StatusServer = Record<'demo' | 'real', TMt5StatusServerType[]>;

type TClientStore = {
    accounts: { [k: string]: TAccount };
    active_accounts: TActiveAccount[];
    active_account_landing_company: string;
    account_limits: {
        daily_transfers?: {
            [k: string]: {
                allowed: boolean;
                available: boolean;
            };
        };
    };
    account_list: TAccountsList;
    account_status: GetAccountStatus;
    available_crypto_currencies: string[];
    balance?: string | number;
    can_change_fiat_currency: boolean;
    cfd_score: number;
    setCFDScore: (score: number) => void;
    currency: string;
    current_currency_type?: string;
    current_fiat_currency?: string;
    getLimits: () => { get_limits?: GetLimits };
    has_active_real_account: boolean;
    has_logged_out: boolean;
    has_maltainvest_account: boolean;
    initialized_broadcast: boolean;
    is_account_setting_loaded: boolean;
    is_deposit_lock: boolean;
    is_dxtrade_allowed: boolean;
    is_eu_country: boolean;
    is_eu: boolean;
    is_uk: boolean;
    is_financial_account: boolean;
    is_financial_information_incomplete: boolean;
    is_identity_verification_needed: boolean;
    is_landing_company_loaded: boolean;
    is_logged_in: boolean;
    is_logging_in: boolean;
    is_pending_proof_of_ownership: boolean;
    is_switching: boolean;
    is_tnc_needed: boolean;
    is_trading_experience_incomplete: boolean;
    is_virtual: boolean;
    is_withdrawal_lock: boolean;
    landing_company_shortcode: string;
    local_currency_config: {
        currency: string;
        decimal_places?: number;
    };
    loginid?: string;
    pre_switch_broadcast: boolean;
    residence: string;
    responseMt5LoginList: ({
        mt5_login_list,
    }: {
        mt5_login_list: DetailsOfEachMT5Loginid[];
    }) => DetailsOfEachMT5Loginid[];
    responseTradingPlatformAccountsList: ({
        trading_platform_accounts,
    }: {
        trading_platform_accounts: DetailsOfEachMT5Loginid[];
    }) => DetailsOfEachMT5Loginid[];
    standpoint: TStandPoint;
    setAccountStatus: (status?: GetAccountStatus) => void;
    setBalanceOtherAccounts: (balance: number) => void;
    setInitialized: (status?: boolean) => void;
    setLogout: (status?: boolean) => void;
    setP2pAdvertiserInfo: () => void;
    setPreSwitchAccount: (status?: boolean) => void;
    switchAccount: (value?: string) => void;
    switched: boolean;
    switch_broadcast: boolean;
    switchEndSignal: () => void;
    verification_code: {
        payment_agent_withdraw: string;
        payment_withdraw: string;
        request_email: string;
        reset_password: string;
        signup: string;
        system_email_change: string;
        trading_platform_dxtrade_password_reset: string;
        trading_platform_mt5_password_reset: string;
    };
    website_status: { mt5_status: TMt5StatusServer; dx_trade_status: TDXTraderStatusServerType };
    email: string;
    setVerificationCode: (code: string, action: string) => void;
    updateAccountStatus: () => Promise<void>;
    is_authentication_needed: boolean;
    authentication_status: TAuthenticationStatus;
    mt5_login_list: DetailsOfEachMT5Loginid[];
    logout: () => Promise<LogOutResponse>;
    should_allow_authentication: boolean;
    is_crypto: boolean;
    isEligibleForMoreDemoMt5Svg: (market_type: 'synthetic' | 'financial') => boolean;
    isEligibleForMoreRealMt5: (market_type: 'synthetic' | 'financial') => boolean;
    fetchResidenceList?: () => void;
    account_settings: GetSettings & {
        upload_file?: string;
        poi_state?: string;
    };
    residence_list: ResidenceList;
    is_high_risk: boolean;
    should_restrict_bvi_account_creation: boolean;
    should_restrict_vanuatu_account_creation: boolean;
    trading_platform_available_accounts: {
        market_type: 'financial' | 'gaming';
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
    }[];
    updateMT5Status: () => void;
    fetchAccountSettings: () => void;
    setAccountSettings: (get_settings_response: GetSettings) => void;
    upgradeable_landing_companies: unknown[];
    is_populating_mt5_account_list: boolean;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    landing_companies: Record<string, any>;
    getChangeableFields: () => string[];
    landing_company: LandingCompany;
    isAccountOfTypeDisabled: (account: Record<string, DetailsOfEachMT5Loginid>) => boolean;
    is_mt5_allowed: boolean;
    mt5_disabled_signup_types: {
        real: boolean;
        demo: boolean;
    };
    dxtrade_disabled_signup_types: {
        real: boolean;
        demo: boolean;
    };
    dxtrade_accounts_list_error: null;
    has_account_error_in_mt5_real_list: boolean;
    has_account_error_in_mt5_demo_list: boolean;
    has_account_error_in_dxtrade_real_list: boolean;
    has_account_error_in_dxtrade_demo_list: boolean;
    real_account_creation_unlock_date: string;
    is_fully_authenticated: boolean;
    states_list: StatesList;
    fetchStatesList: () => void;
};

type TCommonStoreError = {
    app_routing_history: unknown[];
    header: string | JSX.Element;
    message: string | JSX.Element;
    redirect_label: string;
    redirect_to: string;
    redirectOnClick: () => void;
    setError: (has_error: boolean, error: React.ReactNode | null) => void;
    should_clear_error_on_click: boolean;
    should_show_refresh: boolean;
    type?: string;
};

type TCommonStore = {
    error: TCommonStoreError;
    has_error: boolean;
    is_from_derivgo: boolean;
    is_network_online: boolean;
    platform: string;
    routeBackInApp: (history: Pick<RouteComponentProps, 'history'>, additional_platform_path?: string[]) => void;
    routeTo: (pathname: string) => void;
    changeCurrentLanguage: (new_language: string) => void;
    changeSelectedLanguage: (key: string) => void;
    current_language: string;
    is_language_changing: boolean;
    setAppstorePlatform: (value: string) => void;
    app_routing_history: unknown[];
};

type TUiStore = {
    app_contents_scroll_ref: React.MutableRefObject<null | HTMLDivElement>;
    current_focus: string | null;
    disableApp: () => void;
    enableApp: () => void;
    has_real_account_signup_ended: boolean;
    is_cashier_visible: boolean;
    is_closing_create_real_account_modal: boolean;
    is_dark_mode_on: boolean;
    is_language_settings_modal_on: boolean;
    is_mobile: boolean;
    notification_messages_ui: ElementType;
    openRealAccountSignup: (value: string) => void;
    setCurrentFocus: (value: string) => void;
    setDarkMode: (is_dark_mode_on: boolean) => boolean;
    setIsClosingCreateRealAccountModal: (value: boolean) => void;
    setRealAccountSignupEnd: (status: boolean) => void;
    sub_section_index: number;
    setSubSectionIndex: (index: number) => void;
    shouldNavigateAfterChooseCrypto: (value: string) => void;
    toggleAccountsDialog: () => void;
    toggleCashier: () => void;
    toggleLanguageSettingsModal: () => void;
    toggleReadyToDepositModal: () => void;
    toggleSetCurrencyModal: () => void;
    is_ready_to_deposit_modal_visible: boolean;
    is_need_real_account_for_cashier_modal_visible: boolean;
    toggleNeedRealAccountForCashierModal: () => void;
    setIsAcuityModalOpen: (value: boolean) => void;
    is_switch_to_deriv_account_modal_visible: boolean;
    openSwitchToRealAccountModal: () => void;
    openDerivRealAccountNeededModal: () => void;
    is_top_up_virtual_open: boolean;
    is_top_up_virtual_in_progress: boolean;
    is_top_up_virtual_success: boolean;
    closeSuccessTopUpModal: () => void;
    closeTopUpModal: () => void;
    is_cfd_reset_password_modal_enabled: boolean;
    setCFDPasswordResetModal: (value: boolean) => void;
    openAccountNeededModal: () => void;
    is_accounts_switcher_on: boolean;
    openTopUpModal: () => void;
    toggleShouldShowRealAccountsList: () => void;
    is_reset_trading_password_modal_visible: boolean;
    setResetTradingPasswordModalOpen: () => void;
    setShouldShowCooldownModal: (value: boolean) => void;
};

type TMenuStore = {
    attach: (item: TMenuItem) => void;
    update: (menu: TMenuItem, index: number) => void;
};

type TNotificationStore = {
    addNotificationMessage: (message: TNotification) => void;
    addNotificationMessageByKey: (key: string) => void;
    client_notifications: object;
    filterNotificationMessages: () => void;
    refreshNotifications: () => void;
    removeNotificationByKey: (obj: { key: string }) => void;
    removeNotificationMessage: (obj: { key: string; should_show_again?: boolean }) => void;
    setP2POrderProps: () => void;
    showAccountSwitchToRealNotification: (loginid: string, currency: string) => void;
    setP2PRedirectTo: () => void;
};

type TTradersHubStore = {
    closeModal: () => void;
    content_flag: 'low_risk_cr_eu' | 'low_risk_cr_non_eu' | 'high_risk_cr' | 'cr_demo' | 'eu_demo' | 'eu_real' | '';
    combined_cfd_mt5_accounts: DetailsOfEachMT5Loginid &
        {
            short_code_and_region: string;
            login: string;
            sub_title: string;
            icon: 'Derived' | 'Financial' | 'Options' | 'CFDs';
        }[];
    openModal: (modal_id: string, props?: unknown) => void;
    selected_account: {
        login: string;
        account_id: string;
    };
    is_low_risk_cr_eu_real: boolean;
    is_eu_user: boolean;
    show_eu_related_content: boolean;
    is_real: boolean;
    selectRegion: (region: string) => void;
    no_CR_account: boolean;
    financial_restricted_countries: string[];
    no_MF_account: boolean;
};

/**
 * This is the type that contains all the `core` package stores
 */
export type TCoreStores = {
    client: TClientStore;
    common: TCommonStore;
    menu: TMenuStore;
    ui: TUiStore;
    // This should be `any` as this property will be handled in each package.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modules: any;
    notifications: TNotificationStore;
    traders_hub: TTradersHubStore;
};
