import Cookies from 'js-cookie';
import { action, computed, makeObservable, observable, reaction, runInAction, toJS, when } from 'mobx';
import moment from 'moment';

import {
    CFD_PLATFORMS,
    deriv_urls,
    excludeParamsFromUrlQuery,
    filterUrlQuery,
    getPropertyValue,
    getUrlSmartTrader,
    isCryptocurrency,
    isDesktopOs,
    isMobile,
    isEmptyObject,
    isLocal,
    isProduction,
    isStaging,
    isTestLink,
    isTestDerivApp,
    LocalStore,
    redirectToLogin,
    removeCookies,
    routes,
    SessionStore,
    setCurrencies,
    State,
    toMoment,
    sortApiData,
    urlForLanguage,
    getAppId,
    getUrlP2P,
} from '@deriv/shared';
import { Analytics } from '@deriv-com/analytics';
import { URLConstants } from '@deriv-com/utils';

import { getLanguage, localize, getRedirectionLanguage } from '@deriv/translations';

import { requestLogout, WS } from 'Services';
import BinarySocketGeneral from 'Services/socket-general';

import { getAccountTitle, getAvailableAccount, getClientAccountType } from './Helpers/client';
import { setDeviceDataCookie } from './Helpers/device';
import { buildCurrenciesList } from './Modules/Trading/Helpers/currency';
import BaseStore from './base-store';
import BinarySocket from '_common/base/socket_base';
import * as SocketCache from '_common/base/socket_cache';
import { getRegion, isEuCountry, isMultipliersOnly, isOptionsBlocked } from '_common/utility';

const LANGUAGE_KEY = 'i18n_language';
const storage_key = 'client.accounts';
const store_name = 'client_store';
const eu_shortcode_regex = /^maltainvest$/;
const eu_excluded_regex = /^mt$/;

export default class ClientStore extends BaseStore {
    loginid;
    preferred_language;
    upgrade_info;
    email;
    accounts = {};
    trading_platform_available_accounts = [];
    ctrader_trading_platform_available_accounts = [];
    pre_switch_broadcast = false;
    switched = '';
    is_switching = false;
    switch_broadcast = false;
    initialized_broadcast = false;
    currencies_list = {};
    residence_list = [];
    states_list = [];
    citizen = '';
    selected_currency = '';
    is_populating_account_list = false;
    is_populating_mt5_account_list = true;
    is_populating_dxtrade_account_list = true;
    is_populating_ctrader_account_list = true;
    website_status = {};
    account_settings = {};
    account_status = {};
    device_data = {};
    is_authorize = false;
    is_logging_in = false;
    is_client_store_initialized = false;
    has_logged_out = false;
    is_landing_company_loaded = false;
    is_account_setting_loaded = false;
    has_enabled_two_fa = false;
    has_changed_two_fa = false;
    landing_companies = {};
    is_new_session = false;
    is_tradershub_tracking = false;
    // All possible landing companies of user between all
    standpoint = {
        svg: false,
        maltainvest: false,
        gaming_company: false,
        financial_company: false,
    };

    upgradeable_landing_companies = [];
    mt5_disabled_signup_types = { real: false, demo: false };
    mt5_login_list = [];
    mt5_login_list_error = null;
    dxtrade_accounts_list = [];
    ctrader_accounts_list = [];
    dxtrade_accounts_list_error = null;
    dxtrade_disabled_signup_types = { real: false, demo: false };
    statement = [];
    obj_total_balance = {
        amount_real: undefined,
        amount_mt5: undefined,
        amount_dxtrade: undefined,
        currency: '',
    };

    verification_code = {
        signup: '',
        reset_password: '',
        payment_withdraw: '',
        payment_agent_withdraw: '',
        phone_number_verification: '',
        trading_platform_mt5_password_reset: '',
        trading_platform_dxtrade_password_reset: '',
        request_email: '',
        social_email_change: '',
        system_email_change: '',
    };

    new_email = {
        system_email_change: '',
        social_email_change: '',
    };

    account_limits = {};
    self_exclusion = {};

    local_currency_config = {
        currency: '',
        decimal_places: undefined,
    };
    has_cookie_account = false;

    financial_assessment = null;

    mt5_trading_servers = [];
    dxtrade_trading_servers = [];
    is_cfd_poi_completed = false;

    cfd_score = 0;

    is_mt5_account_list_updated = false;

    prev_real_account_loginid = '';
    prev_account_type = 'demo';
    external_url_params = {};
    is_already_attempted = false;
    is_p2p_enabled = false;
    real_account_signup_form_data = [];
    real_account_signup_form_step = 0;
    wallet_migration_state;
    wallet_migration_interval_id;
    is_wallet_migration_request_is_in_progress = false;

    is_passkey_supported = false;
    is_phone_number_verification_enabled = false;
    should_show_passkey_notification = false;
    passkeys_list = [];

    subscriptions = {};
    exchange_rates = {};

    constructor(root_store) {
        const local_storage_properties = ['device_data'];
        super({ root_store, local_storage_properties, store_name });

        makeObservable(this, {
            exchange_rates: observable,
            loginid: observable,
            external_url_params: observable,
            setExternalParams: action.bound,
            redirectToLegacyPlatform: action.bound,
            preferred_language: observable,
            upgrade_info: observable,
            email: observable,
            accounts: observable,
            trading_platform_available_accounts: observable,
            ctrader_trading_platform_available_accounts: observable,
            pre_switch_broadcast: observable,
            switched: observable,
            is_switching: observable,
            switch_broadcast: observable,
            initialized_broadcast: observable,
            currencies_list: observable,
            residence_list: observable,
            states_list: observable,
            citizen: observable,
            selected_currency: observable,
            is_populating_account_list: observable,
            is_populating_mt5_account_list: observable,
            is_populating_dxtrade_account_list: observable,
            is_populating_ctrader_account_list: observable,
            website_status: observable,
            account_settings: observable,
            account_status: observable,
            device_data: observable,
            is_authorize: observable,
            is_logging_in: observable,
            is_client_store_initialized: observable,
            has_logged_out: observable,
            is_landing_company_loaded: observable,
            is_account_setting_loaded: observable,
            has_enabled_two_fa: observable,
            has_changed_two_fa: observable,
            landing_companies: observable,
            standpoint: observable,
            upgradeable_landing_companies: observable,
            mt5_disabled_signup_types: observable,
            mt5_login_list: observable,
            mt5_login_list_error: observable,
            dxtrade_accounts_list: observable,
            ctrader_accounts_list: observable,
            dxtrade_accounts_list_error: observable,
            dxtrade_disabled_signup_types: observable,
            statement: observable,
            cfd_score: observable,
            obj_total_balance: observable,
            verification_code: observable,
            new_email: observable,
            account_limits: observable,
            self_exclusion: observable,
            local_currency_config: observable,
            has_cookie_account: observable,
            financial_assessment: observable,
            mt5_trading_servers: observable,
            dxtrade_trading_servers: observable,
            is_cfd_poi_completed: observable,
            prev_real_account_loginid: observable,
            prev_account_type: observable,
            is_already_attempted: observable,
            is_p2p_enabled: observable,
            real_account_signup_form_data: observable,
            real_account_signup_form_step: observable,
            wallet_migration_state: observable,
            is_wallet_migration_request_is_in_progress: observable,
            is_passkey_supported: observable,
            is_phone_number_verification_enabled: observable,
            passkeys_list: observable,
            should_show_passkey_notification: observable,
            balance: computed,
            account_open_date: computed,
            is_svg: computed,
            has_active_real_account: computed,
            has_maltainvest_account: computed,
            has_any_real_account: computed,
            can_change_fiat_currency: computed,
            legal_allowed_currencies: computed,
            upgradeable_currencies: computed,
            current_currency_type: computed,
            available_crypto_currencies: computed,
            available_onramp_currencies: computed,
            has_fiat: computed,
            current_fiat_currency: computed,
            current_landing_company: computed,
            account_list: computed,
            has_real_mt5_login: computed,
            has_real_dxtrade_login: computed,
            active_accounts: computed,
            all_loginids: computed,
            account_title: computed,
            currency: computed,
            is_crypto: action.bound,
            default_currency: computed,
            should_allow_authentication: computed,
            should_allow_poinc_authentication: computed,
            is_financial_assessment_needed: computed,
            is_authentication_needed: computed,
            is_identity_verification_needed: computed,
            is_poa_expired: computed,
            real_account_creation_unlock_date: computed,
            is_social_signup: computed,
            isEligibleForMoreDemoMt5Svg: action.bound,
            isEligibleForMoreRealMt5: action.bound,
            setCitizen: action.bound,
            is_mt5_password_not_set: computed,
            is_dxtrade_password_not_set: computed,
            is_financial_information_incomplete: computed,
            is_deposit_lock: computed,
            is_duplicate_dob_phone: computed,
            is_withdrawal_lock: computed,
            is_trading_experience_incomplete: computed,
            authentication_status: computed,
            social_identity_provider: computed,
            is_from_restricted_country: computed,
            is_fully_authenticated: computed,
            is_financial_account: computed,
            landing_company_shortcode: computed,
            landing_company: computed,
            is_logged_in: computed,
            has_restricted_mt5_account: computed,
            has_mt5_account_with_rejected_poa: computed,
            has_wallet: computed,
            should_restrict_bvi_account_creation: computed,
            should_restrict_vanuatu_account_creation: computed,
            should_show_eu_error: computed,
            is_virtual: computed,
            is_eu: computed,
            can_upgrade: computed,
            can_upgrade_to: computed,
            virtual_account_loginid: computed,
            is_single_currency: computed,
            account_type: computed,
            is_mt5_allowed: computed,
            is_dxtrade_allowed: computed,
            is_bot_allowed: computed,
            clients_country: computed,
            is_eu_country: computed,
            is_options_blocked: computed,
            is_multipliers_only: computed,
            is_proof_of_ownership_enabled: computed,
            resetLocalStorageValues: action.bound,
            getBasicUpgradeInfo: action.bound,
            setMT5DisabledSignupTypes: action.bound,
            setCFDDisabledSignupTypes: action.bound,
            getLimits: action.bound,
            setPreferredLanguage: action.bound,
            setCookieAccount: action.bound,
            setCFDScore: action.bound,
            updateSelfExclusion: action.bound,
            responsePayoutCurrencies: action.bound,
            responseAuthorize: action.bound,
            setWebsiteStatus: action.bound,
            accountRealReaction: action.bound,
            setLoginInformation: action.bound,
            realAccountSignup: action.bound,
            setAccountCurrency: action.bound,
            updateAccountCurrency: action.bound,
            createCryptoAccount: action.bound,
            residence: computed,
            email_address: computed,
            updateAccountList: action.bound,
            switchAccount: action.bound,
            resetVirtualBalance: action.bound,
            switchEndSignal: action.bound,
            init: action.bound,
            resetMt5AccountListPopulation: action.bound,
            responseWebsiteStatus: action.bound,
            responseLandingCompany: action.bound,
            setStandpoint: action.bound,
            setLoginId: action.bound,
            setAccounts: action.bound,
            setSwitched: action.bound,
            setIsAuthorize: action.bound,
            setIsLoggingIn: action.bound,
            setPreSwitchAccount: action.bound,
            broadcastAccountChange: action.bound,
            switchAccountHandler: action.bound,
            registerReactions: action.bound,
            setBalanceActiveAccount: action.bound,
            setBalanceOtherAccounts: action.bound,
            selectCurrency: action.bound,
            setResidence: action.bound,
            setEmail: action.bound,
            setAccountSettings: action.bound,
            setAccountStatus: action.bound,
            updateAccountStatus: action.bound,
            setInitialized: action.bound,
            cleanUp: action.bound,
            setIsClientStoreInitialized: action.bound,
            logout: action.bound,
            setLogout: action.bound,
            storeClientAccounts: action.bound,
            setUserLogin: action.bound,
            canStoreClientAccounts: action.bound,
            setVerificationCode: action.bound,
            setNewEmail: action.bound,
            setDeviceData: action.bound,
            getSignupParams: action.bound,
            onSetResidence: action.bound,
            onSetCitizen: action.bound,
            onSignup: action.bound,
            fetchAccountSettings: action.bound,
            fetchResidenceList: action.bound,
            setResidenceList: action.bound,
            fetchStatesList: action.bound,
            resetMt5ListPopulatedState: action.bound,
            updateMt5LoginList: action.bound,
            responseMT5TradingServers: action.bound,
            responseMt5LoginList: action.bound,
            responseDxtradeTradingServers: action.bound,
            responseTradingPlatformAvailableAccounts: action.bound,
            responseCTraderTradingPlatformAvailableAccounts: action.bound,
            responseTradingPlatformAccountsList: action.bound,
            responseStatement: action.bound,
            getChangeableFields: action.bound,
            syncWithLegacyPlatforms: action.bound,
            is_high_risk: computed,
            is_low_risk: computed,
            has_residence: computed,
            ctrader_total_balance: computed,
            fetchFinancialAssessment: action.bound,
            setFinancialAndTradingAssessment: action.bound,
            setTwoFAStatus: action.bound,
            setTwoFAChangedStatus: action.bound,
            is_eu_or_multipliers_only: computed,
            getTwoFAStatus: action.bound,
            updateMT5Status: action.bound,
            setPrevRealAccountLoginid: action.bound,
            setPrevAccountType: action.bound,
            setIsAlreadyAttempted: action.bound,
            setIsP2PEnabled: action.bound,
            setRealAccountSignupFormData: action.bound,
            setRealAccountSignupFormStep: action.bound,
            getWalletMigrationState: action.bound,
            setWalletMigrationState: action.bound,
            startWalletMigration: action.bound,
            resetWalletMigration: action.bound,
            setIsPasskeySupported: action.bound,
            setIsPhoneNumberVerificationEnabled: action.bound,
            setPasskeysStatusToCookie: action.bound,
            fetchShouldShowPasskeyNotification: action.bound,
            fetchPasskeysList: action.bound,
            setShouldShowPasskeyNotification: action.bound,
            getExchangeRate: action.bound,
            subscribeToExchangeRate: action.bound,
            unsubscribeFromExchangeRate: action.bound,
            unsubscribeFromAllExchangeRates: action.bound,
            setExchangeRates: action.bound,
            setIsLandingCompanyLoaded: action.bound,
            is_cr_account: computed,
            is_mf_account: computed,
            is_tradershub_tracking: observable,
            setTradersHubTracking: action.bound,
            account_time_of_closure: computed,
            is_account_to_be_closed_by_residence: computed,
        });

        reaction(
            () => [
                this.is_logged_in,
                this.loginid,
                this.email,
                this.landing_company,
                this.currency,
                this.residence,
                this.account_settings,
                this.preferred_language,
            ],
            () => {
                this.setCookieAccount();
                if (!this.is_logged_in) {
                    this.root_store.traders_hub.cleanup();
                }
            }
        );

        reaction(
            () => [this.account_settings],
            async () => {
                const language = getRedirectionLanguage(this.account_settings?.preferred_language, this.is_new_session);
                const should_update_preferred_language =
                    language !== this.account_settings?.preferred_language &&
                    this.preferred_language !== this.account_settings?.preferred_language;
                window.history.replaceState({}, document.title, urlForLanguage(language));
                if (should_update_preferred_language) {
                    this.setPreferredLanguage(language);
                    await WS.setSettings({
                        set_settings: 1,
                        preferred_language: language,
                    });
                }
            }
        );

        reaction(
            () => [this.is_logged_in, this.is_authorize, this.is_passkey_supported, this.root_store.ui?.is_mobile],
            () => {
                if (this.is_logged_in && this.is_authorize && this.is_passkey_supported) {
                    this.fetchShouldShowPasskeyNotification();
                }
            }
        );

        when(
            () => !this.is_logged_in && this.root_store.ui && this.root_store.ui.is_real_acc_signup_on,
            () => this.root_store.ui.closeRealAccountSignup()
        );

        reaction(
            () => [this.wallet_migration_state],
            () => {
                if (this.wallet_migration_state === 'in_progress') {
                    this.wallet_migration_interval_id = setInterval(() => {
                        this.getWalletMigrationState();
                    }, 2000);
                } else {
                    clearInterval(this.wallet_migration_interval_id);
                }
            }
        );
    }

    get balance() {
        if (isEmptyObject(this.accounts)) return undefined;
        return this.accounts[this.loginid] && 'balance' in this.accounts[this.loginid]
            ? this.accounts[this.loginid].balance.toString()
            : undefined;
    }

    get account_open_date() {
        if (isEmptyObject(this.accounts) || !this.accounts[this.loginid]) return undefined;
        return Object.keys(this.accounts[this.loginid]).includes('created_at')
            ? this.accounts[this.loginid].created_at
            : undefined;
    }

    get is_svg() {
        if (!this.landing_company_shortcode) {
            return false;
        }
        return this.landing_company_shortcode === 'svg' || this.landing_company_shortcode === 'costarica';
    }

    get has_active_real_account() {
        return this.active_accounts.some(acc => acc.is_virtual === 0);
    }

    get has_maltainvest_account() {
        return this.active_accounts.some(acc => acc.landing_company_shortcode === 'maltainvest');
    }

    hasAnyRealAccount = () => {
        return this.account_list.some(acc => acc.is_virtual === 0);
    };

    get has_any_real_account() {
        return this.hasAnyRealAccount();
    }

    get has_wallet() {
        return Object.values(this.accounts).some(account => account.account_category === 'wallet');
    }

    get can_change_fiat_currency() {
        const has_no_mt5 = !this.has_real_mt5_login;
        const has_no_dxtrade = !this.has_real_dxtrade_login;
        const has_no_transaction = this.statement.count === 0 && this.statement.transactions.length === 0;
        const has_no_deposit_attempt_account_status = !this.account_status?.status?.includes('deposit_attempt');
        const has_account_criteria =
            has_no_transaction && has_no_mt5 && has_no_dxtrade && has_no_deposit_attempt_account_status;
        return !this.is_virtual && has_account_criteria && this.current_currency_type === 'fiat';
    }

    get legal_allowed_currencies() {
        const getDefaultAllowedCurrencies = () => {
            if (this.landing_companies?.gaming_company) {
                return this.landing_companies?.gaming_company?.legal_allowed_currencies;
            }
            if (this.landing_companies?.financial_company) {
                return this.landing_companies?.financial_company?.legal_allowed_currencies;
            }
            return [];
        };

        if (!this.landing_companies || !this.root_store.ui) {
            return [];
        }
        if (!this.root_store.ui.real_account_signup_target) {
            return getDefaultAllowedCurrencies();
        }
        if (
            ['set_currency', 'manage'].includes(this.root_store.ui.real_account_signup_target) &&
            this.current_landing_company
        ) {
            return this.current_landing_company.legal_allowed_currencies;
        }
        const target = this.root_store.ui.real_account_signup_target === 'maltainvest' ? 'financial' : 'gaming';

        if (this.landing_companies[`${target}_company`]) {
            return this.landing_companies[`${target}_company`].legal_allowed_currencies;
        }

        return getDefaultAllowedCurrencies();
    }

    get upgradeable_currencies() {
        if (!this.legal_allowed_currencies || !this.website_status.currencies_config) return [];
        return this.legal_allowed_currencies.map(currency => ({
            value: currency,
            ...this.website_status.currencies_config[currency],
        }));
    }

    get current_currency_type() {
        if (this.account_type === 'virtual') return 'virtual';
        if (
            this.website_status &&
            this.website_status.currencies_config &&
            this.website_status.currencies_config[this.currency]
        ) {
            return this.website_status.currencies_config[this.currency].type;
        }

        return undefined;
    }

    get available_crypto_currencies() {
        const values = Object.values(this.accounts).reduce((acc, item) => {
            acc.push(item.currency);
            return acc;
        }, []);

        return this.upgradeable_currencies.filter(acc => !values.includes(acc.value) && acc.type === 'crypto');
    }

    get available_onramp_currencies() {
        return Object.entries(this.website_status?.currencies_config).reduce((currencies, [currency, values]) => {
            if (values.platform.ramp.length > 0) {
                currencies.push(currency);
            }
            return currencies;
        }, []);
    }

    get has_fiat() {
        return Object.values(this.accounts).some(
            item =>
                item.currency_type === 'fiat' &&
                !item.is_virtual &&
                item.landing_company_shortcode === this.landing_company_shortcode
        );
    }

    get current_fiat_currency() {
        const account = Object.values(this.accounts).find(
            item =>
                item.currency_type === 'fiat' &&
                !item.is_virtual &&
                item.landing_company_shortcode === this.landing_company_shortcode
        );
        return account?.currency;
    }

    // return the landing company object that belongs to the current client by matching shortcode
    // note that it will be undefined for logged out and virtual clients
    get current_landing_company() {
        const landing_company =
            this.landing_companies &&
            Object.keys(this.landing_companies).find(
                company => this.landing_companies[company]?.shortcode === this.landing_company_shortcode
            );
        return landing_company ? this.landing_companies[landing_company] : undefined;
    }

    get account_list() {
        return this.all_loginids.map(id => this.getAccountInfo(id)).filter(account => account);
    }

    get has_real_mt5_login() {
        return this.mt5_login_list.some(account => account.account_type === 'real');
    }

    get has_real_dxtrade_login() {
        return this.dxtrade_accounts_list.some(account => account.account_type === 'real');
    }

    get active_accounts() {
        return this.accounts instanceof Object
            ? Object.values(this.accounts).filter(account => !account.is_disabled)
            : [];
    }

    get all_loginids() {
        return !isEmptyObject(this.accounts) ? Object.keys(this.accounts) : [];
    }

    get account_title() {
        return getAccountTitle(this.loginid);
    }

    get currency() {
        if (this.selected_currency.length) {
            return this.selected_currency;
        } else if (this.is_logged_in) {
            return this.accounts[this.loginid].currency;
        }

        return this.default_currency;
    }

    is_crypto(currency) {
        return isCryptocurrency(currency || this.currency);
    }

    get default_currency() {
        if (Object.keys(this.currencies_list).length > 0) {
            const keys = Object.keys(this.currencies_list);
            // Fix for edge case when logging out from crypto accounts causes Fiat list to be empty
            if (this.currencies_list[localize('Fiat')]?.length < 1) return 'USD';
            return Object.values(this.currencies_list[`${keys[0]}`])[0].text;
        }

        return 'USD';
    }

    get should_allow_authentication() {
        return this.account_status?.status?.some(
            status => status === 'allow_document_upload' || status === 'allow_poi_resubmission'
        );
    }

    get should_allow_poinc_authentication() {
        return (
            this.is_fully_authenticated && this.account_status?.authentication?.needs_verification?.includes('income')
        );
    }

    get is_financial_assessment_needed() {
        return this.account_status?.status?.includes('financial_assessment_notification');
    }

    get is_poa_expired() {
        return this.account_status?.status?.includes('poa_expired');
    }

    get is_authentication_needed() {
        return !this.is_fully_authenticated && !!this.account_status?.authentication?.needs_verification?.length;
    }

    get is_identity_verification_needed() {
        const needs_verification = this.account_status?.authentication?.needs_verification;
        return needs_verification?.length === 1 && needs_verification?.includes('identity');
    }

    get real_account_creation_unlock_date() {
        const { cooling_off_expiration_date } = this.account_settings;
        return cooling_off_expiration_date;
    }

    get is_social_signup() {
        return this.account_status?.status?.includes('social_signup');
    }

    get is_mt5_password_not_set() {
        return this.account_status?.status?.includes('mt5_password_not_set');
    }

    get is_dxtrade_password_not_set() {
        return this.account_status?.status?.includes('dxtrade_password_not_set');
    }

    get is_financial_information_incomplete() {
        return this.account_status?.status?.some(status => status === 'financial_information_not_complete');
    }

    get is_deposit_lock() {
        return this.account_status?.status?.some(status_name => status_name === 'deposit_locked');
    }

    get is_duplicate_dob_phone() {
        return this.account_status?.status?.some(status_name => status_name === 'duplicate_dob_phone');
    }

    get is_withdrawal_lock() {
        return this.account_status?.status?.some(status_name => status_name === 'withdrawal_locked');
    }

    get is_trading_experience_incomplete() {
        return this.account_status?.status?.some(status => status === 'trading_experience_not_complete');
    }

    get authentication_status() {
        const document_status = this.account_status?.authentication?.document?.status;
        const identity_status = this.account_status?.authentication?.identity?.status;
        return { document_status, identity_status };
    }

    get social_identity_provider() {
        return this.account_status?.social_identity_provider;
    }

    get is_from_restricted_country() {
        return this.residence_list.find(item => item.value === this.residence)?.disabled === 'DISABLED';
    }

    get is_fully_authenticated() {
        return this.account_status?.status?.some(status => status === 'authenticated');
    }

    get is_financial_account() {
        if (!this.landing_companies) return false;
        return this.account_type === 'financial';
    }

    get landing_company_shortcode() {
        if (this.accounts[this.loginid]) {
            return this.accounts[this.loginid].landing_company_shortcode;
        }
        return undefined;
    }

    get landing_company() {
        return this.landing_companies;
    }

    get is_logged_in() {
        return !!(
            !isEmptyObject(this.accounts) &&
            Object.keys(this.accounts).length > 0 &&
            this.loginid &&
            this.accounts[this.loginid].token
        );
    }

    get has_restricted_mt5_account() {
        return !!this.mt5_login_list.filter(mt5_account => mt5_account?.status?.includes('poa_failed')).length;
    }

    get has_mt5_account_with_rejected_poa() {
        return !!this.mt5_login_list.filter(mt5_account => mt5_account?.status?.includes('poa_rejected')).length;
    }

    get should_restrict_bvi_account_creation() {
        return !!this.mt5_login_list.filter(
            item => item?.landing_company_short === 'bvi' && item?.status === 'poa_failed'
        ).length;
    }

    get should_restrict_vanuatu_account_creation() {
        return !!this.mt5_login_list.filter(
            item => item?.landing_company_short === 'vanuatu' && item?.status === 'poa_failed'
        ).length;
    }

    get should_show_eu_error() {
        if (!this.is_landing_company_loaded) {
            return false;
        }
        return this.is_eu && !this.is_low_risk;
    }

    get is_virtual() {
        return !isEmptyObject(this.accounts) && this.accounts[this.loginid] && !!this.accounts[this.loginid].is_virtual;
    }

    get is_eu() {
        if (!this.landing_companies) return false;
        const { gaming_company, financial_company, mt_gaming_company } = this.landing_companies;
        const financial_shortcode = financial_company?.shortcode;
        const gaming_shortcode = gaming_company?.shortcode;
        const mt_gaming_shortcode = mt_gaming_company?.financial.shortcode || mt_gaming_company?.swap_free.shortcode;
        const is_current_mf = this.landing_company_shortcode === 'maltainvest';
        return (
            is_current_mf || //is_currently logged in mf account via tradershub
            (financial_shortcode || gaming_shortcode || mt_gaming_shortcode
                ? (eu_shortcode_regex.test(financial_shortcode) && gaming_shortcode !== 'svg') ||
                  eu_shortcode_regex.test(gaming_shortcode)
                : eu_excluded_regex.test(this.residence))
        );
    }

    get can_upgrade() {
        return this.upgrade_info && (this.upgrade_info.can_upgrade || this.upgrade_info.can_open_multi);
    }

    get can_upgrade_to() {
        return this.upgrade_info && this.upgrade_info.can_upgrade_to;
    }

    get virtual_account_loginid() {
        return this.all_loginids.find(loginid => !!this.accounts[loginid].is_virtual);
    }

    get is_single_currency() {
        return (
            Object.keys(this.currencies_list)
                .map(type => Object.values(this.currencies_list[type]).length)
                .reduce((acc, cur) => acc + cur, 0) === 1
        );
    }

    get account_type() {
        return getClientAccountType(this.loginid);
    }

    get is_mt5_allowed() {
        return this.isMT5Allowed(this.landing_companies);
    }

    get is_dxtrade_allowed() {
        return this.isDxtradeAllowed(this.landing_companies);
    }

    get is_bot_allowed() {
        return this.isBotAllowed();
    }

    setTradersHubTracking(is_tradershub_tracking = false) {
        this.is_tradershub_tracking = is_tradershub_tracking;
    }

    setExternalParams = params => {
        this.external_url_params = params;
    };

    redirectToLegacyPlatform = () => {
        const { url, should_redirect } = this.external_url_params;
        if (should_redirect) {
            window.location.replace(url);
        }
    };

    getIsMarketTypeMatching = (account, market_type) => {
        if (market_type === 'synthetic') {
            return account.market_type === market_type || account.market_type === 'gaming';
        } else if (market_type === 'all') {
            return account.market_type === 'all';
        }
        return account.market_type === 'financial';
    };

    isEligibleForMoreDemoMt5Svg(market_type) {
        const is_synthetic = market_type === 'synthetic';
        const available_account = getAvailableAccount(market_type);
        const existing_demo_accounts = this.mt5_login_list.filter(
            account => account.account_type === 'demo' && this.getIsMarketTypeMatching(account, market_type)
        );
        const has_matching_account = this.trading_platform_available_accounts.some(account => {
            return (is_synthetic ? 'gaming' : available_account) === account.market_type && account.shortcode === 'svg';
        });
        const has_no_svg_account = existing_demo_accounts.every(account => {
            return !(account.landing_company_short === 'svg');
        });

        return has_matching_account && has_no_svg_account;
    }

    isEligibleForMoreRealMt5(market_type) {
        const is_synthetic = market_type === 'synthetic';
        const available_account = getAvailableAccount(market_type);
        const existing_real_accounts = this.mt5_login_list.filter(
            account => account.account_type === 'real' && this.getIsMarketTypeMatching(account, market_type)
        );
        const available_real_accounts_shortcodes = this.trading_platform_available_accounts
            .filter(
                account =>
                    (is_synthetic ? 'gaming' : available_account) === account.market_type &&
                    account.shortcode !== 'maltainvest'
            )
            .map(account => account.shortcode);
        const has_no_matching_accounts = available_real_accounts_shortcodes.every(shortcode => {
            if (market_type === 'all') {
                // as Swapfree only have SVG account for now we need to check if there is any real svg account available
                return existing_real_accounts.some(account => account.landing_company_short === shortcode);
            }
            return existing_real_accounts.some(account => account.landing_company_short === shortcode);
        });

        return !has_no_matching_accounts;
    }

    isMT5Allowed = landing_companies => {
        return (
            'mt_financial_company' in landing_companies ||
            'mt_gaming_company' in landing_companies ||
            'mt_all_company' in landing_companies
        );
    };

    isDxtradeAllowed = landing_companies => {
        // Stop showing DerivX for non-logged in EU users
        if (
            (!this.is_logged_in && this.is_eu_country) ||
            (this.is_logged_in && this.root_store.traders_hub.show_eu_related_content)
        )
            return false;

        if (!this.website_status?.clients_country || !landing_companies || !Object.keys(landing_companies).length)
            return true;

        // TODO: Remove two first conditions after real released
        return (
            'dxtrade_financial_company' in landing_companies ||
            'dxtrade_gaming_company' in landing_companies ||
            'dxtrade_all_company' in landing_companies ||
            (!this.is_logged_in && !this.is_eu && !this.is_eu_country)
        );
    };

    isBotAllowed = () => {
        // Stop showing Bot, DBot, DSmartTrader for logged out EU IPs
        if (!this.is_logged_in && this.is_eu_country) return false;
        const is_mf = this.landing_company_shortcode === 'maltainvest';
        return this.is_virtual ? this.is_eu_or_multipliers_only : !is_mf && !this.is_options_blocked;
    };

    get is_eu_or_multipliers_only() {
        // Check whether account is multipliers only and if the account is from eu countries
        return !this.is_multipliers_only ? !isEuCountry(this.residence) : !this.is_multipliers_only;
    }

    get clients_country() {
        return this.website_status?.clients_country;
    }

    get is_eu_country() {
        const country = this.website_status.clients_country;
        if (country) return isEuCountry(country);
        return false;
    }

    get is_options_blocked() {
        return isOptionsBlocked(this.residence);
    }

    get is_multipliers_only() {
        return isMultipliersOnly(this.residence);
    }

    /**
     * Store Values relevant to the loginid to local storage.
     *
     * @param loginid
     */
    resetLocalStorageValues(loginid) {
        this.accounts[loginid].accepted_bch = 0;
        LocalStore.setObject(storage_key, this.accounts);
        LocalStore.set('active_loginid', loginid);
        this.syncWithLegacyPlatforms(loginid, toJS(this.accounts));
        this.loginid = loginid;
    }

    setIsAuthorize(value) {
        this.is_authorize = value;
    }

    getBasicUpgradeInfo() {
        const upgradeable_landing_companies = [
            ...new Set(State.getResponse('authorize.upgradeable_landing_companies')),
        ];
        let can_open_multi = false;
        let type, can_upgrade_to;
        if ((upgradeable_landing_companies || []).length) {
            can_open_multi =
                upgradeable_landing_companies.indexOf(this.accounts[this.loginid].landing_company_shortcode) !== -1;
            const canUpgrade = (...landing_companies) =>
                landing_companies.find(
                    landing_company =>
                        landing_company !== this.accounts[this.loginid].landing_company_shortcode &&
                        upgradeable_landing_companies.indexOf(landing_company) !== -1
                );
            can_upgrade_to = canUpgrade('svg', 'maltainvest');
            if (can_upgrade_to) {
                type = can_upgrade_to === 'maltainvest' ? 'financial' : 'real';
            }
        }

        return {
            type,
            can_upgrade: !!can_upgrade_to,
            can_upgrade_to,
            can_open_multi,
        };
    }

    setMT5DisabledSignupTypes(disabled_types_obj) {
        const current_list = this.mt5_disabled_signup_types;
        this.mt5_disabled_signup_types = { ...current_list, ...disabled_types_obj };
    }

    setCFDDisabledSignupTypes(platform, disabled_types_obj) {
        if (platform === CFD_PLATFORMS.DXTRADE) {
            const current_list = this.dxtrade_disabled_signup_types;
            this.dxtrade_disabled_signup_types = { current_list, ...disabled_types_obj };
        }
    }

    getLimits() {
        return new Promise(resolve => {
            WS.authorized.storage.getLimits().then(data => {
                runInAction(() => {
                    if (data.error) {
                        this.account_limits = {
                            api_initial_load_error: data.error.message,
                        };
                        resolve(data);
                    } else {
                        this.account_limits = {
                            ...data.get_limits,
                            is_loading: false,
                        };
                        resolve(data);
                    }
                });
            });
        });
    }

    setPreferredLanguage = lang => {
        this.preferred_language = lang;
        LocalStore.setObject(LANGUAGE_KEY, lang);
    };

    setCookieAccount() {
        const domain = /deriv\.(com|me|be)/.test(window.location.hostname)
            ? deriv_urls.DERIV_HOST_NAME
            : window.location.hostname;

        // eslint-disable-next-line max-len
        const {
            loginid,
            email,
            landing_company_shortcode,
            currency,
            residence,
            account_settings,
            preferred_language,
            user_id,
        } = this;

        const { first_name, last_name, name } = account_settings;
        if (loginid && email) {
            const client_information = {
                loginid,
                email,
                landing_company_shortcode,
                currency,
                residence,
                first_name,
                last_name,
                name,
                preferred_language,
                user_id,
            };
            Cookies.set('region', getRegion(landing_company_shortcode, residence), { domain });
            Cookies.set('client_information', client_information, { domain });

            this.has_cookie_account = true;
        } else {
            removeCookies('region', 'client_information', 'is_p2p_disabled');
            this.has_cookie_account = false;
        }
    }

    // CFD score is the computed points based on the CFD related questions that the user answers in trading-assessment.
    setCFDScore(score) {
        this.cfd_score = score;
    }

    getSelfExclusion() {
        return new Promise(resolve => {
            WS.authorized.storage.getSelfExclusion().then(data => {
                runInAction(() => {
                    if (data.get_self_exclusion) {
                        this.self_exclusion = data.get_self_exclusion;
                    } else {
                        this.self_exclusion = false;
                    }
                    resolve(data);
                });
            });
        });
    }
    updateSelfExclusion(values) {
        return new Promise(resolve => {
            WS.authorized.storage.setSelfExclusion(values).then(data => {
                if (!data.error) {
                    this.getSelfExclusion();
                }
                resolve(data);
            });
        });
    }

    responsePayoutCurrencies(response) {
        const list = response?.payout_currencies || response;
        this.currencies_list = buildCurrenciesList(Array.isArray(list) ? list : []);
        this.selectCurrency('');
    }

    responseAuthorize(response) {
        this.accounts[this.loginid].email = response.authorize.email;
        this.accounts[this.loginid].currency = response.authorize.currency;
        this.accounts[this.loginid].is_virtual = +response.authorize.is_virtual;
        this.accounts[this.loginid].session_start = parseInt(moment().utc().valueOf() / 1000);
        this.accounts[this.loginid].landing_company_shortcode = response.authorize.landing_company_name;
        this.accounts[this.loginid].country = response.country;
        this.updateAccountList(response.authorize.account_list);
        this.upgrade_info = this.getBasicUpgradeInfo();
        this.user_id = response.authorize.user_id;
        localStorage.setItem('active_user_id', this.user_id);
        this.upgradeable_landing_companies = [...new Set(response.authorize.upgradeable_landing_companies)];
        this.local_currency_config.currency = Object.keys(response.authorize.local_currencies)[0];

        // delete all notifications key when set new account except notifications for this account
        // need this because when the user switchs accounts we don't use logout
        const notification_messages = LocalStore.getObject('notification_messages');
        const messages = notification_messages[this.loginid] ?? [];
        LocalStore.setObject('notification_messages', {
            [this.loginid]: messages,
        });

        // For residences without local currency (e.g. ax)
        const default_fractional_digits = 2;
        this.local_currency_config.decimal_places = isEmptyObject(response.authorize.local_currencies)
            ? default_fractional_digits
            : +response.authorize.local_currencies[this.local_currency_config.currency].fractional_digits;
    }

    setWebsiteStatus(response) {
        this.website_status = response.website_status;
        this.responseWebsiteStatus(response);
        setCurrencies(this.website_status);

        // TODO: remove the below lines after full smartcharts v2 launch.
        const domain = /deriv\.(com|me)/.test(window.location.hostname)
            ? deriv_urls.DERIV_HOST_NAME
            : window.location.hostname;
        const { clients_country } = this.website_status;

        const options = {
            domain,
            expires: 7,
        };

        try {
            const cookie = Cookies.get('website_status') ? JSON.parse(Cookies.get('website_status')) : {};
            cookie.clients_country = clients_country;
            Cookies.set('website_status', cookie, options);
        } catch (e) {
            Cookies.set('website_status', { clients_country }, options);
        }
    }

    async accountRealReaction(response) {
        return new Promise(resolve => {
            let client_accounts;
            const has_client_accounts = !!LocalStore.get(storage_key);

            runInAction(() => {
                this.is_populating_account_list = true;
            });

            if (this.is_logged_in && !has_client_accounts) {
                localStorage.setItem(storage_key, JSON.stringify(this.accounts));
                LocalStore.set(storage_key, JSON.stringify(this.accounts));
                this.syncWithLegacyPlatforms(client_id, this.accounts);
            }

            try {
                client_accounts = JSON.parse(LocalStore.get(storage_key));
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('JSON parse failed, invalid value (client.accounts): ', error);
            }

            const { oauth_token, client_id, currency_type } =
                response.new_account_real ?? response.new_account_maltainvest;
            BinarySocket.authorize(oauth_token)
                .then(authorize_response => {
                    const new_data = {};
                    new_data.token = oauth_token;
                    new_data.residence = authorize_response.authorize.country;
                    new_data.currency = authorize_response.authorize.currency;
                    new_data.is_virtual = authorize_response.authorize.is_virtual;
                    new_data.landing_company_name = authorize_response.authorize.landing_company_fullname;
                    new_data.landing_company_shortcode = authorize_response.authorize.landing_company_name;
                    new_data.currency_type = currency_type;
                    runInAction(() => (client_accounts[client_id] = new_data));
                    this.setLoginInformation(client_accounts, client_id);
                    WS.authorized.storage.getSettings().then(get_settings_response => {
                        this.setAccountSettings(get_settings_response.get_settings);
                        resolve();
                    });
                    this.syncWithLegacyPlatforms(client_id, client_accounts);
                })
                .catch(error => {
                    // eslint-disable-next-line no-console
                    console.error('Something went wrong while registering a real account: ', error);
                });
        });
    }

    setLoginInformation(client_accounts, client_id) {
        this.setAccounts(client_accounts);
        localStorage.setItem(storage_key, JSON.stringify(client_accounts));
        LocalStore.set(storage_key, JSON.stringify(client_accounts));
        this.is_populating_account_list = false;
        this.upgrade_info = this.getBasicUpgradeInfo();
        this.setSwitched(client_id);
        this.syncWithLegacyPlatforms(client_id, client_accounts);
    }

    async realAccountSignup(form_values) {
        const DEFAULT_CRYPTO_ACCOUNT_CURRENCY = 'BTC';
        const is_maltainvest_account = this.root_store.ui.real_account_signup_target === 'maltainvest';
        const is_samoa_account = this.root_store.ui.real_account_signup_target === 'samoa';
        let currency = '';
        form_values.residence = this.residence;
        if (is_maltainvest_account) {
            currency = form_values.currency;
        }
        this.root_store.ui.setRealAccountSignupParams(form_values);
        const { document_number, document_type, document_additional, ...required_form_values } = form_values;
        required_form_values.citizen = form_values?.citizen || this.account_settings?.citizen || this.residence;

        const response = is_maltainvest_account
            ? await WS.newAccountRealMaltaInvest(required_form_values)
            : await WS.newAccountReal(required_form_values);

        if (!response.error) {
            await this.accountRealReaction(response);
            if (is_samoa_account) {
                await this.setAccountCurrency(DEFAULT_CRYPTO_ACCOUNT_CURRENCY);
            }
            localStorage.removeItem('real_account_signup_wizard');
            await this.root_store.gtm.pushDataLayer({ event: 'real_signup' });

            return Promise.resolve({
                ...response,
                ...(is_maltainvest_account
                    ? {
                          new_account_maltainvest: {
                              ...response.new_account_maltainvest,
                              currency,
                          },
                      }
                    : {}),
                ...(is_samoa_account
                    ? {
                          new_account_samoa: {
                              currency,
                          },
                      }
                    : {}),
            });
        }
        return Promise.reject(response.error);
    }

    async setAccountCurrency(currency) {
        const response = await WS.setAccountCurrency(currency, {
            previous_currency: this.currency,
        });
        if (!response.error) {
            await this.updateAccountCurrency(currency);
            return Promise.resolve(response);
        }
        return Promise.reject(response.error);
    }

    async updateAccountCurrency(currency, is_set_storage = true) {
        runInAction(() => {
            const new_account = { ...this.accounts[this.loginid] };
            new_account.currency = currency;
            if (!('balance' in new_account)) new_account.balance = 0;
            this.accounts[this.loginid] = new_account;
        });
        if (is_set_storage) {
            localStorage.setItem(storage_key, JSON.stringify(this.accounts));
            LocalStore.setObject(storage_key, JSON.parse(JSON.stringify(this.accounts)));
        }
        this.selectCurrency(currency);
        this.root_store.notifications.removeNotificationMessage({
            key: 'currency',
        });
        this.root_store.notifications.removeNotificationByKey({
            key: 'currency',
        });
        await this.init();
    }

    async createCryptoAccount(currency) {
        const residence = this.residence;
        const { date_of_birth, first_name, last_name } = this.account_settings;
        const data = {
            residence,
            currency,
            first_name,
            last_name,
            date_of_birth: toMoment(date_of_birth).format('YYYY-MM-DD'),
        };

        const response = await WS.newAccountReal(data);
        if (!response.error) {
            await this.accountRealReaction(response);
            return Promise.resolve(response);
        }
        return Promise.reject(response.error);
    }

    get residence() {
        if (this.is_logged_in) {
            return this.account_settings?.country_code ?? '';
        }
        return '';
    }

    get email_address() {
        if (this.accounts && this.accounts[this.loginid]) {
            return this.accounts[this.loginid].email;
        }

        return '';
    }

    isAccountOfType = type => {
        const client_account_type = getClientAccountType(this.loginid);

        return (
            ((type === 'virtual' && client_account_type === 'virtual') ||
                (type === 'real' && client_account_type !== 'virtual') ||
                type === client_account_type) &&
            !this.isDisabled()
        );
    };

    updateAccountList(account_list) {
        account_list.forEach(account => {
            if (this.accounts[account.loginid]) {
                this.accounts[account.loginid].excluded_until = account.excluded_until || '';
                Object.keys(account).forEach(param => {
                    const param_to_set = param === 'country' ? 'residence' : param;
                    const value_to_set = typeof account[param] === 'undefined' ? '' : account[param];
                    if (param_to_set !== 'loginid') {
                        this.accounts[account.loginid][param_to_set] = value_to_set;
                    }
                });
            }
        });
    }

    /**
     * Switch to the given loginid account.
     *
     * @param {string} loginid
     */
    async switchAccount(loginid) {
        if (!loginid || this.is_logging_in) return;

        this.setPreSwitchAccount(true);
        this.setIsLoggingIn(true);
        this.root_store.notifications.removeNotifications(true);
        this.root_store.notifications.removeTradeNotifications();
        this.root_store.notifications.removeAllNotificationMessages(true);
        if (!this.is_virtual && /VRTC|VRW/.test(loginid)) {
            this.setPrevRealAccountLoginid(this.loginid);
        }
        this.setSwitched(loginid);
        this.responsePayoutCurrencies(await WS.authorized.payoutCurrencies());
    }

    async resetVirtualBalance() {
        if (this.is_tradershub_tracking) {
            Analytics.trackEvent('ce_tradershub_dashboard_form', {
                action: 'reset_balance',
                form_name: 'traders_hub_default',
                account_mode: 'demo',
            });
        }

        this.root_store.notifications.removeNotificationByKey({ key: 'reset_virtual_balance' });
        this.root_store.notifications.removeNotificationMessage({
            key: 'reset_virtual_balance',
            should_show_again: true,
        });
        await WS.authorized.topupVirtual();
    }

    switchEndSignal() {
        this.switch_broadcast = false;
    }

    /**
     * We initially fetch things from local storage, and then do everything inside the store.
     */
    async init(login_new_user) {
        // delete walletsOnboarding key after page refresh
        /** will be removed later when header for the wallets is created) */
        localStorage.removeItem('walletsOnboarding');

        const search = SessionStore.get('signup_query_param') || window.location.search;
        const search_params = new URLSearchParams(search);
        const redirect_url = search_params?.get('redirect_url');
        const code_param = search_params?.get('code');
        const action_param = search_params?.get('action');
        const loginid_param = search_params?.get('loginid');
        const unused_params = [
            'type',
            'acp',
            'label',
            'server',
            'interface',
            'cid',
            'age',
            'utm_source',
            'first_name',
            'second_name',
            'email',
            'phone',
            '_filteredParams',
        ];

        // redirect to the DTrader of there is needed query params
        if (!window.location.pathname.endsWith(routes.trade) && /chart_type|interval|symbol|trade_type/.test(search)) {
            window.history.replaceState({}, document.title, routes.trade + search);
        }

        const authorize_response = await this.setUserLogin(login_new_user);

        if (search) {
            if (code_param && action_param) this.setVerificationCode(code_param, action_param);
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    // timeout is needed to get the token (code) from the URL before we hide it from the URL
                    // and from LiveChat that gets the URL from Window, particularly when initialized via HTML script on mobile
                    history.replaceState(null, null, window.location.search.replace(/&?code=[^&]*/i, ''));
                }, 0);
            });
        }

        this.setDeviceData();

        // On case of invalid token, no need to continue with additional api calls.
        if (authorize_response?.error) {
            await this.logout();
            this.root_store.common.setError(true, {
                header: authorize_response.error.message,
                message: localize('Please Log in'),
                should_show_refresh: false,
                redirect_label: localize('Log in'),
                redirectOnClick: () => redirectToLogin(false, getLanguage()),
            });
            this.setIsLoggingIn(false);
            this.setInitialized(false);
            this.setSwitched('');
            return false;
        }

        if (['crypto_transactions_withdraw', 'payment_withdraw'].includes(action_param) && loginid_param)
            this.setLoginId(loginid_param);
        else this.setLoginId(LocalStore.get('active_loginid'));
        this.user_id = LocalStore.get('active_user_id');
        this.setAccounts(LocalStore.getObject(storage_key));
        this.setSwitched('');
        if (action_param === 'request_email' && this.is_logged_in) {
            const request_email_code = code_param ?? LocalStore.get(`verification_code.${action_param}`) ?? '';
            if (request_email_code) {
                this.setVerificationCode(request_email_code, action_param);
                this.root_store.ui.toggleResetEmailModal(true);
            }
        }
        const client = this.accounts[this.loginid];
        // If there is an authorize_response, it means it was the first login
        if (authorize_response) {
            // If this fails, it means the landing company check failed
            if (this.loginid === authorize_response.authorize.loginid) {
                BinarySocketGeneral.authorizeAccount(authorize_response);
                Analytics.identifyEvent(this.user_id);

                await this.root_store.gtm.pushDataLayer({
                    event: 'login',
                });
            } else {
                // So it will send an authorize with the accepted token, to be handled by socket-general
                await BinarySocket.authorize(client.token);
            }
            if (redirect_url) {
                const redirect_route = routes[redirect_url].length > 1 ? routes[redirect_url] : '';
                const has_action = [
                    'crypto_transactions_withdraw',
                    'payment_agent_withdraw',
                    'payment_withdraw',
                    'reset_password',
                ].includes(action_param);

                if (has_action) {
                    const query_string = filterUrlQuery(search, ['platform', 'code', 'action', 'loginid']);
                    if (
                        [routes.cashier_withdrawal, routes.cashier_pa, routes.cashier_transactions_crypto].includes(
                            redirect_route
                        )
                    ) {
                        // Set redirect path for cashier withdrawal and payment agent withdrawal (after getting PTA redirect_url)
                        window.location.replace(`/redirect?${query_string}`);
                    } else {
                        window.location.replace(`${redirect_route}/redirect?${query_string}`);
                    }
                } else {
                    window.location.replace(`${redirect_route}/?${filterUrlQuery(search, ['platform'])}`);
                }
            }
            runInAction(() => {
                this.is_populating_account_list = false;
            });
            const language = getRedirectionLanguage(
                authorize_response.authorize.preferred_language,
                this.is_new_session
            );
            const stored_language = LocalStore.get(LANGUAGE_KEY);
            if (stored_language && language !== stored_language) {
                window.history.replaceState({}, document.title, urlForLanguage(language));
                await this.root_store.common.changeSelectedLanguage(language);
            }
            if (this.citizen) {
                await this.onSetCitizen(this.citizen);
            }
            if (!this.is_virtual) {
                this.setPrevRealAccountLoginid(this.loginid);
            }
            const no_cr_account = this.active_accounts.some(acc => acc.landing_company_shortcode === 'svg');

            if (!no_cr_account && this.is_low_risk) {
                this.switchAccount(this.virtual_account_loginid);
            }
        }
        this.selectCurrency('');

        this.responsePayoutCurrencies(await WS.authorized.payoutCurrencies());

        if (this.is_logged_in) {
            this.getWalletMigrationState();

            await WS.mt5LoginList().then(this.responseMt5LoginList);
            WS.tradingServers(CFD_PLATFORMS.MT5).then(this.responseMT5TradingServers);

            WS.tradingPlatformAvailableAccounts(CFD_PLATFORMS.MT5).then(this.responseTradingPlatformAvailableAccounts);
            WS.tradingPlatformAvailableAccounts(CFD_PLATFORMS.CTRADER).then(
                this.responseCTraderTradingPlatformAvailableAccounts
            );
            WS.tradingPlatformAccountsList(CFD_PLATFORMS.DXTRADE).then(this.responseTradingPlatformAccountsList);
            WS.tradingPlatformAccountsList(CFD_PLATFORMS.CTRADER).then(this.responseTradingPlatformAccountsList);
            WS.tradingServers(CFD_PLATFORMS.DXTRADE).then(this.responseDxtradeTradingServers);

            this.responseStatement(
                await BinarySocket.send({
                    statement: 1,
                })
            );
            if (Object.keys(this.account_settings).length === 0) {
                this.setAccountSettings((await WS.authorized.cache.getSettings()).get_settings);
            }

            if (this.account_settings) this.setPreferredLanguage(this.account_settings.preferred_language);

            await this.fetchResidenceList();
            await this.getTwoFAStatus();
            if (this.account_settings && !this.account_settings.residence) {
                this.root_store.ui.toggleSetResidenceModal(true);
            }
            if (this.residence) {
                await WS.authorized.cache.landingCompany(this.residence).then(this.responseLandingCompany);
                await this.fetchStatesList();
            }
            if (!this.is_virtual) await this.getLimits();
        } else {
            this.resetMt5AccountListPopulation();
        }
        this.responseWebsiteStatus(await WS.wait('website_status'));

        this.registerReactions();
        this.setIsLoggingIn(false);
        this.setInitialized(true);

        // delete search params if it's signup when signin completed
        if (action_param === 'signup') {
            const filteredQuery = filterUrlQuery(search, ['lang']);
            history.replaceState(
                null,
                null,
                window.location.href.replace(`${search}`, filteredQuery === '' ? '' : `?${filteredQuery}`)
            );
        }

        history.replaceState(
            null,
            null,
            window.location.href.replace(`${search}`, excludeParamsFromUrlQuery(search, unused_params))
        );

        this.setIsClientStoreInitialized();
        return true;
    }

    resetMt5AccountListPopulation() {
        this.is_populating_mt5_account_list = false;
    }

    responseWebsiteStatus(response) {
        this.website_status = response.website_status;
    }

    responseLandingCompany(response) {
        this.landing_companies = response.landing_company;
        this.is_landing_company_loaded = true;
        this.setStandpoint(this.landing_companies);
    }

    setIsLandingCompanyLoaded(state) {
        this.is_landing_company_loaded = state;
    }

    setStandpoint(landing_companies) {
        if (!landing_companies) return;
        const { gaming_company, financial_company } = landing_companies;
        if (gaming_company?.shortcode) {
            this.standpoint = {
                ...this.standpoint,
                [gaming_company.shortcode]: !!gaming_company?.shortcode,
                gaming_company: gaming_company?.shortcode ?? false,
            };
        }
        if (financial_company?.shortcode) {
            this.standpoint = {
                ...this.standpoint,
                [financial_company.shortcode]: !!financial_company?.shortcode,
                financial_company: financial_company?.shortcode ?? false,
            };
        }
    }

    setLoginId(loginid) {
        this.loginid = loginid;
    }

    setAccounts(accounts) {
        this.accounts = accounts;
    }

    setSwitched(switched) {
        this.switched = switched;
    }

    /**
     * Check if account is disabled or not
     *
     * @param loginid
     * @returns {string}
     */
    isDisabled(loginid = this.loginid) {
        return this.getAccount(loginid).is_disabled;
    }

    /**
     * Get accounts token from given login id.
     *
     * @param loginid
     * @returns {string}
     */
    getToken(loginid = this.loginid) {
        return this.getAccount(loginid).token;
    }

    /**
     * Get account object from given login id
     *
     * @param loginid
     * @returns {object}
     */
    getAccount(loginid = this.loginid) {
        return this.accounts[loginid];
    }

    /**
     * Get information required by account switcher
     *
     * @param loginid
     * @returns {{loginid: *, is_virtual: (number|number|*), icon: string, title: *}}
     */
    getAccountInfo(loginid = this.loginid) {
        const account = this.getAccount(loginid);
        const currency = account.currency;
        const is_disabled = account.is_disabled;
        const is_virtual = account.is_virtual;
        const account_type = !is_virtual && currency ? currency : this.account_title;

        const ppc_campaign_cookies =
            Cookies.getJSON('utm_data') === 'null'
                ? {
                      utm_source: 'no source',
                      utm_medium: 'no medium',
                      utm_campaign: 'no campaign',
                      utm_content: 'no content',
                  }
                : Cookies.getJSON('utm_data');
        const broker = LocalStore?.get('active_loginid')
            ?.match(/[a-zA-Z]+/g)
            ?.join('');
        setTimeout(() => {
            const analytics_config = {
                account_type: broker === 'null' ? 'unlogged' : broker,
                residence_country: this.residence,
                app_id: String(getAppId()),
                device_type: isMobile() ? 'mobile' : 'desktop',
                language: getLanguage(),
                device_language: navigator?.language || 'en-EN',
                user_language: getLanguage().toLowerCase(),
                country: Cookies.get('clients_country') || Cookies?.getJSON('website_status')?.clients_country,
                utm_source: ppc_campaign_cookies?.utm_source,
                utm_medium: ppc_campaign_cookies?.utm_medium,
                utm_campaign: ppc_campaign_cookies?.utm_campaign,
                utm_content: ppc_campaign_cookies?.utm_content,
                domain: window.location.hostname,
            };
            if (this.user_id) analytics_config.user_id = this.user_id;
            Analytics.setAttributes(analytics_config);
        }, 4);

        return {
            loginid,
            is_disabled,
            is_virtual,
            icon: account_type.toLowerCase(), // TODO: display the icon
            title: account_type.toLowerCase() === 'virtual' ? localize('DEMO') : account_type,
        };
    }

    setIsLoggingIn(bool) {
        this.is_logging_in = bool;
    }

    setPreSwitchAccount(is_pre_switch) {
        this.pre_switch_broadcast = is_pre_switch;
    }

    broadcastAccountChange() {
        this.switch_broadcast = true;
    }

    broadcastAccountChangeAfterAuthorize() {
        return BinarySocket?.wait('authorize')?.then(() => {
            this.broadcastAccountChange();
        });
    }

    handleNotFoundLoginId() {
        // Logout if the switched_account doesn't belong to any loginid.
        this.root_store.notifications.addNotificationMessage({
            message: localize('Could not switch to default account.'),
            type: 'danger',
        });
        // request a logout
        this.logout();
    }

    isUnableToFindLoginId() {
        return !this.all_loginids.some(id => id !== this.switched) || this.switched === this.loginid;
    }

    async switchAccountHandler() {
        if (!this.switched || !this.switched.length || !this.getAccount(this.switched)?.token) {
            if (this.isUnableToFindLoginId()) {
                this.handleNotFoundLoginId();
                return;
            }

            // Send a toast message to let the user know we can't switch his account.
            this.root_store.notifications.addNotificationMessage({
                message: localize('Switching to default account.'),
                type: 'info',
            });

            // switch to default account.
            this.switchAccount(this.all_loginids[0]);
            await this.switchAccountHandler();
            return;
        }

        runInAction(() => (this.is_switching = true));
        this.setIsAuthorize(false);
        const from_login_id = this.loginid;
        this.resetLocalStorageValues(this.switched);
        SocketCache.clear();

        // if real to virtual --> switch to blue
        // if virtual to real --> switch to green
        // else keep the existing connection
        const should_switch_socket_connection = this.is_virtual || /VRTC|VRW/.test(from_login_id);

        if (should_switch_socket_connection) {
            BinarySocket.closeAndOpenNewConnection();
            await BinarySocket?.wait('authorize');
        } else {
            await WS.forgetAll('balance');
            await BinarySocket.authorize(this.getToken());
        }
        if (this.root_store.common.has_error) this.root_store.common.setError(false, null);
        sessionStorage.setItem('active_tab', '1');

        // set local storage
        this.root_store.gtm.setLoginFlag();
        await this.init();

        // broadcastAccountChange is already called after new connection is authorized
        if (!should_switch_socket_connection) this.broadcastAccountChange();

        runInAction(() => (this.is_switching = false));
    }

    registerReactions() {
        // Switch account reactions.
        when(
            () => this.switched,
            () => {
                // Remove real account notifications upon switching to virtual
                if (this.accounts[this.switched]?.is_virtual) {
                    this.root_store.notifications.removeNotifications(true);
                    this.root_store.notifications.removeAllNotificationMessages();
                }

                this.switchAccountHandler();
            }
        );
    }

    setBalanceActiveAccount(obj_balance) {
        if (this.accounts[obj_balance?.loginid] && obj_balance.loginid === this.loginid) {
            this.accounts[obj_balance.loginid].balance = obj_balance.balance;
            if (this.accounts[obj_balance.loginid].is_virtual) {
                this.root_store.notifications.resetVirtualBalanceNotification(obj_balance.loginid);
            }

            //temporary workaround to sync this.loginid with selected wallet loginid
            if (window.location.pathname.includes(routes.wallets)) {
                this.resetLocalStorageValues(localStorage.getItem('active_loginid') ?? this.loginid);
                return;
            }

            this.resetLocalStorageValues(this.loginid);
        }
    }

    // This callback is used for balance: all
    // Balance: all is very slow
    // --> so we keep a separate balance subscription for the active account
    setBalanceOtherAccounts(obj_balance) {
        // Balance subscription response received when mt5 transfer is in progress should be ignored.
        // After mt5 transfer is done, `balanceAll` is requested along with `mt5LoginList` in order to update the correct balance.
        if (this.root_store.modules?.cashier?.account_transfer?.is_mt5_transfer_in_progress) return;

        // Only the first response of balance:all will include all accounts
        // subsequent requests will be single account balance updates
        if (this.accounts[obj_balance?.loginid] && !obj_balance.accounts && obj_balance.loginid !== this.loginid) {
            this.accounts[obj_balance.loginid].balance = obj_balance.balance;
        }

        if (this.accounts[obj_balance?.loginid] && obj_balance.accounts) {
            Object.keys(obj_balance.accounts).forEach(account_id => {
                const is_active_account_id = account_id === this.loginid;

                if (!is_active_account_id && this.accounts[account_id]) {
                    this.accounts[account_id].balance = +obj_balance.accounts[account_id].balance;
                }
            });
        }

        if (obj_balance?.total) {
            const total_real = getPropertyValue(obj_balance, ['total', 'deriv']);
            const total_mt5 = getPropertyValue(obj_balance, ['total', CFD_PLATFORMS.MT5]);
            const total_dxtrade = getPropertyValue(obj_balance, ['total', CFD_PLATFORMS.DXTRADE]);
            // in API streaming responses MT5 balance is not re-sent, so we need to reuse the first mt5 total sent
            const has_mt5 = !isEmptyObject(total_mt5);
            const has_dxtrade = !isEmptyObject(total_dxtrade);
            this.obj_total_balance = {
                amount_real: +total_real.amount,
                amount_mt5: has_mt5 ? +total_mt5.amount : this.obj_total_balance.amount_mt5,
                amount_dxtrade: has_dxtrade ? +total_dxtrade.amount : this.obj_total_balance.amount_dxtrade,
                currency: total_real.currency,
            };
        }
    }

    selectCurrency(value) {
        this.selected_currency = value;
    }

    setResidence(residence) {
        if (this.loginid) {
            this.accounts[this.loginid].residence = residence;
        }
    }

    setCitizen(citizen) {
        this.citizen = citizen;
    }

    setEmail(email) {
        if (this.loginid) {
            this.accounts[this.loginid].email = email;
            this.email = email;
        }
    }

    setIsClientStoreInitialized() {
        this.is_client_store_initialized = true;
    }

    setAccountSettings(settings) {
        const is_equal_settings = JSON.stringify(settings) === JSON.stringify(this.account_settings);
        if (!is_equal_settings) {
            this.account_settings = settings;
            this.is_account_setting_loaded = true;
        }
    }

    setAccountStatus(status) {
        this.account_status = status;
    }

    async updateAccountStatus() {
        const account_status_response = await WS.authorized.getAccountStatus();
        if (!account_status_response.error) {
            this.setAccountStatus(account_status_response.get_account_status);
        }
    }

    setInitialized(is_initialized) {
        this.initialized_broadcast = is_initialized;
    }

    cleanUp() {
        // delete all notifications keys for this account when logout
        const notification_messages = LocalStore.getObject('notification_messages');
        if (notification_messages && this.loginid) {
            delete notification_messages[this.loginid];
            LocalStore.setObject('notification_messages', {
                ...notification_messages,
            });
        }

        this.root_store.gtm.pushDataLayer({
            event: 'log_out',
        });
        this.loginid = null;
        this.user_id = null;
        this.upgrade_info = undefined;
        this.accounts = {};
        this.mt5_login_list = [];
        this.dxtrade_accounts_list = [];
        this.ctrader_accounts_list = [];
        this.landing_companies = {};
        LocalStore.set('marked_notifications', JSON.stringify([]));
        localStorage.setItem('active_loginid', this.loginid);
        localStorage.setItem('active_user_id', this.user_id);
        localStorage.setItem('client.accounts', JSON.stringify(this.accounts));

        runInAction(async () => {
            this.responsePayoutCurrencies(await WS.payoutCurrencies());
        });
        this.root_store.notifications.removeAllNotificationMessages(true);
        this.syncWithLegacyPlatforms(this.loginid, this.accounts);
    }

    async logout() {
        // makes sure to clear the cached traders-hub data when logging out
        localStorage.removeItem('traders_hub_store');

        // TODO: [add-client-action] - Move logout functionality to client store
        const response = await requestLogout();

        if (response?.logout === 1) {
            this.cleanUp();

            this.setLogout(true);
        }

        return response;
    }

    setLogout(is_logged_out) {
        this.has_logged_out = is_logged_out;
        if (this.root_store.common.has_error) this.root_store.common.setError(false, null);
    }

    /* eslint-disable */
    storeClientAccounts(obj_params, account_list) {
        // store consistent names with other API calls
        // API_V4: send consistent names
        const map_names = {
            country: 'residence',
            landing_company_name: 'landing_company_shortcode',
        };
        const client_object = {};
        const selected_account = obj_params?.selected_acct;
        const verification_code = obj_params?.code;
        const is_wallets_selected = selected_account?.startsWith('CRW');
        let active_loginid;
        let active_wallet_loginid;

        if (selected_account) {
            if (is_wallets_selected) {
                active_wallet_loginid = obj_params.selected_acct;
            }
            active_loginid = obj_params.selected_acct;
        }

        account_list.forEach(function (account) {
            Object.keys(account).forEach(function (param) {
                if (param === 'loginid') {
                    if (!active_loginid && !account.is_disabled) {
                        if (!account.is_virtual) {
                            active_loginid = account[param];
                        } else if (account.is_virtual) {
                            // TODO: [only_virtual] remove this to stop logging non-SVG clients into virtual
                            active_loginid = account[param];
                        }
                    }
                } else {
                    const param_to_set = map_names[param] || param;
                    const value_to_set = typeof account[param] === 'undefined' ? '' : account[param];
                    if (!(account.loginid in client_object)) {
                        client_object[account.loginid] = {};
                    }
                    client_object[account.loginid][param_to_set] = value_to_set;
                }
            });
        });

        let i = 1;
        while (obj_params[`acct${i}`]) {
            const loginid = obj_params[`acct${i}`];
            const token = obj_params[`token${i}`];
            if (loginid && token) {
                client_object[loginid].token = token;
            }
            i++;
        }

        // if didn't find any login ID that matched the above condition
        // or the selected one doesn't have a token, set the first one
        if (!active_loginid || !client_object[active_loginid].token) {
            active_loginid = obj_params.acct1;
        }

        // TODO: send login flag to GTM if needed
        if (active_loginid && Object.keys(client_object).length) {
            if (selected_account && is_wallets_selected) {
                localStorage.setItem('active_wallet_loginid', active_wallet_loginid);
                if (verification_code) {
                    localStorage.setItem('verification_code.payment_withdraw', verification_code);
                }
            }

            localStorage.setItem('active_loginid', active_loginid);
            localStorage.setItem('client.accounts', JSON.stringify(client_object));
            this.syncWithLegacyPlatforms(active_loginid, this.accounts);
        }
    }

    async setUserLogin(login_new_user) {
        // login_new_user is populated only on virtual sign-up
        let obj_params = {};
        const search = window.location.search;

        let is_social_signup_provider = false;

        if (search) {
            let search_params = new URLSearchParams(window.location.search);

            search_params.forEach((value, key) => {
                const account_keys = ['acct', 'token', 'cur', 'code'];
                const is_account_param = account_keys.some(
                    account_key => key?.includes(account_key) && key !== 'affiliate_token'
                );

                if (is_account_param) {
                    obj_params[key] = value;
                    is_social_signup_provider = true;
                }
            });

            this.is_new_session = Object.keys(obj_params).length > 0;

            // delete account query params - but keep other query params (e.g. utm)
            Object.keys(obj_params).forEach(key => search_params.delete(key));
            search_params.delete('state'); // remove unused state= query string
            search_params = search_params?.toString();
            const search_param_without_account = search_params ? `?${search_params}` : '/';
            history.replaceState(null, null, `${search_param_without_account}${window.location.hash}`);
        }

        const is_client_logging_in = login_new_user ? login_new_user.token1 : obj_params.token1;

        if (is_client_logging_in) {
            this.setIsLoggingIn(true);

            const redirect_url = sessionStorage.getItem('redirect_url');

            const target_url = routes.traders_hub;

            if (
                (redirect_url?.endsWith(routes.trade) ||
                    redirect_url?.endsWith(routes.bot) ||
                    /chart_type|interval|symbol|trade_type/.test(redirect_url)) &&
                (isTestLink() || isProduction() || isLocal() || isStaging() || isTestDerivApp())
            ) {
                window.history.replaceState({}, document.title, target_url);
            } else {
                window.history.replaceState({}, document.title, sessionStorage.getItem('redirect_url'));
            }
            SocketCache.clear();
            // is_populating_account_list is used for socket general to know not to filter the first-time logins
            this.is_populating_account_list = true;
            const authorize_response = await BinarySocket.authorize(is_client_logging_in);

            if (is_social_signup_provider) {
                const { get_account_status } = await WS.authorized.getAccountStatus();

                Analytics.trackEvent('ce_virtual_signup_form', {
                    action: 'signup_continued',
                    signup_provider: get_account_status?.social_identity_provider,
                    form_name: this.root_store?.ui?.is_mobile
                        ? 'virtual_signup_web_mobile_default'
                        : 'virtual_signup_web_desktop_default',
                });
            }

            if (login_new_user) {
                // overwrite obj_params if login is for new virtual account
                obj_params = login_new_user;
            }

            if (authorize_response.error) {
                return authorize_response;
            }

            runInAction(() => {
                const account_list = (authorize_response.authorize || {}).account_list;
                this.upgradeable_landing_companies = [...new Set(authorize_response.upgradeable_landing_companies)];

                if (this.canStoreClientAccounts(obj_params, account_list)) {
                    this.storeClientAccounts(obj_params, account_list);
                } else {
                    // Since there is no API error, we have to add this to manually trigger checks in other parts of the code.
                    authorize_response.error = {
                        code: 'MismatchedAcct',
                        message: localize('Invalid token'),
                    };
                }
            });
            return authorize_response;
        }
    }

    canStoreClientAccounts(obj_params, account_list) {
        const is_ready_to_process = account_list && isEmptyObject(this.accounts);
        const accts = Object.keys(obj_params).filter(value => /^acct./.test(value));

        const is_cross_checked = accts.every(acct =>
            account_list.some(account => account.loginid === obj_params[acct])
        );

        return is_ready_to_process && is_cross_checked;
    }

    setVerificationCode(code, action) {
        this.verification_code[action] = code;
        if (action !== 'phone_number_verification') {
            if (code) {
                LocalStore.set(`verification_code.${action}`, code);
            } else {
                LocalStore.remove(`verification_code.${action}`);
            }
        }
        if (action === 'signup') {
            // TODO: add await if error handling needs to happen before AccountSignup is initialised
            this.fetchResidenceList(); // Prefetch for use in account signup process
        }
    }

    setNewEmail(email, action) {
        this.new_email[action] = email;
        if (email) {
            LocalStore.set(`new_email.${action}`, email);
        } else {
            LocalStore.remove(`new_email.${action}`);
        }
    }

    setDeviceData() {
        setDeviceDataCookie('signup_device', isDesktopOs() ? 'desktop' : 'mobile');
    }

    getSignupParams() {
        const param_list = [
            'date_first_contact',
            'signup_device',
            'gclid_url',
            'utm_source',
            'utm_ad_id',
            'utm_adgroup_id',
            'utm_adrollclk_id',
            'utm_campaign_id',
            'utm_campaign',
            'utm_fbcl_id',
            'utm_gl_client_id',
            'utm_msclk_id',
            'utm_medium',
            'utm_term',
            'utm_content',
            'affiliate_token',
        ];
        const signup_params = {};
        const url_params = new URLSearchParams(window.location.search);

        param_list.forEach(key => {
            if (url_params.get(key)) {
                signup_params[key] = url_params.get(key);
            }
        });

        return signup_params;
    }

    onSetResidence({ residence }, cb) {
        if (!residence) return;
        WS.setSettings({
            residence,
        }).then(async response => {
            if (response.error) {
                cb(response.error.message);
            } else {
                await this.setResidence(residence);
                await WS.authorized.storage
                    .landingCompany(this.accounts[this.loginid].residence)
                    .then(this.responseLandingCompany);
                await WS.authorized.storage.getSettings().then(async response => {
                    this.setAccountSettings(response.get_settings);
                });
                runInAction(async () => {
                    await BinarySocket.authorize(this.getToken()).then(() => {
                        runInAction(() => (this.upgrade_info = this.getBasicUpgradeInfo()));
                    });
                });
                cb();
            }
        });
    }

    async onSetCitizen(citizen) {
        if (!citizen) return;
        WS.authorized.setSettings({
            set_settings: 1,
            citizen,
        });
    }

    onSignup({ citizenship, password, residence }, cb) {
        if (!this.verification_code.signup || !password || !residence || !citizenship) return;
        WS.newAccountVirtual(this.verification_code.signup, password, residence, this.getSignupParams())
            .then(async response => {
                if (response.error) {
                    cb(response.error.message);
                } else {
                    cb();
                    // Initialize client store with new user login
                    const { client_id, currency, oauth_token } = response.new_account_virtual;
                    await this.setCitizen(citizenship);
                    await this.switchToNewlyCreatedAccount(client_id, oauth_token, currency);
                    // GTM Signup event
                    this.root_store.gtm.pushDataLayer({
                        event: 'virtual_signup',
                    });
                }
            })
            .finally(() => {
                setTimeout(() => {
                    const { event, analyticsData } = window.dataLayer.find(
                        el => el.event === 'ce_questionnaire_form'
                    ) ?? { event: 'unhandled', analyticsData: {} };
                    Analytics.trackEvent(event, analyticsData);
                }, 10000);
            });
    }

    async switchToNewlyCreatedAccount(client_id, oauth_token, currency) {
        this.setPreSwitchAccount(true);
        const new_user_login = {
            acct1: client_id,
            token1: oauth_token,
            curr1: currency,
        };
        await this.init(new_user_login);
        this.broadcastAccountChange();
    }

    fetchAccountSettings() {
        return new Promise(resolve => {
            WS.authorized.storage.getSettings().then(response => {
                this.setAccountSettings(response.get_settings);
                resolve(response);
            });
        });
    }

    fetchResidenceList() {
        return new Promise(resolve => {
            WS.storage.residenceList().then(response => {
                this.setResidenceList(response);
                resolve(response);
            });
        });
    }

    setResidenceList(residence_list_response) {
        this.residence_list = residence_list_response.residence_list || [];
    }

    fetchStatesList() {
        return new Promise((resolve, reject) => {
            WS.authorized.storage
                .statesList({
                    states_list: this.accounts[this.loginid].residence,
                })
                .then(response => {
                    if (response.error) {
                        reject(response.error);
                    } else {
                        runInAction(() => {
                            this.states_list = response.states_list || [];
                        });
                    }
                    resolve(response);
                });
        });
    }

    resetMt5ListPopulatedState() {
        this.is_mt5_account_list_updated = false;
        this.is_populating_mt5_account_list = true;
        this.mt5_login_list_error = null;
    }

    async updateMt5LoginList() {
        if (this.is_logged_in && !this.is_mt5_account_list_updated && !this.is_populating_mt5_account_list) {
            const response = await WS.mt5LoginList();
            this.responseMt5LoginList(response);
        }
    }

    responseMT5TradingServers(response) {
        if (response.error) {
            this.mt5_trading_servers = [];
            return;
        }
        this.mt5_trading_servers = response.trading_servers;
    }

    responseMt5LoginList(response) {
        this.is_populating_mt5_account_list = false;
        this.is_mt5_account_list_updated = true;
        this.mt5_login_list_error = null;
        /** we need to update mt5_login_list on mount of account switcher
         *  to get the new MT5 balances (balance does not stream for MT5 accounts due to API restriction)
         *  but to avoid spamming this call since the rate limit is strict
         *  keep the current mt5_login_list response cached for one minute
         *  after one minute consider it outdated and allow re-requesting it */
        setTimeout(() => {
            this.is_mt5_account_list_updated = false;
        }, 60000);

        if (!response.error) {
            this.mt5_login_list = response.mt5_login_list.map(account => {
                const display_login = (account.error ? account.error.details.login : account.login).replace(
                    /^(MT[DR]?)/i,
                    ''
                );
                if (account.error) {
                    const { account_type, server } = account.error.details;
                    this.setMT5DisabledSignupTypes({
                        [account_type]: true,
                    });
                    return {
                        account_type,
                        display_login,
                        has_error: true,
                        server,
                    };
                }
                return {
                    ...account,
                    display_login,
                };
            });
        } else {
            this.mt5_login_list_error = response.error;
        }
    }

    responseDxtradeTradingServers(response) {
        if (response.error) {
            this.dxtrade_trading_servers = [];
            return;
        }
        this.dxtrade_trading_servers = response.trading_servers;

        this.dxtrade_trading_servers.forEach(trading_server => {
            const { account_type, disabled } = trading_server;
            if (disabled) {
                this.setCFDDisabledSignupTypes(CFD_PLATFORMS.DXTRADE, {
                    [account_type]: true,
                });
            }
        });
    }

    responseTradingPlatformAvailableAccounts(response) {
        if (!response.error) {
            this.trading_platform_available_accounts = response.trading_platform_available_accounts;
        }
    }

    responseCTraderTradingPlatformAvailableAccounts(response) {
        if (!response.error) {
            this.ctrader_trading_platform_available_accounts = response.trading_platform_available_accounts;
        }
    }

    responseTradingPlatformAccountsList(response) {
        const { platform } = response.echo_req || {};

        this[`is_populating_${platform}_account_list`] = false;
        this[`${platform}_accounts_list_error`] = null;

        if (!response.error) {
            this[`${platform}_accounts_list`] = sortApiData(response.trading_platform_accounts).map(account => {
                const display_login = account.error ? account.error.details.account_id : account.account_id;
                if (account.error) {
                    const { account_type, server } = account.error.details;
                    if (platform === CFD_PLATFORMS.DXTRADE || platform === CFD_PLATFORMS.CTRADER) {
                        this.setCFDDisabledSignupTypes(platform, {
                            [account_type]: true,
                        });
                    }
                    return {
                        account_type,
                        display_login,
                        has_error: true,
                        server,
                    };
                }
                return {
                    ...account,
                    display_login,
                };
            });
        } else {
            this[`${platform}_accounts_list_error`] = response.error;
        }
    }

    responseStatement(response) {
        if (!response.error) {
            this.statement = response.statement;
        }
    }

    getChangeableFields() {
        const readonly_fields = [
            ...(this.account_settings.immutable_fields || []),
            ...['immutable_fields', 'email', 'password'],
        ];
        return Object.keys(this.account_settings).filter(field => !readonly_fields.includes(field));
    }

    syncWithLegacyPlatforms(active_loginid, client_accounts) {
        const smartTrader = {};
        const p2p = {};

        smartTrader.iframe = document.getElementById('localstorage-sync');
        p2p.iframe = document.getElementById('localstorage-sync__p2p');
        smartTrader.origin = getUrlSmartTrader();
        p2p.origin = getUrlP2P(false);

        [smartTrader, p2p].forEach(platform => {
            if (platform.iframe) {
                // Keep client.accounts in sync (in case user wasn't logged in).
                platform.iframe.contentWindow.postMessage(
                    {
                        key: 'client.accounts',
                        value: JSON.stringify(client_accounts),
                    },
                    platform.origin
                );
                platform.iframe.contentWindow.postMessage(
                    {
                        key: 'active_loginid',
                        value: active_loginid,
                    },
                    platform.origin
                );

                if (platform === p2p) {
                    const currentLang = LocalStore.get(LANGUAGE_KEY);
                    platform.iframe.contentWindow.postMessage(
                        {
                            key: LANGUAGE_KEY,
                            value: currentLang,
                        },
                        platform.origin
                    );
                }
            }
        });
    }

    get is_high_risk() {
        if (isEmptyObject(this.account_status)) return false;
        const { gaming_company, financial_company } = this.landing_companies;

        // This is a conditional check for countries like Australia/Norway which fulfil one of these following conditions.
        const restricted_countries =
            financial_company?.shortcode === 'svg' ||
            (gaming_company?.shortcode === 'svg' && financial_company?.shortcode !== 'maltainvest');

        const high_risk_landing_company = financial_company?.shortcode === 'svg' && gaming_company?.shortcode === 'svg';
        return high_risk_landing_company || this.account_status.risk_classification === 'high' || restricted_countries;
    }

    get is_low_risk() {
        const { gaming_company, financial_company } = this.landing_companies;
        const low_risk_landing_company =
            financial_company?.shortcode === 'maltainvest' && gaming_company?.shortcode === 'svg';
        return (
            low_risk_landing_company ||
            (this.upgradeable_landing_companies?.includes('svg') &&
                this.upgradeable_landing_companies?.includes('maltainvest'))
        );
    }

    get has_residence() {
        return !!this.accounts[this.loginid]?.residence;
    }

    get ctrader_total_balance() {
        return this.ctrader_accounts_list
            ?.filter(ctrader_account => ctrader_account.account_type === 'real')
            .reduce((accumulator, ctrader_acc) => accumulator + (ctrader_acc?.balance ?? 0), 0);
    }

    get is_proof_of_ownership_enabled() {
        if (!this.account_status?.authentication) return false;
        const { ownership, needs_verification } = this.account_status.authentication;
        return needs_verification?.includes('ownership') || ownership?.status === 'verified';
    }

    fetchFinancialAssessment() {
        return new Promise(async resolve => {
            const { get_financial_assessment } = await WS.authorized.storage.getFinancialAssessment();

            runInAction(() => (this.financial_assessment = get_financial_assessment));
            resolve(get_financial_assessment);
        });
    }

    async setFinancialAndTradingAssessment(payload) {
        const response = await WS.setFinancialAndTradingAssessment(payload);
        return response;
    }

    setTwoFAStatus(status) {
        this.has_enabled_two_fa = status;
    }

    getTwoFAStatus() {
        return new Promise(resolve => {
            WS.authorized.accountSecurity({ account_security: 1, totp_action: 'status' }).then(response => {
                if (response.error) {
                    resolve(response.error);
                } else {
                    const is_enabled = !!getPropertyValue(response, ['account_security', 'totp', 'is_enabled']);
                    this.setTwoFAStatus(is_enabled);
                    resolve(is_enabled);
                }
            });
        });
    }

    setTwoFAChangedStatus(status) {
        this.has_changed_two_fa = status;
    }

    async updateMT5Status() {
        this.updateAccountStatus();
        await WS.authorized.mt5LoginList().then(this.root_store.client.responseMt5LoginList);
    }

    setPrevRealAccountLoginid = logind => {
        this.prev_real_account_loginid = logind;
    };

    setPrevAccountType = acc_type => {
        this.prev_account_type = acc_type;
    };

    setIsAlreadyAttempted(status) {
        this.is_already_attempted = status;
    }

    setIsP2PEnabled(is_p2p_enabled) {
        this.is_p2p_enabled = is_p2p_enabled;
    }

    setRealAccountSignupFormData(data) {
        this.real_account_signup_form_data = data;
    }

    setRealAccountSignupFormStep(step) {
        this.real_account_signup_form_step = step;
    }

    setWalletMigrationState(state) {
        this.wallet_migration_state = state;
    }

    setIsWalletMigrationRequestIsInProgress(value) {
        this.is_wallet_migration_request_is_in_progress = value;
    }

    async getWalletMigrationState() {
        try {
            const response = await WS.authorized.getWalletMigrationState();
            if (response?.wallet_migration?.state) this.setWalletMigrationState(response?.wallet_migration?.state);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(`Something wrong: code = ${error?.error?.code}, message = ${error?.error?.message}`);
        }
    }

    async startWalletMigration() {
        this.setIsWalletMigrationRequestIsInProgress(true);
        try {
            await WS.authorized.startWalletMigration();
            await this.getWalletMigrationState();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(`Something wrong: code = ${error?.error?.code}, message = ${error?.error?.message}`);
        } finally {
            this.setIsWalletMigrationRequestIsInProgress(false);
        }
    }

    async resetWalletMigration() {
        this.setIsWalletMigrationRequestIsInProgress(true);
        try {
            await WS.authorized.resetWalletMigration();
            this.getWalletMigrationState();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(`Something wrong: code = ${error?.error?.code}, message = ${error?.error?.message}`);
        } finally {
            this.setIsWalletMigrationRequestIsInProgress(false);
        }
    }

    setIsPasskeySupported(is_passkey_supported = false) {
        this.is_passkey_supported = is_passkey_supported;
    }

    setIsPhoneNumberVerificationEnabled(is_phone_number_verification_enabled = false) {
        this.is_phone_number_verification_enabled = is_phone_number_verification_enabled;
    }

    setShouldShowPasskeyNotification(should_show_passkey_notification = true) {
        this.should_show_passkey_notification = should_show_passkey_notification;
    }

    setPasskeysStatusToCookie(status) {
        let domain = /deriv.com/.test(window.location.hostname) ? URLConstants.derivHost : window.location.hostname;

        if (/deriv.dev/.test(window.location.hostname)) {
            //set domain for dev environment (FE deployment and login page on qa-box)
            domain = 'deriv.dev';
        }

        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1); // Set to expire in 1 year

        const is_available = status === 'available';

        Cookies.set('passkeys_available', String(is_available), {
            expires: expirationDate,
            path: '/',
            domain,
            secure: true,
            sameSite: 'None',
        });
    }

    async fetchPasskeysList() {
        const data = await WS.authorized.send({ passkeys_list: 1 });
        this.passkeys_list = data?.passkeys_list;
    }

    async fetchShouldShowPasskeyNotification() {
        if (this.root_store.ui?.is_mobile) {
            try {
                await this.fetchPasskeysList();
                const is_passkeys_empty = this.passkeys_list.length === 0;
                if (!is_passkeys_empty) {
                    this.setPasskeysStatusToCookie('available');
                }
                this.setShouldShowPasskeyNotification(is_passkeys_empty);
            } catch (e) {
                //error handling needed
            }
        } else {
            this.setShouldShowPasskeyNotification(false);
        }
    }

    addSubscription(name, key, subscription, subscription_id) {
        this.subscriptions[name] = this.subscriptions[name] ?? {};
        this.subscriptions[name][key] = this.subscriptions[name][key] ?? { sub: undefined, id: undefined };
        if (subscription) this.subscriptions[name][key].sub = subscription;
        if (subscription_id) this.subscriptions[name][key].id = subscription_id;
    }

    setExchangeRates(rates) {
        this.exchange_rates = { ...rates };
    }

    getExchangeRate = (base_currency, target_currency) => {
        if (this.exchange_rates) {
            return this.exchange_rates?.[base_currency]?.[target_currency] ?? 1;
        }
        return 1;
    };

    subscribeToEndpoint = async (name, payload) => {
        const key = JSON.stringify({ name, payload });
        const matchingSubscription = this.subscriptions?.[name]?.[key]?.sub;
        if (matchingSubscription) return { key, subscription: matchingSubscription };

        try {
            const subscription = await WS?.subscribe({
                [name]: 1,
                subscribe: 1,
                ...(payload ?? {}),
            });

            this.addSubscription(name, key, subscription);
            return { key, subscription };
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(`Something wrong: code = ${error?.error?.code}, message = ${error?.error?.message}`);
            return {};
        }
    };

    unsubscribeByKey = async (name, key) => {
        const matchingSubscription = this.subscriptions?.[name]?.[key]?.sub;
        if (matchingSubscription) {
            try {
                await WS?.forget(this.subscriptions?.[name]?.[key]?.id);
                delete this.subscriptions?.[name]?.[key];
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log(`Something wrong: code = ${error?.error?.code}, message = ${error?.error?.message}`);
            }
        }
    };

    subscribeToExchangeRate = async (base_currency, target_currency) => {
        if (base_currency === '' || target_currency === '' || base_currency === target_currency) return;
        if (this.exchange_rates?.[base_currency]?.[target_currency]) return;

        const { key, subscription } = await this.subscribeToEndpoint('exchange_rates', {
            base_currency,
            target_currency,
        });

        subscription.subscribe(
            response => {
                const rates = response.exchange_rates?.rates;
                const subscription_id = String(response.subscription?.id);

                if (rates) {
                    this.addSubscription('exchange_rates', key, undefined, subscription_id);

                    const currentData = { ...this.exchange_rates };
                    if (currentData) {
                        currentData[base_currency] = { ...currentData[base_currency], ...rates };
                    } else currentData = { [base_currency]: rates };

                    this.setExchangeRates(currentData);
                }
            },
            error => {
                // eslint-disable-next-line no-console
                console.log(`Something wrong: code = ${error?.error?.code}, message = ${error?.error?.message}`);
            }
        );
    };

    unsubscribeFromExchangeRate = async (base_currency, target_currency) => {
        if (base_currency && target_currency) {
            const key = JSON.stringify({ name: 'exchange_rates', payload: { base_currency, target_currency } });
            await this.unsubscribeByKey('exchange_rates', key);
            delete this.subscriptions?.['exchange_rates']?.[key];

            const currData = { ...this.exchange_rates };
            delete currData[payload.base_currency];
            this.setExchangeRates(currData);
        }
    };

    unsubscribeFromAllExchangeRates = () => {
        Object.keys(this.subscriptions?.exchange_rates ?? {})?.forEach(key => {
            this.unsubscribeByKey('exchange_rates', key);
        });
        this.setExchangeRates({});
    };

    get is_cr_account() {
        return this.loginid?.startsWith('CR');
    }

    get is_mf_account() {
        return this.loginid?.startsWith('MF');
    }

    get account_time_of_closure() {
        return this.account_status?.account_closure?.find(
            item => item?.status_codes?.includes('residence_closure') && item?.type === 'residence'
        )?.time_of_closure;
    }

    get is_account_to_be_closed_by_residence() {
        return this.account_time_of_closure && this.residence && this.residence === 'sn';
    }
}
