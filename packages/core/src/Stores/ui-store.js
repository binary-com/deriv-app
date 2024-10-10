import { action, autorun, computed, makeObservable, observable } from 'mobx';

import { isMobile, isTouchDevice, routes } from '@deriv/shared';

import { MAX_MOBILE_WIDTH, MAX_TABLET_WIDTH } from 'Constants/ui';

import BaseStore from './base-store';

const store_name = 'ui_store';

export default class UIStore extends BaseStore {
    url_hashed_values = '';
    is_account_settings_visible = false;
    is_positions_drawer_on = false;
    is_reports_visible = false;
    reports_route_tab_index = 0;
    is_cashier_visible = false;
    is_history_tab_active = false;
    // TODO: [cleanup ui-store]
    // Take profit, Stop loss & Deal cancellation checkbox
    should_show_cancellation_warning = true;

    // Extensions
    footer_extensions = [];
    header_extension = undefined;
    settings_extension = undefined;
    notification_messages_ui = undefined;

    is_dark_mode_on = window?.matchMedia?.('(prefers-color-scheme: dark)').matches && isMobile();
    is_settings_modal_on = false;
    is_language_settings_modal_on = false;
    is_mobile_language_menu_open = false;
    is_accounts_switcher_on = false;
    account_switcher_disabled_message = '';

    has_only_forward_starting_contracts = false;

    // Purchase Controls
    // @observable is_purchase_confirm_on    = false;
    is_services_error_visible = false;
    is_account_signup_modal_visible = false;
    is_link_expired_modal_visible = false;
    is_set_residence_modal_visible = false;
    is_reset_password_modal_visible = false;
    is_reset_email_modal_visible = false;
    is_update_email_modal_visible = false;
    is_reset_trading_password_modal_visible = false;
    is_mf_verification_pending_modal_visible = false;
    is_trading_disabled_by_residence_modal_visible = false;
    // @observable is_purchase_lock_on       = false;
    // SmartCharts Controls
    // TODO: enable asset information
    // @observable is_chart_asset_info_visible = true;
    is_chart_countdown_visible = false;
    is_chart_layout_default = true;

    // PWA event and config
    pwa_prompt_event = null;

    screen_width = window.innerWidth;
    screen_height = window.innerHeight;
    is_onscreen_keyboard_active = false;

    is_advanced_duration = false;
    advanced_duration_unit = 't';
    advanced_expiry_type = 'duration';
    simple_duration_unit = 't';
    duration_t = 5;
    duration_s = 15;
    duration_m = 3;
    duration_h = 1;
    duration_d = 1;

    // purchase button states
    purchase_states = [false, false];

    // app states for modal
    is_app_disabled = false;
    is_route_modal_on = false;

    // real account signup
    is_real_acc_signup_on = false;
    is_from_signup_account = false;
    real_account_signup_target = undefined;
    deposit_real_account_signup_target = undefined;
    has_real_account_signup_ended = false;

    // verification modal
    is_verification_modal_visible = false;

    //verification document submitted modal
    is_verification_submitted = false;

    // set currency modal
    is_set_currency_modal_visible = false;

    // position states
    show_positions_toggle = true;

    modal_index = 0;

    // Mt5 topup
    is_top_up_virtual_open = false;
    is_top_up_virtual_in_progress = false;
    is_top_up_virtual_success = false;

    // MT5 create real STP from demo, show only real accounts from switcher
    should_show_real_accounts_list = false;

    // Real account signup
    real_account_signup = {
        active_modal_index: -1,
        previous_currency: '',
        current_currency: '',
        success_message: '',
        error_message: '',
    };

    // UI Focus retention
    current_focus = null;

    // Mobile
    mobile_toast_timeout = 3500;
    toasts = [];

    is_cfd_page = false;
    is_nativepicker_visible = false;
    is_landscape = false;

    prompt_when = false;
    promptFn = () => {};

    //phone number verification
    should_show_phone_number_otp = false;
    is_forced_to_exit_pnv = false;
    is_phone_verification_completed = false;

    //warn user if they want to close create real account modal
    is_closing_create_real_account_modal = false;

    // MT5 account needed modal
    is_account_needed_modal_on = false;
    is_mt5_migration_modal_open = false;
    account_needed_modal_props = {
        target: '',
        target_label: '',
        target_dmt5_label: '',
    };

    manage_real_account_tab_index = 0;

    //traders-hub
    is_real_tab_enabled = false;

    choose_crypto_currency_target = null;

    // add crypto accounts
    should_show_cancel = false;

    should_show_same_dob_phone_modal = false;
    should_show_deposit_now_or_later_modal = false;
    should_show_crypto_transaction_processing_modal = false;
    should_show_risk_warning_modal = false;
    should_show_appropriateness_warning_modal = false;
    should_show_risk_accept_modal = false;
    should_show_cooldown_modal = false;
    should_show_trading_assessment_modal = false;
    should_show_account_success_modal = false;
    should_show_one_time_deposit_modal = false;
    should_show_trade_assessment_form = false;
    should_trigger_tour_guide = false;
    is_from_success_deposit_modal = false;
    is_trading_assessment_for_existing_user_enabled = false;
    is_trading_assessment_for_new_user_enabled = false;
    should_show_assessment_complete_modal = false;
    app_contents_scroll_ref = null;
    is_deriv_account_needed_modal_visible = false;
    is_redirected_from_email = false;
    is_wallet_modal_visible = false;
    is_ready_to_deposit_modal_visible = false;
    is_need_real_account_for_cashier_modal_visible = false;
    is_switch_to_deriv_account_modal_visible = false;
    is_cfd_reset_password_modal_enabled = false;
    is_mt5_migration_modal_enabled = false;
    isUrlUnavailableModalVisible = false;
    sub_section_index = 0;

    is_additional_kyc_info_modal_open = false;
    is_kyc_information_submitted_modal_open = false;

    // tnc update
    is_tnc_update_modal_open = false;

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

        makeObservable(this, {
            is_additional_kyc_info_modal_open: observable,
            is_kyc_information_submitted_modal_open: observable,
            account_needed_modal_props: observable,
            account_switcher_disabled_message: observable,
            has_only_forward_starting_contracts: observable,
            is_ready_to_deposit_modal_visible: observable,
            is_need_real_account_for_cashier_modal_visible: observable,
            is_services_error_visible: observable,
            is_account_signup_modal_visible: observable,
            is_link_expired_modal_visible: observable,
            is_set_residence_modal_visible: observable,
            is_reset_password_modal_visible: observable,
            is_reset_email_modal_visible: observable,
            is_update_email_modal_visible: observable,
            is_reset_trading_password_modal_visible: observable,
            is_cfd_reset_password_modal_enabled: observable,
            sub_section_index: observable,
            is_chart_countdown_visible: observable,
            is_chart_layout_default: observable,
            pwa_prompt_event: observable,
            screen_width: observable,
            screen_height: observable,
            is_onscreen_keyboard_active: observable,
            is_advanced_duration: observable,
            advanced_duration_unit: observable,
            advanced_expiry_type: observable,
            app_contents_scroll_ref: observable,
            choose_crypto_currency_target: observable,
            current_focus: observable,
            deposit_real_account_signup_target: observable,
            duration_d: observable,
            duration_h: observable,
            duration_m: observable,
            duration_s: observable,
            duration_t: observable,
            footer_extensions: observable,
            has_real_account_signup_ended: observable,
            header_extension: observable,
            is_account_needed_modal_on: observable,
            is_account_settings_visible: observable,
            is_forced_to_exit_pnv: observable,
            is_phone_verification_completed: observable,

            is_accounts_switcher_on: observable,

            is_app_disabled: observable,
            is_cashier_visible: observable,
            is_cfd_page: observable,

            is_closing_create_real_account_modal: observable,
            is_dark_mode_on: observable,
            is_deriv_account_needed_modal_visible: observable,
            is_from_signup_account: observable,
            is_redirected_from_email: observable,
            is_wallet_modal_visible: observable,

            is_history_tab_active: observable,
            is_landscape: observable,
            is_language_settings_modal_on: observable,
            is_mf_verification_pending_modal_visible: observable,
            is_trading_disabled_by_residence_modal_visible: observable,
            is_mobile_language_menu_open: observable,
            is_nativepicker_visible: observable,

            is_positions_drawer_on: observable,
            is_real_acc_signup_on: observable,
            is_real_tab_enabled: observable,
            is_reports_visible: observable,
            is_route_modal_on: observable,
            is_set_currency_modal_visible: observable,
            is_settings_modal_on: observable,
            is_switch_to_deriv_account_modal_visible: observable,
            is_top_up_virtual_in_progress: observable,
            is_top_up_virtual_open: observable,
            is_top_up_virtual_success: observable,
            is_trading_assessment_for_existing_user_enabled: observable,
            is_trading_assessment_for_new_user_enabled: observable,
            is_verification_modal_visible: observable,
            is_verification_submitted: observable,
            is_mt5_migration_modal_open: observable,
            is_mt5_migration_modal_enabled: observable,
            is_tnc_update_modal_open: observable,
            isUrlUnavailableModalVisible: observable,
            manage_real_account_tab_index: observable,
            modal_index: observable,
            notification_messages_ui: observable,
            prompt_when: observable,
            promptFn: observable,
            purchase_states: observable,
            real_account_signup_target: observable,
            real_account_signup: observable,
            reports_route_tab_index: observable,
            settings_extension: observable,
            should_show_phone_number_otp: observable,
            should_show_same_dob_phone_modal: observable,
            should_show_deposit_now_or_later_modal: observable,
            should_show_crypto_transaction_processing_modal: observable,
            should_show_appropriateness_warning_modal: observable,
            should_show_assessment_complete_modal: observable,
            should_show_cancel: observable,
            should_show_cancellation_warning: observable,
            should_show_cooldown_modal: observable,
            should_show_account_success_modal: observable,
            should_show_one_time_deposit_modal: observable,
            should_show_real_accounts_list: observable,
            should_show_risk_accept_modal: observable,
            should_show_risk_warning_modal: observable,
            should_show_trade_assessment_form: observable,
            should_show_trading_assessment_modal: observable,
            should_trigger_tour_guide: observable,
            is_from_success_deposit_modal: observable,
            show_positions_toggle: observable,
            simple_duration_unit: observable,
            toasts: observable.shallow,
            addToast: action.bound,
            closeAccountNeededModal: action.bound,
            closeRealAccountSignup: action.bound,
            closeSuccessTopUpModal: action.bound,
            closeTopUpModal: action.bound,
            continueRouteAfterChooseCrypto: action.bound,
            disableApp: action.bound,
            disableRouteModal: action.bound,
            enableApp: action.bound,
            handleResize: action.bound,
            init: action.bound,
            installWithDeferredPrompt: action.bound,
            is_account_switcher_disabled: computed,
            is_desktop: computed,
            is_mobile: computed,
            is_tablet: computed,
            url_hashed_values: observable,
            notifyAppInstall: action.bound,
            onChangeUiStore: action.bound,
            openAccountNeededModal: action.bound,
            openDerivRealAccountNeededModal: action.bound,
            openPositionsDrawer: action.bound,
            openRealAccountSignup: action.bound,
            openSwitchToRealAccountModal: action.bound,
            openTopUpModal: action.bound,
            populateFooterExtensions: action.bound,
            populateHeaderExtensions: action.bound,
            populateSettingsExtensions: action.bound,
            removePWAPromptEvent: action.bound,
            removeToast: action.bound,
            resetPurchaseStates: action.bound,
            resetRealAccountSignupParams: action.bound,
            resetRealAccountSignupTarget: action.bound,
            setShouldShowPhoneNumberOTP: action.bound,
            setAccountSwitcherDisabledMessage: action.bound,
            setAppContentsScrollRef: action.bound,
            setCFDPasswordResetModal: action.bound,
            setChartCountdown: action.bound,
            setChartLayout: action.bound,
            setCurrentFocus: action.bound,
            setDarkMode: action.bound,
            setHasOnlyForwardingContracts: action.bound,
            setHashedValue: action.bound,
            setIsForcedToExitPnv: action.bound,
            setIsPhoneVerificationCompleted: action.bound,
            setIsClosingCreateRealAccountModal: action.bound,
            setIsFromSignupAccount: action.bound,
            setIsNativepickerVisible: action.bound,
            setIsVerificationModalVisible: action.bound,
            setIsVerificationSubmitted: action.bound,
            setReportsTabIndex: action.bound,
            toggleReadyToDepositModal: action.bound,
            toggleNeedRealAccountForCashierModal: action.bound,
            toggleShouldShowRealAccountsList: action.bound,
            shouldNavigateAfterChooseCrypto: action.bound,
            setShouldShowRiskWarningModal: action.bound,
            setRedirectFromEmail: action.bound,
            setIsWalletModalVisible: action.bound,
            setIsRealTabEnabled: action.bound,
            setIsTradingAssessmentForExistingUserEnabled: action.bound,
            setIsTradingAssessmentForNewUserEnabled: action.bound,
            setManageRealAccountActiveTabIndex: action.bound,
            setModalIndex: action.bound,
            setPromptHandler: action.bound,
            setPurchaseState: action.bound,
            setPWAPromptEvent: action.bound,
            setRealAccountSignupEnd: action.bound,
            setRealAccountSignupParams: action.bound,
            setResetTradingPasswordModalOpen: action.bound,
            setRouteModal: action.bound,
            setShouldShowAppropriatenessWarningModal: action.bound,
            setShouldShowAssessmentCompleteModal: action.bound,
            setShouldShowCancel: action.bound,
            setShouldShowCooldownModal: action.bound,
            setShouldShowOneTimeDepositModal: action.bound,
            setShouldShowTradeAssessmentForm: action.bound,
            setShouldShowTradingAssessmentModal: action.bound,
            setShouldShowWarningModal: action.bound,
            setShouldTriggerTourGuide: action.bound,
            setIsFromSuccessDepositModal: action.bound,
            setSubSectionIndex: action.bound,
            setTopUpInProgress: action.bound,
            setIsMFVericationPendingModal: action.bound,
            setIsTradingDisabledByResidenceModal: action.bound,
            setMT5MigrationModalEnabled: action.bound,
            setMobileLanguageMenuOpen: action.bound,
            toggleAccountsDialog: action.bound,
            toggleAccountSettings: action.bound,
            toggleAccountSignupModal: action.bound,
            toggleCancellationWarning: action.bound,
            toggleCashier: action.bound,
            toggleHistoryTab: action.bound,
            toggleLinkExpiredModal: action.bound,
            toggleOnScreenKeyboard: action.bound,
            togglePositionsDrawer: action.bound,
            toggleReports: action.bound,
            toggleResetEmailModal: action.bound,
            toggleResetPasswordModal: action.bound,
            toggleServicesErrorModal: action.bound,
            toggleSetCurrencyModal: action.bound,
            toggleSetResidenceModal: action.bound,
            toggleSettingsModal: action.bound,
            toggleLanguageSettingsModal: action.bound,
            toggleUpdateEmailModal: action.bound,
            toggleAccountSuccessModal: action.bound,
            toggleAdditionalKycInfoModal: action.bound,
            toggleKycInformationSubmittedModal: action.bound,
            toggleMT5MigrationModal: action.bound,
            toggleUrlUnavailableModal: action.bound,
            setShouldShowDepositNowOrLaterModal: action.bound,
            setShouldShowCryptoTransactionProcessingModal: action.bound,
            setShouldShowSameDOBPhoneModal: action.bound,
            toggleTncUpdateModal: action.bound,
        });

        window.addEventListener('resize', this.handleResize);
        autorun(() => {
            this.changeTheme();
        });
    }
    changeTheme = () => {
        if (this.is_dark_mode_on) {
            document.body.classList.remove('theme--light');
            document.body.classList.add('theme--dark');
        } else {
            document.body.classList.remove('theme--dark');
            document.body.classList.add('theme--light');
        }
    };

    setIsClosingCreateRealAccountModal(is_closing_create_real_account_modal) {
        this.is_closing_create_real_account_modal = is_closing_create_real_account_modal;
    }

    setIsRealTabEnabled(is_real_tab_enabled) {
        this.is_real_tab_enabled = is_real_tab_enabled;
    }

    setShouldShowPhoneNumberOTP(should_show_phone_number_otp) {
        this.should_show_phone_number_otp = should_show_phone_number_otp;
    }

    setIsForcedToExitPnv(is_forced_to_exit_pnv) {
        this.is_forced_to_exit_pnv = is_forced_to_exit_pnv;
    }

    setIsPhoneVerificationCompleted(is_phone_verification_completed) {
        this.is_phone_verification_completed = is_phone_verification_completed;
    }

    setHashedValue(url_hashed_values) {
        this.url_hashed_values = url_hashed_values;
    }

    init(notification_messages) {
        this.setHashedValue(window.location.hash);
        this.notification_messages_ui = notification_messages;
    }

    setAppContentsScrollRef(value) {
        this.app_contents_scroll_ref = value;
    }

    populateFooterExtensions(footer_extensions) {
        this.footer_extensions = footer_extensions;
    }

    populateHeaderExtensions(component) {
        this.header_extension = component;
    }

    populateSettingsExtensions(menu_items) {
        this.settings_extension = menu_items;
    }

    onChangeUiStore({ name, value }) {
        if (!(name in this)) {
            throw new Error(`Invalid Argument: ${name}`);
        }
        this[name] = value;
    }

    handleResize() {
        this.screen_width = window.innerWidth;
        this.screen_height = window.innerHeight;
    }

    setPromptHandler(condition, cb = () => {}) {
        this.prompt_when = condition;
        this.promptFn = cb;
    }

    get is_desktop() {
        return this.screen_width > MAX_TABLET_WIDTH;
    }

    get is_mobile() {
        return this.screen_width <= MAX_MOBILE_WIDTH;
    }

    get is_tablet() {
        return MAX_MOBILE_WIDTH < this.screen_width && this.screen_width <= MAX_TABLET_WIDTH;
    }

    get is_account_switcher_disabled() {
        return !!this.account_switcher_disabled_message;
    }

    setRouteModal() {
        this.is_route_modal_on = true;
    }

    disableRouteModal() {
        this.is_route_modal_on = false;
    }

    disableApp() {
        this.is_app_disabled = true;
    }

    enableApp() {
        this.is_app_disabled = false;
    }

    toggleAccountsDialog(status = !this.is_accounts_switcher_on) {
        this.is_accounts_switcher_on = status;
    }

    setAccountSwitcherDisabledMessage(message) {
        if (message) {
            this.is_accounts_switcher_on = false;
            this.account_switcher_disabled_message = message;
        } else {
            this.account_switcher_disabled_message = '';
        }
    }

    setIsFromSignupAccount(is_from_signup_account) {
        this.is_from_signup_account = is_from_signup_account;
    }

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

    resetPurchaseStates() {
        this.purchase_states = [false, false];
    }

    setChartLayout(is_default) {
        this.is_chart_layout_default = is_default;
    }

    // TODO: enable asset information
    // @action.bound
    // setChartAssetInfo(is_visible) {
    //     this.is_chart_asset_info_visible = is_visible;
    // }

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

    setDarkMode(is_dark_mode_on) {
        if (this.is_dark_mode_on !== is_dark_mode_on) {
            this.is_dark_mode_on = is_dark_mode_on;
            // This GTM call is here instead of the GTM store due to frequency of use
            this.root_store.gtm.pushDataLayer({ event: 'switch theme' });
        }

        return this.is_dark_mode_on;
    }

    setMobileLanguageMenuOpen(is_mobile_language_menu_open) {
        this.is_mobile_language_menu_open = is_mobile_language_menu_open;
    }

    toggleSetCurrencyModal() {
        this.is_set_currency_modal_visible = !this.is_set_currency_modal_visible;
    }

    toggleCashier() {
        this.is_cashier_visible = !this.is_cashier_visible;
    }

    setModalIndex(index = 0) {
        this.modal_index = index;
    }

    toggleSettingsModal() {
        this.is_settings_modal_on = !this.is_settings_modal_on;
    }

    toggleLanguageSettingsModal() {
        this.is_language_settings_modal_on = !this.is_language_settings_modal_on;
    }

    openPositionsDrawer() {
        // show and hide Positions Drawer
        this.is_positions_drawer_on = true;
    }

    openRealAccountSignup(target) {
        if (target) {
            this.is_real_acc_signup_on = true;
            this.real_account_signup_target = target;
            this.is_accounts_switcher_on = false;
            localStorage.removeItem('current_question_index');
        }
    }

    setShouldShowCancel(value) {
        this.should_show_cancel = value;
    }

    resetRealAccountSignupTarget() {
        this.deposit_real_account_signup_target = this.real_account_signup_target;
        this.real_account_signup_target = '';
    }

    setManageRealAccountActiveTabIndex(index) {
        this.manage_real_account_tab_index = index;
    }

    closeRealAccountSignup() {
        this.root_store.client.setRealAccountSignupFormData([]);
        this.root_store.client.setRealAccountSignupFormStep(0);

        this.is_real_acc_signup_on = false;
        this.resetRealAccountSignupTarget();
        setTimeout(() => {
            this.resetRealAccountSignupParams();
            this.setRealAccountSignupEnd(true);
        }, 300);
    }

    openAccountNeededModal(target, target_label, target_dmt5_label) {
        this.is_account_needed_modal_on = true;
        this.account_needed_modal_props = {
            target,
            target_label,
            target_dmt5_label,
        };
    }

    closeAccountNeededModal() {
        this.is_account_needed_modal_on = false;
        this.account_needed_modal_props = {
            target: '',
            target_label: '',
            target_dmt5_label: '',
        };
    }

    togglePositionsDrawer() {
        // toggle Positions Drawer
        this.is_positions_drawer_on = !this.is_positions_drawer_on;
    }

    toggleAccountSettings(is_visible) {
        this.is_account_settings_visible = is_visible;
    }

    toggleReports(is_visible) {
        this.is_reports_visible = is_visible;
    }

    toggleServicesErrorModal(is_visible) {
        this.is_services_error_visible = is_visible;
    }

    removePWAPromptEvent() {
        this.pwa_prompt_event = null;
    }

    setPWAPromptEvent(e) {
        this.pwa_prompt_event = e;
    }

    setHasOnlyForwardingContracts(has_only_forward_starting_contracts) {
        this.has_only_forward_starting_contracts = has_only_forward_starting_contracts;
    }

    toggleAccountSignupModal(state_change = !this.is_account_signup_modal_visible) {
        this.is_account_signup_modal_visible = state_change;
    }

    toggleSetResidenceModal(state_change = !this.is_set_residence_modal_visible) {
        this.is_set_residence_modal_visible = state_change;
    }

    toggleCancellationWarning(state_change = !this.should_show_cancellation_warning) {
        this.should_show_cancellation_warning = state_change;
    }

    toggleHistoryTab(state_change = !this.is_history_tab_active) {
        this.is_history_tab_active = state_change;
    }

    setTopUpInProgress(bool) {
        this.is_top_up_virtual_in_progress = bool;
    }

    closeTopUpModal() {
        this.is_top_up_virtual_open = false;
    }

    openTopUpModal() {
        this.is_top_up_virtual_open = true;
    }

    closeSuccessTopUpModal() {
        this.is_top_up_virtual_success = false;
    }

    toggleResetPasswordModal(state_change = !this.is_reset_password_modal_visible) {
        this.is_reset_password_modal_visible = state_change;
    }

    toggleLinkExpiredModal(state_change = !this.is_link_expired_modal_visible) {
        this.is_link_expired_modal_visible = state_change;
    }

    toggleResetEmailModal(state_change = !this.is_reset_email_modal_visible) {
        this.is_reset_email_modal_visible = state_change;
    }

    toggleUpdateEmailModal(state_change = !this.is_update_email_modal_visible) {
        this.is_update_email_modal_visible = state_change;
    }

    setResetTradingPasswordModalOpen(is_reset_trading_password_modal_visible) {
        this.is_reset_trading_password_modal_visible = is_reset_trading_password_modal_visible;
    }

    setRealAccountSignupParams(params) {
        this.real_account_signup = {
            ...this.real_account_signup,
            ...params,
        };
    }

    setRealAccountSignupEnd(has_ended) {
        this.has_real_account_signup_ended = has_ended;
    }

    resetRealAccountSignupParams() {
        this.real_account_signup = {
            active_modal_index: -1,
            previous_currency: '',
            current_currency: '',
            success_message: '',
            error_message: '',
        };
    }

    toggleOnScreenKeyboard() {
        this.is_onscreen_keyboard_active = this.current_focus !== null && this.is_mobile && isTouchDevice();
    }

    setCurrentFocus(value) {
        this.current_focus = value;
        this.toggleOnScreenKeyboard();
    }

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

    removeToast(key) {
        const index = this.toasts.findIndex(t => t.key === key);
        if (index > -1) {
            this.toasts.splice(index, 1);
        }
    }

    setIsNativepickerVisible(is_nativepicker_visible) {
        this.is_nativepicker_visible = is_nativepicker_visible;
    }

    setReportsTabIndex(tab_index = 0) {
        this.reports_route_tab_index = tab_index;
    }

    notifyAppInstall(prompt) {
        this.deferred_prompt = prompt;
        setTimeout(() => {
            this.root_store.notifications.addNotificationMessageByKey('install_pwa');
        }, 10000);
    }

    async installWithDeferredPrompt() {
        this.deferred_prompt.prompt();
        const choice = await this.deferred_prompt.userChoice;
        if (choice.outcome === 'accepted') {
            const notification_key = 'install_pwa';
            this.root_store.notifications.removeNotificationMessage({
                key: notification_key,
                should_show_again: false,
            });
            this.root_store.notifications.removeNotificationByKey({ key: notification_key });
        }
    }

    toggleShouldShowRealAccountsList(value) {
        this.should_show_real_accounts_list = value;
    }

    shouldNavigateAfterChooseCrypto(next_location) {
        this.choose_crypto_currency_target = next_location;
    }

    continueRouteAfterChooseCrypto() {
        this.root_store.common.routeTo(this.choose_crypto_currency_target);

        if (this.choose_crypto_currency_target === routes.cashier_deposit) {
            this.root_store.modules.cashier.general_store.setIsDeposit(true);
        }
    }

    openDerivRealAccountNeededModal() {
        this.is_deriv_account_needed_modal_visible = !this.is_deriv_account_needed_modal_visible;
    }

    setRedirectFromEmail(value) {
        this.is_redirected_from_email = value;
    }

    setIsWalletModalVisible(value) {
        this.is_wallet_modal_visible = value;
    }

    setShouldShowRiskWarningModal(value) {
        this.should_show_risk_warning_modal = value;
    }

    setIsTradingAssessmentForExistingUserEnabled(value) {
        this.is_trading_assessment_for_existing_user_enabled = value;
    }

    setIsTradingAssessmentForNewUserEnabled(value) {
        this.is_trading_assessment_for_new_user_enabled = value;
    }

    setShouldShowAppropriatenessWarningModal(value) {
        this.should_show_appropriateness_warning_modal = value;
    }

    setShouldShowWarningModal(value) {
        this.should_show_risk_accept_modal = value;
    }

    setShouldShowAssessmentCompleteModal(value) {
        this.should_show_assessment_complete_modal = value;
    }

    setShouldShowCooldownModal(value) {
        this.should_show_cooldown_modal = value;
    }

    setShouldShowTradingAssessmentModal(value) {
        this.should_show_trading_assessment_modal = value;
    }

    setShouldShowTradeAssessmentForm(value) {
        this.should_show_trade_assessment_form = value;
    }

    openSwitchToRealAccountModal() {
        this.is_switch_to_deriv_account_modal_visible = !this.is_switch_to_deriv_account_modal_visible;
    }

    toggleReadyToDepositModal() {
        this.is_ready_to_deposit_modal_visible = !this.is_ready_to_deposit_modal_visible;
    }

    toggleNeedRealAccountForCashierModal() {
        this.is_need_real_account_for_cashier_modal_visible = !this.is_need_real_account_for_cashier_modal_visible;
    }

    setCFDPasswordResetModal(val) {
        this.is_cfd_reset_password_modal_enabled = !!val;
    }

    setSubSectionIndex(index) {
        this.sub_section_index = index;
    }

    setIsVerificationModalVisible(value) {
        this.is_verification_modal_visible = value;
    }

    setIsVerificationSubmitted(value) {
        this.is_verification_submitted = value;
    }

    setShouldShowOneTimeDepositModal(value) {
        this.should_show_one_time_deposit_modal = value;
    }

    toggleAccountSuccessModal() {
        this.should_show_account_success_modal = !this.should_show_account_success_modal;
    }

    setShouldTriggerTourGuide(value) {
        this.should_trigger_tour_guide = value;
    }

    setIsFromSuccessDepositModal(value) {
        this.is_from_success_deposit_modal = value;
    }

    setIsMFVericationPendingModal(value) {
        this.is_mf_verification_pending_modal_visible = value;
    }

    setIsTradingDisabledByResidenceModal(value) {
        this.is_trading_disabled_by_residence_modal_visible = value;
    }

    toggleAdditionalKycInfoModal() {
        this.is_additional_kyc_info_modal_open = !this.is_additional_kyc_info_modal_open;
    }

    toggleKycInformationSubmittedModal() {
        this.is_kyc_information_submitted_modal_open = !this.is_kyc_information_submitted_modal_open;
    }

    setMT5MigrationModalEnabled(value) {
        this.is_mt5_migration_modal_enabled = value;
    }

    toggleMT5MigrationModal(value) {
        this.is_mt5_migration_modal_open = value;
    }

    toggleUrlUnavailableModal(value) {
        this.isUrlUnavailableModalVisible = value;
    }

    setShouldShowDepositNowOrLaterModal(value) {
        this.should_show_deposit_now_or_later_modal = value;
    }

    setShouldShowCryptoTransactionProcessingModal(value) {
        this.should_show_crypto_transaction_processing_modal = value;
    }

    setShouldShowSameDOBPhoneModal(value) {
        this.should_show_same_dob_phone_modal = value;
    }

    toggleTncUpdateModal(value) {
        this.is_tnc_update_modal_open = value;
    }
}
