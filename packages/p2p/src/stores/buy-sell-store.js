import React from 'react';
import { action, computed, observable, reaction, makeObservable } from 'mobx';
import { formatMoney, getDecimalPlaces } from '@deriv/shared';
import { Text } from '@deriv/components';
import { localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { api_error_codes } from 'Constants/api-error-codes';
import { requestWS, subscribeWS } from 'Utils/websocket';
import { textValidator, lengthValidator } from 'Utils/validations';
import { countDecimalPlaces } from 'Utils/string';
import { removeTrailingZeros } from 'Utils/format-value';
import BaseStore from 'Stores/base_store';

export default class BuySellStore extends BaseStore {
    create_sell_ad_from_no_ads = false;
    error_message = '';
    form_error_code = '';
    has_more_items_to_load = false;
    has_payment_methods = false;
    is_filter_modal_loading = false;
    is_loading = true;
    is_sort_dropdown_open = false;
    is_submit_disabled = true;
    local_currencies = [];
    local_currency = null;
    receive_amount = 0;
    search_results = [];
    search_term = '';
    selected_ad_state = {};
    selected_local_currency = null;
    selected_payment_method_value = [];
    selected_payment_method_text = [];
    selected_value = 'rate';
    should_show_verification = false;
    should_use_client_limits = true;
    show_advertiser_page = false;
    show_filter_payment_methods = false;
    sort_by = 'rate';
    submitForm = null;
    table_type = buy_sell.BUY;
    form_props = {};
    is_create_order_subscribed = false;

    initial_values = {
        amount: this.advert?.min_order_amount_limit,
        // For sell orders we require extra information.
        ...(this.is_sell_advert ? { contact_info: this.root_store.general_store.contact_info } : {}),
    };
    payment_method_ids = [];

    constructor(root_store) {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super(root_store);

        makeObservable(this, {
            create_sell_ad_from_no_ads: observable,
            error_message: observable,
            form_error_code: observable,
            has_more_items_to_load: observable,
            has_payment_methods: observable,
            is_filter_modal_loading: observable,
            is_loading: observable,
            is_sort_dropdown_open: observable,
            is_submit_disabled: observable,
            local_currencies: observable,
            local_currency: observable,
            receive_amount: observable,
            search_results: observable,
            search_term: observable,
            selected_ad_state: observable,
            selected_local_currency: observable,
            selected_payment_method_value: observable,
            selected_payment_method_text: observable,
            selected_value: observable,
            should_show_verification: observable,
            should_use_client_limits: observable,
            show_advertiser_page: observable,
            show_filter_payment_methods: observable,
            sort_by: observable,
            submitForm: observable,
            table_type: observable,
            form_props: observable,
            is_create_order_subscribed: observable,
            account_currency: computed,
            advert: computed,
            has_payment_info: computed,
            is_buy: computed,
            is_buy_advert: computed,
            is_sell_advert: computed,
            modal_title: computed,
            getWebsiteStatus: action.bound,
            handleAdvertInfoResponse: action.bound,
            handleChange: action.bound,
            handleSubmit: action.bound,
            hideAdvertiserPage: action.bound,
            hideVerification: action.bound,
            onChangeTableType: action.bound,
            onClickApply: action.bound,
            onLocalCurrencySelect: action.bound,
            setCreateSellAdFromNoAds: action.bound,
            setErrorMessage: action.bound,
            setFormErrorCode: action.bound,
            setFormProps: action.bound,
            setHasMoreItemsToLoad: action.bound,
            setHasPaymentMethods: action.bound,
            setIsFilterModalLoading: action.bound,
            setIsLoading: action.bound,
            setIsSortDropdownOpen: action.bound,
            setIsSubmitDisabled: action.bound,
            setLocalCurrency: action.bound,
            setLocalCurrencies: action.bound,
            setInitialReceiveAmount: action.bound,
            setReceiveAmount: action.bound,
            setSearchResults: action.bound,
            setSearchTerm: action.bound,
            setSelectedAdState: action.bound,
            setSelectedLocalCurrency: action.bound,
            setSelectedPaymentMethodValue: action.bound,
            setSelectedPaymentMethodText: action.bound,
            setSelectedValue: action.bound,
            setShouldShowVerification: action.bound,
            setShouldUseClientLimits: action.bound,
            setShowAdvertiserPage: action.bound,
            setShowFilterPaymentMethods: action.bound,
            setSortBy: action.bound,
            setSubmitForm: action.bound,
            setTableType: action.bound,
            setSelectedAdvert: action.bound,
            showAdvertiserPage: action.bound,
            showVerification: action.bound,
            validatePopup: action.bound,
            sort_list: computed,
            fetchAdvertiserAdverts: action.bound,
            handleResponse: action.bound,
            setIsCreateOrderSubscribed: action.bound,
            unsubscribeAdvertInfo: action.bound,
        });
    }

    advert_info_subscription = {};
    create_order_subscription = {};

    get account_currency() {
        return this.advert?.account_currency;
    }

    get advert() {
        return this.form_props?.advert;
    }

    get has_payment_info() {
        return this.root_store.general_store.contact_info.length;
    }

    get is_buy() {
        return this.table_type === buy_sell.BUY;
    }

    get is_buy_advert() {
        return this.advert?.counterparty_type === buy_sell.BUY;
    }

    get is_sell_advert() {
        return this.advert?.counterparty_type === buy_sell.SELL;
    }

    get modal_title() {
        if (this.is_buy_advert) {
            return localize('Buy {{ account_currency }}', { account_currency: this.account_currency });
        }

        return localize('Sell {{ account_currency }}', { account_currency: this.account_currency });
    }

    // eslint-disable-next-line class-methods-use-this
    get sort_list() {
        return [
            { text: localize('Exchange rate'), value: 'rate' },
            { text: localize('User rating'), value: 'rating' },
        ];
    }

    fetchAdvertiserAdverts() {
        if (!this.is_buy) {
            this.root_store.my_profile_store.getAdvertiserPaymentMethods();
        }
    }

    getWebsiteStatus() {
        requestWS({ website_status: 1 }).then(response => {
            if (response) {
                const { error, website_status } = response;

                if (error) this.setErrorMessage(error.message);
                else this.setLocalCurrencies(website_status.p2p_config?.local_currencies);
            }
        });
    }

    handleChange(e) {
        this.setIsLoading(true);
        this.setSelectedValue(e.target.value);
        this.setSortBy(e.target.value);
        this.setIsSortDropdownOpen(false);
    }

    handleResponse = async order => {
        const { sendbird_store, order_store, general_store } = this.root_store;
        const { setErrorMessage, setHasRateChanged, handleConfirm, handleClose } = this.form_props;
        const { error, p2p_order_create, p2p_order_info, subscription } = order || {};

        if (error) {
            const { code, message } = error;

            if (code === api_error_codes.ORDER_CREATE_FAIL_RATE_SLIPPAGE) {
                general_store.showModal({
                    key: 'MarketRateChangeErrorModal',
                    props: { message },
                });
                setHasRateChanged(true);
            } else {
                setErrorMessage(message);
                this.setFormErrorCode(code);
            }
        } else {
            if (subscription?.id && !this.is_create_order_subscribed) {
                this.setIsCreateOrderSubscribed(true);
            }
            setErrorMessage(null);
            general_store.hideModal();

            if (p2p_order_create?.id) {
                const response = await requestWS({ p2p_order_info: 1, id: p2p_order_create.id });
                handleConfirm(response?.p2p_order_info);
            }

            if (p2p_order_info?.id && p2p_order_info?.chat_channel_url) {
                sendbird_store.setChatChannelUrl(p2p_order_info.chat_channel_url);
                order_store.setOrderDetails(order);
            }

            handleClose();
            this.payment_method_ids = [];
        }
    };

    handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);

        this.form_props.setErrorMessage(null);

        const payload = {
            p2p_order_create: 1,
            advert_id: this.advert.id,
            amount: values.amount,
            payment_method_ids: this.payment_method_ids,
            ...(values.payment_info && this.is_sell_advert ? { payment_info: values.payment_info } : {}),
            // Validate extra information for sell adverts.
            ...(this.is_sell_advert
                ? {
                      contact_info: values.contact_info,
                  }
                : {}),
        };
        if (values.rate !== null) {
            payload.rate = values.rate;
        }

        this.create_order_subscription = subscribeWS({ ...payload }, [this.handleResponse]);

        setSubmitting(false);
    };

    hideAdvertiserPage() {
        this.setShowAdvertiserPage(false);
    }

    hideVerification() {
        this.setShouldShowVerification(false);
    }

    onChangeTableType(event) {
        this.setTableType(event.target.value);
    }

    onClickApply(payment_method_value, payment_method_text) {
        this.setSelectedPaymentMethodValue(payment_method_value);
        this.setSelectedPaymentMethodText(payment_method_text);
    }

    onLocalCurrencySelect(local_currency) {
        this.setSelectedLocalCurrency(local_currency);
        this.setLocalCurrency(local_currency);
    }

    setCreateSellAdFromNoAds(create_sell_ad_from_no_ads) {
        this.create_sell_ad_from_no_ads = create_sell_ad_from_no_ads;
    }

    setErrorMessage(error_message) {
        this.error_message = error_message;
    }

    setFormErrorCode(form_error_code) {
        this.form_error_code = form_error_code;
    }

    setFormProps(props) {
        this.form_props = props;
    }

    setHasMoreItemsToLoad(has_more_items_to_load) {
        this.has_more_items_to_load = has_more_items_to_load;
    }

    setHasPaymentMethods(has_payment_methods) {
        this.has_payment_methods = has_payment_methods;
    }

    setIsFilterModalLoading(is_filter_modal_loading) {
        this.is_filter_modal_loading = is_filter_modal_loading;
    }

    setIsLoading(is_loading) {
        this.is_loading = is_loading;
    }

    setIsSortDropdownOpen(is_sort_dropdown_open) {
        this.is_sort_dropdown_open = is_sort_dropdown_open;
    }

    setIsSubmitDisabled(is_submit_disabled) {
        this.is_submit_disabled = is_submit_disabled;
    }

    setLocalCurrency(local_currency) {
        this.local_currency = local_currency;
    }

    setLocalCurrencies(local_currencies) {
        const currency_list = [];

        local_currencies.forEach(currency => {
            const { display_name, has_adverts, is_default, symbol } = currency;

            if (is_default && !this.selected_local_currency) {
                this.setSelectedLocalCurrency(symbol);
                this.setLocalCurrency(symbol);
            }

            currency_list.push({
                component: (
                    <div className='currency-dropdown__list-item'>
                        <div className='currency-dropdown__list-item-symbol'>{symbol}</div>
                        <Text as='div' align='right' size='xs' line_height='xxs'>
                            {display_name}
                        </Text>
                    </div>
                ),
                display_name,
                has_adverts,
                is_default,
                text: symbol,
                value: symbol,
            });
        });

        this.local_currencies = currency_list;
    }

    setInitialReceiveAmount(initial_price) {
        this.receive_amount = removeTrailingZeros((this.advert.min_order_amount_limit * initial_price).toString());
    }

    setReceiveAmount(receive_amount) {
        this.receive_amount = receive_amount;
    }

    setSearchResults(search_results) {
        this.search_results = search_results;
    }

    setSearchTerm(search_term) {
        this.search_term = search_term;
    }

    setSelectedAdState(selected_ad_state) {
        this.selected_ad_state = selected_ad_state;
    }

    setSelectedLocalCurrency(selected_local_currency) {
        this.selected_local_currency = selected_local_currency;
    }

    setSelectedPaymentMethodValue(payment_method_value) {
        this.selected_payment_method_value = [...payment_method_value];
    }

    setSelectedPaymentMethodText(payment_method_text) {
        this.selected_payment_method_text = [...payment_method_text];
    }

    setSelectedValue(selected_value) {
        this.selected_value = selected_value;
    }

    setShouldShowVerification(should_show_verification) {
        this.should_show_verification = should_show_verification;
    }

    setShouldUseClientLimits(should_use_client_limits) {
        this.should_use_client_limits = should_use_client_limits;
    }

    setShowAdvertiserPage(show_advertiser_page) {
        this.show_advertiser_page = show_advertiser_page;
    }

    setShowFilterPaymentMethods(show_filter_payment_methods) {
        this.show_filter_payment_methods = show_filter_payment_methods;
    }

    setSortBy(sort_by) {
        this.sort_by = sort_by;
    }

    setSubmitForm(submitForm) {
        this.submitForm = submitForm;
    }

    setTableType(table_type) {
        this.table_type = table_type;
    }

    setSelectedAdvert(selected_advert) {
        const { general_store } = this.root_store;
        if (!this.root_store.general_store.is_advertiser) {
            this.setShouldShowVerification(true);
        } else if (this.is_sell_advert) {
            this.setSelectedAdState(selected_advert);
            general_store.showModal({
                key: 'BuySellModal',
            });
        } else {
            this.setSelectedAdState(selected_advert);
            general_store.showModal({
                key: 'BuySellModal',
            });
        }
    }

    setIsCreateOrderSubscribed(is_create_order_subscribed) {
        this.is_create_order_subscribed = is_create_order_subscribed;
    }

    showAdvertiserPage(selected_advert) {
        this.setSelectedAdState(selected_advert);
        this.setShowAdvertiserPage(true);
    }

    showVerification() {
        this.setShouldShowVerification(true);
    }

    validatePopup(values) {
        const validations = {
            amount: [
                v => !!v,
                v => v >= this.advert.min_order_amount_limit,
                v => v <= this.advert.max_order_amount_limit,
                v => (this.root_store.buy_sell_store.is_buy_advert ? true : v <= this.root_store.general_store.balance),
                v => countDecimalPlaces(v) <= getDecimalPlaces(this.account_currency),
            ],
        };

        if (this.is_sell_advert) {
            validations.contact_info = [v => !!v, v => textValidator(v), v => lengthValidator(v)];
            if (!this.has_payment_methods) {
                validations.payment_info = [v => !!v, v => textValidator(v), v => lengthValidator(v)];
            }
        }

        const display_min_amount = formatMoney(this.account_currency, this.advert.min_order_amount_limit, true);
        const display_max_amount = formatMoney(this.account_currency, this.advert.max_order_amount_limit, true);

        const common_messages = [
            localize('Enter a valid amount'),
            localize('Minimum is {{value}} {{currency}}', {
                currency: this.account_currency,
                value: display_min_amount,
            }),
            localize('Maximum is {{value}} {{currency}}', {
                currency: this.account_currency,
                value: display_max_amount,
            }),
            localize('Maximum is {{value}} {{currency}}', {
                currency: this.account_currency,
                value: formatMoney(this.account_currency, this.root_store.general_store.balance, true),
            }),
            localize('Enter a valid amount'),
        ];

        const getInfoMessages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize(
                "{{field_name}} can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;",
                { field_name }
            ),
            localize('{{field_name}} has exceeded maximum length', { field_name }),
        ];

        const mapped_key = {
            contact_info: localize('Contact details'),
            payment_info: localize('Bank details'),
        };

        const errors = {};

        Object.entries(validations).forEach(([key, rules]) => {
            const error_index = rules.findIndex(v => {
                return !v(values[key]);
            });

            if (error_index !== -1) {
                switch (key) {
                    case 'payment_info':
                    case 'contact_info': {
                        errors[key] = getInfoMessages(mapped_key[key])[error_index];
                        break;
                    }
                    default: {
                        errors[key] = common_messages[error_index];
                        break;
                    }
                }
            }
        });

        return errors;
    }

    handleAdvertInfoResponse(response) {
        //TODO: error handling for response
        if (response?.error) return;
        const { p2p_advert_info } = response ?? {};
        if (this.selected_ad_state?.id === p2p_advert_info.id) {
            this.setSelectedAdState(p2p_advert_info);
        }
    }

    subscribeAdvertInfo() {
        this.advert_info_subscription = subscribeWS(
            {
                p2p_advert_info: 1,
                id: this.selected_ad_state.id,
                use_client_limits: 1,
                subscribe: 1,
            },
            [this.handleAdvertInfoResponse]
        );
    }

    registerAdvertIntervalReaction() {
        const disposeAdvertIntervalReaction = reaction(
            () => this.selected_ad_state.id,
            () => {
                if (this.selected_ad_state.id) {
                    this.subscribeAdvertInfo();
                }
            },
            { fireImmediately: true }
        );

        return () => disposeAdvertIntervalReaction();
    }

    unsubscribeAdvertInfo = () => {
        if (this.advert_info_subscription.unsubscribe) {
            this.advert_info_subscription.unsubscribe();
            this.setSelectedAdState({});
        }
    };

    unsubscribeCreateOrder = () => {
        if (this.create_order_subscription.unsubscribe) {
            this.create_order_subscription.unsubscribe();
        }
    };
}
