import React from 'react';
import { action, computed, makeObservable, observable, reaction } from 'mobx';

import { isEmptyObject, isMobile, routes, toMoment } from '@deriv/shared';

import { Localize, localize } from 'Components/i18next';
import { api_error_codes } from 'Constants/api-error-codes';
import { buy_sell } from 'Constants/buy-sell';
import { order_list } from 'Constants/order-list';
import BaseStore from 'Stores/base_store';
import { convertToMillis, getFormattedDateString } from 'Utils/date-time';
import { createExtendedOrderDetails } from 'Utils/orders';
import { init as WebsocketInit, requestWS, subscribeWS } from 'Utils/websocket';

import { get, init } from 'Utils/server_time';

export default class GeneralStore extends BaseStore {
    active_index = 0;
    active_notification_count = 0;
    advertiser_buy_limit = null;
    advertiser_id = null;
    advertiser_info = {};
    advertiser_sell_limit = null;
    advertiser_relations_response = []; //TODO: Remove this when backend has fixed is_blocked flag issue
    block_unblock_user_error = '';
    balance;
    cancels_remaining = null;
    contact_info = '';
    counterparty_advert_id = '';
    counterparty_advertiser_id = null;
    default_advert_description = '';
    error_code = '';
    external_stores = {};
    feature_level = null;
    formik_ref = null;
    inactive_notification_count = 0;
    is_advertiser = false;
    is_advertiser_blocked = null;
    is_advertiser_info_subscribed = false;
    is_blocked = false;
    is_block_unblock_user_loading = false;
    is_block_user_modal_open = false;
    is_high_risk = false;
    is_listed = false;
    is_loading = false;
    is_p2p_blocked_for_pa = false;
    is_p2p_user = null;
    is_restricted = false;
    nickname = null;
    nickname_error = '';
    order_table_type = order_list.ACTIVE;
    orders = [];
    parameters = null;
    payment_info = '';
    p2p_poa_required = false;
    poa_status = null;
    poi_status = null;
    saved_form_state = null;
    should_show_real_name = false;
    should_show_poa = false;
    user_blocked_count = 0;
    user_blocked_until = null;

    list_item_limit = isMobile() ? 10 : 50;
    path = {
        buy_sell: 0,
        orders: 1,
        my_ads: 2,
        my_profile: 3,
    };
    ws_subscriptions = {};
    service_token_timeout;

    server_time = {
        get,
        init,
    };

    constructor(root_store) {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super(root_store);

        makeObservable(this, {
            active_index: observable,
            active_notification_count: observable,
            advertiser_id: observable,
            advertiser_info: observable,
            advertiser_buy_limit: observable,
            advertiser_sell_limit: observable,
            advertiser_relations_response: observable, //TODO: Remove this when backend has fixed is_blocked flag issue
            block_unblock_user_error: observable,
            balance: observable,
            contact_info: observable,
            counterparty_advert_id: observable,
            counterparty_advertiser_id: observable,
            default_advert_description: observable,
            external_stores: observable,
            feature_level: observable,
            formik_ref: observable,
            error_code: observable,
            inactive_notification_count: observable,
            is_advertiser: observable,
            is_advertiser_blocked: observable,
            is_advertiser_info_subscribed: observable,
            is_blocked: observable,
            is_block_unblock_user_loading: observable,
            is_block_user_modal_open: observable,
            is_high_risk: observable,
            is_listed: observable,
            is_loading: observable,
            is_p2p_user: observable,
            is_p2p_blocked_for_pa: observable,
            is_restricted: observable,
            nickname: observable,
            nickname_error: observable,
            order_table_type: observable,
            orders: observable,
            parameters: observable,
            p2p_poa_required: observable,
            poa_status: observable,
            poi_status: observable,
            saved_form_state: observable,
            should_show_real_name: observable,
            should_show_poa: observable,
            user_blocked_count: observable,
            user_blocked_until: observable,
            active_tab_route: computed,
            blocked_until_date_time: computed,
            is_active_tab: computed,
            is_barred: computed,
            is_form_modified: computed,
            should_show_dp2p_blocked: computed,
            blockUnblockUser: action.bound,
            createAdvertiser: action.bound,
            setCounterpartyAdvertiserId: action.bound,
            handleNotifications: action.bound,
            setP2POrderTab: action.bound,
            showCompletedOrderNotification: action.bound,
            handleTabClick: action.bound,
            onMount: action.bound,
            onUnmount: action.bound,
            redirectTo: action.bound,
            setActiveIndex: action.bound,
            setActiveNotificationCount: action.bound,
            setAccountBalance: action.bound,
            setAdvertiserId: action.bound,
            setAdvertiserBuyLimit: action.bound,
            setAdvertiserSellLimit: action.bound,
            setAdvertiserRelationsResponse: action.bound, //TODO: Remove this when backend has fixed is_blocked flag issue
            setCounterpartyAdvertId: action.bound,
            setErrorCode: action.bound,
            setExternalStores: action.bound,
            setFeatureLevel: action.bound,
            setFormikRef: action.bound,
            setSavedFormState: action.bound,
            saveFormState: action.bound,
            setInactiveNotificationCount: action.bound,
            setIsAdvertiser: action.bound,
            setIsAdvertiserInfoSubscribed: action.bound,
            setIsBlocked: action.bound,
            setIsHighRisk: action.bound,
            setIsListed: action.bound,
            setIsLoading: action.bound,
            setIsP2pBlockedForPa: action.bound,
            setIsP2PUser: action.bound,
            setIsRestricted: action.bound,
            setNickname: action.bound,
            setNicknameError: action.bound,
            setOrderTableType: action.bound,
            setP2pPoaRequired: action.bound,
            setParameters: action.bound,
            setPoaStatus: action.bound,
            setPoiStatus: action.bound,
            setBlockUnblockUserError: action.bound,
            setIsAdvertiserBlocked: action.bound,
            setIsBlockUnblockUserLoading: action.bound,
            setShouldShowRealName: action.bound,
            setShouldShowPoa: action.bound,
            setUserBlockedCount: action.bound,
            setUserBlockedUntil: action.bound,
            setWebsocketInit: action.bound,
            showDailyLimitIncreaseNotification: action.bound,
            updateAdvertiserInfo: action.bound,
            updateP2pNotifications: action.bound,
        });

        reaction(
            () => this.is_barred,
            () => {
                const { my_profile_store } = this.root_store;
                if (!this.is_barred) this.setBlockUnblockUserError('');
                my_profile_store.setSearchTerm('');
                my_profile_store.getTradePartnersList({ startIndex: 0 }, true);
            }
        );
    }

    get active_tab_route() {
        switch (this.active_index) {
            case 1:
                return routes.p2p_orders;
            case 2:
                return routes.p2p_my_ads;
            case 3:
                return routes.p2p_my_profile;
            default:
                return routes.p2p_buy_sell;
        }
    }

    get blocked_until_date_time() {
        return getFormattedDateString(new Date(convertToMillis(this.user_blocked_until)), false, true);
    }

    get is_active_tab() {
        return this.order_table_type === order_list.ACTIVE;
    }

    get is_barred() {
        return !!this.user_blocked_until;
    }

    get is_form_modified() {
        return this.form_state?.dirty || this.saved_form_state;
    }

    get should_show_dp2p_blocked() {
        return this.is_blocked || this.is_high_risk || this.is_p2p_blocked_for_pa || this.should_show_poa;
    }

    blockUnblockUser(should_block, advertiser_id, should_set_is_counterparty_blocked = true) {
        const { advertiser_page_store } = this.root_store;
        this.setIsBlockUnblockUserLoading(true);
        requestWS({
            p2p_advertiser_relations: 1,
            [should_block ? 'add_blocked' : 'remove_blocked']: [advertiser_id],
        }).then(response => {
            if (response) {
                if (!response.error) {
                    this.hideModal();
                    if (should_set_is_counterparty_blocked) {
                        const { p2p_advertiser_relations } = response;

                        //TODO: Remove this when backend has fixed is_blocked flag issue
                        this.setAdvertiserRelationsResponse(p2p_advertiser_relations.blocked_advertisers);

                        advertiser_page_store.setIsCounterpartyAdvertiserBlocked(
                            p2p_advertiser_relations.blocked_advertisers.some(ad => ad.id === advertiser_id)
                        );
                    }
                } else {
                    this.hideModal();
                    const { code, message } = response.error;
                    this.setErrorCode(code);
                    this.setBlockUnblockUserError(message);
                }
            }
            this.setIsBlockUnblockUserLoading(false);
        });
    }

    async createAdvertiser(name) {
        await requestWS({
            p2p_advertiser_create: 1,
            name,
        }).then(response => {
            const { sendbird_store } = this.root_store;
            const { error, p2p_advertiser_create } = response;
            const {
                daily_buy,
                daily_buy_limit,
                daily_sell,
                daily_sell_limit,
                id,
                is_approved,
                is_listed,
                name: advertiser_name,
            } = p2p_advertiser_create || {};

            if (error) {
                this.setNicknameError(error.message);
            } else {
                this.setAdvertiserId(id);
                this.setAdvertiserInfo(p2p_advertiser_create);
                this.setAdvertiserBuyLimit(daily_buy_limit - daily_buy);
                this.setAdvertiserSellLimit(daily_sell_limit - daily_sell);
                this.setIsAdvertiser(!!is_approved);
                this.setIsListed(!!is_listed);
                this.setNickname(advertiser_name);
                this.setNicknameError(undefined);
                sendbird_store.handleP2pAdvertiserInfo(response);
                this.hideModal();
            }
        });
    }

    /**
     * @deprecated Please use 'LocalStorageUtils.getValue' from '@deriv-com/utils' instead of this.
     */
    getLocalStorageSettings = () => {
        return JSON.parse(localStorage.getItem('p2p_settings') || '{}');
    };

    getLocalStorageSettingsForLoginId() {
        const local_storage_settings = this.getLocalStorageSettings()[this.external_stores?.client?.loginid];

        if (isEmptyObject(local_storage_settings)) {
            return { is_cached: false, notifications: [] };
        }

        return local_storage_settings;
    }

    handleNotifications(old_orders, new_orders) {
        const { order_store } = this.root_store;
        const { is_cached, notifications } = this.getLocalStorageSettingsForLoginId();

        new_orders?.forEach(new_order => {
            const order_info = createExtendedOrderDetails(
                new_order,
                this.external_stores.client.loginid,
                this.server_time
            );
            const notification = notifications.find(n => n.order_id === new_order.id);
            const old_order = old_orders.find(o => o.id === new_order.id);
            const is_current_order = new_order.id === order_store.order_id;
            const notification_obj = {
                order_id: new_order.id,
                is_seen: is_current_order,
                is_active: order_info.is_active_order,
            };

            if (old_order) {
                if (old_order.status !== new_order.status) {
                    if (notification) {
                        // If order status changed, notify the user.
                        notification.is_seen = is_current_order;
                        notification.is_active = order_info.is_active_order;

                        // Push notification for successful order completion
                        const { advertiser_details, client_details, id, status, type } = new_order;

                        if (
                            type === buy_sell.BUY &&
                            status === 'completed' &&
                            client_details.loginid === this.external_stores.client.loginid
                        )
                            this.showCompletedOrderNotification(advertiser_details.name, id);

                        if (
                            type === buy_sell.SELL &&
                            status === 'completed' &&
                            advertiser_details.loginid === this.external_stores.client.loginid
                        )
                            this.showCompletedOrderNotification(client_details.name, id);
                    } else {
                        // If we have an old_order, but for some reason don't have a copy in local storage.
                        notifications.push(notification_obj);
                    }
                }
            } else if (!notification) {
                // If we don't have an old order nor a notification, this is a first page load. Compare with
                // cached list or only notify user of actionable orders.
                if (is_cached) {
                    // If we can compare with a cached list, assume each new order should be notified.
                    notifications.push(notification_obj);
                } else {
                    // If we don't have a cached list, only notify user of orders that require action.
                    // This is done so user isn't spammed with old orders after resetting their local storage.
                    const actionable_statuses = ['pending', 'buyer-confirmed'];
                    const is_action_required = actionable_statuses.includes(new_order.status);
                    notifications.push({
                        ...notification_obj,
                        is_seen: is_current_order || !is_action_required,
                    });
                }
            }
        });

        this.updateP2pNotifications(notifications);
    }

    setP2POrderTab(order_id) {
        const { order_store } = this.root_store;
        this.redirectTo('orders');
        this.setOrderTableType(order_list.INACTIVE);
        order_store.setOrderId(order_id);
    }

    showCompletedOrderNotification(advertiser_name, order_id) {
        const { order_store } = this.root_store;
        const notification_key = `p2p_order_${order_id}`;

        // we need to refresh notifications in notifications-store in the case of a bug when user closes the notification, the notification count is not synced up with the closed notification
        this.external_stores?.notifications.refreshNotifications();

        this.external_stores?.notifications.addNotificationMessage({
            action: {
                onClick: () => {
                    if (order_store.order_id === order_id) {
                        order_store.setIsRatingModalOpen(true);
                    }
                    this.setP2POrderTab(order_id);
                },
                text: localize('Give feedback'),
            },
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
        });
    }

    showDailyLimitIncreaseNotification() {
        const { upgradable_daily_limits } = this.advertiser_info;
        const { max_daily_buy, max_daily_sell } = upgradable_daily_limits;
        const { client, notifications } = this.external_stores;

        notifications.addNotificationMessage(
            notifications.client_notifications.p2p_daily_limit_increase(client.currency, max_daily_buy, max_daily_sell)
        );
    }

    handleTabClick(idx) {
        this.setActiveIndex(idx);
        this.setParameters(null);
    }

    onMount() {
        this.setIsLoading(true);
        this.setIsBlocked(false);
        this.setIsHighRisk(false);
        this.setIsP2pBlockedForPa(false);

        this.disposeUserBarredReaction = reaction(
            () => this.user_blocked_until,
            blocked_until => {
                if (typeof blocked_until === 'number') {
                    const server_time = this.server_time.get();
                    const blocked_until_moment = toMoment(blocked_until);

                    // Need isAfter instead of setTimeout as setTimeout has a max delay of 24.8 days
                    if (server_time.isAfter(blocked_until_moment)) this.setUserBlockedUntil(null);
                }
            }
        );

        requestWS({ get_account_status: 1 }).then(({ error, get_account_status }) => {
            const { authentication = {}, p2p_poa_required, p2p_status, status } = get_account_status || {};
            const { document, identity } = authentication;
            this.setIsP2PUser(p2p_status !== 'none' && p2p_status !== 'perm_ban');

            if (status.includes('cashier_locked')) {
                this.setIsBlocked(true);
                this.hideModal();
            } else {
                this.setP2pPoaRequired(p2p_poa_required);
                this.setPoaStatus(document.status);
                this.setPoiStatus(identity.status);
            }

            const hasStatuses = statuses => statuses?.every(status => get_account_status.status.includes(status));

            const is_authenticated = hasStatuses(['authenticated']);
            const is_blocked_for_pa = hasStatuses(['p2p_blocked_for_pa']);
            const is_fa_not_complete = hasStatuses(['financial_assessment_not_complete']);

            if (error) {
                this.setIsHighRisk(false);
                this.setIsBlocked(false);
                this.setIsP2pBlockedForPa(false);
            } else if (get_account_status.p2p_status === 'perm_ban') {
                this.setIsBlocked(true);
            } else if (get_account_status.risk_classification === 'high') {
                const is_cashier_locked = hasStatuses(['cashier_locked']);
                const is_not_fully_authenticated = !hasStatuses(['age_verification', 'authenticated']);
                const is_fully_authed_but_poi_expired = hasStatuses(['authenticated', 'document_expired']);
                const is_not_fully_authenticated_and_fa_not_completed =
                    is_not_fully_authenticated && is_fa_not_complete;

                if (
                    is_authenticated &&
                    (is_cashier_locked ||
                        is_not_fully_authenticated ||
                        is_fully_authed_but_poi_expired ||
                        is_not_fully_authenticated_and_fa_not_completed)
                ) {
                    this.setIsBlocked(true);
                }

                if (!is_authenticated && !is_fa_not_complete) this.setShouldShowPoa(true);

                if (is_fa_not_complete) this.setIsHighRisk(true);
            }

            if (is_blocked_for_pa) {
                this.setIsP2pBlockedForPa(true);
            }

            const { sendbird_store } = this.root_store;

            this.ws_subscriptions = {
                advertiser_subscription: subscribeWS(
                    {
                        p2p_advertiser_info: 1,
                        subscribe: 1,
                    },
                    [this.updateAdvertiserInfo, response => sendbird_store.handleP2pAdvertiserInfo(response)]
                ),
            };
        });
    }

    onUnmount() {
        clearTimeout(this.service_token_timeout);
        clearTimeout(this.user_blocked_timeout);

        Object.keys(this.ws_subscriptions).forEach(key => this.ws_subscriptions[key]?.unsubscribe());

        if (typeof this.disposeUserBarredReaction === 'function') {
            this.disposeUserBarredReaction();
        }

        this.setActiveIndex(0);
        this.external_stores?.notifications.refreshNotifications();
        this.external_stores?.notifications.filterNotificationMessages();
    }

    redirectTo(path_name, params = null) {
        this.setActiveIndex(this.path[path_name]);
        this.setParameters(params);
    }

    setActiveIndex(active_index) {
        this.active_index = active_index;
    }

    setActiveNotificationCount(active_notification_count) {
        this.active_notification_count = active_notification_count;
    }

    setAccountBalance(value) {
        this.balance = value;
    }

    setAdvertiserId(advertiser_id) {
        this.advertiser_id = advertiser_id;
    }

    setAdvertiserInfo(advertiser_info) {
        this.advertiser_info = advertiser_info;
    }

    setAdvertiserBuyLimit(advertiser_buy_limit) {
        this.advertiser_buy_limit = advertiser_buy_limit;
    }

    setAdvertiserSellLimit(advertiser_sell_limit) {
        this.advertiser_sell_limit = advertiser_sell_limit;
    }

    //TODO: Remove this when backend has fixed is_blocked flag issue
    setAdvertiserRelationsResponse(advertiser_relations_response) {
        this.advertiser_relations_response = advertiser_relations_response;
    }

    setBlockUnblockUserError(block_unblock_user_error) {
        this.block_unblock_user_error = block_unblock_user_error;
    }

    setContactInfo(contact_info) {
        this.contact_info = contact_info;
    }

    setCounterpartyAdvertId(counterparty_advert_id) {
        this.counterparty_advert_id = counterparty_advert_id;
    }

    setCounterpartyAdvertiserId(counterparty_advertiser_id) {
        this.counterparty_advertiser_id = counterparty_advertiser_id;
    }

    setDefaultAdvertDescription(default_advert_description) {
        this.default_advert_description = default_advert_description;
    }

    setErrorCode(error_code) {
        this.error_code = error_code;
    }

    setExternalStores(external_stores) {
        this.external_stores = external_stores;
    }

    setFeatureLevel(feature_level) {
        this.feature_level = feature_level;
    }

    setFormikRef(formik_ref) {
        this.formik_ref = formik_ref;
    }

    setSavedFormState(saved_form_state) {
        this.saved_form_state = saved_form_state;
    }

    saveFormState() {
        this.setSavedFormState(this.form_state);
    }

    setInactiveNotificationCount(inactive_notification_count) {
        this.inactive_notification_count = inactive_notification_count;
    }

    setIsAdvertiser(is_advertiser) {
        this.is_advertiser = is_advertiser;
    }

    setIsAdvertiserBlocked(is_advertiser_blocked) {
        this.is_advertiser_blocked = is_advertiser_blocked;
    }

    setIsAdvertiserInfoSubscribed(is_advertiser_info_subscribed) {
        this.is_advertiser_info_subscribed = is_advertiser_info_subscribed;
    }

    setIsBlocked(is_blocked) {
        this.is_blocked = is_blocked;
    }

    setIsBlockUnblockUserLoading(is_block_unblock_user_loading) {
        this.is_block_unblock_user_loading = is_block_unblock_user_loading;
    }

    setIsHighRisk(is_high_risk) {
        this.is_high_risk = is_high_risk;
    }

    setIsListed(is_listed) {
        this.is_listed = is_listed;
    }

    setIsLoading(is_loading) {
        this.is_loading = is_loading;
    }

    setIsP2pBlockedForPa(is_p2p_blocked_for_pa) {
        this.is_p2p_blocked_for_pa = is_p2p_blocked_for_pa;
    }

    setIsP2PUser(is_p2p_user) {
        this.is_p2p_user = is_p2p_user;
    }

    setIsRestricted(is_restricted) {
        this.is_restricted = is_restricted;
    }

    setNickname(nickname) {
        this.nickname = nickname;
    }

    setNicknameError(nickname_error) {
        this.nickname_error = nickname_error;
    }

    setOrderTableType(order_table_type) {
        const { order_store } = this.root_store;
        order_store.setIsLoading(true);
        this.order_table_type = order_table_type;
    }

    setParameters(parameters) {
        this.parameters = parameters;
    }

    setPaymentInfo(payment_info) {
        this.payment_info = payment_info;
    }

    setP2pPoaRequired(p2p_poa_required) {
        this.p2p_poa_required = p2p_poa_required;
    }

    setPoaStatus(poa_status) {
        this.poa_status = poa_status;
    }

    setPoiStatus(poi_status) {
        this.poi_status = poi_status;
    }

    setShouldShowRealName(should_show_real_name) {
        this.should_show_real_name = should_show_real_name;
    }

    setShouldShowPoa(should_show_poa) {
        this.should_show_poa = should_show_poa;
    }

    setUserBlockedCount(user_blocked_count) {
        this.user_blocked_count = user_blocked_count;
    }

    setUserBlockedUntil(user_blocked_until) {
        this.user_blocked_until = user_blocked_until;
    }

    setWebsocketInit = websocket => {
        WebsocketInit(websocket);
    };

    updateAdvertiserInfo(response) {
        const {
            blocked_by_count,
            blocked_until,
            contact_info,
            daily_buy,
            daily_buy_limit,
            daily_sell,
            daily_sell_limit,
            default_advert_description,
            id,
            is_approved,
            is_blocked,
            is_listed,
            name,
            payment_info,
            show_name,
            upgradable_daily_limits,
        } = response?.p2p_advertiser_info || {};

        if (!response.error) {
            this.setAdvertiserId(id);
            this.setAdvertiserInfo(response.p2p_advertiser_info);
            this.setContactInfo(contact_info);
            this.setDefaultAdvertDescription(default_advert_description);
            this.setAdvertiserBuyLimit(daily_buy_limit - daily_buy);
            this.setAdvertiserSellLimit(daily_sell_limit - daily_sell);
            this.setIsAdvertiser(!!is_approved);
            this.setIsAdvertiserBlocked(!!is_blocked);
            this.setIsListed(!!is_listed);
            this.setNickname(name);
            this.setUserBlockedUntil(blocked_until);
            this.setUserBlockedCount(blocked_by_count);
            this.setPaymentInfo(payment_info);
            this.setShouldShowRealName(!!show_name);
            this.setIsRestricted(false);
            this.setIsAdvertiserInfoSubscribed(true);

            if (upgradable_daily_limits) this.showDailyLimitIncreaseNotification();
        } else {
            this.ws_subscriptions.advertiser_subscription.unsubscribe();

            this.setContactInfo('');
            this.setPaymentInfo('');
            this.setDefaultAdvertDescription('');

            if (response.error.code === api_error_codes.RESTRICTED_COUNTRY) {
                this.setIsRestricted(true);
            } else if (response.error.code === api_error_codes.ADVERTISER_NOT_FOUND) {
                this.setIsAdvertiser(false);
            } else if (response.error.code === api_error_codes.PERMISSION_DENIED) {
                this.setIsBlocked(true);
            }
        }

        this.setIsLoading(false);

        if (!this.is_p2p_user) {
            requestWS({ get_account_status: 1 }).then(account_response => {
                if (!account_response.error) {
                    const { get_account_status } = account_response;
                    const { status } = get_account_status;

                    if (status.includes('cashier_locked')) {
                        this.setIsBlocked(true);
                        this.hideModal();
                    }
                }
            });
        }

        this.setIsLoading(false);
    }

    updateP2pNotifications(notifications) {
        const unseen_notifications = notifications.filter(notification => notification.is_seen === false);
        const notification_count = unseen_notifications.length;
        const active_notification_count = unseen_notifications.filter(notification => notification.is_active).length;
        const inactive_notification_count = notification_count - active_notification_count;
        const user_settings = this.getLocalStorageSettingsForLoginId();
        user_settings.is_cached = true;
        user_settings.notifications = notifications;

        const p2p_settings = this.getLocalStorageSettings();
        p2p_settings[this.external_stores?.client?.loginid] = user_settings;

        localStorage.setItem('p2p_settings', JSON.stringify(p2p_settings));
        window.dispatchEvent(new Event('storage'));

        this.setActiveNotificationCount(active_notification_count);
        this.setInactiveNotificationCount(inactive_notification_count);
    }

    validatePopup = values => {
        const validations = {
            nickname: [
                v => !!v,
                v => v.length >= 2,
                v => v.length <= 24,
                v => /^[a-zA-Z0-9\\.@_-]{2,24}$/.test(v),
                v => /^(?!(.*(.)\\2{4,})|.*[\\.@_-]{2,}|^([\\.@_-])|.*([\\.@_-])$)[a-zA-Z0-9\\.@_-]{2,24}$/.test(v),
                v => !/([a-zA-Z0-9\\.@_-])\1{4}/.test(v),
            ],
        };

        const nickname_messages = [
            localize('Nickname is required'),
            localize('Nickname is too short'),
            localize('Nickname is too long'),
            localize('Can only contain letters, numbers, and special characters .- _ @.'),
            localize('Cannot start, end with, or repeat special characters.'),
            localize('Cannot repeat a character more than 4 times.'),
        ];

        const errors = {};

        Object.entries(validations).forEach(([key, rules]) => {
            const error_index = rules.findIndex(v => {
                return !v(values[key]);
            });

            if (error_index !== -1) errors[key] = nickname_messages[error_index];
        });

        return errors;
    };
}
