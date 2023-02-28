import merge from 'lodash.merge';
import type { TRootStore } from '../types';

const mock = (): TRootStore => {
    return {
        client: {
            accounts: {
                loginid: {
                    account_type: 'trading',
                    created_at: 1674633682,
                    currency: 'USD',
                    is_disabled: 0,
                    is_virtual: 0,
                    trading: {},
                    excluded_until: 0,
                    landing_company_name: 'svg',
                },
            },
            active_account_landing_company: '',
            account_limits: {
                daily_transfers: {
                    dxtrade: {
                        allowed: false,
                        available: false,
                    },
                    internal: {
                        allowed: false,
                        available: false,
                    },
                    mt5: {
                        allowed: false,
                        available: false,
                    },
                },
            },
            account_status: {
                authentication: {
                    attempts: {
                        count: 1,
                        history: [
                            {
                                country_code: 'id',
                                id: '8919',
                                service: 'manual',
                                status: 'verified',
                                timestamp: 1674633681,
                            },
                        ],
                        latest: {
                            country_code: 'id',
                            id: '8919',
                            service: 'manual',
                            status: 'verified',
                            timestamp: 1674633681,
                        },
                    },
                    document: {
                        status: 'verified',
                    },
                    identity: {
                        services: {
                            idv: {
                                last_rejected: [],
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                            manual: {
                                status: 'verified',
                            },
                            onfido: {
                                country_code: 'IDN',
                                documents_supported: [
                                    'Driving Licence',
                                    'National Identity Card',
                                    'Passport',
                                    'Residence Permit',
                                ],
                                is_country_supported: 1,
                                last_rejected: [],
                                reported_properties: {},
                                status: 'none',
                                submissions_left: 3,
                            },
                        },
                        status: 'verified',
                    },
                    income: {
                        status: 'none',
                    },
                    needs_verification: [],
                    ownership: {
                        requests: [],
                        status: 'none',
                    },
                },
                currency_config: {
                    USD: {
                        is_deposit_suspended: 0,
                        is_withdrawal_suspended: 0,
                    },
                },
                p2p_status: 'none',
                prompt_client_to_authenticate: 0,
                risk_classification: 'low',
                status: [
                    'age_verification',
                    'allow_document_upload',
                    'authenticated',
                    'dxtrade_password_not_set',
                    'financial_information_not_complete',
                    'idv_disallowed',
                    'mt5_password_not_set',
                    'trading_experience_not_complete',
                ],
            },
            balance: '',
            can_change_fiat_currency: false,
            currency: '',
            current_currency_type: '',
            current_fiat_currency: '',
            getLimits: jest.fn(),
            has_active_real_account: false,
            has_logged_out: false,
            has_maltainvest_account: false,
            initialized_broadcast: false,
            is_account_setting_loaded: false,
            is_deposit_lock: false,
            is_dxtrade_allowed: false,
            is_eu: false,
            is_financial_account: false,
            is_financial_information_incomplete: false,
            is_identity_verification_needed: false,
            is_landing_company_loaded: false,
            is_logged_in: false,
            is_logging_in: false,
            is_pre_appstore: false,
            is_switching: false,
            is_tnc_needed: false,
            is_trading_experience_incomplete: false,
            is_virtual: false,
            is_withdrawal_lock: false,
            landing_company_shortcode: '',
            local_currency_config: {
                currency: '',
                decimal_places: 0,
            },
            loginid: '',
            pre_switch_broadcast: false,
            residence: '',
            responseMt5LoginList: jest.fn(),
            responseTradingPlatformAccountsList: jest.fn(),
            standpoint: {
                iom: '',
            },
            switchAccount: jest.fn(),
            verification_code: {
                payment_agent_withdraw: '',
                payment_withdraw: '',
                request_email: '',
                reset_password: '',
                signup: '',
                system_email_change: '',
                trading_platform_dxtrade_password_reset: '',
                trading_platform_mt5_password_reset: '',
            },
            email: '',
            setVerificationCode: jest.fn(),
            updateAccountStatus: jest.fn(),
            is_authentication_needed: false,
            authentication_status: {
                document_status: '',
                identity_status: '',
            },
            mt5_login_list: [],
            is_risky_client: false,
            logout: jest.fn(),
            should_allow_authentication: false,
            active_accounts: [],
            account_list: [],
            available_crypto_currencies: [],
            setAccountStatus: jest.fn(),
            setBalanceOtherAccounts: jest.fn(),
            setInitialized: jest.fn(),
            setLogout: jest.fn(),
            setPreSwitchAccount: jest.fn(),
            switched: false,
            switch_broadcast: false,
            switchEndSignal: jest.fn(),
            is_crypto: false,
        },
        common: {
            error: {
                app_routing_history: [],
                header: '',
                message: '',
                type: '',
                redirect_label: '',
                redirect_to: '',
                should_clear_error_on_click: false,
                should_show_refresh: false,
                redirectOnClick: jest.fn(),
                setError: jest.fn(),
            },
            is_from_derivgo: false,
            has_error: false,
            platform: '',
            routeBackInApp: jest.fn(),
            routeTo: jest.fn(),
            changeCurrentLanguage: jest.fn(),
            is_network_online: false,
        },
        ui: {
            current_focus: null,
            is_cashier_visible: false,
            is_dark_mode_on: false,
            is_mobile: false,
            disableApp: jest.fn(),
            enableApp: jest.fn(),
            setCurrentFocus: jest.fn(),
            toggleAccountsDialog: jest.fn(),
            toggleCashier: jest.fn(),
            setDarkMode: jest.fn(),
            has_real_account_signup_ended: false,
            notification_messages_ui: null,
            openRealAccountSignup: jest.fn(),
            setRealAccountSignupEnd: jest.fn(),
            shouldNavigateAfterChooseCrypto: jest.fn(),
            toggleSetCurrencyModal: jest.fn(),
        },
        traders_hub: {
            closeModal: jest.fn(),
            openModal: jest.fn(),
            content_flag: '',
        },
        contract_store: {
            contract_info: {},
            contract_update_take_profit: '',
            contract_update_stop_loss: '',
            clearContractUpdateConfigValues: jest.fn(),
            has_contract_update_take_profit: false,
            has_contract_update_stop_loss: false,
            updateLimitOrder: jest.fn(),
            validation_errors: { contract_update_stop_loss: [], contract_update_take_profit: [] },
            onChange: jest.fn(),
        },
        menu: {
            attach: jest.fn(),
            update: jest.fn(),
        },
        notifications: {
            addNotificationMessage: jest.fn(),
            filterNotificationMessages: jest.fn(),
            refreshNotifications: jest.fn(),
            removeNotificationByKey: jest.fn(),
            removeNotificationMessage: jest.fn(),
            setP2POrderProps: jest.fn(),
        },
        modules: {},
    };
};

const mockStore = (override: DeepPartial<TRootStore>): TRootStore => merge(mock(), override);

export { mockStore };
