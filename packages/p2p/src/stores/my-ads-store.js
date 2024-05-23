import { action, observable, makeObservable, computed } from 'mobx';
import { getDecimalPlaces, isMobile } from '@deriv/shared';
import { localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { ad_type } from 'Constants/floating-rate';
import BaseStore from 'Stores/base_store';
import { countDecimalPlaces } from 'Utils/string';
import { decimalValidator, lengthValidator, rangeValidator, textValidator } from 'Utils/validations';
import { requestWS } from 'Utils/websocket';
import { generateErrorDialogTitle } from 'Utils/adverts';
import { api_error_codes } from '../constants/api-error-codes';

export default class MyAdsStore extends BaseStore {
    ad_form_values = null;
    advert_details = null;
    adverts = [];
    api_error = '';
    api_error_message = '';
    current_method = { key: null, is_deleted: false };
    delete_error_message = '';
    edit_ad_form_error = '';
    error_message = '';
    has_more_items_to_load = false;
    min_join_days = 0;
    min_completion_rate = 0;
    is_ad_created_modal_visible = false;
    is_form_loading = false;
    is_table_loading = false;
    is_loading = false;
    p2p_advert_information = {};
    show_ad_form = false;
    should_copy_advert = false;
    selected_ad_id = '';
    should_show_add_payment_method = false;
    show_edit_ad_form = false;
    table_height = 0;
    required_ad_type;
    error_code = '';
    payment_method_ids = [];
    payment_method_names = [];
    preferred_countries = [];

    constructor(root_store) {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super(root_store);

        makeObservable(this, {
            ad_form_values: observable,
            advert_details: observable,
            adverts: observable,
            api_error: observable,
            api_error_message: observable,
            current_method: observable,
            delete_error_message: observable,
            edit_ad_form_error: observable,
            error_message: observable,
            has_more_items_to_load: observable,
            is_ad_created_modal_visible: observable,
            is_form_loading: observable,
            is_table_loading: observable,
            is_loading: observable,
            p2p_advert_information: observable,
            selected_ad_id: observable,
            should_copy_advert: observable,
            should_show_add_payment_method: observable,
            show_ad_form: observable,
            show_edit_ad_form: observable,
            required_ad_type: observable,
            error_code: observable,
            selected_ad_type: computed,
            getAccountStatus: action.bound,
            getAdvertInfo: action.bound,
            handleSubmit: action.bound,
            hideQuickAddModal: action.bound,
            onClickActivateDeactivate: action.bound,
            onClickCopy: action.bound,
            onClickCreate: action.bound,
            onClickDelete: action.bound,
            onClickEdit: action.bound,
            onClickSaveEditAd: action.bound,
            onClickUpdatePaymentMethods: action.bound,
            loadMoreAds: action.bound,
            restrictLength: action.bound,
            restrictDecimalPlace: action.bound,
            showQuickAddModal: action.bound,
            setAdFormValues: action.bound,
            setAdvertDetails: action.bound,
            setAdverts: action.bound,
            setApiError: action.bound,
            setApiErrorMessage: action.bound,
            setApiErrorCode: action.bound,
            setCurrentMethod: action.bound,
            setDeleteErrorMessage: action.bound,
            setEditAdFormError: action.bound,
            setErrorMessage: action.bound,
            setHasMoreItemsToLoad: action.bound,
            setIsAdCreatedModalVisible: action.bound,
            setIsFormLoading: action.bound,
            setIsLoading: action.bound,
            setIsTableLoading: action.bound,
            setMinJoinDays: action.bound,
            setMinCompletionRate: action.bound,
            setP2pAdvertInformation: action.bound,
            setPreferredCountries: action.bound,
            setSelectedAdId: action.bound,
            setShouldCopyAdvert: action.bound,
            setShouldShowAddPaymentMethod: action.bound,
            setShowAdForm: action.bound,
            setShowEditAdForm: action.bound,
            setTableHeight: action.bound,
            onToggleSwitchModal: action.bound,
            setRequiredAdType: action.bound,
            toggleMyAdsRateSwitchModal: action.bound,
            validateCreateAdForm: action.bound,
            validateEditAdForm: action.bound,
        });
    }

    get selected_ad_type() {
        return this.p2p_advert_information.rate_type;
    }

    getAccountStatus() {
        this.setIsLoading(true);
        if (!this.root_store.general_store.is_advertiser) {
            requestWS({ get_account_status: 1 }).then(response => {
                if (response) {
                    if (!response.error) {
                        const { get_account_status = {} } = response || {};
                        const { authentication = {} } = get_account_status;
                        const { document, identity } = authentication;

                        this.root_store.general_store.setPoiStatus(identity.status);
                        this.root_store.general_store.setPoaStatus(document.status);
                    } else {
                        this.setErrorMessage(response.error);
                    }
                    this.setIsLoading(false);
                }
            });
        } else {
            this.setIsLoading(false);
        }
    }

    async getAdvertInfo() {
        this.setIsFormLoading(true);
        await requestWS({
            p2p_advert_info: 1,
            id: this.selected_ad_id,
        })
            .then(response => {
                if (response) {
                    if (!response.error) {
                        const { p2p_advert_info } = response;
                        if (!p2p_advert_info.payment_method_names)
                            p2p_advert_info.payment_method_names = this.payment_method_names;
                        if (!p2p_advert_info.payment_method_details)
                            p2p_advert_info.payment_method_details = this.payment_method_details;
                        this.setP2pAdvertInformation(p2p_advert_info);
                    } else {
                        this.setApiErrorMessage(response.error.message);
                    }
                }
            })
            .finally(() => this.setIsFormLoading(false));
    }

    handleSubmit(values, { setSubmitting }, should_reload_ads = false, adverts_archive_period) {
        this.setApiErrorMessage('');

        const is_sell_ad = values.type === buy_sell.SELL;
        const should_not_show_auto_archive_message = localStorage.getItem('should_not_show_auto_archive_message');

        const create_advert = {
            p2p_advert_create: 1,
            type: values.type,
            eligible_countries: values.eligible_countries,
            amount: Number(values.offer_amount),
            max_order_amount: Number(values.max_transaction),
            min_order_amount: Number(values.min_transaction),
            order_expiry_period: values.order_completion_time,
            rate_type: values.rate_type_string,
            rate: Number(values.rate_type),
            ...(this.min_completion_rate ? { min_completion_rate: Number(this.min_completion_rate) } : {}),
            ...(this.min_join_days ? { min_join_days: Number(this.min_join_days) } : {}),
            ...(this.payment_method_names.length > 0 && !is_sell_ad
                ? { payment_method_names: this.payment_method_names }
                : {}),
            ...(this.payment_method_ids.length > 0 && is_sell_ad
                ? { payment_method_ids: this.payment_method_ids }
                : {}),
        };

        if (values.contact_info && is_sell_ad) {
            create_advert.contact_info = values.contact_info;
        }

        if (values.default_advert_description) {
            create_advert.description = values.default_advert_description;
        }

        requestWS(create_advert).then(response => {
            // If we get an error we should let the user submit the form again else we just go back to the list of ads
            if (response) {
                if (response.error) {
                    this.setApiErrorCode(response.error.code);
                    this.setApiErrorMessage(response.error.message);
                    setSubmitting(false);
                } else if (should_not_show_auto_archive_message !== 'true') {
                    this.setAdvertDetails(response.p2p_advert_create);
                    this.setIsAdCreatedModalVisible(true);
                    this.root_store.general_store.showModal({
                        key: 'AdCreatedModal',
                        props: { adverts_archive_period },
                    });
                    this.setAdFormValues(null);
                    this.setShouldCopyAdvert(false);
                } else if (!this.is_ad_created_modal_visible) {
                    if (!response.p2p_advert_create.is_visible) {
                        this.setAdvertDetails(response.p2p_advert_create);
                    }
                    if (this.advert_details?.visibility_status?.includes(api_error_codes.AD_EXCEEDS_BALANCE)) {
                        this.root_store.general_store.showModal({
                            key: 'AdVisibilityErrorModal',
                            props: { error_code: api_error_codes.AD_EXCEEDS_BALANCE },
                        });
                    } else if (
                        this.advert_details?.visibility_status?.includes(api_error_codes.AD_EXCEEDS_DAILY_LIMIT)
                    ) {
                        this.root_store.general_store.showModal({
                            key: 'AdVisibilityErrorModal',
                            props: { error_code: api_error_codes.AD_EXCEEDS_DAILY_LIMIT },
                        });
                    }
                    this.root_store.general_store.hideModal();
                    this.setShowAdForm(false);
                    this.setAdFormValues(null);
                    this.setShouldCopyAdvert(false);
                }

                if (should_reload_ads) this.loadMoreAds({ startIndex: 0 });
            }
        });
    }

    hideQuickAddModal() {
        this.root_store.general_store.hideModal();
        this.setSelectedAdId(undefined);
    }

    onClickActivateDeactivate(id, is_ad_active, setIsAdvertActive) {
        if (!this.root_store.general_store.is_barred) {
            requestWS({ p2p_advert_update: 1, id, is_active: is_ad_active ? 0 : 1 }).then(response => {
                if (response) {
                    if (response.error) {
                        this.setApiErrorCode(response.error.code);
                        this.root_store.general_store.showModal({
                            key: 'ErrorModal',
                            props: {
                                has_close_icon: false,
                                error_message: response.error.message,
                                error_modal_title: generateErrorDialogTitle(this.error_code),
                                width: isMobile() ? '90rem' : '40rem',
                            },
                        });
                    } else {
                        setIsAdvertActive(!!response.p2p_advert_update.is_active);
                        const updated_items = this.adverts.map(ad =>
                            ad.id === response.p2p_advert_update.id ? response.p2p_advert_update : ad
                        );
                        this.setAdverts(updated_items);
                    }
                }
                this.setSelectedAdId('');
            });
        }
    }

    async onClickCopy(country_list, id, is_copy_advert_modal_visible) {
        this.setSelectedAdId(id);

        if (is_copy_advert_modal_visible) {
            await this.getAdvertInfo();
            this.root_store.general_store.showModal({
                key: 'CopyAdvertModal',
                props: { advert: this.p2p_advert_information, country_list },
            });
        } else {
            this.getAdvertInfo();
            this.setShowAdForm(true);
            this.setShouldCopyAdvert(true);
        }
    }

    onClickCreate() {
        this.setShowAdForm(true);
    }

    onClickDelete(id) {
        const { general_store } = this.root_store;

        if (!general_store.is_barred) {
            requestWS({ p2p_advert_info: 1, id }).then(response => {
                if (!response?.error) {
                    const { p2p_advert_info } = response;

                    this.setSelectedAdId(id);

                    if (p2p_advert_info.active_orders > 0) {
                        this.setDeleteErrorMessage(
                            localize(
                                'You have open orders for this ad. Complete all open orders before deleting this ad.'
                            )
                        );
                        general_store.showModal({
                            key: 'MyAdsDeleteErrorModal',
                            props: {},
                        });
                    } else {
                        general_store.showModal({ key: 'MyAdsDeleteModal', props: {} });
                    }
                }
            });
        }
    }

    onClickEdit(id, rate_type) {
        if (!this.root_store.general_store.is_barred) {
            this.setSelectedAdId(id);
            this.setRequiredAdType(rate_type);
            this.getAdvertInfo();
            this.setShowEditAdForm(true);
        }
    }

    onClickSaveEditAd(values, { setSubmitting }) {
        const is_sell_ad = values.type === buy_sell.SELL;
        const update_advert = {
            p2p_advert_update: 1,
            id: this.selected_ad_id,
            eligible_countries: values.eligible_countries,
            max_order_amount: Number(values.max_transaction),
            min_order_amount: Number(values.min_transaction),
            order_expiry_period: values.order_completion_time,
            rate_type: this.required_ad_type,
            rate: Number(values.rate_type),
            min_completion_rate: Number(this.min_completion_rate) > 0 ? Number(this.min_completion_rate) : null,
            min_join_days: Number(this.min_join_days) > 0 ? Number(this.min_join_days) : null,
            ...(this.payment_method_names.length > 0 && !is_sell_ad
                ? { payment_method_names: this.payment_method_names }
                : {}),
            ...(this.payment_method_ids.length > 0 && is_sell_ad
                ? { payment_method_ids: this.payment_method_ids }
                : {}),
        };

        if (values.contact_info && is_sell_ad) {
            update_advert.contact_info = values.contact_info;
        }

        if (values.default_advert_description) {
            update_advert.description = values.default_advert_description;
        }
        if (values.reached_target_date) {
            update_advert.is_active = values.is_active;
        }

        requestWS(update_advert).then(response => {
            // If there's an error, let the user submit the form again.
            if (response) {
                if (response.error) {
                    setSubmitting(false);
                    this.setApiErrorCode(response.error.code);
                    this.setEditAdFormError(response.error.message);
                } else {
                    this.setShowEditAdForm(false);
                }
            }
        });
    }

    onClickUpdatePaymentMethods(id, is_buy_advert) {
        this.setIsTableLoading(true);
        requestWS({
            p2p_advert_update: 1,
            id,
            ...(this.payment_method_names.length > 0 && is_buy_advert
                ? { payment_method_names: this.payment_method_names }
                : {}),
            ...(this.payment_method_ids.length > 0 && !is_buy_advert
                ? { payment_method_ids: this.payment_method_ids }
                : {}),
        }).then(response => {
            if (!response.error) {
                this.loadMoreAds({ startIndex: 0 });
                this.hideQuickAddModal();
            } else {
                this.root_store.general_store.hideModal();
                this.root_store.general_store.showModal({
                    key: 'ErrorModal',
                    props: {
                        has_close_icon: false,
                        error_message: response.error.message,
                        error_modal_title: generateErrorDialogTitle(this.error_code),
                        width: isMobile() ? '90rem' : '40rem',
                    },
                });
            }
            this.setIsTableLoading(false);
        });
    }

    loadMoreAds({ startIndex }, is_initial_load = false) {
        if (is_initial_load) {
            this.setIsTableLoading(true);
            this.setApiErrorMessage('');
        }
        const { general_store } = this.root_store;
        return new Promise(resolve => {
            requestWS({
                p2p_advertiser_adverts: 1,
                offset: startIndex,
                limit: general_store.list_item_limit,
            }).then(response => {
                if (!response.error) {
                    const { list } = response.p2p_advertiser_adverts;
                    const is_first_page = startIndex === 0;
                    const adverts_list = is_first_page ? list : [...this.adverts, ...list];
                    this.setHasMoreItemsToLoad(list.length >= general_store.list_item_limit);
                    this.setAdverts(adverts_list);
                } else if (response.error.code === api_error_codes.PERMISSION_DENIED) {
                    general_store.setIsBlocked(true);
                } else if (response.error.code !== api_error_codes.ADVERTISER_NOT_REGISTERED) {
                    this.setApiErrorMessage(response.error.message);
                }

                this.setIsTableLoading(false);
                resolve();
            });
        });
    }

    restrictLength = (e, handleChange, max_characters = 15) => {
        // typing more than 15 characters will break the layout
        // max doesn't disable typing, so we will use this to restrict length
        if (e.target.value.length > max_characters) {
            e.target.value = e.target.value.slice(0, max_characters);
            return;
        }
        handleChange(e);
    };

    restrictDecimalPlace = (e, handleChangeCallback) => {
        const pattern = new RegExp(/^[+-]?\d{0,4}(\.\d{0,2})?$/);
        if (e.target.value.length > 8) {
            e.target.value = e.target.value.slice(0, 8);
            return;
        }
        if (pattern.test(e.target.value)) {
            handleChangeCallback(e);
        }
    };

    showQuickAddModal(advert) {
        this.setSelectedAdId(advert);
        this.root_store.general_store.showModal({ key: 'QuickAddModal', props: { advert } });
    }

    setAdFormValues(ad_form_values) {
        this.ad_form_values = ad_form_values;
    }

    setAdvertDetails(advert_details) {
        this.advert_details = advert_details;
    }

    setAdverts(adverts) {
        this.adverts = adverts;
    }

    setApiError(api_error) {
        this.api_error = api_error;
    }

    setApiErrorMessage(api_error_message) {
        this.api_error_message = api_error_message;
    }

    setApiErrorCode(error_code) {
        this.error_code = error_code;
    }

    setCurrentMethod(current_method) {
        this.current_method = current_method;
    }

    setDeleteErrorMessage(delete_error_message) {
        this.delete_error_message = delete_error_message;
    }

    setEditAdFormError(edit_ad_form_error) {
        this.edit_ad_form_error = edit_ad_form_error;
    }

    setErrorMessage(error_message) {
        this.error_message = error_message;
    }

    setHasMoreItemsToLoad(has_more_items_to_load) {
        this.has_more_items_to_load = has_more_items_to_load;
    }

    setIsAdCreatedModalVisible(is_ad_created_modal_visible) {
        this.is_ad_created_modal_visible = is_ad_created_modal_visible;
    }

    setShouldCopyAdvert(should_copy_advert) {
        this.should_copy_advert = should_copy_advert;
    }

    setIsFormLoading(is_form_loading) {
        this.is_form_loading = is_form_loading;
    }

    setIsLoading(is_loading) {
        this.is_loading = is_loading;
    }

    setIsTableLoading(is_table_loading) {
        this.is_table_loading = is_table_loading;
    }

    setMinJoinDays(min_join_days) {
        this.min_join_days = min_join_days;
    }

    setMinCompletionRate(min_completion_rate) {
        this.min_completion_rate = min_completion_rate;
    }

    setP2pAdvertInformation(p2p_advert_information) {
        this.p2p_advert_information = p2p_advert_information;
    }

    setPreferredCountries(preferred_countries) {
        this.preferred_countries = preferred_countries;
    }

    setSelectedAdId(selected_ad_id) {
        this.selected_ad_id = selected_ad_id;
    }

    setShouldShowAddPaymentMethod(should_show_add_payment_method) {
        this.should_show_add_payment_method = should_show_add_payment_method;
    }

    setShowAdForm(show_ad_form) {
        this.show_ad_form = show_ad_form;
    }

    setShowEditAdForm(show_edit_ad_form) {
        this.show_edit_ad_form = show_edit_ad_form;
    }

    setTableHeight(table_height) {
        this.table_height = table_height;
    }

    onToggleSwitchModal(ad_id) {
        this.setSelectedAdId(ad_id);
        this.getAdvertInfo();
    }

    setRequiredAdType(change_ad_type) {
        this.required_ad_type = change_ad_type;
    }

    validateCreateAdForm(values) {
        const { general_store } = this.root_store;
        const validations = {
            default_advert_description: [v => !v || lengthValidator(v), v => !v || textValidator(v)],
            max_transaction: [
                v => !!v,
                v => !isNaN(v),
                v =>
                    v > 0 &&
                    decimalValidator(v) &&
                    countDecimalPlaces(v) <= getDecimalPlaces(general_store.external_stores.client.currency),
                v => (values.offer_amount ? +v <= values.offer_amount : true),
                v => (values.min_transaction ? +v >= values.min_transaction : true),
            ],
            min_transaction: [
                v => !!v,
                v => !isNaN(v),
                v =>
                    v > 0 &&
                    decimalValidator(v) &&
                    countDecimalPlaces(v) <= getDecimalPlaces(general_store.external_stores.client.currency),
                v => (values.offer_amount ? +v <= values.offer_amount : true),
                v => (values.max_transaction ? +v <= values.max_transaction : true),
            ],
            offer_amount: [
                v => !!v,
                v => !isNaN(v),
                v =>
                    v > 0 &&
                    decimalValidator(v) &&
                    countDecimalPlaces(v) <= getDecimalPlaces(general_store.external_stores.client.currency),
                v => (values.min_transaction ? +v >= values.min_transaction : true),
                v => (values.max_transaction ? +v >= values.max_transaction : true),
            ],
            rate_type: [
                v => !!v,
                v => !isNaN(v),
                v =>
                    values.rate_type_string === ad_type.FIXED
                        ? v > 0 &&
                          decimalValidator(v) &&
                          countDecimalPlaces(v) <=
                              general_store.external_stores.client.local_currency_config.decimal_places
                        : true,
                v =>
                    values.rate_type_string === ad_type.FLOAT
                        ? rangeValidator(parseFloat(v), values.float_rate_offset_limit)
                        : true,
            ],
        };

        if (values.type === buy_sell.SELL) {
            validations.contact_info = [v => !!v, v => textValidator(v), v => lengthValidator(v)];
        }

        const mapped_key = {
            contact_info: localize('Contact details'),
            default_advert_description: localize('Instructions'),
            max_transaction: localize('Max limit'),
            min_transaction: localize('Min limit'),
            offer_amount: localize('Amount'),
            payment_info: localize('Payment instructions'),
            rate_type: values.rate_type_string === ad_type.FLOAT ? localize('Floating rate') : localize('Fixed rate'),
        };

        const getCommonMessages = field_name => [localize('{{field_name}} is required', { field_name })];

        const getContactInfoMessages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize(
                "{{field_name}} can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;",
                { field_name }
            ),
            localize('{{field_name}} has exceeded maximum length', { field_name }),
        ];

        const getDefaultAdvertDescriptionMessages = field_name => [
            localize('{{field_name}} has exceeded maximum length', { field_name }),
            localize(
                "{{field_name}} can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;",
                { field_name }
            ),
        ];

        const getOfferAmountMessages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize('Enter a valid amount'),
            localize('Enter a valid amount'),
            localize('{{field_name}} should not be below Min limit', { field_name }),
            localize('{{field_name}} should not be below Max limit', { field_name }),
        ];

        const getMaxTransactionLimitMessages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize('Only numbers are allowed.'),
            localize('Only up to 2 decimals are allowed.'),
            localize('{{field_name}} should not exceed Amount', { field_name }),
            localize('{{field_name}} should not be below Min limit', { field_name }),
        ];

        const getMinTransactionLimitMessages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize('Only numbers are allowed.'),
            localize('Only up to 2 decimals are allowed.'),
            localize('{{field_name}} should not exceed Amount', { field_name }),
            localize('{{field_name}} should not exceed Max limit', { field_name }),
        ];

        const getPriceRateMessages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize('Enter a valid amount'),
            localize('Enter a valid amount'),
            localize("Enter a value that's within -{{limit}}% to +{{limit}}%", {
                limit: values.float_rate_offset_limit,
            }),
        ];

        const errors = {};

        Object.entries(validations).forEach(([key, rules]) => {
            const error_index = rules.findIndex(v => !v(values[key]));
            if (error_index !== -1) {
                switch (key) {
                    case 'contact_info':
                        errors[key] = getContactInfoMessages(mapped_key[key])[error_index];
                        break;
                    case 'default_advert_description':
                        errors[key] = getDefaultAdvertDescriptionMessages(mapped_key[key])[error_index];
                        break;
                    case 'offer_amount':
                        errors[key] = getOfferAmountMessages(mapped_key[key])[error_index];
                        break;
                    case 'max_transaction':
                        errors[key] = getMaxTransactionLimitMessages(mapped_key[key])[error_index];
                        break;
                    case 'min_transaction':
                        errors[key] = getMinTransactionLimitMessages(mapped_key[key])[error_index];
                        break;
                    case 'rate_type':
                        errors[key] = getPriceRateMessages(mapped_key[key])[error_index];
                        break;
                    default:
                        errors[key] = getCommonMessages(mapped_key[key])[error_index];
                }
            }
        });

        return errors;
    }

    validateEditAdForm(values) {
        const { general_store } = this.root_store;
        const validations = {
            description: [v => !v || lengthValidator(v), v => !v || textValidator(v)],
            max_transaction: [
                v => !!v,
                v => !isNaN(v),
                v =>
                    v > 0 &&
                    decimalValidator(v) &&
                    countDecimalPlaces(v) <= getDecimalPlaces(general_store.external_stores.client.currency),
                v => (values.offer_amount ? +v <= values.offer_amount : true),
                v => (values.min_transaction ? +v >= values.min_transaction : true),
            ],
            min_transaction: [
                v => !!v,
                v => !isNaN(v),
                v =>
                    v > 0 &&
                    decimalValidator(v) &&
                    countDecimalPlaces(v) <= getDecimalPlaces(general_store.external_stores.client.currency),
                v => (values.offer_amount ? +v <= values.offer_amount : true),
                v => (values.max_transaction ? +v <= values.max_transaction : true),
            ],
            rate_type: [
                v => !!v,
                v => !isNaN(v),
                v =>
                    this.required_ad_type === ad_type.FIXED
                        ? v > 0 &&
                          decimalValidator(v) &&
                          countDecimalPlaces(v) <=
                              general_store.external_stores.client.local_currency_config.decimal_places
                        : true,
                v =>
                    this.required_ad_type === ad_type.FLOAT
                        ? rangeValidator(parseFloat(v), parseFloat(values.float_rate_offset_limit))
                        : true,
            ],
        };

        if (values.type === buy_sell.SELL) {
            validations.contact_info = [v => !!v, v => textValidator(v), v => lengthValidator(v)];
        }

        const mapped_key = {
            contact_info: localize('Contact details'),
            description: localize('Instructions'),
            max_transaction: localize('Max limit'),
            min_transaction: localize('Min limit'),
            offer_amount: localize('Amount'),
            rate_type: this.required_ad_type === ad_type.FLOAT ? localize('Floating rate') : localize('Fixed rate'),
        };

        const getCommonMessages = field_name => [localize('{{field_name}} is required', { field_name })];

        const getContactInfoMessages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize(
                "{{field_name}} can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;",
                { field_name }
            ),
            localize('{{field_name}} has exceeded maximum length', { field_name }),
        ];

        const getDefaultAdvertDescriptionMessages = field_name => [
            localize('{{field_name}} has exceeded maximum length', { field_name }),
            localize(
                "{{field_name}} can only include letters, numbers, spaces, and any of these symbols: -+.,'#@():;",
                { field_name }
            ),
        ];

        const getMaxTransactionLimitMessages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize('Only numbers are allowed.'),
            localize('Only up to 2 decimals are allowed.'),
            localize('{{field_name}} should not exceed Amount', { field_name }),
            localize('{{field_name}} should not be below Min limit', { field_name }),
        ];

        const getMinTransactionLimitMessages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize('Only numbers are allowed.'),
            localize('Only up to 2 decimals are allowed.'),
            localize('{{field_name}} should not exceed Amount', { field_name }),
            localize('{{field_name}} should not exceed Max limit', { field_name }),
        ];

        const getPriceRateMessages = field_name => [
            localize('{{field_name}} is required', { field_name }),
            localize('Enter a valid amount'),
            localize('Enter a valid amount'),
            localize("Enter a value that's within -{{limit}}% to +{{limit}}%", {
                limit: values.float_rate_offset_limit,
            }),
        ];

        const errors = {};

        Object.entries(validations).forEach(([key, rules]) => {
            const error_index = rules.findIndex(v => !v(values[key]));
            if (error_index !== -1) {
                switch (key) {
                    case 'contact_info':
                        errors[key] = getContactInfoMessages(mapped_key[key])[error_index];
                        break;
                    case 'description':
                        errors[key] = getDefaultAdvertDescriptionMessages(mapped_key[key])[error_index];
                        break;
                    case 'max_transaction':
                        errors[key] = getMaxTransactionLimitMessages(mapped_key[key])[error_index];
                        break;
                    case 'min_transaction':
                        errors[key] = getMinTransactionLimitMessages(mapped_key[key])[error_index];
                        break;
                    case 'rate_type':
                        errors[key] = getPriceRateMessages(mapped_key[key])[error_index];
                        break;
                    default:
                        errors[key] = getCommonMessages(mapped_key[key])[error_index];
                }
            }
        });

        return errors;
    }

    toggleMyAdsRateSwitchModal(change_ad_type, is_open_edit_form) {
        this.setRequiredAdType(change_ad_type);
        if (is_open_edit_form) {
            this.setShowEditAdForm(true);
        }

        this.root_store.general_store.hideModal();
        this.onToggleSwitchModal(this.selected_ad_id);
    }
}
