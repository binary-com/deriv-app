import { action, computed, observable, runInAction, makeObservable, override } from 'mobx';
import {
    getAccountListKey,
    getAccountTypeFields,
    CFD_PLATFORMS,
    WS,
    Jurisdiction,
    JURISDICTION_MARKET_TYPES,
    setPerformanceValue,
    startPerformanceEventTimer,
} from '@deriv/shared';
import BaseStore from '../../base-store';

import { getDxCompanies, getMtCompanies } from './Helpers/cfd-config';

export default class CFDStore extends BaseStore {
    is_cfd_personal_details_modal_visible = false;
    is_ctrader_transfer_modal_visible = false;
    is_jurisdiction_modal_visible = false;
    jurisdiction_selected_shortcode = '';
    is_compare_accounts_visible = false;
    is_mt5_trade_modal_visible = false;
    product = '';

    account_type = {
        category: '',
        type: '',
    };

    mt5_trade_account = {};
    new_account_response = {};
    map_type = {};
    has_cfd_error = false;
    error_message = '';
    is_sent_email_modal_enabled = false;

    is_account_being_created = false;
    is_cfd_success_dialog_enabled = false;
    is_mt5_financial_stp_modal_open = false;
    is_cfd_password_modal_enabled = false;
    is_mt5_password_invalid_format_modal_visible = false;
    is_mt5_password_changed_modal_visible = false;
    is_from_mt5_migration_modal = false;
    is_server_maintenance_modal_visible = false;
    is_account_unavailable_modal_visible = false;
    mt5_migration_error = '';
    current_account = undefined; // this is a tmp value, don't rely on it, unless you set it first.

    error_type = undefined;

    is_cfd_verification_modal_visible = false;
    dxtrade_tokens = {
        demo: '',
        real: '',
    };
    ctrader_tokens = {
        demo: '',
        real: '',
    };

    real_synthetic_accounts_existing_data = [];
    real_financial_accounts_existing_data = [];
    real_swapfree_accounts_existing_data = [];
    real_zerospread_accounts_existing_data = [];

    migrated_mt5_accounts = [];

    constructor({ root_store }) {
        super({ root_store });

        makeObservable(this, {
            is_compare_accounts_visible: observable,
            is_cfd_personal_details_modal_visible: observable,
            is_jurisdiction_modal_visible: observable,
            is_mt5_trade_modal_visible: observable,
            is_ctrader_transfer_modal_visible: observable,
            jurisdiction_selected_shortcode: observable,
            account_type: observable,
            mt5_trade_account: observable,
            mt5_migration_error: observable,
            new_account_response: observable,
            map_type: observable,
            has_cfd_error: observable,
            error_message: observable,
            is_account_being_created: observable,
            is_cfd_success_dialog_enabled: observable,
            is_mt5_financial_stp_modal_open: observable,
            is_cfd_password_modal_enabled: observable,
            is_sent_email_modal_enabled: observable,
            current_account: observable,
            is_cfd_verification_modal_visible: observable,
            error_type: observable,
            product: observable,
            dxtrade_tokens: observable,
            ctrader_tokens: observable,
            migrated_mt5_accounts: observable,
            is_mt5_password_invalid_format_modal_visible: observable,
            is_mt5_password_changed_modal_visible: observable,
            is_from_mt5_migration_modal: observable,
            is_server_maintenance_modal_visible: observable,
            is_account_unavailable_modal_visible: observable,
            account_title: computed,
            current_list: computed,
            has_created_account_for_selected_jurisdiction: computed,
            has_submitted_cfd_personal_details: computed,
            onMount: action.bound,
            onUnmount: override,
            checkShouldOpenAccount: action.bound,
            realAccountSignupEndListener: action.bound,
            resetFormErrors: action.bound,
            clearCFDError: action.bound,
            createCFDAccount: action.bound,
            disableCFDPasswordModal: action.bound,
            enableCFDPasswordModal: action.bound,
            getName: action.bound,
            migrateMT5Accounts: action.bound,
            openMT5Account: action.bound,
            openCFDAccount: action.bound,
            beginRealSignupForMt5: action.bound,
            enableMt5FinancialStpModal: action.bound,
            setAccountType: action.bound,
            setProduct: action.bound,
            setCurrentAccount: action.bound,
            setMT5TradeAccount: action.bound,
            setIsAccountBeingCreated: action.bound,
            setError: action.bound,
            setCFDNewAccount: action.bound,
            setCFDSuccessDialog: action.bound,
            setMT5MigrationError: action.bound,
            setMigratedMT5Accounts: action.bound,
            setSentEmailModalStatus: action.bound,
            setIsFromMt5MigrationModal: action.bound,
            setServerMaintenanceModal: action.bound,
            setAccountUnavailableModal: action.bound,
            getAccountStatus: action.bound,
            creatMT5Password: action.bound,
            submitMt5Password: action.bound,
            createCFDPassword: action.bound,
            submitCFDPassword: action.bound,
            toggleCompareAccountsModal: action.bound,
            toggleCTraderTransferModal: action.bound,
            getRealSyntheticAccountsExistingData: action.bound,
            getRealFinancialAccountsExistingData: action.bound,
            getRealSwapfreeAccountsExistingData: action.bound,
            toggleJurisdictionModal: action.bound,
            toggleMT5TradeModal: action.bound,
            disableMt5FinancialStpModal: action.bound,
            topUpVirtual: action.bound,
            sendVerifyEmail: action.bound,
            setJurisdictionSelectedShortcode: action.bound,
            toggleCFDVerificationModal: action.bound,
            setDxtradeToken: action.bound,
            setCTraderToken: action.bound,
            loadDxtradeTokens: action.bound,
            loadCTraderTokens: action.bound,
            setIsMt5PasswordInvalidFormatModalVisible: action.bound,
            setIsMt5PasswordChangedModalVisible: action.bound,
        });
    }

    get account_title() {
        return this.account_type.category
            ? getMtCompanies(this.root_store.traders_hub.show_eu_related_content, this.product)[
                  this.account_type.category
              ][this.account_type.type].title
            : '';
    }

    get has_submitted_cfd_personal_details() {
        const { citizen, place_of_birth, tax_residence, tax_identification_number, account_opening_reason } =
            this.root_store.client.account_settings;
        return !!(citizen && place_of_birth && tax_residence && tax_identification_number && account_opening_reason);
    }

    get current_list() {
        const list = {};
        const show_eu_related_content = this.root_store.traders_hub.show_eu_related_content;
        this.root_store.client.mt5_login_list
            // eslint-disable-next-line no-confusing-arrow
            .filter(acc =>
                show_eu_related_content
                    ? acc.landing_company_short === 'maltainvest'
                    : acc.landing_company_short !== 'maltainvest'
            )
            .forEach(account => {
                // e.g. mt5.real.financial_stp
                list[getAccountListKey(account, CFD_PLATFORMS.MT5, account.landing_company_short)] = {
                    ...account,
                };
            });

        this.root_store.client.dxtrade_accounts_list.forEach(account => {
            // e.g. dxtrade.real.financial_stp
            list[getAccountListKey(account, CFD_PLATFORMS.DXTRADE)] = {
                ...account,
            };
        });
        this.root_store.client.ctrader_accounts_list.forEach(account => {
            list[getAccountListKey(account, CFD_PLATFORMS.CTRADER)] = {
                ...account,
            };
        });
        return list;
    }

    // eslint-disable-next-line class-methods-use-this
    get mt5_companies() {
        return getMtCompanies(this.root_store.client.is_eu, this.product);
    }

    // eslint-disable-next-line class-methods-use-this
    get dxtrade_companies() {
        return getDxCompanies();
    }

    get has_created_account_for_selected_jurisdiction() {
        switch (this.account_type.type) {
            case 'synthetic':
                return this.real_synthetic_accounts_existing_data?.some(
                    account => account.landing_company_short === this.jurisdiction_selected_shortcode
                );
            // here
            case 'all':
                return this.real_swapfree_accounts_existing_data?.some(
                    account => account.landing_company_short === this.jurisdiction_selected_shortcode
                );
            default:
                return this.real_financial_accounts_existing_data?.some(
                    account => account.landing_company_short === this.jurisdiction_selected_shortcode
                );
        }
    }

    onMount() {
        this.checkShouldOpenAccount();
        this.onRealAccountSignupEnd(this.realAccountSignupEndListener);
        this.root_store.ui.is_cfd_page = true;
    }

    onUnmount() {
        this.disposeRealAccountSignupEnd();
        this.root_store.ui.is_cfd_page = false;
    }

    // other platforms can redirect to here using account switcher's `Add` account button
    // so in that case we should open the corresponding account opening modal on load/component update
    checkShouldOpenAccount() {
        const account_type = sessionStorage.getItem('open_cfd_account_type');
        if (account_type) {
            const [category, platform, type, set_password] = account_type.split('.');
            this.createCFDAccount({ category, platform, type, set_password });
            sessionStorage.removeItem('open_cfd_account_type');
        }
    }

    setIsAccountBeingCreated(is_account_being_created) {
        this.is_account_being_created = is_account_being_created;
    }

    realAccountSignupEndListener() {
        const post_signup = JSON.parse(sessionStorage.getItem('post_real_account_signup'));
        if (post_signup && post_signup.category && post_signup.type) {
            sessionStorage.removeItem('post_real_account_signup');
            this.enableCFDPasswordModal();
        }
        return Promise.resolve();
    }

    resetFormErrors() {
        this.error_message = '';
        this.error_type = undefined;
        this.has_cfd_error = false;
    }

    clearCFDError() {
        this.resetFormErrors();
        this.is_cfd_password_modal_enabled = false;
    }

    async createCFDAccount({ category, platform, type, set_password }) {
        this.clearCFDError();
        this.setAccountType({
            category,
            type,
        });
        if (platform === CFD_PLATFORMS.DXTRADE) {
            if (category === 'real') {
                this.realCFDSignup(set_password);
            } else {
                this.demoCFDSignup();
            }
        } else if (platform === CFD_PLATFORMS.CTRADER) {
            startPerformanceEventTimer('create_ctrader_account_time');
            this.root_store.client.setIsLandingCompanyLoaded(false);

            this.setJurisdictionSelectedShortcode('svg');
            if (this.account_type.category === 'demo') {
                this.setIsAccountBeingCreated(true);
            }
            const account_creation_values = {
                platform,
                account_type: this.account_type.category,
                market_type: this.account_type.type,
                company: this.jurisdiction_selected_shortcode,
            };

            const response = await this.openCFDAccount(account_creation_values);
            if (!response.error) {
                this.setError(false);

                const account_list = {
                    echo_req: response.echo_req,
                    trading_platform_accounts: [
                        ...this.root_store.client.ctrader_accounts_list,
                        response.trading_platform_new_account,
                    ],
                };
                this.root_store.client.responseTradingPlatformAccountsList(account_list);
                WS.transferBetweenAccounts();
                const trading_platform_available_accounts_list_response = await WS.tradingPlatformAvailableAccounts(
                    CFD_PLATFORMS.CTRADER
                );
                this.root_store.client.responseCTraderTradingPlatformAvailableAccounts(
                    trading_platform_available_accounts_list_response
                );
                this.setCFDSuccessDialog(true);
                this.setIsAccountBeingCreated(false);
                WS.tradingPlatformAccountsList(CFD_PLATFORMS.CTRADER);
                setPerformanceValue('create_ctrader_account_time');
            } else {
                this.setError(true, response.error);
                this.setIsAccountBeingCreated(false);
            }
            this.root_store.client.setIsLandingCompanyLoaded(true);
        } else if (platform === CFD_PLATFORMS.MT5) {
            if (category === 'real') {
                this.toggleJurisdictionModal();
            } else {
                if (this.root_store.traders_hub.show_eu_related_content) {
                    this.setJurisdictionSelectedShortcode(Jurisdiction.MALTA_INVEST);
                } else this.setJurisdictionSelectedShortcode(Jurisdiction.SVG);
                this.demoCFDSignup();
            }
        }
    }

    demoCFDSignup() {
        this.enableCFDPasswordModal();
    }

    disableCFDPasswordModal() {
        this.is_cfd_password_modal_enabled = false;
    }

    enableCFDPasswordModal() {
        this.is_cfd_password_modal_enabled = true;
    }

    setSentEmailModalStatus(status) {
        this.is_sent_email_modal_enabled = status;
    }

    getName(account_type = this.account_type) {
        const { first_name } = this.root_store.client.account_settings && this.root_store.client.account_settings;
        const title = this.mt5_companies[account_type?.category][account_type?.type].title;

        // First name is not set when user has no real account
        return first_name ? [first_name, title].join(' ') : title;
    }

    async migrateMT5Accounts(values, actions) {
        actions?.setSubmitting(true);
        const account_to_migrate = this.root_store.client.mt5_login_list.filter(
            acc => acc.landing_company_short === Jurisdiction.SVG && !!acc.eligible_to_migrate
        );
        const promises = account_to_migrate.map(account => {
            const { eligible_to_migrate } = account;
            const [type, shortcode] = Object.entries(eligible_to_migrate)[0];
            const account_type = {
                category: 'real',
                type,
            };
            this.setMigratedMT5Accounts([
                ...this.migrated_mt5_accounts,
                { login_id: account.login, to_account: { ...(eligible_to_migrate ?? {}) } },
            ]);
            return this.requestMigrateAccount(values, shortcode, account_type);
        });
        this.root_store.ui.setMT5MigrationModalEnabled(true);

        try {
            const results = await Promise.all(promises);
            const has_error = results.find(result => result.error);
            const error_code = has_error?.error?.code;
            if (this.is_mt5_password_changed_modal_visible) this.setIsMt5PasswordChangedModalVisible(false);
            if (!has_error) {
                actions?.setStatus({ error_message: '' });
                this.setError(false);
                this.setCFDSuccessDialog(true);
                await this.getAccountStatus(CFD_PLATFORMS.MT5);

                const mt5_login_list_response = await WS.authorized.mt5LoginList();
                this.root_store.client.responseMt5LoginList(mt5_login_list_response);

                WS.transferBetweenAccounts();
                this.root_store.client.responseMT5TradingServers(await WS.tradingServers(CFD_PLATFORMS.MT5));
            } else if (['IncorrectMT5PasswordFormat', 'InvalidTradingPlatformPasswordFormat'].includes(error_code)) {
                this.setError(true, has_error?.error);
                this.setMigratedMT5Accounts([]);
                this.setMT5MigrationError('');
            } else {
                this.setMT5MigrationError(has_error?.error?.message);
                actions?.setStatus({ error_message: has_error?.error?.message });
                await this.getAccountStatus(CFD_PLATFORMS.MT5);
                this.clearCFDError();
                this.root_store.ui.toggleMT5MigrationModal(true);
                this.setMigratedMT5Accounts([]);
            }
        } catch (error) {
            // At least one request has failed
            // eslint-disable-next-line no-console
            console.warn('One or more MT5 migration requests failed:', error);
            actions?.setStatus({ error_message: error?.message });
            this.setMT5MigrationError(error);
            this.setMigratedMT5Accounts([]);
        } finally {
            actions?.setSubmitting(false);
        }
    }

    requestMigrateAccount(values, shortcode, account_type) {
        const name = this.getName(account_type);
        const leverage = this.mt5_companies[account_type.category][account_type.type].leverage;
        const type_request = getAccountTypeFields(account_type);
        const { address_line_1, address_line_2, address_postcode, address_city, address_state, country_code, phone } =
            this.root_store.client.account_settings;

        return WS.mt5NewAccount({
            mainPassword: values.password,
            email: this.root_store.client.email_address,
            leverage,
            name,
            address: address_line_1 || address_line_2,
            city: address_city,
            country: country_code,
            phone,
            state: address_state,
            zipCode: address_postcode,
            migrate: 1,
            ...(values.server ? { server: values.server } : {}),
            ...(shortcode ? { company: shortcode } : {}),
            ...(shortcode !== Jurisdiction.LABUAN
                ? type_request
                : {
                      account_type: JURISDICTION_MARKET_TYPES.FINANCIAL,
                      mt5_account_type: 'financial_stp',
                  }),
        });
    }

    openMT5Account(values) {
        const name = this.getName();
        const leverage = this.mt5_companies[this.account_type.category][this.account_type.type].leverage;
        const type_request = getAccountTypeFields(this.account_type);
        const { address_line_1, address_line_2, address_postcode, address_city, address_state, country_code, phone } =
            this.root_store.client.account_settings;

        return WS.mt5NewAccount({
            mainPassword: values.password,
            email: this.root_store.client.email_address,
            leverage,
            name,
            address: address_line_1 || address_line_2,
            city: address_city,
            country: country_code,
            phone,
            state: address_state,
            zipCode: address_postcode,
            ...(this.account_type.type === 'all'
                ? this.product === 'swap_free'
                    ? { product: 'swap_free' }
                    : { product: 'zero_spread' }
                : {}),
            ...(values.server ? { server: values.server } : {}),
            ...(this.jurisdiction_selected_shortcode && this.account_type.category === 'real'
                ? { company: this.jurisdiction_selected_shortcode }
                : {}),
            ...(this.jurisdiction_selected_shortcode !== Jurisdiction.LABUAN
                ? type_request
                : {
                      account_type: 'financial',
                      mt5_account_type: 'financial_stp',
                  }),
        });
    }

    openCFDAccount(values) {
        return WS.tradingPlatformNewAccount({
            password: CFD_PLATFORMS.DXTRADE ? values.password : '',
            platform: values.platform,
            account_type: this.account_type.category,
            market_type:
                this.account_type.type === 'dxtrade' || this.account_type.type === 'cTrader'
                    ? 'all'
                    : this.account_type.type,
            company: values.company,
        });
    }

    beginRealSignupForMt5() {
        sessionStorage.setItem('post_real_account_signup', JSON.stringify(this.account_type));
        this.root_store.ui.openRealAccountSignup('svg');
    }

    realCFDSignup(set_password) {
        switch (this.account_type.type) {
            case 'financial':
                this.enableCFDPasswordModal();
                break;
            case 'financial_stp':
                this.root_store.client.fetchResidenceList();
                this.root_store.client.fetchStatesList();
                this.root_store.client.fetchAccountSettings();
                if (set_password) this.enableCFDPasswordModal();
                else this.enableMt5FinancialStpModal();
                break;
            case 'synthetic':
            case 'dxtrade':
            case 'all':
                this.enableCFDPasswordModal();
                break;
            default:
                throw new Error('Cannot determine mt5 account signup.');
        }
    }

    enableMt5FinancialStpModal() {
        this.is_mt5_financial_stp_modal_open = true;
    }

    setAccountType(account_type) {
        this.account_type = account_type;
    }

    setProduct(product) {
        this.product = product;
    }

    setCurrentAccount(data, meta) {
        this.current_account = {
            ...meta,
            ...data,
        };
    }

    setIsMt5PasswordInvalidFormatModalVisible(visible) {
        this.is_mt5_password_invalid_format_modal_visible = visible;
    }

    setIsMt5PasswordChangedModalVisible(visible) {
        this.is_mt5_password_changed_modal_visible = visible;
    }

    setMT5TradeAccount(mt5_trade_account) {
        this.mt5_trade_account = mt5_trade_account;
    }

    setError(state, obj) {
        this.has_cfd_error = state;
        this.error_message = obj ? obj.message : '';
        this.error_type = obj?.code ?? undefined;
    }

    setCFDNewAccount(cfd_new_account) {
        this.new_account_response = cfd_new_account;
    }

    setCFDSuccessDialog(value) {
        this.is_cfd_success_dialog_enabled = !!value;
    }

    setMT5MigrationError(error) {
        this.mt5_migration_error = error;
    }

    async getAccountStatus(platform) {
        const should_load_account_status =
            (platform === CFD_PLATFORMS.MT5 && this.root_store.client.is_mt5_password_not_set) ||
            (platform === CFD_PLATFORMS.DXTRADE && this.root_store.client.is_dxtrade_password_not_set);

        if (should_load_account_status) {
            await WS.getAccountStatus();
        }
    }

    async creatMT5Password(values, actions) {
        const response = await WS.tradingPlatformPasswordChange({
            new_password: values.password,
            platform: CFD_PLATFORMS.MT5,
        });
        if (response.error) {
            this.setError(true, response.error);
            actions.resetForm({});
            actions.setSubmitting(false);
            actions.setStatus({ success: false });
            return true;
        }
        return false;
    }

    async submitMt5Password(values, actions) {
        startPerformanceEventTimer('create_mt5_account_time');

        if (this.root_store.client.is_mt5_password_not_set) {
            const has_error = await this.creatMT5Password(values, actions);
            if (has_error) return;
        }

        this.resetFormErrors();
        if (this.root_store.ui.is_mt5_migration_modal_enabled || this.is_from_mt5_migration_modal) {
            await this.migrateMT5Accounts(values, actions);
        } else {
            const response = await this.openMT5Account(values);
            if (!response.error) {
                actions?.setStatus({ success: true });
                actions?.setSubmitting(false);
                this.setError(false);
                this.setIsMt5PasswordChangedModalVisible(false);
                this.setCFDSuccessDialog(true);
                await this.getAccountStatus(CFD_PLATFORMS.MT5);

                const mt5_login_list_response = await WS.authorized.mt5LoginList();
                this.root_store.client.responseMt5LoginList(mt5_login_list_response);

                WS.transferBetweenAccounts(); // get the list of updated accounts for transfer in cashier
                this.root_store.client.responseMT5TradingServers(await WS.tradingServers(CFD_PLATFORMS.MT5));
                this.setCFDNewAccount(response.mt5_new_account);
                setPerformanceValue('create_mt5_account_time');
            } else {
                await this.getAccountStatus(CFD_PLATFORMS.MT5);
                this.setError(true, response.error);
                actions?.resetForm({});
                actions?.setSubmitting(false);
                actions?.setStatus({ success: false });
            }
        }
    }

    async createCFDPassword(values, actions) {
        const response = await WS.tradingPlatformPasswordChange({
            new_password: values.password,
            platform: CFD_PLATFORMS.DXTRADE,
        });
        if (response.error) {
            this.setError(true, response.error);
            actions.resetForm({});
            actions.setSubmitting(false);
            actions.setStatus({ success: false });
            return true;
        }

        return false;
    }

    async submitCFDPassword(values, actions) {
        startPerformanceEventTimer('create_dxtrade_account_time');

        if (CFD_PLATFORMS.DXTRADE && this.root_store.client.is_dxtrade_password_not_set) {
            const has_error = await this.createCFDPassword(values, actions);
            if (has_error) return;
        }

        const response = await this.openCFDAccount(values);

        if (response.error) {
            await this.getAccountStatus(CFD_PLATFORMS.DXTRADE);
            this.setError(true, response.error);
            actions.resetForm({});
            actions.setSubmitting(false);
            actions.setStatus({ success: false });
            return;
        }

        actions.setStatus({ success: true });
        actions.setSubmitting(false);
        this.setError(false);
        this.setCFDSuccessDialog(true);
        await this.getAccountStatus(CFD_PLATFORMS.DXTRADE);

        const trading_platform_accounts_list_response = await WS.tradingPlatformAccountsList(values.platform);
        this.root_store.client.responseTradingPlatformAccountsList(trading_platform_accounts_list_response);

        WS.transferBetweenAccounts(); // get the list of updated accounts for transfer in cashier
        this.setCFDNewAccount(response.trading_platform_new_account);
        setPerformanceValue('create_dxtrade_account_time');
    }

    toggleCompareAccountsModal() {
        this.is_compare_accounts_visible = !this.is_compare_accounts_visible;
    }

    toggleCTraderTransferModal() {
        this.is_ctrader_transfer_modal_visible = !this.is_ctrader_transfer_modal_visible;
    }

    getRealSyntheticAccountsExistingData(real_synthetic_accounts_existing_data) {
        this.real_synthetic_accounts_existing_data = real_synthetic_accounts_existing_data;
    }

    getRealFinancialAccountsExistingData(real_financial_accounts_existing_data) {
        this.real_financial_accounts_existing_data = real_financial_accounts_existing_data;
    }

    getRealSwapfreeAccountsExistingData(real_swapfree_accounts_existing_data) {
        this.real_swapfree_accounts_existing_data = real_swapfree_accounts_existing_data;
    }

    toggleJurisdictionModal() {
        this.is_jurisdiction_modal_visible = !this.is_jurisdiction_modal_visible;
    }

    toggleMT5TradeModal() {
        this.is_mt5_trade_modal_visible = !this.is_mt5_trade_modal_visible;
    }

    disableMt5FinancialStpModal() {
        this.is_mt5_financial_stp_modal_open = false;
    }

    async topUpVirtual(platform) {
        this.root_store.ui.setTopUpInProgress(true);
        let response;

        switch (platform) {
            case CFD_PLATFORMS.DXTRADE: {
                response = await WS.authorized.send({
                    trading_platform_deposit: 1,
                    platform,
                    to_account: this.current_account.account_id,
                });
                break;
            }
            case CFD_PLATFORMS.CTRADER: {
                response = await WS.authorized.send({
                    trading_platform_deposit: 1,
                    platform: CFD_PLATFORMS.CTRADER,
                    to_account: this.current_account.account_id,
                });
                break;
            }
            case CFD_PLATFORMS.MT5: {
                response = await WS.authorized.mt5Deposit({
                    to_mt5: this.current_account.login,
                });
                break;
            }
            default: {
                response.error = 'Invalid platform';
                break;
            }
        }

        if (!response.error) {
            let new_balance;
            switch (platform) {
                case CFD_PLATFORMS.DXTRADE: {
                    await WS.authorized
                        .tradingPlatformAccountsList(CFD_PLATFORMS.DXTRADE)
                        .then(this.root_store.client.responseTradingPlatformAccountsList);
                    new_balance = this.root_store.client.dxtrade_accounts_list.find(
                        item => item.account_id === this.current_account.account_id
                    )?.balance;
                    break;
                }
                case CFD_PLATFORMS.CTRADER: {
                    await WS.authorized
                        .tradingPlatformAccountsList(CFD_PLATFORMS.CTRADER)
                        .then(this.root_store.client.responseTradingPlatformAccountsList);
                    new_balance = this.root_store.client.ctrader_accounts_list.find(
                        item => item.account_id === this.current_account.account_id
                    )?.balance;
                    break;
                }
                case CFD_PLATFORMS.MT5: {
                    await WS.authorized.mt5LoginList().then(this.root_store.client.responseMt5LoginList);

                    new_balance = this.root_store.client.mt5_login_list.find(
                        item => item.login === this.current_account.login
                    )?.balance;
                    break;
                }
                default: {
                    break;
                }
            }
            runInAction(() => {
                // Get new current account
                this.root_store.ui.is_top_up_virtual_open = false;
                this.current_account.balance = new_balance;
            });
            setTimeout(() => {
                runInAction(() => {
                    this.root_store.ui.is_top_up_virtual_success = true;
                });
            }, 250);
        } else {
            // eslint-disable-next-line no-console
            console.error(response);
        }
        this.root_store.ui.setTopUpInProgress(false);
    }

    sendVerifyEmail() {
        return WS.verifyEmail(this.root_store.client.email, 'trading_platform_investor_password_reset');
    }

    setDxtradeToken(response, server) {
        if (!response.error) {
            const { dxtrade } = response.service_token;
            this.dxtrade_tokens[server] = dxtrade.token;
        }
    }

    setCTraderToken(response, server) {
        if (!response.error) {
            const { ctrader } = response.service_token;
            this.ctrader_tokens[server] = ctrader.token;
        }
    }

    loadDxtradeTokens() {
        ['demo', 'real'].forEach(account_type => {
            const has_existing_account = this.root_store.client.dxtrade_accounts_list.some(
                account => account.account_type === account_type
            );
            if (!this.dxtrade_tokens[account_type] && has_existing_account) {
                WS.getServiceToken(CFD_PLATFORMS.DXTRADE, account_type).then(response =>
                    this.setDxtradeToken(response, account_type)
                );
            }
        });
    }

    loadCTraderTokens(url, account_type) {
        const has_existing_account = this.root_store.client.ctrader_accounts_list.some(
            account => account.account_type === account_type
        );
        if (has_existing_account) {
            WS.getServiceToken(CFD_PLATFORMS.CTRADER, account_type)
                .then(response => {
                    this.setCTraderToken(response, account_type);
                    return window.open(`${url}?token=${response.service_token.ctrader.token}`, '_blank');
                })
                .catch(() => window.open(`${url}`, '_blank'));
        }
    }

    static async changePassword({ login, old_password, new_password, password_type }) {
        let response;

        if (password_type === 'investor') {
            response = await WS.authorized.tradingPlatformInvestorPasswordChange({
                account_id: login,
                old_password,
                new_password,
                platform: CFD_PLATFORMS.MT5,
            });
        } else {
            response = await WS.authorized.tradingPlatformPasswordChange({
                account_id: login,
                old_password,
                new_password,
                platform: CFD_PLATFORMS.MT5,
            });
        }

        return response?.error?.message;
    }

    setJurisdictionSelectedShortcode(shortcode) {
        this.jurisdiction_selected_shortcode = shortcode;
    }

    toggleCFDVerificationModal() {
        this.is_cfd_verification_modal_visible = !this.is_cfd_verification_modal_visible;
    }

    setMigratedMT5Accounts(accounts) {
        this.migrated_mt5_accounts = accounts;
    }

    setIsFromMt5MigrationModal(is_from_mt5_migration_modal) {
        this.is_from_mt5_migration_modal = is_from_mt5_migration_modal;
    }

    setServerMaintenanceModal(is_server_maintenance_modal_visible) {
        this.is_server_maintenance_modal_visible = is_server_maintenance_modal_visible;
    }

    setAccountUnavailableModal(is_account_unavailable_modal_visible) {
        this.is_account_unavailable_modal_visible = is_account_unavailable_modal_visible;
    }
}
