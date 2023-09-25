import merge from 'lodash.merge';
import type { TStores } from '../types';

const mock = (): TStores & { is_mock: boolean } => {
    return {
        is_mock: true,
        client: {
            account_settings: {},
            account_type: 'virtual',
            accounts: {},
            is_social_signup: false,
            active_account_landing_company: '',
            trading_platform_available_accounts: [],
            account_limits: {},
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
                                status: 'none',
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
            country_standpoint: {
                is_belgium: false,
                is_france: false,
                is_isle_of_man: false,
                is_other_eu: false,
                is_rest_of_eu: false,
                is_united_kingdom: false,
            },
            currency: '',
            current_currency_type: '',
            current_fiat_currency: '',
            cfd_score: 0,
            ctrader_accounts_list: [],
            setCFDScore: jest.fn(),
            getLimits: jest.fn(),
            has_active_real_account: false,
            has_logged_out: false,
            has_maltainvest_account: false,
            has_restricted_mt5_account: false,
            initialized_broadcast: false,
            is_account_setting_loaded: false,
            is_authorize: false,
            is_deposit_lock: false,
            is_dxtrade_allowed: false,
            is_eu: false,
            is_eu_country: false,
            has_residence: false,
            is_financial_account: false,
            is_financial_assessment_needed: false,
            is_financial_information_incomplete: false,
            is_low_risk: false,
            is_identity_verification_needed: false,
            is_landing_company_loaded: false,
            is_logged_in: false,
            is_logging_in: false,
            is_pending_proof_of_ownership: false,
            is_switching: false,
            is_single_currency: false,
            is_tnc_needed: false,
            is_trading_experience_incomplete: false,
            is_virtual: false,
            is_withdrawal_lock: false,
            is_populating_account_list: false,
            is_language_loaded: false,
            prev_account_type: '',
            landing_company_shortcode: '',
            local_currency_config: {
                currency: '',
                decimal_places: 0,
            },
            loginid: '',
            pre_switch_broadcast: false,
            residence: '',
            is_svg: false,
            responseMt5LoginList: jest.fn(),
            responseTradingPlatformAccountsList: jest.fn(),
            setFinancialAndTradingAssessment: jest.fn(),
            standpoint: {
                financial_company: '',
                gaming_company: '',
                maltainvest: false,
                svg: false,
                iom: false,
                malta: false,
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
            logout: jest.fn(),
            should_allow_authentication: false,
            active_accounts: [],
            account_list: [],
            available_crypto_currencies: [],
            setAccountStatus: jest.fn(),
            setBalanceOtherAccounts: jest.fn(),
            setInitialized: jest.fn(),
            setLogout: jest.fn(),
            setVisibilityRealityCheck: jest.fn(),
            setP2pAdvertiserInfo: jest.fn(),
            setPreSwitchAccount: jest.fn(),
            switched: false,
            switch_broadcast: false,
            switchEndSignal: jest.fn(),
            is_uk: false,
            isEligibleForMoreRealMt5: jest.fn(),
            isEligibleForMoreDemoMt5Svg: jest.fn(),
            updateMT5Status: jest.fn(),
            is_high_risk: false,
            fetchResidenceList: jest.fn(),
            residence_list: [],
            should_restrict_bvi_account_creation: false,
            should_restrict_vanuatu_account_creation: false,
            fetchAccountSettings: jest.fn(),
            setAccountSettings: jest.fn(),
            upgradeable_landing_companies: [],
            is_populating_mt5_account_list: false,
            landing_companies: {},
            landing_company: {},
            getChangeableFields: jest.fn(),
            isAccountOfTypeDisabled: jest.fn(),
            is_mt5_allowed: false,
            mt5_disabled_signup_types: {
                real: false,
                demo: false,
            },
            dxtrade_disabled_signup_types: {
                real: false,
                demo: false,
            },
            dxtrade_accounts_list_error: null,
            has_account_error_in_mt5_demo_list: false,
            has_account_error_in_mt5_real_list: false,
            has_account_error_in_dxtrade_demo_list: false,
            has_account_error_in_dxtrade_real_list: false,
            website_status: {
                dx_trade_status: {
                    all: 0,
                    demo: 0,
                    real: 0,
                },
                mt5_status: {
                    real: [],
                    demo: [],
                },
            },
            is_fully_authenticated: false,
            states_list: [],
            fetchStatesList: jest.fn(),
            is_crypto: jest.fn(),
            dxtrade_accounts_list: [],
            derivez_accounts_list: [],
            default_currency: 'USD',
            resetVirtualBalance: jest.fn(),
            has_enabled_two_fa: false,
            setTwoFAStatus: jest.fn(),
            has_changed_two_fa: false,
            setTwoFAChangedStatus: jest.fn(),
            real_account_creation_unlock_date: '',
            has_any_real_account: false,
            setPrevAccountType: jest.fn(),
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
            services_error: {},
            current_language: 'EN',
            isCurrentLanguage: jest.fn(),
            is_from_derivgo: false,
            has_error: false,
            platform: '',
            routeBackInApp: jest.fn(),
            routeTo: jest.fn(),
            changeCurrentLanguage: jest.fn(),
            changeSelectedLanguage: jest.fn(),
            is_network_online: false,
            server_time: undefined,
            is_language_changing: false,
            is_socket_opened: false,
            setAppstorePlatform: jest.fn(),
            app_routing_history: [],
            getExchangeRate: jest.fn(),
            network_status: {},
        },
        ui: {
            account_switcher_disabled_message: '',
            app_contents_scroll_ref: {
                current: null,
            },
            current_focus: null,
            is_account_settings_visible: false,
            is_loading: false,
            is_cashier_visible: false,
            is_app_disabled: false,
            is_closing_create_real_account_modal: false,
            is_dark_mode_on: false,
            is_language_settings_modal_on: false,
            is_unsupported_contract_modal_visible: false,
            has_only_forward_starting_contracts: false,
            header_extension: null,
            is_link_expired_modal_visible: false,
            is_mobile: false,
            is_positions_drawer_on: false,
            is_reports_visible: false,
            is_route_modal_on: false,
            is_services_error_visible: false,
            disableApp: jest.fn(),
            enableApp: jest.fn(),
            setCurrentFocus: jest.fn(),
            toggleAccountsDialog: jest.fn(),
            toggleAccountSettings: jest.fn(),
            toggleCashier: jest.fn(),
            togglePositionsDrawer: jest.fn(),
            setDarkMode: jest.fn(),
            setReportsTabIndex: jest.fn(),
            has_real_account_signup_ended: false,
            notification_messages_ui: jest.fn(),
            openRealAccountSignup: jest.fn(),
            setIsClosingCreateRealAccountModal: jest.fn(),
            setRealAccountSignupEnd: jest.fn(),
            setPurchaseState: jest.fn(),
            setHasOnlyForwardingContracts: jest.fn(),
            shouldNavigateAfterChooseCrypto: jest.fn(),
            toggleLanguageSettingsModal: jest.fn(),
            toggleLinkExpiredModal: jest.fn(),
            toggleSetCurrencyModal: jest.fn(),
            toggleServicesErrorModal: jest.fn(),
            addToast: jest.fn(),
            removeToast: jest.fn(),
            reports_route_tab_index: 1,
            should_show_cancellation_warning: false,
            toggleCancellationWarning: jest.fn(),
            toggleUnsupportedContractModal: jest.fn(),
            toggleReports: jest.fn(),
            setSubSectionIndex: jest.fn(),
            sub_section_index: 0,
            toggleReadyToDepositModal: jest.fn(),
            is_tablet: false,
            is_ready_to_deposit_modal_visible: false,
            is_real_acc_signup_on: false,
            is_need_real_account_for_cashier_modal_visible: false,
            is_chart_layout_default: false,
            toggleNeedRealAccountForCashierModal: jest.fn(),
            setIsAcuityModalOpen: jest.fn(),
            setAppContentsScrollRef: jest.fn(),
            is_switch_to_deriv_account_modal_visible: false,
            openSwitchToRealAccountModal: jest.fn(),
            is_top_up_virtual_open: false,
            is_top_up_virtual_in_progress: false,
            is_top_up_virtual_success: false,
            closeTopUpModal: jest.fn(),
            closeSuccessTopUpModal: jest.fn(),
            is_cfd_reset_password_modal_enabled: false,
            setCFDPasswordResetModal: jest.fn(),
            openDerivRealAccountNeededModal: jest.fn(),
            populateHeaderExtensions: jest.fn(),
            populateSettingsExtensions: jest.fn(),
            purchase_states: [],
            setShouldShowCooldownModal: jest.fn(),
            populateFooterExtensions: jest.fn(),
            openAccountNeededModal: jest.fn(),
            is_accounts_switcher_on: false,
            openTopUpModal: jest.fn(),
            toggleShouldShowRealAccountsList: jest.fn(),
            is_reset_trading_password_modal_visible: false,
            setResetTradingPasswordModalOpen: jest.fn(),
        },
        traders_hub: {
            getAccount: jest.fn(),
            closeModal: jest.fn(),
            combined_cfd_mt5_accounts: [],
            available_cfd_accounts: [],
            content_flag: '',
            CFDs_restricted_countries: false,
            openModal: jest.fn(),
            selected_account: {
                login: '',
                account_id: '',
            },
            handleTabItemClick: jest.fn(),
            is_account_transfer_modal_open: false,
            is_eu_user: false,
            setIsOnboardingVisited: jest.fn(),
            is_real: false,
            is_regulators_compare_modal_visible: false,
            is_tour_open: false,
            selectRegion: jest.fn(),
            setSelectedAccount: jest.fn(),
            is_low_risk_cr_eu_real: false,
            show_eu_related_content: false,
            platform_real_balance: {
                currency: '',
                balance: 0,
            },
            cfd_demo_balance: {
                currency: '',
                balance: 0,
            },
            platform_demo_balance: {
                currency: '',
                balance: 0,
            },
            cfd_real_balance: {
                currency: '',
                balance: 0,
            },
            closeAccountTransferModal: jest.fn(),
            toggleRegulatorsCompareModal: jest.fn(),
            selected_region: '',
            is_demo: false,
            financial_restricted_countries: false,
            selected_account_type: 'real',
            selected_platform_type: 'options',
            no_CR_account: false,
            no_MF_account: false,
            modal_data: {
                active_modal: '',
                data: {},
            },
            multipliers_account_status: '',
            openFailedVerificationModal: jest.fn(),
            setTogglePlatformType: jest.fn(),
            toggleAccountTransferModal: jest.fn(),
            selectAccountType: jest.fn(),
            available_dxtrade_accounts: [],
            available_ctrader_accounts: [],
            toggleIsTourOpen: jest.fn(),
            is_demo_low_risk: false,
            is_mt5_notification_modal_visible: false,
            setMT5NotificationModal: jest.fn(),
            available_derivez_accounts: [],
            has_any_real_account: false,
            startTrade: jest.fn(),
            getExistingAccounts: jest.fn(),
            toggleAccountTypeModalVisibility: jest.fn(),
            showTopUpModal: jest.fn(),
        },
        menu: {
            attach: jest.fn(),
            update: jest.fn(),
        },
        notifications: {
            addNotificationMessage: jest.fn(),
            addNotificationMessageByKey: jest.fn(),
            client_notifications: {},
            is_notifications_empty: true,
            is_notifications_visible: false,
            filterNotificationMessages: jest.fn(),
            notifications: [],
            refreshNotifications: jest.fn(),
            removeNotifications: jest.fn(),
            removeNotificationByKey: jest.fn(),
            removeNotificationMessage: jest.fn(),
            removeNotificationMessageByKey: jest.fn(),
            setP2POrderProps: jest.fn(),
            showAccountSwitchToRealNotification: jest.fn(),
            setP2PRedirectTo: jest.fn(),
            toggleNotificationsModal: jest.fn(),
        },
        portfolio: {
            active_positions: [],
            all_positions: [],
            error: '',
            getPositionById: jest.fn(),
            is_loading: false,
            is_accumulator: false,
            is_multiplier: false,
            is_turbos: false,
            onClickCancel: jest.fn(),
            onClickSell: jest.fn(),
            onMount: jest.fn(),
            positions: [],
            removePositionById: jest.fn(),
        },
        contract_trade: {
            contract_info: {},
            contract_update_stop_loss: '',
            contract_update_take_profit: '',
            has_contract_update_stop_loss: false,
            has_contract_update_take_profit: false,
            getContractById: jest.fn(),
        },
        modules: {},
        exchange_rates: {
            data: undefined,
            update: jest.fn(),
            unmount: jest.fn(),
        },
        feature_flags: {
            data: undefined,
            update: jest.fn(),
            unmount: jest.fn(),
        },
        gtm: {
            is_gtm_applicable: false,
            visitorId: 'visitorId',
            common_variables: {
                language: 'en',
                theme: 'dark',
                platform: 'DBot',
                loggedIn: false,
            },
            accountSwitcherListener: jest.fn(),
            pushDataLayer: jest.fn(),
            pushTransactionData: jest.fn(),
            eventHandler: jest.fn(),
            setLoginFlag: jest.fn(),
        },
    };
};

const mockStore = (override: DeepPartial<TStores>): TStores => merge(mock(), override);

export default mockStore;
