import React from 'react';
import { action, computed, makeObservable, observable, reaction } from 'mobx';

import { StaticUrl } from '@deriv/components';
import {
    checkServerMaintenance,
    extractInfoFromShortcode,
    formatDate,
    formatMoney,
    getDateFromTimestamp,
    getEndTime,
    getMarketName,
    getPathname,
    getPlatformSettings,
    shouldShowPhoneVerificationNotification,
    getStaticUrl,
    getTotalProfit,
    getTradeTypeName,
    getUrlBase,
    isCryptocurrency,
    isEmptyObject,
    isHighLow,
    isMobile,
    isMultiplierContract,
    LocalStore,
    routes,
    unique,
} from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';

import { BinaryLink } from 'App/Components/Routes';
import { WS } from 'Services';

import { sortNotifications, sortNotificationsMobile } from '../App/Components/Elements/NotificationMessage/constants';

import {
    excluded_notifications,
    getCashierValidations,
    getStatusValidations,
    hasMissingRequiredField,
    maintenance_notifications,
    poi_notifications,
} from './Helpers/client-notifications';
import BaseStore from './base-store';
import dayjs from 'dayjs';
import { Analytics } from '@deriv-com/analytics';

export default class NotificationStore extends BaseStore {
    is_notifications_visible = false;
    notifications = [];
    notification_messages = [];
    marked_notifications = [];
    push_notifications = [];
    client_notifications = {};
    should_show_popups = true;
    should_show_passkey_notification = false;
    trade_notifications = [];
    p2p_advertiser_info = {};
    p2p_order_props = {};
    p2p_redirect_to = {};
    p2p_completed_orders = [];

    constructor(root_store) {
        super({ root_store });

        makeObservable(this, {
            addNotificationBar: action.bound,
            addNotificationMessage: action.bound,
            addNotificationMessageByKey: action.bound,
            addTradeNotification: action.bound,
            addVerificationNotifications: action.bound,
            client_notifications: observable,
            filterNotificationMessages: action.bound,
            handleClientNotifications: action.bound,
            is_notifications_empty: computed,
            is_notifications_visible: observable,
            marked_notifications: observable,
            markNotificationMessage: action.bound,
            notification_messages: observable,
            notifications: observable,
            p2p_advertiser_info: observable,
            p2p_completed_orders: observable,
            p2p_order_props: observable,
            p2p_redirect_to: observable,
            push_notifications: observable,
            refreshNotifications: action.bound,
            removeAllNotificationMessages: action.bound,
            removeNotificationByKey: action.bound,
            removeNotificationMessage: action.bound,
            removeNotificationMessageByKey: action.bound,
            removeNotifications: action.bound,
            removeTradeNotifications: action.bound,
            resetVirtualBalanceNotification: action.bound,
            setClientNotifications: action.bound,
            setP2POrderProps: action.bound,
            setP2PRedirectTo: action.bound,
            setShouldShowPopups: action.bound,
            should_show_passkey_notification: observable,
            should_show_popups: observable,
            showCompletedOrderNotification: action.bound,
            toggleNotificationsModal: action.bound,
            trade_notifications: observable,
            unmarkNotificationMessage: action.bound,
            updateNotifications: action.bound,
            handleCurrencyRemovalNotification: action.bound,
        });

        reaction(
            () => root_store.common.app_routing_history.map(i => i.pathname),
            () => {
                this.filterNotificationMessages();
                this.marked_notifications = JSON.parse(LocalStore.get('marked_notifications') || '[]');
            }
        );
        reaction(
            () => [
                root_store.client.account_settings,
                root_store.client.account_status,
                root_store.client.landing_companies,
                root_store.client.is_p2p_enabled,
                root_store.common?.selected_contract_type,
                root_store.client.is_eu,
                root_store.client.has_enabled_two_fa,
                root_store.client.has_changed_two_fa,
                root_store.client.should_show_passkey_notification,
                this.p2p_order_props.order_id,
            ],
            () => {
                if (
                    !root_store.client.is_logged_in ||
                    (Object.keys(root_store.client.account_status || {}).length > 0 &&
                        Object.keys(root_store.client.landing_companies || {}).length > 0)
                ) {
                    this.removeNotifications();
                    this.removeAllNotificationMessages();
                    this.setClientNotifications();
                    this.handleClientNotifications();
                    this.filterNotificationMessages();
                    this.checkNotificationMessages();
                }
            }
        );
        reaction(
            () => [this.p2p_completed_orders, this.p2p_advertiser_info],
            () => {
                this.handleClientNotifications();
            }
        );
    }

    get is_notifications_empty() {
        return !this.notifications.length;
    }

    addNotificationBar(message) {
        this.push_notifications.push(message);
        this.push_notifications = unique(this.push_notifications, 'msg_type');
    }

    addNotificationMessage(notification) {
        if (!notification) return;
        if (!this.notification_messages.find(item => item.key === notification.key)) {
            // Remove notification messages if it was already closed by user and exists in LocalStore
            const active_loginid = LocalStore.get('active_loginid');
            const messages = LocalStore.getObject('notification_messages');

            if (active_loginid) {
                // Check if is existing message to remove already closed messages stored in LocalStore
                const is_existing_message = Array.isArray(messages[active_loginid])
                    ? messages[active_loginid].includes(notification.key)
                    : false;

                if (is_existing_message) {
                    this.markNotificationMessage({ key: notification.key });
                    return;
                }

                const sortFn = isMobile() ? sortNotificationsMobile : sortNotifications;
                this.notification_messages = [...this.notification_messages, notification].sort(sortFn);

                if (
                    ['svg', 'p2p'].some(key => notification.key?.includes(key)) ||
                    (excluded_notifications && !excluded_notifications.includes(notification.key))
                ) {
                    this.updateNotifications();
                }
            }
        }
    }

    addNotificationMessageByKey(key) {
        if (key) this.addNotificationMessage(this.client_notifications[key]);
    }

    addTradeNotification(contract_info) {
        if (!contract_info) return;
        const {
            buy_price,
            contract_id,
            contract_type,
            currency,
            profit,
            purchase_time,
            shortcode,
            status,
            underlying,
        } = contract_info;
        const id = `${contract_id}_${status}`;
        if (this.trade_notifications.some(({ id: notification_id }) => notification_id === id)) return;
        const contract_main_title = getTradeTypeName(contract_type, {
            isHighLow: isHighLow({ shortcode }),
            showMainTitle: true,
        });
        this.trade_notifications.push({
            id,
            buy_price,
            contract_id,
            contract_type: `${contract_main_title} ${getTradeTypeName(contract_type, {
                isHighLow: isHighLow({ shortcode }),
            })}`.trim(),
            currency,
            profit: isMultiplierContract(contract_type) && !isNaN(profit) ? getTotalProfit(contract_info) : profit,
            status,
            symbol: getMarketName(underlying ?? extractInfoFromShortcode(shortcode).underlying),
            timestamp: status === 'open' ? purchase_time : getEndTime(contract_info),
        });
        /* Consider notifications older than 100s ago as stale and filter out such trade_notifications from the array
           in order to protect RAM in case there are too many notifications coming at once. */
        const hundred_sec_ago = Math.floor(Date.now() / 1000) - 100;
        this.trade_notifications = this.trade_notifications.filter(({ timestamp }) => timestamp > hundred_sec_ago);
    }

    addVerificationNotifications(identity, document, has_restricted_mt5_account, has_mt5_account_with_rejected_poa) {
        if (identity.status === 'verified') {
            //identity
            this.addNotificationMessage(this.client_notifications.poi_verified);
        } else if (!['none', 'pending', 'expired'].includes(identity.status)) {
            this.addNotificationMessage(this.client_notifications.poi_failed);
        }

        // document
        if (document.status === 'verified') {
            this.addNotificationMessage(this.client_notifications.poa_verified);
        } else if (has_restricted_mt5_account) {
            if (document.status === 'pending') {
                this.addNotificationMessage(this.client_notifications.resticted_mt5_with_pending_poa);
            } else {
                this.addNotificationMessage(this.client_notifications.resticted_mt5_with_failed_poa);
            }
        } else if (has_mt5_account_with_rejected_poa) {
            this.addNotificationMessage(this.client_notifications.poa_rejected_for_mt5);
        } else if (!['none', 'pending', 'expired'].includes(document.status)) {
            this.addNotificationMessage(this.client_notifications.poa_failed);
        }
    }

    filterNotificationMessages() {
        if (LocalStore.get('active_loginid') !== 'null')
            this.resetVirtualBalanceNotification(LocalStore.get('active_loginid'));
        if (window.location.pathname === routes.proof_of_identity) {
            this.notification_messages = this.notification_messages.filter(
                notif => !poi_notifications.includes(notif.key)
            );
        }
        if (window.location.pathname === routes.personal_details) {
            this.notification_messages = this.notification_messages.filter(
                notification =>
                    notification.platform === 'Account' || maintenance_notifications.includes(notification.key)
            );
        } else if (!window.location.pathname.includes(routes.cashier_p2p)) {
            this.notification_messages = this.notification_messages.filter(notification => {
                if (notification.platform === undefined || notification.platform.includes(getPathname())) {
                    return true;
                } else if (!notification.platform.includes(getPathname())) {
                    if (notification.is_disposable) {
                        this.removeNotificationMessage({
                            key: notification.key,
                            should_show_again: notification.should_show_again,
                        });
                        this.removeNotificationByKey({ key: notification.key });
                    }
                }

                return false;
            });
        }
    }

    // check for the already added keys in the notification_messages and don't display those notifications
    checkNotificationMessages() {
        const notifications_list = LocalStore.getObject('notification_messages');
        const { loginid } = this.root_store.client;
        const refined_list = notifications_list[loginid] ? Object.values(notifications_list[loginid]) : [];
        const p2p_settings = LocalStore.getObject('p2p_settings');
        const is_p2p_notifications_visible = p2p_settings[loginid]
            ? p2p_settings[loginid].is_notifications_visible
            : false;
        if (refined_list.length) {
            refined_list.map(refined => {
                if (refined.includes('p2p')) {
                    if (is_p2p_notifications_visible === false) {
                        this.removeNotificationByKey({ key: refined });
                    }
                } else {
                    this.removeNotificationByKey({ key: refined });
                }
            });
        }
    }

    async handleClientNotifications() {
        const current_time = dayjs();
        const {
            account_list,
            account_settings,
            account_status,
            accounts,
            isAccountOfType,
            is_eu,
            is_identity_verification_needed,
            is_logged_in,
            is_virtual,
            is_phone_number_verification_enabled,
            landing_company_shortcode,
            loginid,
            obj_total_balance,
            website_status,
            has_enabled_two_fa,
            has_changed_two_fa,
            has_wallet,
            is_poi_dob_mismatch,
            is_financial_assessment_needed,
            is_financial_information_incomplete,
            has_restricted_mt5_account,
            has_mt5_account_with_rejected_poa,
            is_proof_of_ownership_enabled,
            is_p2p_enabled,
            is_poa_expired,
            currency,
        } = this.root_store.client;
        const { upgradable_daily_limits } = this.p2p_advertiser_info || {};
        const { max_daily_buy, max_daily_sell } = upgradable_daily_limits || {};
        const { is_10k_withdrawal_limit_reached } = this.root_store.modules.cashier.withdraw;
        const { current_language, selected_contract_type } = this.root_store.common;
        const malta_account = landing_company_shortcode === 'maltainvest';
        const cr_account = landing_company_shortcode === 'svg';
        const has_trustpilot = LocalStore.getObject('marked_notifications').includes(
            this.client_notifications.trustpilot?.key
        );
        const is_next_email_attempt_timer_running = shouldShowPhoneVerificationNotification(
            account_settings?.phone_number_verification?.next_email_attempt,
            current_time
        );
        const show_phone_number_verification_notification =
            !(window.location.pathname === routes.phone_verification) &&
            !account_settings?.phone_number_verification?.verified &&
            account_settings?.phone &&
            !is_next_email_attempt_timer_running &&
            !is_virtual &&
            is_phone_number_verification_enabled;
        let has_missing_required_field;

        const is_server_down = checkServerMaintenance(website_status);

        if (website_status?.message?.length || is_server_down) {
            this.addNotificationMessage(this.client_notifications.site_maintenance);
        } else {
            this.removeNotificationByKey({ key: this.client_notifications.site_maintenance });
        }

        if (is_logged_in) {
            if (isEmptyObject(account_status)) return;
            const {
                authentication: { document, identity, income, needs_verification, ownership } = {},
                status,
                cashier_validation,
                account_closure = [],
            } = account_status;

            const {
                cashier_locked,
                deposit_locked,
                document_needs_action,
                mt5_withdrawal_locked,
                personal_details_locked,
                poi_name_mismatch,
                withdrawal_locked,
            } = getStatusValidations(status || []);

            this.handlePOAAddressMismatchNotifications();

            const account_currency_closure_status = account_closure.find(
                closure_type => closure_type.type === 'currency'
            );

            if (account_currency_closure_status) {
                this.handleCurrencyRemovalNotification(account_currency_closure_status, currency);
            }

            if (status?.includes('mt5_additional_kyc_required'))
                this.addNotificationMessage(this.client_notifications.additional_kyc_info);

            if (!has_enabled_two_fa && obj_total_balance.amount_real > 0) {
                this.addNotificationMessage(this.client_notifications.two_f_a);
            } else {
                this.removeNotificationByKey({ key: this.client_notifications.two_f_a?.key });
            }

            if (show_phone_number_verification_notification) {
                this.addNotificationMessage(this.client_notifications.phone_number_verification);
            } else {
                this.removeNotificationByKey({ key: this.client_notifications.phone_number_verification });
            }

            if (malta_account && is_financial_information_incomplete) {
                this.addNotificationMessage(this.client_notifications.need_fa);
            } else {
                this.removeNotificationByKey({ key: this.client_notifications.need_fa });
            }

            if (is_poi_dob_mismatch) {
                this.addNotificationMessage(this.client_notifications.poi_dob_mismatch);
            } else {
                this.removeNotificationByKey({ key: this.client_notifications.poi_dob_mismatch });
            }
            if (is_poa_expired) {
                this.addNotificationMessage(this.client_notifications.poa_expired);
            } else {
                this.removeNotificationByKey({ key: this.client_notifications.poa_expired });
            }
            if (loginid !== LocalStore.get('active_loginid')) return;

            if (is_financial_assessment_needed) {
                this.addNotificationMessage(this.client_notifications.notify_financial_assessment);
            } else {
                this.removeNotificationByKey({ key: this.client_notifications.notify_financial_assessment?.key });
            }

            if (has_changed_two_fa) {
                this.addNotificationMessage(this.client_notifications.has_changed_two_fa);
            }

            if (this.root_store.client.should_show_passkey_notification) {
                this.addNotificationMessage(this.client_notifications.enable_passkey);
            } else {
                this.removeNotificationByKey({ key: this.client_notifications.enable_passkey });
            }

            if (this.root_store.client.is_account_to_be_closed_by_residence) {
                this.addNotificationMessage(this.client_notifications.notify_account_is_to_be_closed_by_residence);
            } else {
                this.removeNotificationByKey({
                    key: this.client_notifications.notify_account_is_to_be_closed_by_residence,
                });
            }

            if (!has_trustpilot && this.root_store.client.should_show_trustpilot_notification) {
                this.addNotificationMessage(this.client_notifications.trustpilot);
            }

            const client = accounts[loginid];
            if (client && !client.is_virtual) {
                if (isEmptyObject(account_status)) return;
                if (loginid !== LocalStore.get('active_loginid')) return;

                const {
                    cashier_locked_status,
                    documents_expired,
                    FinancialAssessmentRequired,
                    is_virtual,
                    no_residence,
                    no_withdrawal_or_trading_status,
                    SelfExclusion,
                    system_maintenance,
                    unwelcome_status,
                    withdrawal_locked_status,
                    ASK_AUTHENTICATE,
                    ASK_CURRENCY,
                    ASK_FINANCIAL_RISK_APPROVAL,
                    ASK_FIX_DETAILS,
                    ASK_SELF_EXCLUSION_MAX_TURNOVER_SET,
                    ASK_TIN_INFORMATION,
                } = cashier_validation ? getCashierValidations(cashier_validation) : {};
                const needs_poa =
                    is_10k_withdrawal_limit_reached &&
                    (needs_verification.includes('document') || document?.status !== 'verified');
                const needs_poi = is_10k_withdrawal_limit_reached && identity?.status !== 'verified';
                const needs_poinc =
                    needs_verification.includes('income') && ['rejected', 'none'].includes(income?.status);
                const poinc_upload_limited = needs_verification.includes('income') && income?.status === 'locked';
                const onfido_submissions_left = identity?.services.onfido.submissions_left;
                const poo_required = ownership?.requests?.length > 0 && ownership?.status?.toLowerCase() !== 'rejected';
                const poo_rejected = is_proof_of_ownership_enabled && ownership?.status?.toLowerCase() === 'rejected';
                const svg_needs_poi_poa =
                    cr_account &&
                    status.includes('allow_document_upload') &&
                    identity?.status === 'none' &&
                    document?.status === 'none';
                const svg_needs_poa =
                    cr_account && status.includes('allow_document_upload') && document?.status === 'none';
                const svg_needs_poi =
                    cr_account && status.includes('allow_document_upload') && identity?.status === 'none';
                const svg_poi_expired = cr_account && identity?.status === 'expired';
                const has_tusdt_account = account_list.some(account => account.title === 'tUSDT');

                this.addVerificationNotifications(
                    identity,
                    document,
                    has_restricted_mt5_account,
                    has_mt5_account_with_rejected_poa
                );

                if (needs_poa) this.addNotificationMessage(this.client_notifications.needs_poa);
                if (needs_poi) this.addNotificationMessage(this.client_notifications.needs_poi);
                if (needs_poinc) this.addNotificationMessage(this.client_notifications.needs_poinc);
                if (poinc_upload_limited) this.addNotificationMessage(this.client_notifications.poinc_upload_limited);

                if (
                    poi_name_mismatch &&
                    identity?.services.onfido.last_rejected &&
                    !personal_details_locked &&
                    onfido_submissions_left > 0
                ) {
                    this.addNotificationMessage(this.client_notifications.poi_name_mismatch);
                }

                if (system_maintenance) {
                    this.setClientNotifications(client);
                    this.addNotificationMessage(
                        this.client_notifications.system_maintenance(withdrawal_locked, deposit_locked)
                    );
                } else if (cashier_locked) {
                    if (is_virtual) {
                        this.addNotificationMessage(this.client_notifications.is_virtual);
                    } else if (no_residence) {
                        this.addNotificationMessage(this.client_notifications.no_residence);
                    } else if (documents_expired) {
                        this.addNotificationMessage(this.client_notifications.documents_expired);
                    } else if (cashier_locked_status) {
                        this.addNotificationMessage(this.client_notifications.cashier_locked);
                    } else if (ASK_CURRENCY) {
                        this.addNotificationMessage(this.client_notifications.currency);
                    } else if (ASK_AUTHENTICATE && is_identity_verification_needed) {
                        this.addNotificationMessage(this.client_notifications.identity);
                    } else if (ASK_AUTHENTICATE) {
                        this.addNotificationMessage(this.client_notifications.authenticate);
                    } else if (isAccountOfType('financial') && ASK_FINANCIAL_RISK_APPROVAL) {
                        this.addNotificationMessage(this.client_notifications.ask_financial_risk_approval);
                    } else if (FinancialAssessmentRequired) {
                        this.addNotificationMessage(this.client_notifications.risk);
                    } else if (isAccountOfType('financial') && ASK_TIN_INFORMATION) {
                        this.addNotificationMessage(this.client_notifications.tax);
                    } else if (ASK_SELF_EXCLUSION_MAX_TURNOVER_SET) {
                        this.addNotificationMessage(this.client_notifications.max_turnover_limit_not_set);
                    } else if (ASK_FIX_DETAILS) {
                        this.addNotificationMessage(
                            this.client_notifications.required_fields(withdrawal_locked, deposit_locked)
                        );
                    } else if (!has_wallet) {
                        this.addNotificationMessage(this.client_notifications.cashier_locked);
                    }
                } else {
                    if (withdrawal_locked) {
                        if (ASK_AUTHENTICATE) {
                            this.addNotificationMessage(this.client_notifications.withdrawal_locked_review);
                        } else if (no_withdrawal_or_trading_status) {
                            this.addNotificationMessage(this.client_notifications.no_withdrawal_or_trading);
                        } else if (withdrawal_locked_status) {
                            this.addNotificationMessage(this.client_notifications.withdrawal_locked);
                        } else if (ASK_FIX_DETAILS) {
                            this.addNotificationMessage(
                                this.client_notifications.required_fields(withdrawal_locked, deposit_locked)
                            );
                        }
                    }
                    if (deposit_locked) {
                        if (SelfExclusion) {
                            this.addNotificationMessage(
                                this.client_notifications.self_exclusion(client.excluded_until)
                            );
                        } else if (unwelcome_status) {
                            this.addNotificationMessage(this.client_notifications.unwelcome);
                        }
                    }
                }

                if (has_tusdt_account) this.addNotificationMessage(this.client_notifications.has_tusdt_account);
                if (mt5_withdrawal_locked) this.addNotificationMessage(this.client_notifications.mt5_withdrawal_locked);
                if (document_needs_action) this.addNotificationMessage(this.client_notifications.document_needs_action);
                if (is_p2p_enabled) {
                    this.addNotificationMessage(this.client_notifications.dp2p);

                    this.p2p_completed_orders?.map(order => {
                        const {
                            advertiser_details,
                            client_details,
                            id,
                            is_reviewable,
                            status: order_status,
                            type,
                        } = order;

                        if (is_reviewable) {
                            if (type === 'buy' && order_status === 'completed' && client_details.loginid === loginid)
                                this.showCompletedOrderNotification(advertiser_details.name, id);

                            if (
                                type === 'sell' &&
                                order_status === 'completed' &&
                                advertiser_details.loginid === loginid
                            )
                                this.showCompletedOrderNotification(client_details.name, id);
                        }
                    });

                    if (upgradable_daily_limits)
                        this.addNotificationMessage(
                            this.client_notifications.p2p_daily_limit_increase(
                                client.currency,
                                max_daily_buy,
                                max_daily_sell
                            )
                        );
                } else {
                    this.removeNotificationMessageByKey({ key: this.client_notifications.dp2p?.key });
                }
                has_missing_required_field = hasMissingRequiredField(account_settings, client, isAccountOfType);
                if (has_missing_required_field) {
                    this.addNotificationMessage(
                        this.client_notifications.required_fields(withdrawal_locked, deposit_locked)
                    );
                }
                if (poo_required) {
                    this.addNotificationMessage(this.client_notifications.poo_required);
                }
                if (poo_rejected) {
                    this.addNotificationMessage(this.client_notifications.poo_rejected);
                }
                //add notification message for SVG clients
                if (svg_needs_poi_poa) {
                    this.addNotificationMessage(this.client_notifications.svg_needs_poi_poa);
                } else if (svg_needs_poa) {
                    this.addNotificationMessage(this.client_notifications.svg_needs_poa);
                } else if (svg_needs_poi) {
                    this.addNotificationMessage(this.client_notifications.svg_needs_poi);
                } else if (svg_poi_expired) {
                    this.addNotificationMessage(this.client_notifications.svg_poi_expired);
                }
            }
        }

        if (!is_eu && isMultiplierContract(selected_contract_type) && current_language === 'EN' && is_logged_in) {
            this.addNotificationMessage(this.client_notifications.deriv_go);
        } else {
            this.removeNotificationMessageByKey({ key: this.client_notifications.deriv_go?.key });
        }
    }

    showCompletedOrderNotification(advertiser_name, order_id) {
        const notification_key = `p2p_order_${order_id}`;
        const { setP2POrderTab, navigateToOrderDetails } = this.p2p_order_props;
        const is_p2p_route = window.location.pathname.includes(routes.cashier_p2p);

        const notification_redirect_action = is_p2p_route
            ? {
                  onClick: () => {
                      setP2POrderTab(order_id);
                      navigateToOrderDetails(order_id);
                      this.setP2POrderProps({ ...this.p2p_order_props, order_id });

                      if (this.is_notifications_visible) this.toggleNotificationsModal();
                      this.refreshNotifications();
                  },
                  text: localize('Give feedback'),
              }
            : {
                  route: `${routes.p2p_orders}?order=${order_id}`,
                  text: localize('Give feedback'),
              };

        this.addNotificationMessage({
            action: notification_redirect_action,
            header: <Localize i18n_default_text='Your order {{order_id}} is complete' values={{ order_id }} />,
            key: notification_key,
            message: (
                <Localize
                    i18n_default_text='{{name}} has released your funds. <br/> Would you like to give your feedback?'
                    values={{ name: advertiser_name }}
                />
            ),
            platform: 'P2P',
            type: 'p2p_completed_order',
            should_show_again: true,
        });
    }

    markNotificationMessage({ key }) {
        if (!this.marked_notifications.includes(key)) {
            this.marked_notifications.push(key);
            LocalStore.set('marked_notifications', JSON.stringify(this.marked_notifications));
        }
    }

    refreshNotifications() {
        this.removeNotifications(true);
        this.removeAllNotificationMessages();
        this.setClientNotifications();
        this.handleClientNotifications();
    }

    removeAllNotificationMessages(should_close_persistent = false) {
        this.notification_messages = should_close_persistent
            ? []
            : [...this.notification_messages.filter(notifs => notifs.is_persistent)];
    }

    removeNotifications(should_close_persistent) {
        this.notifications = should_close_persistent
            ? []
            : [...this.notifications.filter(notifs => notifs.is_persistent)];
    }

    removeTradeNotifications(id) {
        this.trade_notifications = id ? this.trade_notifications.filter(item => item.id !== id) : [];
    }

    removeNotificationByKey({ key }) {
        this.notifications = this.notifications.filter(n => n.key !== key);
    }

    removeNotificationMessage({ key, should_show_again } = {}) {
        if (!key) return;
        this.notification_messages = this.notification_messages.filter(n => n.key !== key);
        // Add notification messages to LocalStore when user closes, check for redundancy
        const active_loginid = LocalStore.get('active_loginid');
        if (!excluded_notifications.includes(key) && !key.startsWith('p2p_order') && active_loginid) {
            let messages = LocalStore.getObject('notification_messages');
            // Check if same message already exists in LocalStore for this account
            if (messages[active_loginid] && messages[active_loginid].includes(key)) {
                return;
            }
            const getCurrentMessage = () => {
                if (Array.isArray(messages[active_loginid])) {
                    messages[active_loginid].push(key);
                    return messages[active_loginid];
                }
                return [key];
            };
            if (!should_show_again) {
                // Store message into LocalStore upon closing message
                messages = { ...messages, [active_loginid]: getCurrentMessage() };
                LocalStore.setObject('notification_messages', messages);
            }
        }
    }

    removeNotificationMessageByKey({ key }) {
        this.notification_messages = this.notification_messages.filter(n => n.key !== key);
    }

    resetVirtualBalanceNotification(loginid) {
        const { accounts, is_logged_in } = this.root_store.client;
        if (!is_logged_in) return;
        if (!accounts[loginid]?.is_virtual) return;
        const min_reset_limit = 1000;
        const max_reset_limit = 999000;
        const balance = parseInt(accounts[loginid]?.balance);

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
            this.setClientNotifications({ resetVirtualBalance: this.root_store.client.resetVirtualBalance, message });
            this.addNotificationMessage(this.client_notifications.reset_virtual_balance);
        } else {
            this.removeNotificationByKey({ key: 'reset_virtual_balance' });
            this.removeNotificationMessage({ key: 'reset_virtual_balance', should_show_again: true });
        }
    }

    setClientNotifications(client_data = {}) {
        const { ui } = this.root_store;
        const { has_enabled_two_fa, setTwoFAChangedStatus, logout, email } = this.root_store.client;
        const two_fa_status = has_enabled_two_fa ? localize('enabled') : localize('disabled');

        const platform_name_trader = getPlatformSettings('trader').name;
        const platform_name_go = getPlatformSettings('go').name;

        const notifications = {
            ask_financial_risk_approval: {
                key: 'ask_financial_risk_approval',
                header: localize('Complete your Appropriateness Test'),
                message: localize('Please click the following link to complete your Appropriateness Test.'),
                action: {
                    route: routes.financial_assessment,
                    text: localize('Click here'),
                },
                type: 'warning',
            },
            authenticate: {
                key: 'authenticate',
                header: localize('Your account has not been verified'),
                message: localize(
                    'Please submit your proof of identity and proof of address to verify your account in your account settings to access the cashier.'
                ),
                action: {
                    route: routes.proof_of_identity,
                    text: localize('Go to my account settings'),
                },
                type: 'warning',
            },
            cashier_locked: {
                key: 'cashier_locked',
                header: localize('Your cashier is currently locked'),
                message: localize('Please contact us via live chat to unlock it.'),
                action: {
                    onClick: () => {
                        window.LC_API.open_chat_window();
                    },
                    text: localize('Go to live chat'),
                },
                type: 'warning',
            },
            trustpilot: {
                key: 'trustpilot',
                header: localize('Enjoy using Deriv?'),
                header_popup: localize('We’d love to hear your thoughts'),
                message: localize('Drop your review on Trustpilot.'),
                message_popup: localize('Drop your review on Trustpilot.'),
                action: {
                    onClick: () => {
                        window.open('https://www.trustpilot.com/evaluate/deriv.com', '_blank');
                        this.markNotificationMessage({ key: this.client_notifications.trustpilot.key });
                    },
                    text: localize('Go to Trustpilot'),
                },
                img_src: getUrlBase('/public/images/common/trustpilot_banner.png'),
                img_alt: 'Trustpilot',
                className: 'trustpilot',
                type: 'trustpilot',
                should_show_again: false,
            },
            currency: {
                key: 'currency',
                header: localize('You have not selected your account currency'),
                message: localize('Please set your account currency to enable deposits and withdrawals.'),
                action: {
                    onClick: () => {
                        ui.openRealAccountSignup('set_currency');
                    },
                    text: localize('Set my account currency'),
                },
                type: 'danger',
            },
            p2p_daily_limit_increase: (currency, max_daily_buy, max_daily_sell) => {
                return {
                    action: window.location.pathname.includes(routes.cashier_p2p)
                        ? {
                              onClick: () => {
                                  this.p2p_redirect_to.routeToMyProfile();
                                  if (this.is_notifications_visible) this.toggleNotificationsModal();

                                  this.removeNotificationMessage({
                                      key: 'p2p_daily_limit_increase',
                                      should_show_again: false,
                                  });
                              },
                              text: localize('Yes, increase my limits'),
                          }
                        : {
                              route: routes.p2p_my_profile,
                              text: localize('Yes, increase my limits'),
                          },
                    header: <Localize i18n_default_text='Enjoy higher daily limits' />,
                    key: 'p2p_daily_limit_increase',
                    message: (
                        <Localize
                            i18n_default_text='Would you like to increase your daily limits to {{max_daily_buy}} {{currency}} (buy) and {{max_daily_sell}} {{currency}} (sell)?'
                            values={{
                                currency,
                                max_daily_buy: formatMoney(client_data.currency, max_daily_buy, true),
                                max_daily_sell: formatMoney(client_data.currency, max_daily_sell, true),
                            }}
                        />
                    ),
                    platform: 'P2P',
                    type: 'announce',
                };
            },
            deriv_go: {
                key: 'deriv_go',
                header: <Localize i18n_default_text='Trade on the go' />,
                message: (
                    <Localize
                        i18n_default_text='Get a faster mobile trading experience with the <0>{{platform_name_go}}</0> app!'
                        components={[<StaticUrl key={0} className='link dark' href='/landing/deriv-go' />]}
                        values={{ platform_name_go }}
                    />
                ),
                cta_btn: {
                    text: localize('Learn more'),
                    onClick: () => {
                        window.open(getStaticUrl('/landing/deriv-go'), '_blank');
                    },
                },
                img_src: getUrlBase('/public/images/common/derivgo_banner.png'),
                img_alt: 'deriv_go',
                type: 'promotions',
            },
            documents_expired: {
                key: 'poi_expired',
                header: localize('You submitted expired identification documents'),
                message: localize('Please submit valid identity documents to unlock the cashier.'),
                action: {
                    route: routes.proof_of_identity,
                    text: localize('Submit identity documents'),
                },
                type: 'danger',
            },
            document_needs_action: {
                key: 'document_needs_action',
                header: localize('Authentication failed'),
                message: (
                    <Localize
                        i18n_default_text='<0>Your Proof of Identity or Proof of Address</0> did not meet our requirements. Please check your email for further instructions.'
                        components={[<BinaryLink key={0} className='link' to={routes.proof_of_identity} />]}
                    />
                ),
                type: 'warning',
            },
            dp2p: {
                key: 'dp2p',
                header: localize('Payment problems?'),
                message: localize('There’s an app for that'),
                primary_btn: {
                    text: localize('Learn more'),
                    onClick: () => {
                        window.open(getStaticUrl('/p2p'), '_blank');
                    },
                },
                img_src: getUrlBase('/public/images/common/dp2p_banner.png'),
                img_alt: 'Deriv P2P',
                type: 'news',
            },
            enable_passkey: {
                action: {
                    route: routes.passkeys,
                    text: localize('Enable passkey'),
                },
                key: 'enable_passkey',
                header: localize('Level up your security'),
                message: localize('Strengthen your account’s security today with the latest passkeys feature.'),
                type: 'announce',
                should_show_again: true,
            },
            identity: {
                key: 'identity',
                header: localize('Let’s verify your ID'),
                message: localize(
                    'You need to make a quick identity verification before you can access the Cashier. Please go to your account settings to submit your proof of identity.'
                ),
                action: {
                    route: routes.proof_of_identity,
                    text: localize('Go to my account settings'),
                },
                type: 'warning',
            },
            install_pwa: {
                key: 'install_pwa',
                action: {
                    onClick: () => ui.installWithDeferredPrompt(),
                    text: localize('Install'),
                },
                header: localize('Install the {{platform_name_trader}} web app', { platform_name_trader }),
                message: localize('Launch {{platform_name_trader}} in seconds the next time you want to trade.', {
                    platform_name_trader,
                }),
                type: 'announce',
                should_hide_close_btn: false,
            },
            is_virtual: {
                key: 'is_virtual',
                header: localize('You are on your demo account'),
                message: localize('Please switch to your real account or create one to access the cashier.'),
                type: 'warning',
            },
            max_turnover_limit_not_set: {
                key: 'max_turnover_limit_not_set',
                header: localize('You’ve not set your 30-day turnover limit'),
                message: localize(
                    'Your access to the cashier has been temporarily disabled as you have not set your 30-day turnover limit. Please go to Self-exclusion and set the limit.'
                ),
                action: {
                    route: routes.self_exclusion,
                    text: localize('Go to Self-exclusion'),
                },
                type: 'danger',
            },
            mt5_withdrawal_locked: {
                key: 'mt5_withdrawal_locked',
                header: localize('MT5 withdrawal disabled'),
                message: localize(
                    'MT5 withdrawals have been disabled on your account. Please check your email for more details.'
                ),
                type: 'warning',
            },
            needs_poa: {
                action: {
                    route: routes.proof_of_address,
                    text: localize('Verify address'),
                },
                key: 'needs_poa',
                header: localize('Please verify your proof of address'),
                message: localize('To continue trading with us, please confirm where you live.'),
                type: 'danger',
            },
            needs_poi: {
                action: {
                    route: routes.proof_of_identity,
                    text: localize('Verify identity'),
                },
                key: 'needs_poi',
                header: localize('Please verify your proof of identity'),
                message: localize('To continue trading with us, please confirm who you are.'),
                type: 'danger',
            },
            needs_poinc: {
                action: {
                    route: routes.proof_of_income,
                    text: localize('Go to my account settings'),
                },
                key: 'needs_poinc',
                header: localize('Please verify your proof of income'),
                message: localize('To continue trading with us, please submit your proof of income.'),
                type: 'warning',
            },

            new_version_available: {
                action: {
                    onClick: () => window.location.reload(),
                    text: localize('Refresh now'),
                },
                key: 'new_version_available',
                header: localize('A new version of Deriv is available'),
                message: localize('This page will automatically refresh in 5 minutes to load the latest version.'),
                type: 'warning',
                should_hide_close_btn: true,
                timeout: 300000,
                timeoutMessage: remaining => localize('Auto update in {{ remaining }} seconds', { remaining }),
            },
            no_residence: {
                key: 'no_residence',
                header: localize('You have not selected your country of residence'),
                message: localize(
                    'Please set your country of residence in your account settings to access the cashier.'
                ),
                action: {
                    route: routes.personal_details,
                    text: localize('Go to my account settings'),
                },
                type: 'warning',
            },
            no_withdrawal_or_trading: {
                key: 'no_withdrawal_or_trading',
                header: localize('You are only allowed to make deposits'),
                message: localize('Please contact us via live chat to enable withdrawals.'),
                action: {
                    onClick: () => {
                        window.LC_API.open_chat_window();
                    },
                    text: localize('Go to live chat'),
                },
                type: 'warning',
            },
            notify_financial_assessment: {
                action: {
                    route: routes.financial_assessment,
                    text: localize('Start now'),
                },
                header: localize('Pending action required'),
                key: 'notify_financial_assessment',
                message: localize('Please complete your financial assessment.'),
                should_show_again: true,
                type: 'warning',
            },
            password_changed: {
                key: 'password_changed',
                header: localize('Password updated.'),
                message: <Localize i18n_default_text='Please log in with your updated password.' />,
                type: 'info',
            },
            phone_number_verification: {
                key: 'phone_number_verification',
                header: localize('Complete phone verification'),
                message: <Localize i18n_default_text='Secure your Deriv account by verifying your phone number.' />,
                type: 'warning',
                action: {
                    onClick: () => {
                        WS.verifyEmail(email, 'phone_number_verification');
                        localStorage.setItem('routes_from_notification_to_pnv', window.location.pathname);
                    },
                    route: routes.phone_verification,
                    text: localize('Verify now'),
                },
                should_show_again: true,
            },
            poa_rejected_for_mt5: {
                action: {
                    route: routes.proof_of_address,
                    text: localize('Resubmit proof of address'),
                },
                key: 'poa_rejected_for_mt5',
                header: localize('Please resubmit your proof of address or we may restrict your account.'),
                message: localize('Please submit your proof of address.'),
                type: 'danger',
            },
            poa_failed: {
                action: {
                    route: routes.proof_of_address,
                    text: localize('Resubmit proof of address'),
                },
                key: 'poa_failed',
                header: localize('Please resubmit your proof of address.'),
                type: 'danger',
            },
            poa_verified: {
                key: 'poa_verified',
                header: localize('Your proof of address is verified.'),
                type: 'announce',
                should_hide_close_btn: false,
            },
            poa_expired: {
                key: 'poa_expired',
                header: <Localize i18n_default_text='Lets get your address verified' />,
                message: <Localize i18n_default_text='Please submit your proof of address' />,
                type: 'warning',
                action: {
                    route: routes.proof_of_address,
                    text: localize('Submit now'),
                },
            },
            poi_failed: {
                action: {
                    route: routes.proof_of_identity,
                    text: localize('Resubmit proof of identity'),
                },
                key: 'poi_failed',
                header: localize('Your proof of identity verification has failed'),
                message: localize('Please submit your proof of identity.'),
                type: 'danger',
            },
            poi_verified: {
                key: 'poi_verified',
                header: localize('Your proof of identity is verified.'),
                type: 'announce',
                should_hide_close_btn: false,
            },
            poi_name_mismatch: {
                action: {
                    route: routes.personal_details,
                    text: localize('Personal details'),
                },
                key: 'poi_name_mismatch',
                header: localize('Please update your personal info'),
                message: (
                    <Localize
                        i18n_default_text='It seems that your name in the document is not the same as your Deriv profile. Please update your name in the <0>Personal details</0> page to solve this issue.'
                        components={[<strong key={0} />]}
                    />
                ),
                type: 'warning',
            },
            poinc_upload_limited: {
                key: 'poinc_upload_limited',
                header: localize("You've reached the limit of uploading your documents."),
                message: localize('Please check your email.'),
                type: 'danger',
            },
            resticted_mt5_with_pending_poa: {
                key: 'resticted_mt5_with_pending_poa',
                header: localize('Your proof of address verification is pending'),
                message: localize(
                    'Your address verification is pending, and we’ve placed some restrictions on your account. The restrictions will be lifted once your address is verified.'
                ),
                type: 'danger',
            },
            resticted_mt5_with_failed_poa: {
                action: {
                    route: routes.proof_of_address,
                    text: localize('Resubmit proof of address'),
                },
                key: 'resticted_mt5_with_failed_poa',
                header: localize('Your proof of address verification has failed'),
                message: localize(
                    'Your proof of address did not pass our verification checks, and we’ve placed some restrictions on your account. Please resubmit your proof of address.'
                ),
                type: 'danger',
            },
            required_fields: (withdrawal_locked, deposit_locked) => {
                let message;
                if (withdrawal_locked) {
                    message = localize(
                        'Please go to your account settings and complete your personal details to enable withdrawals.'
                    );
                } else if (deposit_locked) {
                    message = localize(
                        'Please go to your account settings and complete your personal details to enable deposits.'
                    );
                } else {
                    message = localize(
                        'Please go to your account settings and complete your personal details to enable deposits and withdrawals.'
                    );
                }
                return {
                    key: 'required_fields',
                    header: localize('Your personal details are incomplete'),
                    message,
                    type: 'danger',
                    action: {
                        route: routes.personal_details,
                        text: localize('Go to my account settings'),
                    },
                };
            },
            reset_virtual_balance: {
                key: 'reset_virtual_balance',
                header: localize('Reset your balance'),
                message: client_data.message,
                type: 'info',
                is_persistent: true,
                should_show_again: true,
                is_disposable: true,
                action: {
                    text: localize('Reset balance'),
                    onClick: async () => {
                        await client_data.resetVirtualBalance();
                    },
                },
            },
            risk: {
                key: 'risk',
                header: localize('Your cashier is locked'),
                message: localize('Please complete the financial assessment in your account settings to unlock it.'),
                action: {
                    route: routes.financial_assessment,
                    text: localize('Go to my account settings'),
                },
                type: 'warning',
            },
            self_exclusion: excluded_until => {
                return {
                    key: 'self_exclusion',
                    header: localize('You have self-excluded from trading'),
                    message: (
                        <Localize
                            i18n_default_text='You have chosen to exclude yourself from trading on our website until {{exclusion_end}}. If you are unable to place a trade or deposit after your self-exclusion period, please contact us via live chat.'
                            values={{
                                exclusion_end: formatDate(excluded_until, 'DD MMM, YYYY'),
                                interpolation: { escapeValue: false },
                            }}
                        />
                    ),
                    action: {
                        onClick: () => {
                            window.LC_API.open_chat_window();
                        },
                        text: localize('Go to live chat'),
                    },
                    type: 'danger',
                };
            },
            site_maintenance: {
                key: 'site_maintenance',
                header: localize('We’re updating our site'),
                message: localize('Some services may be temporarily unavailable.'),
                type: 'warning',
                should_show_again: true,
                closeOnClick: notification_obj => this.markNotificationMessage({ key: notification_obj.key }),
            },
            system_maintenance: (withdrawal_locked, deposit_locked) => {
                let message, header;
                if (isCryptocurrency(client_data.currency)) {
                    if (withdrawal_locked) {
                        header = localize('Unable to process withdrawals in the moment');
                        message = localize(
                            'Withdrawals are temporarily unavailable due to system maintenance. You can make withdrawals when the maintenance is complete.'
                        );
                    } else if (deposit_locked) {
                        header = localize('Unable to process deposit in the moment');
                        message = localize(
                            'Deposits are temporarily unavailable due to system maintenance. You can make deposits when the maintenance is complete.'
                        );
                    } else {
                        header = localize('Scheduled cashier system maintenance');
                        message = localize(
                            'Our cryptocurrency cashier is temporarily down due to system maintenance. You can make cryptocurrency deposits and withdrawals in a few minutes when the maintenance is complete.'
                        );
                    }
                } else {
                    header = localize('Scheduled cashier maintenance');
                    message = localize(
                        'The cashier is temporarily down due to maintenance. It will be available as soon as the maintenance is complete.'
                    );
                }
                return {
                    key: 'system_maintenance',
                    header,
                    message,
                    type: 'warning',
                    should_show_again: true,
                    closeOnClick: notification_obj => this.markNotificationMessage({ key: notification_obj.key }),
                };
            },
            tax: {
                key: 'tax',
                header: localize('You have not provided your tax identification number'),
                message: localize(
                    'This information is necessary for legal and regulatory requirements. Please go to your account settings, and fill in your latest tax identification number.'
                ),
                action: {
                    route: routes.personal_details,
                    text: localize('Go to my account settings'),
                },
                type: 'danger',
            },
            tnc: {
                action: {
                    onClick: async () => {
                        await WS.tncApproval();
                        WS.getSettings();
                    },
                    text: localize('I accept'),
                },
                key: 'tnc',
                header: localize('Terms & conditions updated'),
                message: (
                    <Localize
                        i18n_default_text='Please accept our <0>updated Terms and Conditions</0> to proceed.'
                        components={[<StaticUrl key={0} className='link' href='terms-and-conditions' />]}
                    />
                ),
                type: 'warning',
            },
            has_changed_two_fa: {
                key: 'has_changed_two_fa',
                header: localize('Logging out on other devices'),
                message: (
                    <Localize
                        i18n_default_text="You've {{two_fa_status}} 2FA on this device. You'll be logged out of your account on other devices (if any). Use your password and a 2FA code to log back in."
                        values={{ two_fa_status }}
                    />
                ),
                type: 'info',
                delay: 4000,
                is_auto_close: true,
                closeOnClick: () => {
                    setTwoFAChangedStatus(false);
                },
            },
            two_f_a: {
                key: 'two_f_a',
                header: localize('Stronger security for your Deriv account'),
                message: localize(
                    'With two-factor authentication, you’ll protect your account with both your password and your phone - so only you can access your account, even if someone knows your password.'
                ),
                action: {
                    route: routes.two_factor_authentication,
                    text: localize('Secure my account'),
                },
                type: 'warning',
            },
            unwelcome: {
                key: 'unwelcome',
                header: localize('Deposits are locked'),
                message: localize('Please contact us via live chat.'),
                action: {
                    onClick: () => {
                        window.LC_API.open_chat_window();
                    },
                    text: localize('Go to live chat'),
                },
                type: 'danger',
            },
            withdrawal_locked: {
                key: 'withdrawal_locked',
                header: localize('You are only allowed to make deposits'),
                message: localize('Please contact us via live chat to enable withdrawals.'),
                action: {
                    onClick: () => {
                        window.LC_API.open_chat_window();
                    },
                    text: localize('Go to live chat'),
                },
                type: 'warning',
            },
            withdrawal_locked_review: {
                key: 'withdrawal_locked_review',
                header: localize('You are unable to make withdrawals'),
                message: (
                    <Localize
                        i18n_default_text='To enable withdrawals, please submit your <0>Proof of Identity (POI)</0> and <1>Proof of Address (POA)</1> and also complete the <2>financial assessment</2> in your account settings.'
                        components={[
                            <a key={0} className='link dark' href={'/account/proof-of-identity'} />,
                            <a key={1} className='link dark' href={'/account/proof-of-address'} />,
                            <a key={2} className='link dark' href={'/account/financial-assessment'} />,
                        ]}
                    />
                ),
                type: 'warning',
            },
            you_are_offline: {
                key: 'you_are_offline',
                header: localize('You are offline'),
                message: <Localize i18n_default_text='Check your connection.' />,
                type: 'danger',
            },
            poi_dob_mismatch: {
                key: 'poi_dob_mismatch',
                header: localize('Please update your personal info'),
                message: (
                    <Localize
                        i18n_default_text='It seems that your date of birth in the document is not the same as your Deriv profile. Please update your date of birth in the <0>Personal details</0> page to solve this issue.'
                        components={[<strong key={0} />]}
                    />
                ),
                type: 'warning',
                action: {
                    route: routes.personal_details,
                    text: localize('Personal details'),
                },
            },
            poo_required: {
                key: 'poo_required',
                header: (
                    <Localize
                        i18n_default_text='<0>Proof of ownership</0> <1>required</1>'
                        components={[<div key={0} />, <div key={1} />]}
                    />
                ),
                message: (
                    <Localize
                        i18n_default_text='<0></0><1>Your account is currently locked</1> <2></2><3>Please upload your proof of</3> <4>ownership to unlock your account.</4> <5></5>'
                        components={[
                            <br key={0} />,
                            <div key={1} />,
                            <br key={2} />,
                            <div key={3} />,
                            <div key={4} />,
                            <br key={5} />,
                        ]}
                    />
                ),
                action: {
                    route: routes.proof_of_ownership,
                    text: localize('Upload my document'),
                },
                type: 'warning',
            },
            poo_rejected: {
                key: 'poo_rejected',
                header: (
                    <Localize
                        i18n_default_text='<0>Proof of ownership</0> <1>verification failed</1>'
                        components={[<div key={0} />, <div key={1} />]}
                    />
                ),
                message: (
                    <Localize
                        i18n_default_text='<0></0><1>Please upload your document</1> <2>with the correct details.</2> <3></3>'
                        components={[<br key={0} />, <div key={1} />, <div key={2} />, <br key={3} />]}
                    />
                ),
                action: {
                    route: routes.proof_of_ownership,
                    text: localize('Upload again'),
                },
                type: 'warning',
            },
            need_fa: {
                key: 'need_fa',
                header: localize('You can only make deposits.'),
                message: (
                    <Localize i18n_default_text='You can only make deposits at the moment. To enable withdrawals, please complete your financial assessment.' />
                ),
                type: 'warning',
                action: {
                    route: routes.financial_assessment,
                    text: localize('Start assessment'),
                },
                should_show_again: true,
                closeOnClick: notification_obj => this.markNotificationMessage({ key: notification_obj.key }),
            },
            svg_needs_poi_poa: {
                key: 'svg_needs_poi_poa',
                header: localize('Account verification required'),
                message: (
                    <Localize i18n_default_text='Please submit your proof of identity and proof of address to verify your account and continue trading.' />
                ),
                type: 'warning',
                action: {
                    route: routes.proof_of_identity,
                    text: localize('Go to my account settings'),
                },
                closeOnClick: notification_obj => this.markNotificationMessage({ key: notification_obj.key }),
            },
            svg_needs_poa: {
                key: 'svg_needs_poa',
                header: localize('Proof of address required'),
                message: (
                    <Localize i18n_default_text='Please submit your proof of address to verify your account and continue trading.' />
                ),
                type: 'warning',
                action: {
                    route: routes.proof_of_address,
                    text: localize('Submit proof of address'),
                },
            },
            svg_needs_poi: {
                key: 'svg_needs_poi',
                header: localize('Proof of identity required'),
                message: (
                    <Localize i18n_default_text='Please submit your proof of identity to verify your account and continue trading.' />
                ),
                type: 'warning',
                action: {
                    route: routes.proof_of_identity,
                    text: localize('Submit proof of identity'),
                },
                closeOnClick: notification_obj => this.markNotificationMessage({ key: notification_obj.key }),
            },
            svg_poi_expired: {
                key: 'svg_poi_expired',
                header: localize('Your proof of identity is expired'),
                message: (
                    <Localize i18n_default_text='Your proof of identity has expired. Please submit a new proof of identity to verify your account and continue trading.' />
                ),
                type: 'warning',
                action: {
                    route: routes.proof_of_identity,
                    text: localize('Resubmit proof of identity'),
                },
            },
            wallets_migrated: {
                key: 'wallets_migrated',
                header: localize('Your Wallets are ready'),
                message: localize(
                    'To complete the upgrade, please log out and log in again to add more accounts and make transactions with your Wallets.'
                ),
                action: {
                    onClick: async () => {
                        await logout();
                    },
                    text: localize('Log out'),
                },
                type: 'announce',
            },
            wallets_failed: {
                key: 'wallets_failed',
                header: localize('Sorry for the interruption'),
                message: localize(
                    "We're unable to complete with the Wallet upgrade. Please try again later or contact us via live chat."
                ),
                action: {
                    onClick: async () => {
                        window.LC_API.open_chat_window();
                    },
                    text: localize('Go to LiveChat'),
                },
                type: 'danger',
            },
            additional_kyc_info: {
                key: 'additional_kyc_info',
                header: <Localize i18n_default_text='Pending action required' />,
                message: (
                    <Localize i18n_default_text='We require additional information for your Deriv MT5 account(s). Please take a moment to update your information now.' />
                ),
                action: {
                    text: localize('Update now'),
                    onClick: () => {
                        if (this.is_notifications_visible) this.toggleNotificationsModal();
                        ui.toggleAdditionalKycInfoModal();
                        this.markNotificationMessage({ key: 'additional_kyc_info' });
                    },
                },
                type: 'warning',
            },
            notify_account_is_to_be_closed_by_residence: {
                action: {
                    route: routes.cashier_withdrawal,
                    text: localize('Withdraw funds'),
                },
                header: localize('Deposits and trading disabled'),
                key: 'notify_account_is_to_be_closed_by_residence',
                message: (
                    <Localize
                        i18n_default_text='Due to business changes, client accounts in Senegal are to be closed. Withdraw your funds by {{date}}.'
                        values={{
                            date: formatDate(this.root_store.client.account_time_of_closure, 'DD MMM YYYY'),
                        }}
                    />
                ),
                should_show_again: true,
                type: 'warning',
            },
            has_tusdt_account: {
                key: 'has_tusdt_account',
                header: localize('Attention: tUSDT deposit address change'),
                message: (
                    <Localize i18n_default_text='Verify the address on the Deposit page before each deposit to avoid losing funds. Occasionally, the address could be updated.' />
                ),
                type: 'announce',
            },
        };

        this.client_notifications = notifications;
    }

    setP2POrderProps(p2p_order_props) {
        this.p2p_order_props = p2p_order_props;
    }

    setP2PRedirectTo(p2p_redirect_to) {
        this.p2p_redirect_to = p2p_redirect_to;
    }

    setShouldShowPopups(should_show_popups) {
        this.should_show_popups = should_show_popups;
    }

    toggleNotificationsModal() {
        Analytics.trackEvent('ce_notification_form', {
            action: this.is_notifications_visible ? 'close' : 'open',
            form_name: 'ce_notification_form',
            notification_num: this.notifications.length,
        });

        this.is_notifications_visible = !this.is_notifications_visible;
    }

    unmarkNotificationMessage({ key }) {
        this.marked_notifications = this.marked_notifications.filter(item => key !== item);
    }

    updateNotifications() {
        this.notifications = this.notification_messages.filter(message =>
            ['svg', 'p2p'].some(key => message.key?.includes(key))
                ? message
                : excluded_notifications && !excluded_notifications.includes(message.key)
        );
    }

    handlePOAAddressMismatchNotifications = () => {
        const { client } = this.root_store;
        const { account_status } = client;
        const { status } = account_status;
        const { poa_address_mismatch } = getStatusValidations(status || []);

        if (poa_address_mismatch) {
            this.showPOAAddressMismatchWarningNotification();
        }
    };

    showPOAAddressMismatchWarningNotification = () => {
        this.addNotificationMessage({
            key: 'poa_address_mismatch_warning',
            header: localize('Please update your address'),
            message: localize(
                'It appears that the address in your document doesn’t match the address in your Deriv profile. Please update your personal details now with the correct address.'
            ),
            action: {
                route: routes.personal_details,
                text: localize('Go to Personal details'),
            },
            type: 'warning',
            should_show_again: true,
        });
    };

    showPOAAddressMismatchSuccessNotification = () => {
        this.addNotificationMessage({
            key: 'poa_address_mismatch_success',
            header: localize('Your proof of address has been verified'),
            type: 'announce',
            should_show_again: true,
            platform: 'Account',
        });
    };

    showPOAAddressMismatchFailureNotification = () => {
        this.addNotificationMessage({
            key: 'poa_address_mismatch_failure',
            header: localize('Your address doesn’t match your profile'),
            message: localize('Update the address in your profile.'),
            type: 'danger',
            should_show_again: true,
            platform: 'Account',
        });
    };

    handleCurrencyRemovalNotification = (account_currency_closure_status, currency) => {
        const is_funded_account = account_currency_closure_status.status_codes.includes('funded_account');
        const is_non_funded_account = account_currency_closure_status.status_codes.includes('non_funded_account');

        if (!is_funded_account && !is_non_funded_account) return;

        const notification_header = is_funded_account
            ? localize('Withdraw your funds')
            : localize('Change your currency');

        const time_of_closure = getDateFromTimestamp(account_currency_closure_status.time_of_closure);

        const notification_message = is_funded_account ? (
            <Localize
                i18n_default_text="{{currency}} accounts won't be available after {{time_of_closure}}."
                values={{ time_of_closure, currency }}
            />
        ) : (
            <Localize
                i18n_default_text="{{currency}} accounts won't be available after {{time_of_closure}}. Choose a new account currency."
                values={{ time_of_closure, currency }}
            />
        );

        const notification_button_action = is_funded_account
            ? {
                  route: routes.cashier_withdrawal,
                  text: <Localize i18n_default_text='Withdraw {{currency}}' values={{ currency }} />,
              }
            : {
                  text: localize('Contact live chat'),
                  onClick: () => {
                      window.LC_API.open_chat_window();
                  },
              };

        this.addNotificationMessage({
            key: 'account_currency_closure',
            header: notification_header,
            message: notification_message,
            action: notification_button_action,
            type: 'warning',
            should_show_again: true,
        });
    };
}
