import Cookies from 'js-cookie';
import { action, computed, observable, reaction, runInAction, toJS, when } from 'mobx';
import moment from 'moment';
import {
    redirectToLogin,
    getPropertyValue,
    getUrlSmartTrader,
    isDesktopOs,
    isEmptyObject,
    LocalStore,
    setCurrencies,
    State,
    toMoment,
    deriv_urls,
    urlForLanguage,
    CFD_PLATFORMS,
} from '@deriv/shared';
import { getLanguage, localize } from '@deriv/translations';
import { requestLogout, WS } from 'Services';
import BinarySocketGeneral from 'Services/socket-general';
import BinarySocket from '_common/base/socket_base';
import * as SocketCache from '_common/base/socket_cache';
import { isEuCountry, isOptionsBlocked, isSyntheticsUnavailable } from '_common/utility';
import BaseStore from './base-store';
import { getClientAccountType, getAccountTitle } from './Helpers/client';
import { setDeviceDataCookie } from './Helpers/device';
import { handleClientNotifications, clientNotifications } from './Helpers/client-notifications';
import { buildCurrenciesList } from './Modules/Trading/Helpers/currency';

const LANGUAGE_KEY = 'i18n_language';
const storage_key = 'client.accounts';
const store_name = 'client_store';
const eu_shortcode_regex = new RegExp('^(maltainvest|malta|iom)$');
const eu_excluded_regex = new RegExp('^mt$');

export default class ClientStore extends BaseStore {
    @observable loginid;
    @observable preferred_language;
    @observable upgrade_info;
    @observable email;
    @observable accounts = {};
    @observable pre_switch_broadcast = false;
    @observable switched = '';
    @observable is_switching = false;
    @observable switch_broadcast = false;
    @observable initialized_broadcast = false;
    @observable currencies_list = {};
    @observable residence_list = [];
    @observable states_list = [];
    @observable selected_currency = '';
    @observable is_populating_account_list = false;
    @observable is_populating_mt5_account_list = true;
    @observable is_populating_dxtrade_account_list = true;
    @observable has_reality_check = false;
    @observable is_reality_check_dismissed;
    @observable reality_check_dur;
    @observable reality_check_timeout;
    @observable website_status = {};
    @observable account_settings = {};
    @observable account_status = {};
    @observable device_data = {};
    @observable is_logging_in = false;
    @observable has_logged_out = false;
    @observable is_landing_company_loaded = false;
    @observable is_account_setting_loaded = false;
    // this will store the landing_company API response, including
    // financial_company: {}
    // gaming_company: {}
    // mt_financial_company: {}
    // mt_gaming_company: {}
    @observable landing_companies = {};

    @observable upgradeable_landing_companies = [];
    @observable mt5_disabled_signup_types = { real: false, demo: false };
    @observable mt5_login_list = [];
    @observable mt5_login_list_error = null;
    @observable dxtrade_accounts_list = [];
    @observable dxtrade_accounts_list_error = null;
    @observable dxtrade_disabled_signup_types = { real: false, demo: false };
    @observable statement = [];
    @observable obj_total_balance = {
        amount_real: undefined,
        amount_mt5: undefined,
        amount_dxtrade: undefined,
        currency: '',
    };

    @observable verification_code = {
        signup: '',
        reset_password: '',
        payment_withdraw: '',
        payment_agent_withdraw: '',
        trading_platform_password_reset: '',
    };
    @observable account_limits = {};

    @observable self_exclusion = {};

    @observable local_currency_config = {
        currency: '',
        decimal_places: undefined,
    };
    @observable has_cookie_account = false;

    @observable financial_assessment = null;

    @observable trading_servers = [];

    is_mt5_account_list_updated = false;

    constructor(root_store) {
        const local_storage_properties = ['device_data'];
        super({ root_store, local_storage_properties, store_name });

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
            }
        );
        when(
            () => this.should_have_real_account,
            () => {
                this.root_store.ui.showAccountTypesModalForEuropean();
                this.onRealAccountSignupEnd(() => {
                    if (!this.has_any_real_account) {
                        this.root_store.ui.showAccountTypesModalForEuropean();
                    }

                    return Promise.resolve();
                });

                if (!this.root_store.ui.is_real_acc_signup_on) {
                    this.root_store.ui.toggleAccountTypesModal(true);
                }
            }
        );
        when(
            () => !this.is_logged_in && this.root_store.ui && this.root_store.ui.is_real_acc_signup_on,
            () => this.root_store.ui.closeRealAccountSignup()
        );
    }

    @computed
    get balance() {
        if (isEmptyObject(this.accounts)) return undefined;
        return this.accounts[this.loginid] && 'balance' in this.accounts[this.loginid]
            ? this.accounts[this.loginid].balance.toString()
            : undefined;
    }

    @computed
    get is_reality_check_visible() {
        if (!this.loginid || !this.landing_company) {
            return false;
        }
        return !!(this.has_reality_check && !this.reality_check_dismissed);
    }

    @computed
    get is_svg() {
        if (!this.landing_company_shortcode) {
            return false;
        }
        return this.landing_company_shortcode === 'svg' || this.landing_company_shortcode === 'costarica';
    }

    @computed
    get reality_check_duration() {
        return this.has_reality_check ? this.reality_check_dur || +LocalStore.get('reality_check_duration') : undefined;
    }

    @computed
    get reality_check_dismissed() {
        return this.has_reality_check
            ? this.is_reality_check_dismissed || JSON.parse(LocalStore.get('reality_check_dismissed') || false)
            : undefined;
    }

    @computed
    get has_active_real_account() {
        return this.active_accounts.some(acc => acc.is_virtual === 0);
    }

    @computed
    get has_maltainvest_account() {
        return this.active_accounts.some(acc => acc.landing_company_shortcode === 'maltainvest');
    }

    @computed
    get has_malta_account() {
        return this.active_accounts.some(acc => acc.landing_company_shortcode === 'malta');
    }

    hasAnyRealAccount = () => {
        return this.account_list.some(acc => acc.is_virtual === 0);
    };

    @computed
    get has_any_real_account() {
        return this.hasAnyRealAccount();
    }

    @computed
    get first_switchable_real_loginid() {
        const result = this.active_accounts.find(
            acc => acc.is_virtual === 0 && acc.landing_company_shortcode === 'svg'
        );
        return result.loginid || undefined;
    }

    @computed
    get can_change_fiat_currency() {
        const has_no_mt5 = !this.has_mt5_login;
        const has_no_dxtrade = !this.has_dxtrade_login;
        const has_no_transaction = this.statement.count === 0 && this.statement.transactions.length === 0;
        const has_account_criteria = has_no_transaction && has_no_mt5 && has_no_dxtrade;
        return !this.is_virtual && has_account_criteria && this.current_currency_type === 'fiat';
    }

    @computed
    get legal_allowed_currencies() {
        const getDefaultAllowedCurrencies = () => {
            if (this.landing_companies.gaming_company) {
                return this.landing_companies.gaming_company.legal_allowed_currencies;
            }
            if (this.landing_companies.financial_company) {
                return this.landing_companies.financial_company.legal_allowed_currencies;
            }
            return [];
        };

        if (!this.landing_companies || !this.root_store.ui) return [];
        if (!this.root_store.ui.real_account_signup_target) {
            return getDefaultAllowedCurrencies();
        }
        if (['set_currency', 'manage'].includes(this.root_store.ui.real_account_signup_target)) {
            return this.current_landing_company?.legal_allowed_currencies;
        }
        const target = this.root_store.ui.real_account_signup_target === 'maltainvest' ? 'financial' : 'gaming';

        if (this.landing_companies[`${target}_company`]) {
            return this.landing_companies[`${target}_company`].legal_allowed_currencies;
        }

        return getDefaultAllowedCurrencies();
    }

    @computed
    get upgradeable_currencies() {
        if (!this.legal_allowed_currencies || !this.website_status.currencies_config) return [];
        return this.legal_allowed_currencies.map(currency => ({
            value: currency,
            ...this.website_status.currencies_config[currency],
        }));
    }

    @computed
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

    @computed
    get available_crypto_currencies() {
        const values = Object.values(this.accounts).reduce((acc, item) => {
            acc.push(item.currency);
            return acc;
        }, []);

        return this.upgradeable_currencies.filter(acc => !values.includes(acc.value) && acc.type === 'crypto');
    }

    @computed
    get has_iom_account() {
        return this.active_accounts.some(acc => acc.landing_company_shortcode === 'iom');
    }

    @computed
    get has_fiat() {
        const values = Object.values(this.accounts).reduce((acc, item) => {
            if (!item.is_virtual) {
                acc.push(item.currency);
            }
            return acc;
        }, []);
        return !!this.upgradeable_currencies.filter(acc => values.includes(acc.value) && acc.type === 'fiat').length;
    }

    @computed
    get current_fiat_currency() {
        const values = Object.values(this.accounts).reduce((acc, item) => {
            if (!item.is_virtual) {
                acc.push(item.currency);
            }
            return acc;
        }, []);

        return this.has_fiat
            ? this.upgradeable_currencies.filter(acc => values.includes(acc.value) && acc.type === 'fiat')[0].value
            : undefined;
    }

    // return the landing company object that belongs to the current client by matching shortcode
    // note that it will be undefined for logged out and virtual clients
    @computed
    get current_landing_company() {
        const landing_company = Object.keys(this.landing_companies).find(
            company => this.landing_companies[company]?.shortcode === this.landing_company_shortcode
        );
        return landing_company ? this.landing_companies[landing_company] : undefined;
    }

    @computed
    get account_list() {
        return this.all_loginids.map(id => this.getAccountInfo(id)).filter(account => account);
    }

    @computed
    get has_mt5_login() {
        return this.mt5_login_list.length > 0;
    }

    @computed
    get has_dxtrade_login() {
        return this.dxtrade_accounts_list.length > 0;
    }

    getListOfMT5AccountsWithError = account_type => {
        if (!this.is_logged_in) return [];
        return this.mt5_login_list?.filter(
            account => !!account.has_error && (!account_type || account.account_type === account_type)
        );
    };

    @computed
    get list_of_real_mt5_accounts_with_error() {
        return this.getListOfMT5AccountsWithError('real');
    }

    @computed
    get has_account_error_in_mt5_real_list() {
        return this.list_of_real_mt5_accounts_with_error.length > 0;
    }

    @computed
    get list_of_demo_mt5_accounts_with_error() {
        return this.getListOfMT5AccountsWithError('demo');
    }

    @computed
    get has_account_error_in_mt5_demo_list() {
        return this.list_of_demo_mt5_accounts_with_error.length > 0;
    }

    @computed
    get has_account_error_in_dxtrade_list() {
        if (!this.is_logged_in) return false;
        return this.dxtrade_accounts_list?.some(account => !!account.has_error);
    }

    @computed
    get can_have_more_real_synthetic_mt5() {
        const number_of_current_added_synthetics = this.mt5_login_list.reduce((acc, cur) => {
            const is_included =
                cur.account_type === 'real' && (cur.market_type === 'synthetic' || cur.market_type === 'gaming');
            return is_included ? acc + 1 : acc;
        }, 0);
        const number_of_available_synthetic = this.trading_servers.reduce(
            (acc, cur) => (cur.supported_accounts.includes('gaming') && !cur.disabled ? acc + 1 : acc),
            0
        );
        return number_of_current_added_synthetics > 0 && number_of_available_synthetic > 0;
    }

    @computed
    get active_accounts() {
        return this.accounts instanceof Object
            ? Object.values(this.accounts).filter(account => !account.is_disabled)
            : [];
    }

    @computed
    get all_loginids() {
        return !isEmptyObject(this.accounts) ? Object.keys(this.accounts) : [];
    }

    @computed
    get account_title() {
        return getAccountTitle(this.loginid);
    }

    @computed
    get currency() {
        if (this.selected_currency.length) {
            return this.selected_currency;
        } else if (this.is_logged_in) {
            return this.accounts[this.loginid].currency;
        }

        return this.default_currency;
    }

    @computed
    get default_currency() {
        if (Object.keys(this.currencies_list).length > 0) {
            const keys = Object.keys(this.currencies_list);
            // Fix for edge case when logging out from crypto accounts causes Fiat list to be empty
            if (this.currencies_list[localize('Fiat')].length < 1) return 'USD';
            return Object.values(this.currencies_list[`${keys[0]}`])[0].text;
        }

        return 'USD';
    }

    @computed
    get should_allow_authentication() {
        const allow_document_upload = this.account_status?.status?.some(status => status === 'allow_document_upload');
        return allow_document_upload || !!this.is_authentication_needed;
    }

    @computed
    get is_authentication_needed() {
        return this.account_status?.authentication?.needs_verification?.length;
    }

    @computed
    get is_tnc_needed() {
        if (this.is_virtual) return false;

        const { client_tnc_status } = this.account_settings;
        const { terms_conditions_version } = this.website_status;

        return typeof client_tnc_status !== 'undefined' && client_tnc_status !== terms_conditions_version;
    }

    @computed
    get is_social_signup() {
        return this.account_status?.status?.includes('social_signup');
    }

    @computed
    get is_trading_password_required() {
        return this.account_status?.status?.includes('trading_password_required');
    }

    @computed
    get is_financial_information_incomplete() {
        return this.account_status?.status?.some(status => status === 'financial_information_not_complete');
    }

    @computed
    get is_deposit_lock() {
        return this.account_status?.status?.some(status_name => status_name === 'deposit_locked');
    }

    @computed
    get is_withdrawal_lock() {
        return this.account_status?.status?.some(status_name =>
            /^(withdrawal_locked|no_withdrawal_or_trading)$/.test(status_name)
        );
    }

    @computed
    get is_trading_experience_incomplete() {
        return this.account_status?.status?.some(status => status === 'trading_experience_not_complete');
    }

    @computed
    get authentication_status() {
        const document_status = this.account_status?.authentication?.document?.status;
        const identity_status = this.account_status?.authentication?.identity?.status;
        return { document_status, identity_status };
    }

    @computed
    get social_identity_provider() {
        return this.account_status?.social_identity_provider;
    }

    @computed
    get is_fully_authenticated() {
        return this.account_status?.status?.some(status => status === 'authenticated');
    }

    @computed
    get is_pending_authentication() {
        return this.account_status?.status?.some(status => status === 'document_under_review');
    }

    @computed
    get is_financial_account() {
        if (!this.landing_companies) return false;
        return this.account_type === 'financial';
    }

    @computed
    get is_age_verified() {
        return this.account_status?.status?.some(status => status === 'age_verification');
    }

    @computed
    get landing_company_shortcode() {
        if (this.accounts[this.loginid]) {
            return this.accounts[this.loginid].landing_company_shortcode;
        }
        return undefined;
    }

    @computed
    get landing_company() {
        return this.landing_companies;
    }

    @computed
    get is_valid_login() {
        if (!this.is_logged_in) return true;
        const valid_login_ids_regex = new RegExp('^(MX|MF|VRTC|MLT|CR|FOG)[0-9]+$', 'i');
        return this.all_loginids.every(id => valid_login_ids_regex.test(id));
    }

    @computed
    get is_logged_in() {
        return !!(
            !isEmptyObject(this.accounts) &&
            Object.keys(this.accounts).length > 0 &&
            this.loginid &&
            this.accounts[this.loginid].token
        );
    }

    @computed
    get is_virtual() {
        return !isEmptyObject(this.accounts) && this.accounts[this.loginid] && !!this.accounts[this.loginid].is_virtual;
    }

    @computed
    get is_eu() {
        if (!this.landing_companies) return false;
        const { gaming_company, financial_company } = this.landing_companies;
        const financial_shortcode = financial_company?.shortcode;
        const gaming_shortcode = gaming_company?.shortcode;
        return financial_shortcode || gaming_shortcode
            ? eu_shortcode_regex.test(financial_shortcode) || eu_shortcode_regex.test(gaming_shortcode)
            : eu_excluded_regex.test(this.residence);
    }

    @computed
    get is_uk() {
        return this.residence === 'gb';
    }

    // this is true when a user needs to have a active real account for trading
    @computed
    get should_have_real_account() {
        return this.standpoint.iom && this.is_uk && !this.has_any_real_account;
    }

    // Shows all possible landing companies of user between all
    @computed
    get standpoint() {
        const result = {
            iom: false,
            svg: false,
            malta: false,
            maltainvest: false,
            gaming_company: false,
            financial_company: false,
        };
        if (!this.landing_companies) return result;
        const { gaming_company, financial_company } = this.landing_companies;
        if (gaming_company?.shortcode) {
            Object.assign(result, {
                [gaming_company.shortcode]: !!gaming_company?.shortcode,
                gaming_company: gaming_company?.shortcode ?? false,
            });
        }
        if (financial_company?.shortcode) {
            Object.assign(result, {
                [financial_company.shortcode]: !!financial_company?.shortcode,
                financial_company: financial_company?.shortcode ?? false,
            });
        }

        return result;
    }

    @computed
    get can_upgrade() {
        return this.upgrade_info && (this.upgrade_info.can_upgrade || this.upgrade_info.can_open_multi);
    }

    @computed
    get can_upgrade_to() {
        return this.upgrade_info && this.upgrade_info.can_upgrade_to;
    }

    @computed
    get virtual_account_loginid() {
        return this.all_loginids.find(loginid => !!this.accounts[loginid].is_virtual);
    }

    @computed
    get is_single_currency() {
        return (
            Object.keys(this.currencies_list)
                .map(type => Object.values(this.currencies_list[type]).length)
                .reduce((acc, cur) => acc + cur, 0) === 1
        );
    }

    @computed
    get account_type() {
        return getClientAccountType(this.loginid);
    }

    @computed
    get is_mt5_allowed() {
        return this.isMT5Allowed(this.landing_companies);
    }

    @computed
    get is_dxtrade_allowed() {
        return this.isDxtradeAllowed(this.landing_companies);
    }

    isMT5Allowed = landing_companies => {
        // default allowing mt5 to true before landing_companies gets populated
        // since most clients are allowed to use mt5
        if (!landing_companies || !Object.keys(landing_companies).length) return true;

        return 'mt_financial_company' in landing_companies || 'mt_gaming_company' in landing_companies;
    };

    isDxtradeAllowed = landing_companies => {
        if (!this.website_status?.clients_country || !landing_companies || !Object.keys(landing_companies).length)
            return true;

        return (
            'dxtrade_financial_company' in landing_companies ||
            'dxtrade_gaming_company' in landing_companies ||
            (!this.is_logged_in && !this.is_eu && !this.is_eu_country)
        );
    };

    @computed
    get clients_country() {
        return this.website_status?.clients_country;
    }

    @computed
    get is_eu_country() {
        const country = this.website_status.clients_country;
        if (country) return isEuCountry(country);
        return false;
    }

    @computed
    get is_synthetics_unavailable() {
        return this.is_logged_in
            ? isSyntheticsUnavailable(this.residence)
            : isSyntheticsUnavailable(this.website_status.clients_country);
    }

    @computed
    get is_options_blocked() {
        return this.is_logged_in
            ? isOptionsBlocked(this.residence)
            : isOptionsBlocked(this.website_status.clients_country);
    }

    /**
     * Store Values relevant to the loginid to local storage.
     *
     * @param loginid
     */
    @action.bound
    resetLocalStorageValues(loginid) {
        this.accounts[loginid].accepted_bch = 0;
        LocalStore.setObject(storage_key, this.accounts);
        LocalStore.set('active_loginid', loginid);
        this.syncWithSmartTrader(loginid, toJS(this.accounts));
        this.loginid = loginid;
    }

    @action.bound
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
            can_upgrade_to = canUpgrade('svg', 'iom', 'malta', 'maltainvest');
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

    @action.bound
    setMT5DisabledSignupTypes(disabled_types_obj) {
        const current_list = this.mt5_disabled_signup_types;
        this.mt5_disabled_signup_types = { ...current_list, ...disabled_types_obj };
    }

    @action.bound
    setCFDDisabledSignupTypes(platform, disabled_types_obj) {
        if (platform === CFD_PLATFORMS.DXTRADE) {
            const current_list = this.dxtrade_disabled_signup_types;
            this.dxtrade_disabled_signup_types = { current_list, ...disabled_types_obj };
        }
    }

    @action.bound
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

    @action.bound
    setPreferredLanguage = lang => {
        this.preferred_language = lang;
        LocalStore.setObject(LANGUAGE_KEY, lang);
    };

    @action.bound
    setCookieAccount() {
        const domain = /deriv\.(com|me)/.test(window.location.hostname) ? deriv_urls.DERIV_HOST_NAME : 'binary.sx';
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
            Cookies.set('client_information', client_information, { domain });
            this.has_cookie_account = true;
        } else {
            Cookies.remove('client_information', { domain });
            this.has_cookie_account = false;
        }
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
    @action.bound
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

    @action.bound
    responsePayoutCurrencies(response) {
        const list = response.payout_currencies || response;
        this.currencies_list = buildCurrenciesList(list);
        this.selectCurrency('');
    }

    @action.bound
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
        this.upgradeable_landing_companies = [...new Set(response.authorize.upgradeable_landing_companies)];
        this.local_currency_config.currency = Object.keys(response.authorize.local_currencies)[0];

        // For residences without local currency (e.g. ax)
        const default_fractional_digits = 2;
        this.local_currency_config.decimal_places = isEmptyObject(response.authorize.local_currencies)
            ? default_fractional_digits
            : +response.authorize.local_currencies[this.local_currency_config.currency].fractional_digits;
    }

    @action.bound
    setWebsiteStatus(response) {
        this.website_status = response.website_status;
        this.responseWebsiteStatus(response);
        setCurrencies(this.website_status);
    }

    @action.bound
    async accountRealReaction(response) {
        return new Promise(resolve => {
            runInAction(() => {
                this.is_populating_account_list = true;
            });
            const client_accounts = JSON.parse(LocalStore.get(storage_key));
            const { oauth_token, client_id } = response.new_account_real ?? response.new_account_maltainvest;
            BinarySocket.authorize(oauth_token).then(authorize_response => {
                const new_data = {};
                new_data.token = oauth_token;
                new_data.residence = authorize_response.authorize.country;
                new_data.currency = authorize_response.authorize.currency;
                new_data.is_virtual = authorize_response.authorize.is_virtual;
                new_data.landing_company_name = authorize_response.authorize.landing_company_fullname;
                new_data.landing_company_shortcode = authorize_response.authorize.landing_company_name;

                runInAction(() => (client_accounts[client_id] = new_data));
                this.setLoginInformation(client_accounts, client_id);
                WS.authorized.storage.getSettings().then(get_settings_response => {
                    this.setAccountSettings(get_settings_response.get_settings);
                    resolve();
                });
            });
        });
    }

    @action.bound
    setLoginInformation(client_accounts, client_id) {
        this.setAccounts(client_accounts);
        localStorage.setItem(storage_key, JSON.stringify(client_accounts));
        LocalStore.set(storage_key, JSON.stringify(client_accounts));
        this.is_populating_account_list = false;
        this.upgrade_info = this.getBasicUpgradeInfo();
        this.setSwitched(client_id);
        this.syncWithSmartTrader(client_id, client_accounts);
    }

    @action.bound
    async realAccountSignup(form_values) {
        const DEFAULT_CRYPTO_ACCOUNT_CURRENCY = 'BTC';
        const is_maltainvest_account = this.root_store.ui.real_account_signup_target === 'maltainvest';
        const is_samoa_account = this.root_store.ui.real_account_signup_target === 'samoa';
        let currency = '';
        form_values.residence = this.residence;
        if (is_maltainvest_account) {
            currency = form_values.currency;
            form_values.accept_risk = form_values.accept_risk || 0;
            delete form_values.currency;
        }
        const response = is_maltainvest_account
            ? await WS.newAccountRealMaltaInvest(form_values)
            : await WS.newAccountReal(form_values);
        if (!response.error) {
            await this.accountRealReaction(response);
            // Set currency after account is created
            // Maltainvest only
            if (is_maltainvest_account) {
                await this.setAccountCurrency(currency);
            }
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

    @action.bound
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

    @action.bound
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
        this.root_store.ui.removeNotificationMessage({
            key: 'currency',
        });
        this.root_store.ui.removeNotificationByKey({
            key: 'currency',
        });
        await this.init();
    }

    @action.bound
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

    @computed
    get residence() {
        if (this.is_logged_in) {
            return this.account_settings.country_code ?? '';
        }
        return '';
    }

    @computed
    get email_address() {
        if (this.accounts && this.accounts[this.loginid]) {
            return this.accounts[this.loginid].email;
        }

        return '';
    }

    @computed
    get is_website_status_ready() {
        return this.website_status && !BinarySocket.getAvailability().is_down;
    }

    isEuCountrySelected = selected_country => {
        if (selected_country) return isEuCountry(selected_country);
        return false;
    };

    isAccountOfType = type => {
        const client_account_type = getClientAccountType(this.loginid);

        return (
            ((type === 'virtual' && client_account_type === 'virtual') ||
                (type === 'real' && client_account_type !== 'virtual') ||
                type === client_account_type) &&
            !this.isDisabled()
        );
    };

    isAccountOfTypeDisabled = type => {
        const filtered_list = this.account_list.filter(acc => getClientAccountType(acc.loginid) === type);
        return filtered_list.length > 0 && filtered_list.every(acc => acc.is_disabled);
    };

    getRiskAssessment = () => {
        if (!this.account_status) return false;

        const status = this.account_status?.status;

        return this.isAccountOfType('financial')
            ? /(financial_assessment|trading_experience)_not_complete/.test(status)
            : /financial_assessment_not_complete/.test(status);
    };

    shouldCompleteTax = () => {
        if (!this.isAccountOfType('financial')) return false;

        return !/crs_tin_information/.test((this.account_status || {})?.status);
    };

    @action.bound
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
    @action.bound
    async switchAccount(loginid) {
        this.setPreSwitchAccount(true);
        this.setIsLoggingIn(true);
        this.root_store.ui.removeNotifications(true);
        this.root_store.ui.removeAllNotificationMessages(true);
        this.setSwitched(loginid);
        this.responsePayoutCurrencies(await WS.authorized.payoutCurrencies());
    }

    @action.bound
    async resetVirtualBalance() {
        this.root_store.ui.removeNotificationByKey({ key: 'reset_virtual_balance' });
        this.root_store.ui.removeNotificationMessage({ key: 'reset_virtual_balance', should_show_again: true });
        await WS.authorized.topupVirtual();
    }

    @action.bound
    switchEndSignal() {
        this.switch_broadcast = false;
    }

    @action.bound
    refreshNotifications() {
        this.root_store.ui.removeNotifications(true);
        this.root_store.ui.removeAllNotificationMessages();
        const client = this.accounts[this.loginid];
        const { has_missing_required_field } = handleClientNotifications(
            client,
            this,
            this.root_store.ui,
            this.root_store.modules.cashier
        );
        this.setHasMissingRequiredField(has_missing_required_field);
    }

    /**
     * We initially fetch things from local storage, and then do everything inside the store.
     */
    @action.bound
    async init(login_new_user) {
        this.setIsLoggingIn(true);
        const authorize_response = await this.setUserLogin(login_new_user);
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

        this.setLoginId(LocalStore.get('active_loginid'));
        this.setAccounts(LocalStore.getObject(storage_key));
        this.setSwitched('');
        let client = this.accounts[this.loginid];
        // If there is an authorize_response, it means it was the first login
        if (authorize_response) {
            // If this fails, it means the landing company check failed
            if (this.loginid === authorize_response.authorize.loginid) {
                BinarySocketGeneral.authorizeAccount(authorize_response);

                // Client comes back from oauth and logs in
                await this.root_store.rudderstack.identifyEvent();

                await this.root_store.gtm.pushDataLayer({
                    event: 'login',
                });
            } else {
                // So it will send an authorize with the accepted token, to be handled by socket-general
                await BinarySocket.authorize(client.token);
            }
            runInAction(() => {
                this.is_populating_account_list = false;
            });
            const language = authorize_response.authorize.preferred_language;
            if (language !== 'EN' && language !== LocalStore.get(LANGUAGE_KEY)) {
                window.location.replace(urlForLanguage(authorize_response.authorize.preferred_language));
            }
        }

        /**
         * Set up reaction for account_settings, account_status, is_p2p_visible
         */
        reaction(
            () => [this.account_settings, this.account_status, this.root_store.modules?.cashier?.is_p2p_visible],
            () => {
                client = this.accounts[this.loginid];
                BinarySocket.wait('landing_company').then(() => {
                    this.root_store.ui.removeNotifications();
                    this.root_store.ui.removeAllNotificationMessages();
                    if (client && !client.is_virtual) {
                        const { has_missing_required_field } = handleClientNotifications(
                            client,
                            this,
                            this.root_store.ui,
                            this.root_store.modules.cashier
                        );
                        this.setHasMissingRequiredField(has_missing_required_field);
                    }
                });
            }
        );

        this.selectCurrency('');

        this.responsePayoutCurrencies(await WS.authorized.payoutCurrencies());
        if (this.is_logged_in) {
            WS.storage.mt5LoginList().then(this.responseMt5LoginList);
            WS.tradingServers().then(this.responseTradingServers);
            WS.tradingPlatformAccountsList(CFD_PLATFORMS.DXTRADE).then(this.responseTradingPlatformAccountsList);
            this.responseStatement(
                await BinarySocket.send({
                    statement: 1,
                })
            );
            const account_settings = (await WS.authorized.cache.getSettings()).get_settings;
            if (account_settings) this.setPreferredLanguage(account_settings.preferred_language);
            await this.fetchResidenceList();

            if (account_settings && !account_settings.residence) {
                this.root_store.ui.toggleSetResidenceModal(true);
            }

            await WS.authorized.cache.landingCompany(this.residence).then(this.responseLandingCompany);
            if (!this.is_virtual) await this.getLimits();
        } else {
            this.resetMt5AccountListPopulation();
        }
        this.responseWebsiteStatus(await WS.wait('website_status'));

        this.registerReactions();
        this.setIsLoggingIn(false);
        this.setInitialized(true);
        return true;
    }

    @action.bound
    resetMt5AccountListPopulation() {
        this.is_populating_mt5_account_list = false;
    }

    @action.bound
    responseWebsiteStatus(response) {
        this.website_status = response.website_status;
        if (this.website_status.message && this.website_status.message.length) {
            this.root_store.ui.addNotificationMessage({
                key: 'maintenance',
                header: localize('Site is being updated'),
                message: localize(this.website_status.message),
                type: 'warning',
                is_persistent: true,
            });
        } else {
            this.root_store.ui.removeNotificationMessage({
                key: 'maintenance',
            });
        }
    }

    @action.bound
    responseLandingCompany(response) {
        this.is_landing_company_loaded = true;
        this.landing_companies = response.landing_company;
        this.setRealityCheck();
    }

    @action.bound
    setRealityCheck() {
        this.has_reality_check = this.current_landing_company?.has_reality_check;
        // if page reloaded after reality check was submitted
        // use the submitted values to initiate rather than asking again
        if (
            this.has_reality_check &&
            this.reality_check_duration &&
            typeof this.reality_check_timeout === 'undefined'
        ) {
            this.setRealityCheckDuration(this.reality_check_duration);
        }
    }

    @action.bound
    setLoginId(loginid) {
        this.loginid = loginid;
    }

    @action.bound
    setAccounts(accounts) {
        this.accounts = accounts;
    }

    @action.bound
    setSwitched(switched) {
        this.switched = switched;
    }

    @action.bound
    setHasMissingRequiredField(has_missing_required_field) {
        this.has_missing_required_field = has_missing_required_field;
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

        return {
            loginid,
            is_disabled,
            is_virtual,
            icon: account_type.toLowerCase(), // TODO: display the icon
            title: account_type.toLowerCase() === 'virtual' ? localize('DEMO') : account_type,
        };
    }

    @action.bound
    setIsLoggingIn(bool) {
        this.is_logging_in = bool;
    }

    @action.bound
    setPreSwitchAccount(is_pre_switch) {
        this.pre_switch_broadcast = is_pre_switch;
    }

    @action.bound
    broadcastAccountChange() {
        this.switch_broadcast = true;
    }

    broadcastAccountChangeAfterAuthorize() {
        return BinarySocket.wait('authorize').then(() => {
            this.broadcastAccountChange();
        });
    }

    handleNotFoundLoginId() {
        // Logout if the switched_account doesn't belong to any loginid.
        this.root_store.ui.addNotificationMessage({
            message: localize('Could not switch to default account.'),
            type: 'danger',
        });
        // request a logout
        this.logout();
    }

    isUnableToFindLoginId() {
        return !this.all_loginids.some(id => id !== this.switched) || this.switched === this.loginid;
    }

    @action.bound
    async switchAccountHandler() {
        if (!this.switched || !this.switched.length || !this.getAccount(this.switched)?.token) {
            if (this.isUnableToFindLoginId()) {
                this.handleNotFoundLoginId();
                return;
            }

            // Send a toast message to let the user know we can't switch his account.
            this.root_store.ui.addNotificationMessage({
                message: localize('Switching to default account.'),
                type: 'info',
            });

            // switch to default account.
            this.switchAccount(this.all_loginids[0]);
            await this.switchAccountHandler();
            return;
        }

        runInAction(() => (this.is_switching = true));
        const from_login_id = this.loginid;
        this.resetLocalStorageValues(this.switched);
        SocketCache.clear();

        // if real to virtual --> switch to blue
        // if virtual to real --> switch to green
        // else keep the existing connection
        const should_switch_socket_connection = this.is_virtual || /VRTC/.test(from_login_id);

        if (should_switch_socket_connection) {
            BinarySocket.closeAndOpenNewConnection();
            await BinarySocket.wait('authorize');
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

        if (!this.is_virtual) this.getLimits();

        runInAction(() => (this.is_switching = false));
    }

    @action.bound
    registerReactions() {
        // Switch account reactions.
        when(
            () => this.switched,
            () => {
                // Remove real account notifications upon switching to virtual
                if (this.accounts[this.switched]?.is_virtual) {
                    this.root_store.ui.removeNotifications(true);
                    this.root_store.ui.removeAllNotificationMessages();
                }

                this.switchAccountHandler();
            }
        );
    }

    @action.bound
    resetVirtualBalanceNotification(loginid) {
        if (!this.is_logged_in) return;
        if (!this.accounts[loginid].is_virtual) return;
        const min_reset_limit = 1000;
        const max_reset_limit = 999000;
        const balance = parseInt(this.accounts[loginid].balance);

        // Display notification message to user with virtual account to reset their balance
        // if the balance is less than equals to 1000 or more than equals to 999000
        if (balance <= min_reset_limit || balance >= max_reset_limit) {
            let message = localize(
                'Your demo account balance is low. Reset your balance to continue trading from your demo account.'
            );
            if (balance >= max_reset_limit)
                message = localize(
                    'Your demo account balance has reached the maximum limit, and you will not be able to place new trades. Reset your balance to continue trading from your demo account.'
                );
            this.root_store.ui.addNotificationMessage(
                clientNotifications({}, { resetVirtualBalance: this.resetVirtualBalance, message })
                    .reset_virtual_balance
            );
        } else {
            this.root_store.ui.removeNotificationByKey({ key: 'reset_virtual_balance' });
            this.root_store.ui.removeNotificationMessage({ key: 'reset_virtual_balance', should_show_again: true });
        }
    }

    @action.bound
    setBalanceActiveAccount(obj_balance) {
        if (this.accounts[obj_balance?.loginid] && obj_balance.loginid === this.loginid) {
            this.accounts[obj_balance.loginid].balance = obj_balance.balance;
            if (this.accounts[obj_balance.loginid].is_virtual) {
                this.resetVirtualBalanceNotification(obj_balance.loginid);
            }
            this.resetLocalStorageValues(this.loginid);
        }
    }

    // This callback is used for balance: all
    // Balance: all is very slow
    // --> so we keep a separate balance subscription for the active account
    @action.bound
    setBalanceOtherAccounts(obj_balance) {
        // Balance subscription response received when mt5 transfer is in progress should be ignored.
        // After mt5 transfer is done, `balanceAll` is requested along with `mt5LoginList` in order to update the correct balance.
        if (this.root_store.modules?.cashier?.isMT5TransferInProgress()) return;

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

        if (obj_balance.total) {
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

    @action.bound
    selectCurrency(value) {
        this.selected_currency = value;
    }

    @action.bound
    setResidence(residence) {
        this.accounts[this.loginid].residence = residence;
    }

    @action.bound
    setEmail(email) {
        this.accounts[this.loginid].email = email;
        this.email = email;
    }

    @action.bound
    setAccountSettings(settings) {
        this.account_settings = settings;
        this.is_account_setting_loaded = true;
    }

    @action.bound
    setAccountStatus(status) {
        this.account_status = status;
    }

    @action.bound
    setInitialized(is_initialized) {
        this.initialized_broadcast = is_initialized;
    }

    @action.bound
    cleanUp() {
        this.root_store.gtm.pushDataLayer({
            event: 'log_out',
        });
        this.loginid = null;
        this.user_id = null;
        this.upgrade_info = undefined;
        this.accounts = {};
        this.mt5_login_list = [];
        localStorage.setItem('active_loginid', this.loginid);
        localStorage.setItem('client.accounts', JSON.stringify(this.accounts));

        runInAction(async () => {
            this.responsePayoutCurrencies(await WS.payoutCurrencies());
        });
        this.root_store.ui.removeAllNotificationMessages(true);
        this.syncWithSmartTrader(this.loginid, this.accounts);
        this.cleanupRealityCheck();
    }

    @action.bound
    async logout() {
        // TODO: [add-client-action] - Move logout functionality to client store
        const response = await requestLogout();

        if (response.logout === 1) {
            this.cleanUp();

            this.root_store.rudderstack.reset();
            this.setLogout(true);
        }

        return response;
    }

    @action.bound
    setLogout(is_logged_out) {
        this.has_logged_out = is_logged_out;
        if (this.root_store.common.has_error) this.root_store.common.setError(false, null);
    }

    /* eslint-disable */
    @action.bound
    storeClientAccounts(obj_params, account_list) {
        // store consistent names with other API calls
        // API_V4: send consistent names
        const map_names = {
            country: 'residence',
            landing_company_name: 'landing_company_shortcode',
        };
        const client_object = {};
        let active_loginid;

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
            localStorage.setItem('active_loginid', active_loginid);
            localStorage.setItem('client.accounts', JSON.stringify(client_object));
            this.syncWithSmartTrader(active_loginid, this.accounts);
        }
    }

    @action.bound
    async setUserLogin(login_new_user) {
        // login_new_user is populated only on virtual sign-up
        let obj_params = {};
        const search = window.location.search;

        if (search) {
            let search_params = new URLSearchParams(window.location.search);

            search_params.forEach((value, key) => {
                const account_keys = ['acct', 'token', 'cur'];
                const is_account_param = account_keys.some(
                    account_key => key?.includes(account_key) && key !== 'affiliate_token'
                );

                if (is_account_param) {
                    obj_params[key] = value;
                }
            });

            // delete account query params - but keep other query params (e.g. utm)
            Object.keys(obj_params).forEach(key => search_params.delete(key));
            search_params.delete('state'); // remove unused state= query string
            search_params = search_params?.toString();
            const search_param_without_account = search_params ? `?${search_params}` : '/';
            history.replaceState(null, null, `${search_param_without_account}${window.location.hash}`);
        }

        const is_client_logging_in = login_new_user ? login_new_user.token1 : obj_params.token1;
        if (is_client_logging_in) {
            window.history.replaceState({}, document.title, sessionStorage.getItem('redirect_url'));
            SocketCache.clear();
            // is_populating_account_list is used for socket general to know not to filter the first-time logins
            this.is_populating_account_list = true;
            const authorize_response = await BinarySocket.authorize(is_client_logging_in);

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

    @action.bound
    canStoreClientAccounts(obj_params, account_list) {
        const is_ready_to_process = account_list && isEmptyObject(this.accounts);
        const accts = Object.keys(obj_params).filter(value => /^acct./.test(value));

        const is_cross_checked = accts.every(acct =>
            account_list.some(account => account.loginid === obj_params[acct])
        );

        return is_ready_to_process && is_cross_checked;
    }

    @action.bound
    setVerificationCode(code, action) {
        this.verification_code[action] = code;
        if (code) {
            LocalStore.set(`verification_code.${action}`, code);
        } else {
            LocalStore.remove(`verification_code.${action}`);
        }
        if (action === 'signup') {
            // TODO: add await if error handling needs to happen before AccountSignup is initialised
            this.fetchResidenceList(); // Prefetch for use in account signup process
        }
    }

    @action.bound
    setDeviceData() {
        setDeviceDataCookie('signup_device', isDesktopOs() ? 'desktop' : 'mobile');
    }

    @action.bound
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

    @action.bound
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

    @action.bound
    onSignup({ password, residence, email_consent }, cb) {
        if (!this.verification_code.signup || !password || !residence) return;
        if (email_consent === undefined) return;
        email_consent = email_consent ? 1 : 0;
        // Currently the code doesn't reach here and the console log is needed for debugging.
        // TODO: remove console log when AccountSignup component and validation are ready
        WS.newAccountVirtual(
            this.verification_code.signup,
            password,
            residence,
            email_consent,
            this.getSignupParams()
        ).then(async response => {
            if (response.error) {
                cb(response.error.message);
            } else {
                cb();
                // Initialize client store with new user login
                const { client_id, currency, oauth_token } = response.new_account_virtual;
                await this.switchToNewlyCreatedAccount(client_id, oauth_token, currency);

                // GTM Signup event
                this.root_store.gtm.pushDataLayer({
                    event: 'virtual_signup',
                });

                this.root_store.ui.showAccountTypesModalForEuropean();

                if (!this.is_uk) {
                    this.root_store.ui.toggleWelcomeModal({ is_visible: true, should_persist: true });
                }
            }
        });
    }

    async switchToNewlyCreatedAccount(client_id, oauth_token, currency) {
        const new_user_login = {
            acct1: client_id,
            token1: oauth_token,
            curr1: currency,
        };
        await this.init(new_user_login);
    }

    @action.bound
    fetchAccountSettings() {
        return new Promise(resolve => {
            WS.authorized.storage.getSettings().then(response => {
                this.setAccountSettings(response.get_settings);
                resolve(response);
            });
        });
    }

    @action.bound
    fetchResidenceList() {
        return new Promise(resolve => {
            WS.storage.residenceList().then(response => {
                this.setResidenceList(response);
                resolve(response);
            });
        });
    }

    @action.bound
    setResidenceList(residence_list_response) {
        this.residence_list = residence_list_response.residence_list || [];
    }

    @action.bound
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

    @action.bound
    resetMt5ListPopulatedState() {
        this.is_mt5_account_list_updated = false;
        this.is_populating_mt5_account_list = true;
        this.mt5_login_list_error = null;
    }

    @action.bound
    async updateMt5LoginList() {
        if (this.is_logged_in && !this.is_mt5_account_list_updated && !this.is_populating_mt5_account_list) {
            const response = await WS.mt5LoginList();
            this.responseMt5LoginList(response);
        }
    }

    @action.bound
    responseTradingServers(response) {
        if (response.error) {
            this.trading_servers = [];
            return;
        }
        this.trading_servers = response.trading_servers;
    }

    @action.bound
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

    @action.bound
    responseTradingPlatformAccountsList(response) {
        const { platform } = response.echo_req || {};

        this[`is_populating_${platform}_account_list`] = false;

        if (!response.error) {
            this[`${platform}_accounts_list`] = response.trading_platform_accounts.map(account => {
                const display_login = account.error ? account.error.details.account_id : account.account_id;
                if (account.error) {
                    const { account_type, server } = account.error.details;
                    if (platform === CFD_PLATFORMS.DXTRADE) {
                        this.setCFDDisabledSignupTypes(platform, {
                            real: account_type === 'real',
                            demo: account_type === 'demo',
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

    @action.bound
    responseStatement(response) {
        if (!response.error) {
            this.statement = response.statement;
        }
    }

    @action.bound
    getChangeableFields() {
        const get_settings =
            Object.keys(this.account_settings).length === 0
                ? WS.authorized.storage.getSettings()
                : this.account_settings;

        const readonly_fields = [...get_settings.immutable_fields, ...['immutable_fields', 'email', 'password']];
        return Object.keys(get_settings).filter(field => !readonly_fields.includes(field));
    }

    @action.bound
    syncWithSmartTrader(active_loginid, client_accounts) {
        const iframe_window = document.getElementById('localstorage-sync');
        if (iframe_window) {
            const origin = getUrlSmartTrader();
            if (origin) {
                // Keep client.accounts in sync (in case user wasn't logged in).
                iframe_window.contentWindow.postMessage(
                    {
                        key: 'client.accounts',
                        value: JSON.stringify(client_accounts),
                    },
                    origin
                );
                iframe_window.contentWindow.postMessage(
                    {
                        key: 'active_loginid',
                        value: active_loginid,
                    },
                    origin
                );
            }
        }
    }

    @computed
    get is_high_risk() {
        if (isEmptyObject(this.account_status)) return false;
        return this.account_status.risk_classification === 'high';
    }

    @computed
    get needs_financial_assessment() {
        if (this.is_virtual) return false;
        if (this.is_financial_information_incomplete) return true;
        if (!this.is_svg) {
            if (this.is_financial_account || this.is_trading_experience_incomplete) return true;
        }

        return false;
    }

    @computed
    get has_residence() {
        return !!this.accounts[this.loginid]?.residence;
    }

    @action.bound
    setVisibilityRealityCheck(is_visible) {
        // if reality check timeout has been set, don't make it visible until it runs out
        if (is_visible && typeof this.reality_check_timeout === 'number') {
            return;
        }
        this.is_reality_check_dismissed = !is_visible;
        // store in localstorage to keep track of across tabs/on refresh
        LocalStore.set('reality_check_dismissed', !is_visible);
    }

    @action.bound
    clearRealityCheckTimeout() {
        clearTimeout(this.reality_check_timeout);
        this.reality_check_timeout = undefined;
    }

    @action.bound
    setRealityCheckDuration(duration) {
        this.reality_check_dur = +duration;
        this.clearRealityCheckTimeout();
        // store in localstorage to keep track of across tabs/on refresh
        LocalStore.set('reality_check_duration', +duration);
        this.reality_check_timeout = setTimeout(() => {
            // set reality_check_timeout to undefined
            this.clearRealityCheckTimeout();
            // after this duration passes, show the summary pop up
            this.setVisibilityRealityCheck(1);
        }, +duration * 60 * 1000);
    }

    @action.bound
    cleanupRealityCheck() {
        this.has_reality_check = false;
        this.is_reality_check_dismissed = undefined;
        this.reality_check_dur = undefined;
        this.clearRealityCheckTimeout();
        LocalStore.remove('reality_check_duration');
        LocalStore.remove('reality_check_dismissed');
    }

    @action.bound
    fetchFinancialAssessment() {
        return new Promise(async resolve => {
            const { get_financial_assessment } = await WS.getFinancialAssessment();

            runInAction(() => (this.financial_assessment = get_financial_assessment));
            resolve(get_financial_assessment);
        });
    }
}
/* eslint-enable */
