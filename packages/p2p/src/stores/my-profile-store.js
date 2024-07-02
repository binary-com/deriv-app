import { observable, action, computed, makeObservable, reaction } from 'mobx';
import { requestWS } from 'Utils/websocket';
import { localize } from 'Components/i18next';
import { textValidator } from 'Utils/validations';
import BaseStore from 'Stores/base_store';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { isMobile } from '@deriv/shared';

export default class MyProfileStore extends BaseStore {
    active_tab = my_profile_tabs.MY_STATS;
    add_payment_method_error_message = '';
    advertiser_payment_methods = {};
    advertiser_payment_methods_error = '';
    available_payment_methods = {};
    error_message = '';
    form_error = '';
    full_name = '';
    has_more_items_to_load = false;
    is_block_user_table_loading = false;
    is_button_loading = false;
    is_daily_limit_upgrade_success = false;
    is_daily_limit_upgrading = false;
    is_loading = false;
    is_submit_success = false;
    is_there_daily_limit_error = false;
    is_trade_partners_list_empty = true;
    payment_method_value = undefined;
    payment_methods_list = [];
    payment_method_to_delete = {};
    payment_method_to_edit = {};
    search_results = [];
    search_term = '';
    selected_payment_method = '';
    selected_payment_method_display_name = '';
    selected_payment_method_fields = [];
    selected_sort_value = 'all_users';
    selected_trade_partner = {};
    should_show_add_payment_method_form = false;
    should_show_block_user_list_header = false;
    should_show_edit_payment_method_form = false;
    trade_partners_list = [];

    // TODO: Refactor this out once modal management refactoring is completed
    MODAL_TRANSITION_DURATION = 280;

    constructor(root_store) {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super(root_store);

        makeObservable(this, {
            active_tab: observable,
            add_payment_method_error_message: observable,
            advertiser_payment_methods: observable,
            advertiser_payment_methods_error: observable,
            available_payment_methods: observable,
            error_message: observable,
            form_error: observable,
            full_name: observable,
            has_more_items_to_load: observable,
            is_block_user_table_loading: observable,
            is_button_loading: observable,
            is_daily_limit_upgrade_success: observable,
            is_daily_limit_upgrading: observable,
            is_loading: observable,
            is_submit_success: observable,
            is_there_daily_limit_error: observable,
            is_trade_partners_list_empty: observable,
            payment_method_value: observable,
            payment_methods_list: observable,
            payment_method_to_delete: observable,
            payment_method_to_edit: observable,
            search_results: observable,
            search_term: observable,
            selected_payment_method: observable,
            selected_payment_method_display_name: observable,
            selected_payment_method_fields: observable,
            selected_sort_value: observable,
            selected_trade_partner: observable,
            should_show_add_payment_method_form: observable,
            should_show_block_user_list_header: observable,
            should_show_edit_payment_method_form: observable,
            trade_partners_list: observable,
            advertiser_has_payment_methods: computed,
            advertiser_payment_methods_list: computed,
            block_user_sort_list: computed,
            payment_method_field_set: computed,
            initial_values: computed,
            payment_method_info: computed,
            payment_methods_list_items: computed,
            rendered_trade_partners_list: computed,
            trade_partner_dropdown_list: computed,
            getAdvertiserPaymentMethods: action.bound,
            getPaymentMethodsList: action.bound,
            getPaymentMethodDisplayName: action.bound,
            getPaymentMethodValue: action.bound,
            getSearchedTradePartners: action.bound,
            getSelectedPaymentMethodDetails: action.bound,
            getTradePartnersList: action.bound,
            handleChange: action.bound,
            handleSubmit: action.bound,
            handleToggle: action.bound,
            hideAddPaymentMethodForm: action.bound,
            onClear: action.bound,
            validatePaymentMethodFields: action.bound,
            showAddPaymentMethodForm: action.bound,
            onSubmit: action.bound,
            onClickUnblock: action.bound,
            setActiveTab: action.bound,
            setAddPaymentMethodErrorMessage: action.bound,
            setAdvertiserPaymentMethods: action.bound,
            setAdvertiserPaymentMethodsError: action.bound,
            setAvailablePaymentMethods: action.bound,
            setErrorMessage: action.bound,
            setFormError: action.bound,
            setFullName: action.bound,
            setHasMoreItemsToLoad: action.bound,
            setIsBlockUserTableLoading: action.bound,
            setIsDailyLimitUpgradeSuccess: action.bound,
            setIsLoading: action.bound,
            setIsSubmitSuccess: action.bound,
            setIsThereDailyLimitError: action.bound,
            setIsTradePartnersListEmpty: action.bound,
            setIsDailyLimitUpgrading: action.bound,
            setPaymentMethodValue: action.bound,
            setPaymentMethodsList: action.bound,
            setPaymentMethodToDelete: action.bound,
            setPaymentMethodToEdit: action.bound,
            setSearchResults: action.bound,
            setSearchTerm: action.bound,
            setSelectedPaymentMethod: action.bound,
            setSelectedPaymentMethodDisplayName: action.bound,
            setSelectedPaymentMethodFields: action.bound,
            setSelectedSortValue: action.bound,
            setSelectedTradePartner: action.bound,
            setShouldShowAddPaymentMethodForm: action.bound,
            setShouldShowBlockUserListHeader: action.bound,
            setShouldShowEditPaymentMethodForm: action.bound,
            setTradePartnersList: action.bound,
            upgradeDailyLimit: action.bound,
        });

        reaction(
            () => this.trade_partners_list,
            () => {
                if (this.trade_partners_list.length > 0 && this.is_trade_partners_list_empty)
                    this.setIsTradePartnersListEmpty(false);
            }
        );
    }

    get advertiser_has_payment_methods() {
        return !!Object.keys(this.advertiser_payment_methods).length;
    }

    get advertiser_payment_methods_list() {
        const list = [];

        Object.entries(this.advertiser_payment_methods).forEach(key => {
            list.push({
                ID: key[0],
                is_enabled: key[1].is_enabled,
                fields: key[1].fields,
                method: key[1].method,
                display_name: key[1].display_name,
            });
        });

        return list;
    }

    // eslint-disable-next-line class-methods-use-this
    get block_user_sort_list() {
        return [
            // TODO: uncomment when BE returns trade partner count values
            // {
            //     text: localize('All ({{list_value}})', {
            //         list_value: this.is_block_user_table_loading ? '...' : this.trade_partner_dropdown_list.length,
            //     }),
            //     value: 'all_users',
            // },
            // {
            //     text: localize('Blocked ({{list_value}})', {
            //         list_value: this.is_block_user_table_loading
            //             ? '...'
            //             : this.trade_partner_dropdown_list.filter(partner => partner.is_blocked === 1).length,
            //     }),
            //     value: 'blocked_users',
            // },
            {
                text: localize('All'),
                value: 'all_users',
            },
            {
                text: localize('Blocked'),
                value: 'blocked_users',
            },
        ];
    }

    get payment_method_field_set() {
        // The fields are rendered dynamically based on the response. This variable will hold a dictionary of field id and its name/required properties
        return this.selected_payment_method_fields.reduce((dict, field_data) => {
            return {
                ...dict,
                [field_data[0]]: { display_name: field_data[1].display_name, required: field_data[1].required },
            };
        }, {});
    }

    get initial_values() {
        const object = {};

        Object.values(this.selected_payment_method_fields).forEach(field => {
            const filter = this.payment_method_info
                ? Object.entries(this.payment_method_info.fields).filter(
                      payment_method_field => payment_method_field[0] === field[0]
                  )
                : {};

            if (Object.values(filter).length > 0) {
                object[field[0]] = Object.values(filter)[0][1].value;
            } else {
                object[field[0]] = '';
            }
        });

        return object;
    }

    get payment_method_info() {
        return this.advertiser_payment_methods_list.filter(method => method.ID === this.payment_method_to_edit?.ID)[0];
    }

    get payment_methods_list_items() {
        const list_items = [];

        Object.entries(this.available_payment_methods).forEach(key => {
            list_items.push({ text: key[1].display_name, value: key[0] });
        });

        return list_items;
    }

    /**
     * Evaluates a new trade_partners_list based on if the user has searched an advertiser
     * By default it returns the trade_partners_list when there are no searches
     *
     * @returns {Array} Returns the entire trade partners list or filtered list of searched trade partners
     */
    get rendered_trade_partners_list() {
        return this.search_term ? this.search_results : this.trade_partners_list;
    }

    get trade_partner_dropdown_list() {
        if (this.search_term) {
            if (this.search_results.length) return this.search_results;
            else if (this.search_results.length === 0) return [];
        }

        return this.trade_partners_list;
    }

    getAdvertiserPaymentMethods() {
        this.setIsLoading(true);
        requestWS({
            p2p_advertiser_payment_methods: 1,
        }).then(response => {
            if (response?.error) {
                this.setAdvertiserPaymentMethodsError(response.error.message);
            } else {
                this.setAdvertiserPaymentMethods(response?.p2p_advertiser_payment_methods);
            }
            this.setIsLoading(false);
        });
    }

    getPaymentMethodsList() {
        const { buy_sell_store } = this.root_store;
        requestWS({
            p2p_payment_methods: 1,
        }).then(response => {
            if (response) {
                if (response.error) {
                    return;
                }
                const { p2p_payment_methods } = response;
                const list = [];
                const list_items = [];
                this.setAvailablePaymentMethods(p2p_payment_methods);
                if (this.search_term) {
                    Object.entries(this.available_payment_methods).forEach(key => {
                        if (key[1].display_name.toLowerCase().includes(this.search_term.toLowerCase().trim()))
                            list_items.push({ text: key[1].display_name, value: key[0] });
                    });
                }

                Object.entries(this.available_payment_methods).forEach(key => {
                    list.push({ text: key[1].display_name, value: key[0] });
                });
                this.setPaymentMethodsList(list);

                if (list_items.length) {
                    this.setSearchResults(list_items);
                } else {
                    this.setSearchResults([]);
                }
            }
            buy_sell_store.setIsFilterModalLoading(false);
        });
    }

    getPaymentMethodDisplayName(payment_method) {
        this.setSelectedPaymentMethodDisplayName(this.available_payment_methods[payment_method].display_name);
        return this.selected_payment_method_display_name;
    }

    getPaymentMethodValue(payment_method) {
        const method = Object.entries(this.available_payment_methods).filter(
            pm => pm[1].display_name === payment_method
        );

        this.setPaymentMethodValue(method[0]?.[0]);
        return this.payment_method_value;
    }

    getSelectedPaymentMethodDetails() {
        this.setPaymentMethodValue(undefined);

        if (this.selected_payment_method) {
            this.setSelectedPaymentMethodDisplayName(
                this.available_payment_methods[this.selected_payment_method].display_name
            );
            this.setSelectedPaymentMethodFields(
                Object.entries(this.available_payment_methods[this.selected_payment_method].fields)
            );
        } else if (this.selected_payment_method_display_name) {
            const payment_method = Object.entries(this.available_payment_methods).filter(
                pm => pm[1].display_name === this.selected_payment_method_display_name
            );
            const filtered_payment_method = Object.entries(payment_method)[0][1][1];

            this.setPaymentMethodValue(payment_method[0][0]);
            this.setSelectedPaymentMethodDisplayName(filtered_payment_method.display_name);
            this.setSelectedPaymentMethodFields(Object.entries(filtered_payment_method.fields));
        }
    }

    getSettings() {
        requestWS({ get_settings: 1 }).then(response => {
            const { get_settings } = response || {};
            if (!response?.error) {
                this.setFullName(`${get_settings?.first_name} ${get_settings?.last_name}`);
            } else {
                this.setFormError(response?.error?.message);
            }
        });
    }

    getTradePartnersList({ startIndex }, is_initial_load = false) {
        const { general_store } = this.root_store;

        if (is_initial_load) this.setIsBlockUserTableLoading(true);

        requestWS({
            p2p_advertiser_list: 1,
            trade_partners: 1,
            ...(this.search_term ? { advertiser_name: this.search_term } : {}),
            ...(this.selected_sort_value === 'blocked_users' ? { is_blocked: 1 } : {}),
            offset: startIndex,
            limit: general_store.list_item_limit,
        }).then(response => {
            if (response) {
                if (!response.error) {
                    const { list } = response.p2p_advertiser_list;
                    const is_first_page = startIndex === 0;

                    this.setHasMoreItemsToLoad(list.length >= general_store.list_item_limit);

                    this.setShouldShowBlockUserListHeader(
                        this.is_trade_partners_list_empty && list.length === 0 && !this.search_term
                    );

                    let filtered_list, partners_list;

                    if (this.search_term) {
                        filtered_list = list.filter(
                            partner => !this.search_results.find(({ id }) => partner.id === id)
                        );
                        partners_list = is_first_page ? list : [...this.search_results, ...filtered_list];

                        this.setSearchResults(partners_list);
                    } else {
                        filtered_list = list.filter(
                            partner => !this.trade_partners_list.find(({ id }) => partner.id === id)
                        );
                        partners_list = is_first_page ? list : [...this.trade_partners_list, ...filtered_list];

                        this.setTradePartnersList(partners_list);
                    }
                } else {
                    const { code, message } = response.error;

                    general_store.setErrorCode(code);
                    general_store.setBlockUnblockUserError(message);
                }
            }
            this.setIsBlockUserTableLoading(false);
        });
    }

    handleChange(e) {
        this.setSelectedSortValue(e.target.value);
        this.getTradePartnersList({ startIndex: 0 }, true);

        if (isMobile()) {
            this.root_store.general_store.hideModal();
        }
    }

    handleSubmit(values) {
        const { general_store } = this.root_store;

        requestWS({
            p2p_advertiser_update: 1,
            contact_info: values.contact_info,
            payment_info: values.payment_info,
            default_advert_description: values.default_advert_description,
        }).then(response => {
            if (!response.error) {
                const { contact_info, default_advert_description } = response.p2p_advertiser_update;

                this.setIsSubmitSuccess(true);
                general_store.setContactInfo(contact_info);
                general_store.setDefaultAdvertDescription(default_advert_description);
            } else {
                this.setFormError(response.error.message);
            }
            setTimeout(() => {
                this.setIsSubmitSuccess(false);
            }, 3000);
        });
    }

    handleToggle() {
        this.root_store.general_store.setShouldShowRealName(!this.root_store?.general_store?.should_show_real_name);
        requestWS({
            p2p_advertiser_update: 1,
            show_name: this.root_store?.general_store?.should_show_real_name ? 1 : 0,
        }).then(response => {
            if (response?.error) {
                this.root_store.general_store.showModal({
                    key: 'ErrorModal',
                    props: {
                        error_message: response.error.message,
                        has_close_icon: false,
                    },
                });
                this.root_store.general_store.setShouldShowRealName(
                    !this.root_store?.general_store?.should_show_real_name
                );
            }
        });
    }

    hideAddPaymentMethodForm() {
        this.setShouldShowAddPaymentMethodForm(false);
    }

    /**
     * This function updates the search_results based on the searched advertiser
     */
    getSearchedTradePartners() {
        if (this.search_term) {
            this.setTradePartnersList([]);
            this.getTradePartnersList({ startIndex: 0 }, true);
        }
    }

    onClear() {
        if (this.search_term) {
            this.setSearchTerm('');
            this.setSearchResults([]);
            this.setTradePartnersList([]);
            this.getTradePartnersList({ startIndex: 0 }, true);
        }
    }

    onClickUnblock(advertiser) {
        const { general_store } = this.root_store;

        general_store.showModal({
            key: 'BlockUserModal',
            props: { advertiser_name: advertiser.name, is_advertiser_blocked: !!advertiser.is_blocked },
        });
        this.setSelectedTradePartner(advertiser);
    }

    onSubmit() {
        const { general_store } = this.root_store;

        clearTimeout(delay);
        if (general_store.isCurrentModal('BlockUserModal')) {
            general_store.hideModal();
        }
        general_store.blockUnblockUser(!this.selected_trade_partner.is_blocked, this.selected_trade_partner.id);
        const delay = setTimeout(() => this.getTradePartnersList({ startIndex: 0 }, true), 250);
    }

    showAddPaymentMethodForm() {
        this.setShouldShowAddPaymentMethodForm(true);
    }

    validateForm = values => {
        const validations = {
            contact_info: [v => textValidator(v)],
            default_advert_description: [v => textValidator(v)],
            payment_info: [v => textValidator(v)],
        };

        const mapped_key = {
            contact_info: localize('Contact details'),
            default_advert_description: localize('Instructions'),
            payment_info: localize('Payment details'),
        };

        const errors = {};

        const getErrorMessages = field_name => [
            localize(
                "{{field_name}} can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;",
                {
                    field_name,
                }
            ),
        ];

        Object.entries(validations).forEach(([key, rule]) => {
            const error_index = rule.findIndex(v => !v(values[key]));
            if (error_index !== -1) {
                switch (key) {
                    case 'contact_info':
                    case 'default_advert_description':
                    case 'payment_info':
                        errors[key] = getErrorMessages(mapped_key[key])[error_index];
                        break;
                    default: {
                        errors[key] = getErrorMessages[error_index];
                        break;
                    }
                }
            }
        });

        return errors;
    };

    validatePaymentMethodFields = values => {
        const errors = {};
        const no_symbols_regex = /^[a-zA-Z0-9\s\-.@_+#(),:;']+$/;

        Object.keys(values).forEach(key => {
            const value = values[key];
            const payment_method_field_set = this.payment_method_field_set[key] || this.payment_method_to_edit;
            const { display_name, required } = payment_method_field_set;

            if (required && !value) {
                errors[key] = localize('This field is required.');
            } else if (value && !no_symbols_regex.test(value)) {
                errors[key] = localize(
                    "{{field_name}} can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;",
                    {
                        field_name: display_name,
                        interpolation: { escapeValue: false },
                    }
                );
            } else if (value.length > 200) {
                errors[key] = localize('{{field_name}} has exceeded maximum length of 200 characters.', {
                    field_name: display_name,
                    interpolation: { escapeValue: false },
                });
            }
        });

        return errors;
    };

    setActiveTab(active_tab) {
        this.active_tab = active_tab;
    }

    setAddPaymentMethodErrorMessage(add_payment_method_error_message) {
        this.add_payment_method_error_message = add_payment_method_error_message;
    }

    setAdvertiserPaymentMethods(advertiser_payment_methods) {
        this.advertiser_payment_methods = advertiser_payment_methods;
    }

    setAdvertiserPaymentMethodsError(advertiser_payment_methods_error) {
        this.advertiser_payment_methods_error = advertiser_payment_methods_error;
    }

    setAvailablePaymentMethods(available_payment_methods) {
        this.available_payment_methods = available_payment_methods;
    }

    setErrorMessage(error_message) {
        this.error_message = error_message;
    }

    setFormError(form_error) {
        this.form_error = form_error;
    }

    setFullName(full_name) {
        this.full_name = full_name;
    }

    setHasMoreItemsToLoad(has_more_items_to_load) {
        this.has_more_items_to_load = has_more_items_to_load;
    }

    setIsBlockUserTableLoading(is_block_user_table_loading) {
        this.is_block_user_table_loading = is_block_user_table_loading;
    }

    setIsDailyLimitUpgradeSuccess(is_daily_limit_upgrade_success) {
        this.is_daily_limit_upgrade_success = is_daily_limit_upgrade_success;
    }

    setIsDailyLimitUpgrading(is_daily_limit_upgrading) {
        this.is_daily_limit_upgrading = is_daily_limit_upgrading;
    }

    setIsLoading(is_loading) {
        this.is_loading = is_loading;
    }

    setIsSubmitSuccess(is_submit_success) {
        this.is_submit_success = is_submit_success;
    }

    setIsThereDailyLimitError(is_there_daily_limit_error) {
        this.is_there_daily_limit_error = is_there_daily_limit_error;
    }

    setIsTradePartnersListEmpty(is_trade_partners_list_empty) {
        this.is_trade_partners_list_empty = is_trade_partners_list_empty;
    }

    setPaymentMethodValue(payment_method_value) {
        this.payment_method_value = payment_method_value;
    }

    setPaymentMethodsList(payment_methods_list) {
        this.payment_methods_list = payment_methods_list;
    }

    setPaymentMethodToDelete(payment_method_to_delete) {
        this.payment_method_to_delete = payment_method_to_delete;
    }

    setPaymentMethodToEdit(payment_method_to_edit) {
        this.payment_method_to_edit = payment_method_to_edit;
    }

    setSearchResults(search_results) {
        this.search_results = search_results;
    }

    setSearchTerm(search_term) {
        this.search_term = search_term;
    }

    setSelectedPaymentMethod(selected_payment_method) {
        this.selected_payment_method = selected_payment_method;
    }

    setSelectedPaymentMethodDisplayName(selected_payment_method_display_name) {
        this.selected_payment_method_display_name = selected_payment_method_display_name;
    }

    setSelectedPaymentMethodFields(selected_payment_method_fields) {
        this.selected_payment_method_fields = selected_payment_method_fields;
    }

    setSelectedSortValue(selected_sort_value) {
        this.selected_sort_value = selected_sort_value;
    }

    setSelectedTradePartner(selected_trade_partner) {
        this.selected_trade_partner = selected_trade_partner;
    }

    setShouldShowAddPaymentMethodForm(should_show_add_payment_method_form) {
        this.should_show_add_payment_method_form = should_show_add_payment_method_form;
    }

    setShouldShowBlockUserListHeader(should_show_block_user_list_header) {
        this.should_show_block_user_list_header = should_show_block_user_list_header;
    }

    setShouldShowEditPaymentMethodForm(should_show_edit_payment_method_form) {
        this.should_show_edit_payment_method_form = should_show_edit_payment_method_form;
    }

    setTradePartnersList(trade_partners_list) {
        this.trade_partners_list = trade_partners_list;
    }

    upgradeDailyLimit() {
        const { general_store } = this.root_store;

        requestWS({ p2p_advertiser_update: 1, upgrade_limits: 1 }).then(response => {
            if (response) {
                this.setIsDailyLimitUpgrading(false);

                if (response.error) this.setIsThereDailyLimitError(true);
                else this.setIsDailyLimitUpgradeSuccess(true);

                general_store.external_stores.notifications.removeNotificationByKey({
                    key: 'p2p_daily_limit_increase',
                    should_show_again: false,
                });

                general_store.external_stores.client.setP2pAdvertiserInfo(false);
            }
        });
    }
}
