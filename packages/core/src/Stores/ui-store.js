import { action, autorun, computed, observable } from 'mobx';
import {
    getPathname,
    getPlatformInformation,
    LocalStore,
    unique,
    isTouchDevice,
    platform_name,
    isMobile,
    routes,
} from '@deriv/shared';
import { sortNotifications, sortNotificationsMobile } from 'App/Components/Elements/NotificationMessage';
import { MAX_MOBILE_WIDTH, MAX_TABLET_WIDTH } from 'Constants/ui';
import BaseStore from './base-store';
import { clientNotifications, excluded_notifications } from './Helpers/client-notifications';

const store_name = 'ui_store';

export default class UIStore extends BaseStore {
    @observable is_account_settings_visible = false;
    @observable is_notifications_visible = false;
    @observable is_positions_drawer_on = false;
    @observable is_reports_visible = false;
    @observable reports_route_tab_index = 0;
    @observable is_cashier_visible = false;
    @observable is_history_tab_active = false;
    // TODO: [cleanup ui-store]
    // Take profit, Stop loss & Deal cancellation checkbox
    @observable should_show_cancellation_warning = true;

    // Extensions
    @observable footer_extensions = [];
    @observable header_extension = undefined;
    @observable settings_extension = undefined;
    @observable notification_messages_ui = undefined;

    @observable is_dark_mode_on = window?.matchMedia?.('(prefers-color-scheme: dark)').matches && isMobile();
    @observable is_settings_modal_on = false;
    @observable is_accounts_switcher_on = false;
    @observable account_switcher_disabled_message = '';

    @observable has_only_forward_starting_contracts = false;

    // Purchase Controls
    // @observable is_purchase_confirm_on    = false;
    @observable is_services_error_visible = false;
    @observable is_unsupported_contract_modal_visible = false;
    @observable is_account_signup_modal_visible = false;
    @observable is_set_residence_modal_visible = false;
    @observable is_reset_password_modal_visible = false;
    @observable is_reset_trading_password_modal_visible = false;
    // @observable is_purchase_lock_on       = false;

    // SmartCharts Controls
    // TODO: enable asset information
    // @observable is_chart_asset_info_visible = true;
    @observable is_chart_countdown_visible = false;
    @observable is_chart_layout_default = true;

    // PWA event and config
    @observable pwa_prompt_event = null;

    @observable screen_width = window.innerWidth;
    @observable screen_height = window.innerHeight;
    @observable is_onscreen_keyboard_active = false;

    @observable notifications = [];
    @observable notification_messages = [];
    @observable marked_notifications = [];
    @observable push_notifications = [];

    @observable is_advanced_duration = false;
    @observable advanced_duration_unit = 't';
    @observable advanced_expiry_type = 'duration';
    @observable simple_duration_unit = 't';
    @observable duration_t = 5;
    @observable duration_s = 15;
    @observable duration_m = 3;
    @observable duration_h = 1;
    @observable duration_d = 1;

    // purchase button states
    @observable purchase_states = [false, false];

    // app states for modal
    @observable is_app_disabled = false;
    @observable is_route_modal_on = false;

    // real account signup
    @observable is_real_acc_signup_on = false;
    @observable real_account_signup_target = undefined;
    @observable deposit_real_account_signup_target = undefined;
    @observable has_real_account_signup_ended = false;

    // account types modal
    @observable is_account_types_modal_visible = false;

    // Welcome modal
    @observable is_welcome_modal_visible = false;

    // set currency modal
    @observable is_set_currency_modal_visible = false;

    // position states
    @observable show_positions_toggle = true;

    @observable modal_index = 0;

    // Mt5 topup
    @observable is_top_up_virtual_open = false;
    @observable is_top_up_virtual_in_progress = false;
    @observable is_top_up_virtual_success = false;

    // MT5 create real STP from demo, show only real accounts from switcher
    @observable should_show_real_accounts_list = false;

    // Real account signup
    @observable real_account_signup = {
        active_modal_index: -1,
        previous_currency: '',
        current_currency: '',
        success_message: '',
        error_message: '',
    };

    // UI Focus retention
    @observable current_focus = null;

    // Mobile
    mobile_toast_timeout = 3500;
    @observable.shallow toasts = [];

    @observable is_cfd_page = false;
    @observable is_nativepicker_visible = false;
    @observable is_landscape = false;

    @observable prompt_when = false;
    @observable promptFn = () => {};

    // MT5 account needed modal
    @observable is_account_needed_modal_on = false;
    @observable account_needed_modal_props = {
        target: '',
        target_label: '',
        target_dmt5_label: '',
    };

    @observable manage_real_account_tab_index = 0;

    // onboarding
    @observable should_show_multipliers_onboarding = false;
    @observable choose_crypto_currency_target = null;

    // add crypto accounts
    @observable should_show_cancel = false;

    getDurationFromUnit = unit => this[`duration_${unit}`];

    constructor(root_store) {
        const local_storage_properties = [
            'advanced_duration_unit',
            'is_advanced_duration',
            'advanced_expiry_type',
            'simple_duration_unit',
            'duration_t',
            'duration_s',
            'duration_m',
            'duration_h',
            'duration_d',
            'is_account_settings_visible',
            'is_chart_asset_info_visible',
            'is_chart_countdown_visible',
            'is_chart_layout_default',
            'is_dark_mode_on',
            'is_positions_drawer_on',
            'is_reports_visible',
            // 'is_purchase_confirm_on',
            // 'is_purchase_lock_on',
            'should_show_cancellation_warning',
        ];

        super({ root_store, local_storage_properties, store_name });

        window.addEventListener('resize', this.handleResize);
        autorun(() => {
            this.changeTheme();
        });
    }

    changeTheme = () => {
        // TODO: [disable-dark-bot] Delete this condition when Bot is ready
        const new_app_routing_history = this.root_store.common.app_routing_history.slice();
        const platform = getPlatformInformation(new_app_routing_history).header;
        if (platform === platform_name.DBot) {
            document.body.classList.remove('theme--dark');
            document.body.classList.add('theme--light');
            return;
        }

        if (this.is_dark_mode_on) {
            document.body.classList.remove('theme--light');
            document.body.classList.add('theme--dark');
        } else {
            document.body.classList.remove('theme--dark');
            document.body.classList.add('theme--light');
        }
    };

    @action.bound
    init(notification_messages) {
        this.notification_messages_ui = notification_messages;
    }

    @action.bound
    populateFooterExtensions(footer_extensions) {
        this.footer_extensions = footer_extensions;
    }

    @action.bound
    populateHeaderExtensions(component) {
        this.header_extension = component;
    }

    @action.bound
    populateSettingsExtensions(menu_items) {
        this.settings_extension = menu_items;
    }

    @action.bound
    onChangeUiStore({ name, value }) {
        if (!(name in this)) {
            throw new Error(`Invalid Argument: ${name}`);
        }
        this[name] = value;
    }

    @action.bound
    handleResize() {
        this.screen_width = window.innerWidth;
        this.screen_height = window.innerHeight;
    }

    @action.bound
    setPromptHandler(condition, cb = () => {}) {
        this.prompt_when = condition;
        this.promptFn = cb;
    }

    @computed
    get is_mobile() {
        return this.screen_width <= MAX_MOBILE_WIDTH;
    }

    @computed
    get is_tablet() {
        return this.screen_width <= MAX_TABLET_WIDTH;
    }

    @computed
    get is_account_switcher_disabled() {
        return !!this.account_switcher_disabled_message;
    }

    @computed
    get filtered_notifications() {
        return this.notifications.filter(message => message.type !== 'news');
    }

    @action.bound
    filterNotificationMessages() {
        if (LocalStore.get('active_loginid') !== 'null')
            this.root_store.client.resetVirtualBalanceNotification(LocalStore.get('active_loginid'));
        this.notifications = this.notification_messages.filter(notification => {
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

    @action.bound
    setRouteModal() {
        this.is_route_modal_on = true;
    }

    @action.bound
    disableRouteModal() {
        this.is_route_modal_on = false;
    }

    @action.bound
    disableApp() {
        this.is_app_disabled = true;
    }

    @action.bound
    enableApp() {
        this.is_app_disabled = false;
    }

    @action.bound
    toggleAccountsDialog(status = !this.is_accounts_switcher_on) {
        this.is_accounts_switcher_on = status;
    }

    @action.bound
    setAccountSwitcherDisabledMessage(message) {
        if (message) {
            this.is_accounts_switcher_on = false;
            this.account_switcher_disabled_message = message;
        } else {
            this.account_switcher_disabled_message = '';
        }
    }

    @action.bound
    setPurchaseState(index) {
        this.purchase_states[index] = true;

        // TODO: Find better solution in the future for hack below
        // Force the animation to start quicker by manually assigning class to compensate for mobx getter lag
        // Because mobx has a delay before it can receive the updated prop used to assign the animation class
        const el_purchase_buttons = document.getElementsByClassName('btn-purchase');
        if (el_purchase_buttons[index]) {
            el_purchase_buttons[index].classList.add('btn-purchase--swoosh');
        }
        // UI/UX wants button to remain green until transition is finished and only then disable buttons
        setTimeout(() => {
            [].forEach.bind(el_purchase_buttons, el => {
                el.classList.add('btn-purchase--disabled');
            })();
        }, 250);
    }

    @action.bound
    resetPurchaseStates() {
        this.purchase_states = [false, false];
    }

    @action.bound
    setChartLayout(is_default) {
        this.is_chart_layout_default = is_default;
    }

    // TODO: enable asset information
    // @action.bound
    // setChartAssetInfo(is_visible) {
    //     this.is_chart_asset_info_visible = is_visible;
    // }

    @action.bound
    setChartCountdown(is_visible) {
        this.is_chart_countdown_visible = is_visible;
    }

    // @action.bound
    // togglePurchaseLock() {
    //     this.is_purchase_lock_on = !this.is_purchase_lock_on;
    // }

    // @action.bound
    // setPurchaseLock(is_locked) {
    //     this.is_purchase_lock_on = is_locked;
    // }

    // @action.bound
    // togglePurchaseConfirmation() {
    //     this.is_purchase_confirm_on = !this.is_purchase_confirm_on;
    // }

    @action.bound
    setDarkMode(is_dark_mode_on) {
        if (this.is_dark_mode_on !== is_dark_mode_on) {
            this.is_dark_mode_on = is_dark_mode_on;
            // This GTM call is here instead of the GTM store due to frequency of use
            this.root_store.gtm.pushDataLayer({ event: 'switch theme' });
        }

        return this.is_dark_mode_on;
    }

    @action.bound
    toggleSetCurrencyModal() {
        this.is_set_currency_modal_visible = !this.is_set_currency_modal_visible;
    }

    @action.bound
    toggleCashier() {
        this.is_cashier_visible = !this.is_cashier_visible;
    }

    @action.bound
    setModalIndex(index = 0) {
        this.modal_index = index;
    }

    @action.bound
    toggleSettingsModal() {
        this.is_settings_modal_on = !this.is_settings_modal_on;
    }

    @action.bound
    openPositionsDrawer() {
        // show and hide Positions Drawer
        this.is_positions_drawer_on = true;
    }

    @action.bound
    openRealAccountSignup(target = this.root_store.client.upgradeable_landing_companies?.[0]) {
        this.is_real_acc_signup_on = true;
        this.real_account_signup_target = target;
        this.is_accounts_switcher_on = false;
    }

    @action.bound
    setShouldShowCancel(value) {
        this.should_show_cancel = value;
    }

    @action.bound
    resetRealAccountSignupTarget() {
        this.deposit_real_account_signup_target = this.real_account_signup_target;
        this.real_account_signup_target = '';
    }

    @action.bound
    setManageRealAccountActiveTabIndex(index) {
        this.manage_real_account_tab_index = index;
    }

    @action.bound
    closeRealAccountSignup() {
        this.is_real_acc_signup_on = false;
        this.resetRealAccountSignupTarget();
        setTimeout(() => {
            this.resetRealAccountSignupParams();
            this.setRealAccountSignupEnd(true);
        }, 300);
    }

    @action.bound
    openAccountNeededModal(target, target_label, target_dmt5_label) {
        this.is_account_needed_modal_on = true;
        this.account_needed_modal_props = {
            target,
            target_label,
            target_dmt5_label,
        };
    }

    @action.bound
    closeAccountNeededModal() {
        this.is_account_needed_modal_on = false;
        this.account_needed_modal_props = {
            target: '',
            target_label: '',
            target_dmt5_label: '',
        };
    }

    @action.bound
    togglePositionsDrawer() {
        // toggle Positions Drawer
        this.is_positions_drawer_on = !this.is_positions_drawer_on;
    }

    @action.bound
    toggleNotificationsModal() {
        this.is_notifications_visible = !this.is_notifications_visible;
    }

    @action.bound
    toggleAccountSettings(is_visible) {
        this.is_account_settings_visible = is_visible;
    }

    @action.bound
    toggleReports(is_visible) {
        this.is_reports_visible = is_visible;
    }

    @action.bound
    toggleServicesErrorModal(is_visible) {
        this.is_services_error_visible = is_visible;
    }

    @action.bound
    removePWAPromptEvent() {
        this.pwa_prompt_event = null;
    }

    @action.bound
    setPWAPromptEvent(e) {
        this.pwa_prompt_event = e;
    }

    @action.bound
    updateNotifications(notifications_array) {
        this.notifications = notifications_array.filter(message => !excluded_notifications.includes(message.key));
    }

    @action.bound
    removeNotifications(should_close_persistent) {
        this.notifications = should_close_persistent
            ? []
            : [...this.notifications.filter(notifs => notifs.is_persistent)];
    }

    @action.bound
    removeNotificationByKey({ key }) {
        this.notifications = this.notifications.filter(n => n.key !== key);
    }

    @action.bound
    removeNotificationMessageByKey({ key }) {
        this.notification_messages = this.notification_messages.filter(n => n.key !== key);
    }

    @action.bound
    addNotificationMessageByKey(key) {
        if (key) this.addNotificationMessage(clientNotifications(this)[key]);
    }

    @action.bound
    markNotificationMessage({ key }) {
        this.marked_notifications.push(key);
    }

    @action.bound
    addNotificationMessage(notification) {
        if (!notification) return;
        if (!this.notification_messages.find(item => item.header === notification.header)) {
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
                }

                const sortFn = isMobile() ? sortNotificationsMobile : sortNotifications;
                this.notification_messages = [...this.notification_messages, notification].sort(sortFn);

                if (!excluded_notifications.includes(notification.key)) {
                    this.updateNotifications(this.notification_messages);
                }
            }
        }
    }

    @action.bound
    removeNotificationMessage({ key, should_show_again } = {}) {
        if (!key) return;
        this.notification_messages = this.notification_messages.filter(n => n.key !== key);
        // Add notification messages to LocalStore when user closes, check for redundancy
        const active_loginid = LocalStore.get('active_loginid');
        if (!excluded_notifications.includes(key) && active_loginid) {
            const messages = LocalStore.getObject('notification_messages');
            // Check if same message already exists in LocalStore for this account
            if (messages[active_loginid] && messages[active_loginid].includes(key)) {
                return;
            }
            const current_message = () => {
                if (Array.isArray(messages[active_loginid])) {
                    messages[active_loginid].push(key);
                    return messages[active_loginid];
                }
                return [key];
            };
            if (!should_show_again) {
                // Store message into LocalStore upon closing message
                Object.assign(messages, { [active_loginid]: current_message() });
                LocalStore.setObject('notification_messages', messages);
            }
        }
    }

    @action.bound
    removeAllNotificationMessages(should_close_persistent) {
        this.notification_messages = should_close_persistent
            ? []
            : [...this.notification_messages.filter(notifs => notifs.is_persistent)];
    }

    @action.bound
    setHasOnlyForwardingContracts(has_only_forward_starting_contracts) {
        this.has_only_forward_starting_contracts = has_only_forward_starting_contracts;
    }

    @action.bound
    addNotificationBar(message) {
        this.push_notifications.push(message);
        this.push_notifications = unique(this.push_notifications, 'msg_type');
    }

    @action.bound
    toggleUnsupportedContractModal(state_change = !this.is_unsupported_contract_modal_visible) {
        this.is_unsupported_contract_modal_visible = state_change;
    }

    @action.bound
    toggleAccountSignupModal(state_change = !this.is_account_signup_modal_visible) {
        this.is_account_signup_modal_visible = state_change;
    }

    @action.bound
    toggleSetResidenceModal(state_change = !this.is_set_residence_modal_visible) {
        this.is_set_residence_modal_visible = state_change;
    }

    @action.bound
    toggleCancellationWarning(state_change = !this.should_show_cancellation_warning) {
        this.should_show_cancellation_warning = state_change;
    }

    @action.bound
    toggleHistoryTab(state_change = !this.is_history_tab_active) {
        this.is_history_tab_active = state_change;
    }

    @action.bound
    setTopUpInProgress(bool) {
        this.is_top_up_virtual_in_progress = bool;
    }

    @action.bound
    closeTopUpModal() {
        this.is_top_up_virtual_open = false;
    }

    @action.bound
    openTopUpModal() {
        this.is_top_up_virtual_open = true;
    }

    @action.bound
    closeSuccessTopUpModal() {
        this.is_top_up_virtual_success = false;
    }

    @action.bound
    toggleResetPasswordModal(state_change = !this.is_reset_password_modal_visible) {
        this.is_reset_password_modal_visible = state_change;
    }

    @action.bound
    setResetTradingPasswordModalOpen(is_reset_trading_password_modal_visible) {
        this.is_reset_trading_password_modal_visible = is_reset_trading_password_modal_visible;
    }

    @action.bound
    setRealAccountSignupParams(params) {
        this.real_account_signup = {
            ...this.real_account_signup,
            ...params,
        };
    }

    @action.bound
    setRealAccountSignupEnd(has_ended) {
        this.has_real_account_signup_ended = has_ended;
    }

    @action.bound
    resetRealAccountSignupParams() {
        this.real_account_signup = {
            active_modal_index: -1,
            previous_currency: '',
            current_currency: '',
            success_message: '',
            error_message: '',
        };
    }

    @action.bound
    onOrientationChange({ is_landscape_orientation }) {
        this.is_landscape = is_landscape_orientation;
    }

    @action.bound
    toggleOnScreenKeyboard() {
        this.is_onscreen_keyboard_active = this.current_focus !== null && this.is_mobile && isTouchDevice();
    }

    @action.bound
    setCurrentFocus(value) {
        this.current_focus = value;
        this.toggleOnScreenKeyboard();
    }

    @action.bound
    addToast(toast_config) {
        toast_config.key = toast_config.key ?? toast_config.content;
        const toast_index = this.toasts.findIndex(t => t.key === toast_config.key);
        if (toast_index > -1) {
            this.toasts.splice(toast_index, 1);
        }

        toast_config.timeout = toast_config.timeout ?? this.mobile_toast_timeout;
        if (toast_config.is_bottom) {
            this.toasts.push(toast_config);
        } else {
            this.toasts.unshift(toast_config);
        }
    }

    @action.bound
    removeToast(key) {
        const index = this.toasts.findIndex(t => t.key === key);
        if (index > -1) {
            this.toasts.splice(index, 1);
        }
    }

    @action.bound
    setIsNativepickerVisible(is_nativepicker_visible) {
        this.is_nativepicker_visible = is_nativepicker_visible;
    }

    @action.bound
    setReportsTabIndex(tab_index = 0) {
        this.reports_route_tab_index = tab_index;
    }

    @action.bound
    toggleAccountTypesModal(is_visible = !this.is_account_types_modal_visible) {
        this.is_account_types_modal_visible = is_visible;
    }

    @action.bound
    toggleWelcomeModal({ is_visible = !this.is_welcome_modal_visible, should_persist = false }) {
        if (LocalStore.get('has_viewed_welcome_screen') && !should_persist) return;
        this.is_welcome_modal_visible = is_visible;

        if (!is_visible) {
            LocalStore.set('has_viewed_welcome_screen', true);
        }
    }

    @action.bound
    showAccountTypesModalForEuropean() {
        this.toggleAccountTypesModal(this.root_store.client.is_uk);
    }

    @action.bound
    notifyAppInstall(prompt) {
        this.deferred_prompt = prompt;
        setTimeout(() => {
            this.addNotificationMessageByKey('install_pwa');
        }, 10000);
    }

    @action.bound
    async installWithDeferredPrompt() {
        this.deferred_prompt.prompt();
        const choice = await this.deferred_prompt.userChoice;
        if (choice.outcome === 'accepted') {
            const notification_key = 'install_pwa';
            this.removeNotificationMessage({
                key: notification_key,
                should_show_again: false,
            });
            this.removeNotificationByKey({ key: notification_key });
        }
    }

    @action.bound
    toggleShouldShowRealAccountsList(value) {
        this.should_show_real_accounts_list = value;
    }

    @action.bound
    toggleShouldShowMultipliersOnboarding(value) {
        this.should_show_multipliers_onboarding = value;
    }

    @action.bound
    shouldNavigateAfterChooseCrypto(next_location) {
        this.choose_crypto_currency_target = next_location;
    }

    @action.bound
    continueRouteAfterChooseCrypto() {
        this.root_store.common.routeTo(this.choose_crypto_currency_target);

        if (this.choose_crypto_currency_target === routes.cashier_deposit) {
            this.root_store.modules.cashier.setIsDeposit(true);
        }
    }
}
