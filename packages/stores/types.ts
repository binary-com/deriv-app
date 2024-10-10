import type { RouteComponentProps } from 'react-router';
import type { Moment } from 'moment';

import type {
    AccountLimitsResponse,
    ActiveSymbols,
    Authorize,
    ContractUpdate,
    ContractUpdateHistory,
    DetailsOfEachMT5Loginid,
    GetAccountStatus,
    GetLimits,
    GetSettings,
    LandingCompany,
    LogOutResponse,
    Portfolio1,
    ProposalOpenContract,
    ResidenceList,
    SetFinancialAssessmentRequest,
    SetFinancialAssessmentResponse,
    StatesList,
    Transaction,
    P2PAdvertiserInformationResponse,
    P2POrderListResponse,
    WebsiteStatus,
    GetSelfExclusion,
} from '@deriv/api-types';

import type { FeatureFlagsStore } from './src/stores';
import { TContractInfo } from '../shared/src/utils/contract';

type TRoutes =
    | '/404'
    | '/account'
    | '/account/trading-assessment'
    | '/account/languages'
    | '/account/financial-assessment'
    | '/account/personal-details'
    | '/account/proof-of-identity'
    | '/account/proof-of-address'
    | '/account/proof-of-ownership'
    | '/account/proof-of-income'
    | '/account/passwords'
    | '/account/passkeys'
    | '/account/closing-account'
    | '/account/deactivate-account'
    | '/account-closed'
    | '/account/account-limits'
    | '/account/connected-apps'
    | '/account/api-token'
    | '/account/login-history'
    | '/account/two-factor-authentication'
    | '/account/self-exclusion'
    | '/settings/account_password'
    | '/settings/apps'
    | '/settings/cashier_password'
    | '/contract/:contract_id'
    | '/settings/exclusion'
    | '/settings/financial'
    | '/settings/history'
    | '/index'
    | '/settings/limits'
    | '/mt5'
    | '/derivx'
    | '/settings/personal'
    | '/reports/positions'
    | '/reports/profit'
    | '/reports'
    | '/'
    | '/dtrader'
    | '/redirect'
    | '/settings'
    | '/reports/statement'
    | '/settings/token'
    | '/bot'
    | '/cashier'
    | '/cashier/deposit'
    | '/cashier/withdrawal'
    | '/cashier/payment-agent'
    | '/cashier/account-transfer'
    | '/cashier/crypto-transactions'
    | '/cashier/on-ramp'
    | '/cashier/p2p'
    | '/cashier/p2p/profile'
    | '/cashier/p2p/verification'
    | '/cashier/payment-agent-transfer'
    | '/endpoint'
    | '/complaints-policy'
    | '/appstore'
    | '/appstore/traders-hub'
    | '/appstore/onboarding'
    | '/wallet'
    | '/wallet/deposit'
    | '/wallet/withdrawal'
    | '/wallet/account-transfer'
    | '/wallet/reset-balance'
    | '/wallet/transactions'
    | '/wallet/on-ramp'
    | '/compare-accounts';

type TPopulateSettingsExtensionsMenuItem = {
    icon: string;
    label: string;
    value: <T extends object>(props: T) => JSX.Element;
};

type TProduct = 'swap_free' | 'zero_spread' | 'ctrader' | 'derivx';

type TRegionAvailability = 'Non-EU' | 'EU' | 'All';

type TIconTypes =
    | 'Derived'
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

type AvailableAccount = {
    name: string;
    is_item_blurry?: boolean;
    has_applauncher_account?: boolean;
    sub_title?: string;
    description?: string;
    is_visible?: boolean;
    is_disabled?: boolean;
    platform?: string;
    market_type?: 'all' | 'financial' | 'synthetic';
    icon: TIconTypes;
    availability: TRegionAvailability;
    short_code_and_region?: string;
    login?: string;
    currency?: string;
    display_balance?: string;
    display_login?: string;
    product?: TProduct;
};

type BrandConfig = {
    name: string;
    icon: TIconTypes;
    availability: TRegionAvailability;
    is_deriv_platform?: boolean;
};

export type TPortfolioPosition = {
    barrier?: number;
    contract_info: ProposalOpenContract &
        Portfolio1 & {
            contract_update?: ContractUpdate;
        };
    current_tick?: number;
    details?: string;
    display_name: string;
    entry_spot?: number;
    high_barrier?: number;
    id?: number;
    indicative: number;
    low_barrier?: number;
    payout?: number;
    purchase?: number;
    reference: number;
    type?: string;
    is_unsupported: boolean;
    contract_update: ProposalOpenContract['limit_order'];
    is_sell_requested: boolean;
    is_valid_to_sell?: boolean;
    profit_loss: number;
    status?: null | string;
};

type TAppRoutingHistory = {
    action: string;
    hash: string;
    key: string;
    pathname: string;
    search: string;
};

type TAccount = NonNullable<Authorize['account_list']>[0] & {
    balance?: number;
    landing_company_shortcode?: 'svg' | 'costarica' | 'maltainvest';
    is_virtual: number;
    account_category?: 'wallet' | 'trading';
};

type TCtraderAccountsList = DetailsOfEachMT5Loginid & {
    display_balance?: string;
    platform?: string;
};

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
            CFDs: React.SVGAttributes<SVGElement>;
        };
        text?: JSX.Element | string;
        value?: string;
    };
    icon?: string;
    idx?: string | number;
    is_dark_mode_on?: boolean;
    is_virtual?: boolean | number;
    is_disabled?: boolean | number;
    loginid?: string;
    trader_accounts_list?: DetailsOfEachMT5Loginid[];
    mt5_login_list?: DetailsOfEachMT5Loginid[];
    title?: string;
}[];

// balance is missing in @deriv/api-types
export type TActiveAccount = TAccount & {
    balance?: string | number;
    landing_company_shortcode: 'svg' | 'costarica' | 'maltainvest';
    is_virtual: number;
    account_category?: 'wallet' | 'trading';
    linked_to?: { loginid: string; platform: string }[];
    token: string;
};

type TTradingPlatformAvailableAccount = {
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
    shortcode?: DetailsOfEachMT5Loginid['landing_company_short'];
    sub_account_type: string;
    max_count?: number;
    available_count?: number;
    product: TProduct;
};

type TAvailableCFDAccounts = {
    availability: 'Non-EU' | 'EU' | 'All';
    description: string;
    icon: 'Derived' | 'Financial' | 'DerivX' | 'SwapFree' | 'CTrader';
    market_type: 'synthetic' | 'financial' | 'all' | 'gaming';
    name: string;
    platform: 'mt5' | 'dxtrade' | 'ctrader';
};

type TAuthenticationStatus = { document_status: string; identity_status: string };

type TAddToastProps = {
    key?: string;
    content: string | React.ReactNode;
    timeout?: number;
    is_bottom?: boolean;
    type?: string;
};

type TButtonProps = {
    onClick: () => void;
    text: string;
};

type TActionProps = TButtonProps & {
    route?: string;
};

type TChartStateChangeOption = {
    indicator_type_name?: string;
    indicators_category_name?: string;
    isClosed?: boolean;
    is_favorite?: boolean;
    is_info_open?: boolean;
    is_open?: boolean;
    chart_type_name?: string;
    search_string?: string;
    symbol?: string;
    symbol_category?: string;
    time_interval_name?: string;
};

type TContentConfig = {
    className?: string;
    label?: string;
    line_style?: string;
    spot_className?: string;
};

type TMarkerContentConfig = TContentConfig & {
    align_label?: string;
    is_value_hidden?: boolean;
    marker_config?: {
        [key: string]: {
            type: string;
            marker_config: {
                ContentComponent: React.ComponentType<TMarkerContentConfig> | string;
                className?: string;
            };
            content_config: TContentConfig;
        };
    };
    spot_epoch?: string;
    spot_count?: number;
    spot_profit?: string;
    spot_value?: string;
    status?: string;
};

export type TNotificationMessage = {
    action?: TActionProps;
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
    message?: string | JSX.Element;
    platform?: string;
    primary_btn?: TButtonProps;
    secondary_btn?: TButtonProps;
    should_hide_close_btn?: boolean;
    should_show_again?: boolean;
    timeout?: number;
    timeoutMessage?: (remaining: number | string) => string;
    type: string;
    only_toast_message?: boolean;
};

type TNotification =
    | TNotificationMessage
    | ((withdrawal_locked: boolean, deposit_locked: boolean) => TNotificationMessage)
    | ((excluded_until: number) => TNotificationMessage);

type LoginParams = {
    acct: string;
    token: string;
    curr: string;
    lang: string;
};

type IncrementedProperties<N extends number> = {
    [K in keyof LoginParams as `${string & K}${N}`]: string;
};

type LoginURLParams<N extends number> = LoginParams & IncrementedProperties<N>;
type TStandPoint = {
    financial_company: string;
    gaming_company: string;
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

type RealAccountSignupSettings = {
    active_modal_index: number;
    current_currency: string;
    error_code?: string;
    error_details?: string | Record<string, string>;
    error_message: string;
    previous_currency: string;
    success_message: string;
};

export type TClientStore = {
    fetchStatesList: () => Promise<StatesList>;
    account_type: string;
    accounts: { [k: string]: TActiveAccount };
    active_accounts: TActiveAccount[];
    active_account_landing_company: string;
    trading_platform_available_accounts: TTradingPlatformAvailableAccount[];
    ctrader_trading_platform_available_accounts: TTradingPlatformAvailableAccount[];
    account_limits: Partial<AccountLimitsResponse['get_limits']> & {
        is_loading?: boolean;
        api_initial_load_error?: string;
    };
    account_list: TAccountsList;
    self_exclusion: Partial<GetSelfExclusion>;
    getSelfExclusion: () => Promise<Partial<GetSelfExclusion>>;
    account_status: Omit<GetAccountStatus, 'status' | 'p2p_poa_required'> &
        Partial<Pick<GetAccountStatus, 'status'>> & { p2p_poa_required: number };
    available_crypto_currencies: Array<WebsiteStatus['currencies_config'][string] & { value: string }>;
    available_onramp_currencies: Array<string>;
    balance?: string | number;
    can_change_fiat_currency: boolean;
    clients_country: string;
    cfd_score: number;
    setCFDScore: (score: number) => void;
    currency: string;
    ctrader_total_balance: number;
    currencies_list: { text: string; value: string; has_tool_tip?: boolean }[];
    current_currency_type?: string;
    current_fiat_currency?: string;
    current_landing_company: {
        support_professional_client?: string;
    };
    email_address: string;
    has_any_real_account: boolean;
    getLimits: () => Promise<{ get_limits?: GetLimits }>;
    getTwoFAStatus: () => Promise<
        | boolean
        | {
              error: {
                  message: string;
              };
          }
    >;
    has_active_real_account: boolean;
    has_cookie_account: boolean;
    has_logged_out: boolean;
    has_maltainvest_account: boolean;
    has_restricted_mt5_account: boolean;
    initialized_broadcast: boolean;
    is_account_setting_loaded: boolean;
    is_deposit_lock: boolean;
    is_duplicate_dob_phone: boolean;
    is_dxtrade_allowed: boolean;
    is_eu_country: boolean;
    is_eu: boolean;
    is_unwelcome: boolean;
    is_single_currency: boolean;
    is_social_signup: boolean;
    has_residence: boolean;
    has_wallet: boolean;
    is_authorize: boolean;
    is_dxtrade_password_not_set: boolean;
    is_financial_account: boolean;
    is_financial_assessment_needed: boolean;
    is_financial_information_incomplete: boolean;
    is_identity_verification_needed: boolean;
    is_landing_company_loaded: boolean;
    is_logged_in: boolean;
    is_logging_in: boolean;
    is_low_risk: boolean;
    is_client_store_initialized: boolean;
    is_mt5_password_not_set: boolean;
    is_mt5_account_list_updated: boolean;
    is_p2p_enabled: boolean;
    is_proof_of_ownership_enabled: boolean;
    is_poa_expired: boolean;
    is_populating_dxtrade_account_list: boolean;
    is_populating_ctrader_account_list: boolean;
    is_switching: boolean;
    is_high_risk: boolean;
    is_trading_experience_incomplete: boolean;
    is_virtual: boolean;
    is_withdrawal_lock: boolean;
    landing_company_shortcode: string;
    is_tradershub_tracking: boolean;
    is_populating_account_list: boolean;
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
    selectCurrency: (currency: string) => void;
    setInitialized: (status?: boolean) => void;
    setIsClientStoreInitialized: () => void;
    setLogout: (status?: boolean) => void;
    setP2pAdvertiserInfo: () => void;
    setPreSwitchAccount: (status?: boolean) => void;
    switchAccount: (value?: string) => Promise<void>;
    setLoginInformation: (client_accounts: { [k: string]: TActiveAccount }, client_id: string) => void;
    social_identity_provider: string;
    switched: boolean;
    switch_broadcast: boolean;
    switchEndSignal: () => void;
    upgradeable_currencies: Array<WebsiteStatus['currencies_config']>;
    verification_code: {
        payment_agent_withdraw: string;
        payment_withdraw: string;
        phone_number_verification: string;
        request_email: string;
        reset_password: string;
        signup: string;
        system_email_change: string;
        trading_platform_dxtrade_password_reset: string;
        trading_platform_mt5_password_reset: string;
    };
    website_status: WebsiteStatus;
    email: string;
    setVerificationCode: (code: string, action: string) => void;
    updateAccountStatus: () => Promise<void>;
    is_authentication_needed: boolean;
    authentication_status: TAuthenticationStatus;
    mt5_login_list: DetailsOfEachMT5Loginid[];
    logout: () => Promise<LogOutResponse>;
    should_allow_authentication: boolean;
    should_allow_poinc_authentication: boolean;
    isEligibleForMoreDemoMt5Svg: (market_type: 'synthetic' | 'financial' | 'gaming' | 'all') => boolean;
    isEligibleForMoreRealMt5: (market_type: 'synthetic' | 'financial' | 'gaming' | 'all') => boolean;
    fetchResidenceList?: () => Promise<void>;
    account_settings: GetSettings & {
        upload_file?: string;
        poi_state?: string;
        tnc_status?: Record<string, number>;
        phone_number_verification?: {
            verified?: 0 | 1;
            next_attempt?: number;
            next_email_attempt?: number;
            next_verify_attempt?: number;
            session_timestamp?: number;
        };
    };
    residence_list: ResidenceList;
    should_restrict_bvi_account_creation: boolean;
    should_restrict_vanuatu_account_creation: boolean;
    updateMT5Status: () => Promise<void>;
    fetchAccountSettings: () => Promise<void>;
    setAccountSettings: (get_settings_response: GetSettings) => void;
    upgradeable_landing_companies: string[];
    is_populating_mt5_account_list: boolean;
    landing_companies: LandingCompany;
    getChangeableFields: () => string[];
    landing_company: LandingCompany;
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
    has_fiat: boolean;
    is_fully_authenticated: boolean;
    updateMt5LoginList: () => Promise<void>;
    states_list: StatesList;
    /** @deprecated Use `useCurrencyConfig` or `useCurrentCurrencyConfig` from `@deriv/hooks` package instead. */
    is_crypto: (currency?: string) => boolean;
    ctrader_accounts_list: TCtraderAccountsList[];
    dxtrade_accounts_list: (DetailsOfEachMT5Loginid & { account_id?: string })[];
    default_currency: string;
    resetVirtualBalance: () => Promise<void>;
    has_enabled_two_fa: boolean;
    setTwoFAStatus: (status: boolean) => void;
    has_changed_two_fa: boolean;
    setTwoFAChangedStatus: (status: boolean) => void;
    is_svg: boolean;
    real_account_creation_unlock_date: string;
    setPrevAccountType: (account_type: string) => void;
    init: (login_new_user?: LoginURLParams<1>) => void;
    setLoginId: (loginid: string) => void;
    resetLocalStorageValues: (loginid: string) => void;
    setFinancialAndTradingAssessment: (
        payload: Omit<SetFinancialAssessmentRequest, 'set_financial_assessment'>
    ) => Promise<SetFinancialAssessmentResponse>;
    setIsAlreadyAttempted: (value: boolean) => void;
    is_already_attempted: boolean;
    is_bot_allowed: boolean;
    prev_account_type: string;
    account_open_date: number | undefined;
    setAccounts: (accounts: Record<string, TActiveAccount>) => void;
    should_show_eu_error: boolean;
    is_options_blocked: boolean;
    setIsP2PEnabled: (is_p2p_enabled: boolean) => void;
    real_account_signup_form_data: Array<Record<string, unknown>>;
    real_account_signup_form_step: number;
    setRealAccountSignupFormData: (data: Array<Record<string, unknown>>) => void;
    setRealAccountSignupFormStep: (step: number) => void;
    wallet_migration_state?: 'ineligible' | 'eligible' | 'in_progress' | 'migrated' | 'failed';
    startWalletMigration: () => void;
    resetWalletMigration: () => void;
    is_wallet_migration_request_is_in_progress: boolean;
    is_passkey_supported: boolean;
    passkeys_list: Array<{
        id: number;
        name: string;
        last_used: number;
        created_at?: number;
        stored_on?: string;
        passkey_id: string;
        icon?: string;
    }>;
    setIsPasskeySupported: (value: boolean) => void;
    is_phone_number_verification_enabled: boolean;
    setIsPhoneNumberVerificationEnabled: (value: boolean) => void;
    setPasskeysStatusToCookie: (status: 'available' | 'not_available') => void;
    should_show_passkey_notification: boolean;
    setShouldShowPasskeyNotification: (value: boolean) => void;
    fetchShouldShowPasskeyNotification: () => void;
    fetchPasskeysList: () => void;
    exchange_rates: Record<string, Record<string, number>>;
    getExchangeRate: (base_currency: string, target_currency: string) => number;
    subscribeToExchangeRate: (base_currency: string, target_currency: string) => Promise<void>;
    unsubscribeFromExchangeRate: (base_currency: string, target_currency: string) => Promise<void>;
    unsubscribeFromAllExchangeRates: () => void;
    virtual_account_loginid?: string;
    is_cr_account: boolean;
    is_mf_account: boolean;
    setTradersHubTracking: (value: boolean) => void;
    account_time_of_closure?: number;
    is_account_to_be_closed_by_residence: boolean;
    should_show_trustpilot_notification: boolean;
};

type TCommonStoreError = {
    header?: string | JSX.Element;
    message: string | JSX.Element;
    redirect_label?: string;
    redirect_to?: string;
    redirectOnClick?: (() => void) | null;
    should_clear_error_on_click?: boolean;
    should_redirect?: boolean;
    should_show_refresh?: boolean;
    setError?: (has_error: boolean, error: React.ReactNode | null) => void;
    type?: string;
};

type TCommonStoreServicesError = {
    code?: string;
    message?: string;
    type?: string;
};

type TCommonStore = {
    isCurrentLanguage(language_code: string): boolean;
    error: TCommonStoreError;
    has_error: boolean;
    is_from_derivgo: boolean;
    is_from_outside_cashier: boolean;
    is_network_online: boolean;
    platform: 'dxtrade' | 'mt5' | 'ctrader' | '';
    routeBackInApp: (history: Pick<RouteComponentProps, 'history'>, additional_platform_path?: string[]) => void;
    routeTo: (pathname: string) => void;
    server_time: Moment;
    changeCurrentLanguage: (new_language: string) => void;
    changeSelectedLanguage: (key: string) => void;
    current_language: string;
    is_language_changing: boolean;
    services_error: TCommonStoreServicesError;
    is_socket_opened: boolean;
    setAppstorePlatform: (value?: string) => void;
    setError?: (has_error: boolean, error: TCommonStoreError) => void;
    setSelectedContractType: (contract_type: string) => void;
    setServicesError: (error: TCommonStoreServicesError, hide_toast: boolean) => void;
    resetServicesError: () => void;
    showError: (error: TCommonStoreError) => void;
    app_routing_history: TAppRoutingHistory[];
    getExchangeRate: (from_currency: string, to_currency: string) => Promise<number>;
    network_status: Record<string, never> | { [key: string]: string };
};

type TUiStore = {
    advanced_duration_unit: string;
    advanced_expiry_type: string;
    addToast: (toast_config: TAddToastProps) => void;
    account_switcher_disabled_message: string;
    app_contents_scroll_ref: React.MutableRefObject<null | HTMLDivElement>;
    current_focus: string | null;
    disableApp: () => void;
    duration_t: number;
    enableApp: () => void;
    getDurationFromUnit: (unit: string) => number;
    has_only_forward_starting_contracts: boolean;
    has_real_account_signup_ended: boolean;
    header_extension: JSX.Element | null;
    is_account_settings_visible: boolean;
    is_account_switcher_disabled: boolean;
    is_additional_kyc_info_modal_open: boolean;
    is_advanced_duration: boolean;
    is_cashier_visible: boolean;
    is_history_tab_active: boolean;
    is_forced_to_exit_pnv: boolean;
    is_phone_verification_completed: boolean;
    is_redirected_from_email: boolean;
    is_wallet_modal_visible: boolean;
    is_chart_asset_info_visible?: boolean;
    is_chart_layout_default: boolean;
    is_chart_countdown_visible: boolean;
    is_closing_create_real_account_modal: boolean;
    is_from_signup_account: boolean;
    is_from_success_deposit_modal: boolean;
    is_kyc_information_submitted_modal_open: boolean;
    is_dark_mode_on: boolean;
    is_loading: boolean;
    is_reports_visible: boolean;
    is_reset_password_modal_visible: boolean;
    is_route_modal_on: boolean;
    is_language_settings_modal_on: boolean;
    is_verification_modal_visible: boolean;
    is_verification_submitted: boolean;
    is_desktop: boolean;
    is_app_disabled: boolean;
    is_link_expired_modal_visible: boolean;
    is_mobile: boolean;
    is_tablet: boolean;
    is_mobile_language_menu_open: boolean;
    is_positions_drawer_on: boolean;
    is_reset_email_modal_visible: boolean;
    is_services_error_visible: boolean;
    is_trading_assessment_for_existing_user_enabled: boolean;
    isUrlUnavailableModalVisible: boolean;
    onChangeUiStore: ({ name, value }: { name: string; value: unknown }) => void;
    openPositionsDrawer: () => void;
    openRealAccountSignup: (
        value: 'maltainvest' | 'svg' | 'add_crypto' | 'choose' | 'add_fiat' | 'set_currency' | 'manage'
    ) => void;
    notification_messages_ui: (props?: {
        is_notification_loaded?: boolean;
        is_mt5?: boolean;
        stopNotificationLoading?: () => void;
        show_trade_notifications?: boolean;
    }) => JSX.Element;
    setChartCountdown: (value: boolean) => void;
    populateFooterExtensions: (
        footer_extensions:
            | [
                  {
                      position?: string;
                      Component?: React.FunctionComponent;
                      has_right_separator?: boolean;
                  }
              ]
            | []
    ) => void;
    resetPurchaseStates: () => void;
    setAppContentsScrollRef: (ref: React.MutableRefObject<null | HTMLDivElement>) => void;
    setCurrentFocus: (value: string | null) => void;
    setDarkMode: (is_dark_mode_on: boolean) => boolean;
    setIsWalletModalVisible: (value: boolean) => void;
    setIsForcedToExitPnv: (value: boolean) => void;
    setIsPhoneVerificationCompleted: (value: boolean) => void;
    setRedirectFromEmail: (value: boolean) => void;
    setHasOnlyForwardingContracts: (has_only_forward_starting_contracts?: boolean) => void;
    setMobileLanguageMenuOpen: (is_mobile_language_menu_open: boolean) => void;
    setReportsTabIndex: (value: number) => void;
    setIsClosingCreateRealAccountModal: (value: boolean) => void;
    setIsFromSignupAccount: (value: boolean) => void;
    setIsVerificationModalVisible: (value: boolean) => void;
    setIsFromSuccessDepositModal: (value: boolean) => void;
    setIsVerificationSubmitted: (value: boolean) => void;
    setIsMT5VerificationFailedModal: (value: boolean) => void;
    setRealAccountSignupEnd: (status: boolean) => void;
    setPurchaseState: (index: number) => void;
    simple_duration_unit: string;
    should_show_phone_number_otp: boolean;
    setShouldShowPhoneNumberOTP: (value: boolean) => void;
    sub_section_index: number;
    setPromptHandler: (
        condition: boolean,
        cb?: (() => void) | ((route_to: RouteComponentProps['location'], action: string) => boolean)
    ) => void;
    setSubSectionIndex: (index: number) => void;
    shouldNavigateAfterChooseCrypto: (value: Omit<string, TRoutes> | TRoutes) => void;
    should_show_real_accounts_list?: boolean;
    toggleAccountsDialog: (value?: boolean) => void;
    toggleAccountSettings: (props?: boolean) => void;
    toggleCashier: () => void;
    toggleHistoryTab: (state_change?: boolean) => void;
    toggleLanguageSettingsModal: () => void;
    toggleLinkExpiredModal: (state_change: boolean) => void;
    togglePositionsDrawer: () => void;
    toggleReadyToDepositModal: () => void;
    toggleResetEmailModal: (state_change: boolean) => void;
    toggleResetPasswordModal: (state_change: boolean) => void;
    toggleServicesErrorModal: (is_visible: boolean) => void;
    toggleSetCurrencyModal: () => void;
    toggleShouldShowRealAccountsList: (value: boolean) => void;
    toggleUrlUnavailableModal: (value: boolean) => void;
    removeToast: (key: string) => void;
    is_ready_to_deposit_modal_visible: boolean;
    reports_route_tab_index: number;
    should_show_cancellation_warning: boolean;
    should_show_one_time_deposit_modal: boolean;
    should_show_account_success_modal: boolean;
    should_trigger_tour_guide: boolean;
    toggleCancellationWarning: (state_change?: boolean) => void;
    toggleReports: (is_visible: boolean) => void;
    is_real_acc_signup_on: boolean;
    is_need_real_account_for_cashier_modal_visible: boolean;
    is_mf_verification_pending_modal_visible: boolean;
    toggleNeedRealAccountForCashierModal: () => void;
    is_switch_to_deriv_account_modal_visible: boolean;
    openSwitchToRealAccountModal: () => void;
    openDerivRealAccountNeededModal: () => void;
    is_top_up_virtual_open: boolean;
    is_top_up_virtual_in_progress: boolean;
    is_top_up_virtual_success: boolean;
    real_account_signup_target: string;
    closeSuccessTopUpModal: () => void;
    closeTopUpModal: () => void;
    is_cfd_reset_password_modal_enabled: boolean;
    is_mt5_migration_modal_enabled: boolean;
    is_mt5_migration_modal_open: boolean;
    setCFDPasswordResetModal: (value: boolean) => void;
    openAccountNeededModal: () => void;
    is_accounts_switcher_on: boolean;
    openTopUpModal: () => void;
    is_reset_trading_password_modal_visible: boolean;
    real_account_signup: RealAccountSignupSettings;
    resetRealAccountSignupParams: () => void;
    setResetTradingPasswordModalOpen: () => void;
    populateHeaderExtensions: (header_items: JSX.Element | null) => void;
    populateSettingsExtensions: (menu_items: Array<TPopulateSettingsExtensionsMenuItem> | null) => void;
    purchase_states: boolean[];
    setShouldShowCooldownModal: (value: boolean) => void;
    setShouldTriggerTourGuide: (value: boolean) => void;
    setShouldShowOneTimeDepositModal: (value: boolean) => void;
    toggleAccountSuccessModal: () => void;
    setIsMFVericationPendingModal: (value: boolean) => void;
    setMT5MigrationModalEnabled: (value: boolean) => void;
    toggleMT5MigrationModal: (value: boolean) => void;
    vanilla_trade_type: 'VANILLALONGCALL' | 'VANILLALONGPUT';
    toggleAdditionalKycInfoModal: () => void;
    toggleKycInformationSubmittedModal: () => void;
    setAccountSwitcherDisabledMessage: (message?: string) => void;
    is_set_currency_modal_visible: boolean;
    should_show_deposit_now_or_later_modal: boolean;
    setShouldShowDepositNowOrLaterModal: (value: boolean) => void;
    should_show_crypto_transaction_processing_modal: boolean;
    setShouldShowCryptoTransactionProcessingModal: (value: boolean) => void;
    is_trading_disabled_by_residence_modal_visible: boolean;
    setIsTradingDisabledByResidenceModal: (value: boolean) => void;
    should_show_same_dob_phone_modal: boolean;
    setShouldShowSameDOBPhoneModal: (value: boolean) => void;
    setHashedValue: (value: string) => void;
    url_hashed_values: string;
    is_tnc_update_modal_open: boolean;
    toggleTncUpdateModal: (value: boolean) => void;
};

type TPortfolioStore = {
    active_positions: TPortfolioPosition[];
    active_positions_count: number;
    all_positions: TPortfolioPosition[];
    barriers: TBarriers;
    error: string;
    getPositionById: (id: number) => TPortfolioPosition;
    is_active_empty: boolean;
    is_loading: boolean;
    is_multiplier: boolean;
    is_accumulator: boolean;
    is_turbos: boolean;
    onBuyResponse: (contract_info: { contract_id: number; longcode: string; contract_type: string }) => void;
    onHoverPosition: (is_over: boolean, position: TPortfolioPosition, underlying: string) => void;
    onClickCancel: (contract_id?: number) => void;
    onClickSell: (contract_id?: number) => void;
    onMount: () => void;
    onUnmount: () => void;
    open_accu_contract: TPortfolioPosition | null;
    positions: TPortfolioPosition[];
    removePositionById: (contract_id?: number) => void;
    setContractType: (contract_type: string) => void;
    setAddNotificationBannerCallback: (
        cb?: (params: { message: string; redirectTo: string; timestamp: number; title: string }, status: string) => void
    ) => void;
};

type TAccumulatorBarriersData = {
    current_spot: number;
    current_spot_time: number;
    tick_update_timestamp: number;
    accumulators_high_barrier: string;
    accumulators_low_barrier: string;
    barrier_spot_distance: string;
    previous_spot_time: number;
};
type TAccumulatorContractBarriersData = TAccumulatorBarriersData & {
    should_update_contract_barriers: boolean;
};
type TAddContractParams = {
    barrier: number | null;
    contract_id: number;
    contract_type: string;
    start_time: number;
    longcode: string;
    underlying: string;
    is_tick_contract: boolean;
    limit_order?: ProposalOpenContract['limit_order'];
};
type TOnChartBarrierChange = null | ((barrier_1: string, barrier_2?: string) => void);
type TOnChangeParams = { high: string | number; low?: string | number; title?: string; hidePriceLines?: boolean };
type TBarriers = Array<{
    color: string;
    lineStyle: string;
    shade?: string;
    shadeColor?: string;
    high?: string | number;
    low?: string | number;
    onChange: (barriers: TOnChangeParams) => void;
    relative: boolean;
    draggable: boolean;
    hidePriceLines: boolean;
    hideBarrierLine?: boolean;
    hideOffscreenLine?: boolean;
    title?: string;
    onChartBarrierChange: TOnChartBarrierChange | null;
    key?: string;
    hideOffscreenBarrier?: boolean;
    isSingleBarrier?: boolean;
    onBarrierChange: (barriers: TOnChangeParams) => void;
    updateBarriers: (
        high: string | number,
        low?: string | number,
        title?: string,
        hidePriceLines?: boolean,
        isFromChart?: boolean
    ) => void;
    updateBarrierShade: (should_display: boolean, contract_type: string) => void;
    barrier_count: number;
    default_shade: string;
}>;
type TContractTradeStore = {
    accountSwitchListener: () => Promise<void>;
    accu_barriers_timeout_id: NodeJS.Timeout | null;
    accumulator_barriers_data: Partial<TAccumulatorBarriersData>;
    accumulator_contract_barriers_data: Partial<TAccumulatorContractBarriersData>;
    addContract: ({
        barrier,
        contract_id,
        contract_type,
        start_time,
        longcode,
        underlying,
        is_tick_contract,
        limit_order,
    }: TAddContractParams) => void;
    chart_type: string;
    clearAccumulatorBarriersData: (should_clear_contract_data_only?: boolean, should_clear_timeout?: boolean) => void;
    clearError: () => void;
    contracts: TContractStore[];
    error_message: string;
    filtered_contracts: TPortfolioPosition[];
    getContractById: (contract_id?: number) => TContractStore;
    granularity: null | number;
    has_crossed_accu_barriers: boolean;
    has_error: boolean;
    last_contract: TContractStore | Record<string, never>;
    markers_array: Array<{
        type: string;
        contract_info: TPortfolioPosition['contract_info'];
        key: string;
        price_array: [string, string];
        epoch_array: [number];
    }>;
    onUnmount: () => void;
    prev_contract: TContractStore | Record<string, never>;
    removeContract: (data: { contract_id: string }) => void;
    saveChartType: (chart_type: string) => void;
    saved_chart_type: string;
    saved_granularity: number | null;
    saveGranularity: (granularity: number | null) => void;
    setChartTypeAndGranularity: any;
    setNewAccumulatorBarriersData: (
        new_barriers_data: TAccumulatorBarriersData,
        should_update_contract_barriers?: boolean
    ) => void;
    updateAccumulatorBarriersData: ({
        accumulators_high_barrier,
        accumulators_low_barrier,
        barrier_spot_distance,
        current_spot,
        current_spot_time,
        should_update_contract_barriers,
        underlying,
    }: Partial<TAccumulatorContractBarriersData & { underlying: string }>) => void;
    updateChartType: (type: string) => void;
    updateGranularity: (granularity: number | null) => void;
    updateProposal: (response: ProposalOpenContract) => void;
};

type TContractStore = {
    clearContractUpdateConfigValues: () => void;
    contract_info: TPortfolioPosition['contract_info'];
    contract_update_history: ContractUpdateHistory;
    contract_update_take_profit: number | string;
    contract_update_stop_loss: number | string;
    digits_info: { [key: number]: { digit: number; spot: string } };
    display_status: string;
    has_contract_update_take_profit: boolean;
    has_contract_update_stop_loss: boolean;
    is_digit_contract: boolean;
    is_ended: boolean;
    onChange: (param: { name: string; value: string | number | boolean }) => void;
    updateLimitOrder: () => void;
    validation_errors: { contract_update_stop_loss: string[]; contract_update_take_profit: string[] };
};

type TNotificationStore = {
    addNotificationMessage: (message: TNotification) => void;
    addNotificationMessageByKey: (key: string) => void;
    addTradeNotification: (contract_info: TContractInfo) => void;
    client_notifications: Record<string, TNotificationMessage>;
    is_notifications_empty: boolean;
    is_notifications_visible: boolean;
    filterNotificationMessages: () => void;
    handleCurrencyRemovalNotification: (
        account_currency_closure_status: Record<string, unknown>,
        currency: string
    ) => void;
    notifications: TNotificationMessage[];
    p2p_advertiser_info: P2PAdvertiserInformationResponse['p2p_advertiser_info'];
    p2p_completed_orders: NonNullable<P2POrderListResponse['p2p_order_list']>['list'];
    refreshNotifications: () => void;
    removeAllNotificationMessages: (should_close_persistent: boolean) => void;
    removeNotifications: (should_close_persistent: boolean) => void;
    removeNotificationByKey: ({ key }: { key: string }) => void;
    removeNotificationMessage: ({ key, should_show_again }: { key: string; should_show_again?: boolean }) => void;
    removeNotificationMessageByKey: ({ key }: { key: string }) => void;
    removeTradeNotifications: (id?: string) => void;
    setP2POrderProps: () => void;
    showPOAAddressMismatchSuccessNotification: () => void;
    showPOAAddressMismatchFailureNotification: () => void;
    setP2PRedirectTo: () => void;
    showAccountSwitchToRealNotification: (loginid: string, currency: string) => void;
    setShouldShowPopups: (should_show_popups: boolean) => void;
    toggleNotificationsModal: () => void;
    trade_notifications: Array<{
        buy_price: number;
        contract_id: number;
        currency: string;
        contract_type: string;
        id: string;
        profit: number;
        status: string;
        symbol: string;
        timestamp: number;
    }>;
};

type TActiveSymbolsStore = {
    active_symbols: ActiveSymbols;
    setActiveSymbols: () => Promise<void>;
};

type TBalance = {
    currency: string;
    balance: number;
};

type TModalData = {
    active_modal: string;
    data: Record<string, unknown>;
};

type TPlatform = 'mt5' | 'dxtrade' | 'ctrader';

type TTradersHubStore = {
    closeModal: () => void;
    content_flag: 'low_risk_cr_eu' | 'low_risk_cr_non_eu' | 'high_risk_cr' | 'cr_demo' | 'eu_demo' | 'eu_real' | '';
    combined_cfd_mt5_accounts: DetailsOfEachMT5Loginid &
        {
            tracking_name: string;
            short_code_and_region: string;
            login: string;
            sub_title: string;
            icon: 'Derived' | 'Financial' | 'Options' | 'CFDs';
            status?: string;
            action_type: 'get' | 'none' | 'trade' | 'dxtrade' | 'multi-action';
            key: string;
            name: string;
            landing_company_short?: DetailsOfEachMT5Loginid['landing_company_short'];
            platform?: TPlatform;
            availability?: TRegionAvailability;
            description?: string;
            market_type?: 'all' | 'financial' | 'synthetic';
            product: TProduct;
        }[];
    openModal: (modal_id: string, props?: unknown) => void;
    selected_account: {
        login: string;
        account_id: string;
    };
    is_low_risk_cr_eu_real: boolean;
    is_eu_user: boolean;
    is_onboarding_visited: boolean;
    is_first_time_visit: boolean;
    setIsOnboardingVisited: (is_visited: boolean) => void;
    setIsFirstTimeVisit: (first_time_visit: boolean) => void;
    show_eu_related_content: boolean;
    setTogglePlatformType: (platform_type: string) => void;
    is_demo: boolean;
    is_real: boolean;
    selectRegion: (region: string) => void;
    closeAccountTransferModal: () => void;
    toggleRegulatorsCompareModal: () => void;
    openFailedVerificationModal: (selected_account_type: Record<string, unknown> | string) => void;
    modal_data: TModalData;
    financial_restricted_countries: boolean;
    selected_account_type: string;
    selected_platform_type: string;
    setSelectedAccount: (account: { login?: string; account_id?: string }) => void;
    no_CR_account: boolean;
    no_MF_account: boolean;
    CFDs_restricted_countries: boolean;
    toggleAccountTransferModal: () => void;
    is_real_wallets_upgrade_on: boolean;
    toggleWalletsUpgrade: (value: boolean) => void;
    platform_real_balance: TBalance;
    cfd_demo_balance: TBalance;
    platform_demo_balance: TBalance;
    cfd_real_balance: TBalance;
    selectAccountType: (account_type: string) => void;
    is_wallet_migration_failed: boolean;
    setWalletsMigrationFailedPopup: (value: boolean) => void;
    available_platforms: BrandConfig[];
    selected_region: TRegionAvailability;
    getExistingAccounts: (platform: string, market_type: string) => AvailableAccount[];
    active_modal_tab?: 'Deposit' | 'Withdraw' | 'Transfer' | 'Transactions';
    setWalletModalActiveTab: (tab?: 'Deposit' | 'Withdraw' | 'Transfer' | 'Transactions') => void;
    active_modal_wallet_id?: string;
    setWalletModalActiveWalletID: (wallet_id?: string) => void;
    available_cfd_accounts: TAvailableCFDAccounts[];
    available_dxtrade_accounts: TAvailableCFDAccounts[];
    available_ctrader_accounts: TAvailableCFDAccounts[];
    is_demo_low_risk: boolean;
    has_any_real_account: boolean;
    startTrade: (platform?: TPlatform, existing_account?: DetailsOfEachMT5Loginid) => void;
    getAccount: () => void;
    showTopUpModal: (existing_account?: DetailsOfEachMT5Loginid) => void;
    is_regulators_compare_modal_visible: boolean;
    is_setup_real_account_or_go_to_demo_modal_visible: boolean;
    is_cfd_restricted_country: boolean;
    is_financial_restricted_country: boolean;
    setIsCFDRestrictedCountry: (value: boolean) => void;
    setIsFinancialRestrictedCountry: (value: boolean) => void;
    setIsSetupRealAccountOrGoToDemoModalVisible: (value: boolean) => void;
};

type TContractReplay = {
    contract_store: {
        accumulator_previous_spot_time: number | null;
        barriers_array: Array<TCoreStores['chart_barrier_store']> | [];
        contract_config:
            | Record<string, never>
            | {
                  chart_type: string;
                  granularity?: number;
                  end_epoch?: number;
                  start_epoch: number;
                  scroll_to_epoch: number;
              }
            | null;
        contract_info: TPortfolioPosition['contract_info'];
        contract_update: ProposalOpenContract['limit_order'];
        contract_update_history: TContractStore['contract_update_history'];
        digits_info: { [key: number]: { digit: number; spot: string } };
        display_status: string;
        getContractsArray: () => {
            type: string;
            markers: Array<{
                color: string;
                epoch: number;
                quote?: number;
                text?: string;
                type: string;
            }>;
            props: {
                hasPersistentBorders: boolean;
            };
        }[];
        is_digit_contract: boolean;
        is_ended: boolean;
        marker: {
            contract_info: TPortfolioPosition['contract_info'];
            epoch_array: Array<number> | [];
            key: string;
            price_array: Array<number> | [];
            type: string;
        };
        markers_array:
            | []
            | Array<{
                  content_config: TMarkerContentConfig;
                  marker_config: {
                      ContentComponent: React.ComponentType<TMarkerContentConfig> | string;
                      className?: string;
                      x: string | number;
                      y: string | number | null;
                  };
                  react_key: string;
                  type: string;
              }>;
    };
    chart_state: string;
    chartStateChange: (state: string, option?: TChartStateChangeOption) => void;
    error_code?: string;
    error_message?: string;
    has_error: boolean;
    is_chart_loading: boolean;
    is_forward_starting: boolean;
    is_market_closed: boolean;
    is_sell_requested: boolean;
    margin?: number;
    onClickCancel: (contract_id?: number) => void;
    onClickSell: (contract_id?: number) => void;
    onMount: (contract_id?: number) => void;
    onUnmount: () => void;
    removeErrorMessage: () => void;
    removeAccountSwitcherListener: () => void;
    setAccountSwitcherListener: (contract_id: string | number, history: Array<string>) => void;
};
type TGtmStore = {
    is_gtm_applicable: boolean;
    visitorId: Readonly<string>;
    common_variables: Readonly<{
        language: string;
        visitorId?: string;
        currency?: string;
        userId?: string;
        email?: string;
        loggedIn: boolean;
        theme: 'dark' | 'light';
        platform: 'DBot' | 'MT5' | 'DTrader' | 'undefined';
    }>;
    accountSwitcherListener: () => Promise<Record<string, unknown>>;
    pushDataLayer: (data: Record<string, unknown>) => void;
    pushTransactionData: (response: Transaction, extra_data: Record<string, unknown>) => void;
    eventHandler: (get_settings: GetSettings) => void;
    setLoginFlag: (event_name: string) => void;
};

/**
 * This is the type that contains all the `core` package stores
 */
export type TCoreStores = {
    client: TClientStore;
    common: TCommonStore;
    ui: TUiStore;
    portfolio: TPortfolioStore;
    contract_trade: TContractTradeStore;
    // This should be `any` as this property will be handled in each package.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modules: Record<string, any>;
    notifications: TNotificationStore;
    traders_hub: TTradersHubStore;
    gtm: TGtmStore;
    pushwoosh: Record<string, unknown>;
    contract_replay: TContractReplay;
    chart_barrier_store: TBarriers[number];
    active_symbols: TActiveSymbolsStore;
};

export type TStores = TCoreStores & {
    feature_flags: FeatureFlagsStore;
};
