import { action, observable, computed } from 'mobx';
import { buy_sell } from '../src/constants/buy-sell';
import { getShortNickname } from 'Utils/string';
import { height_constants } from 'Utils/height_constants';
import { localize } from 'Components/i18next';
import { requestWS } from 'Utils/websocket';

export default class AdvertiserPageStore {
    constructor(root_store) {
        this.root_store = root_store;
        this.general_store = this.root_store.general_store;
    }

    @observable active_index = 0;
    @observable ad = null;
    @observable advertiser_first_name = '';
    @observable advertiser_last_name = '';
    @observable advertiser_info = {};
    @observable adverts = [];
    @observable counterparty_type = buy_sell.BUY;
    @observable api_error_message = '';
    @observable form_error_message = '';
    @observable is_loading = true;
    @observable is_submit_disabled = true;
    @observable show_ad_popup = false;
    @observable submitForm = () => {};

    height_values = [
        height_constants.screen,
        height_constants.advertiser_page_content,
        height_constants.core_header,
        height_constants.core_footer,
        height_constants.filters,
        height_constants.filters_margin,
        height_constants.page_overlay_header,
        height_constants.page_overlay_content_padding,
        height_constants.table_header,
        height_constants.tabs,
    ];
    item_height = 56;
    props = {};

    @computed
    get account_currency() {
        return this.props?.selected_advert.account_currency;
    }

    @computed
    get advertiser_details() {
        return this.props?.selected_advert.advertiser_details || {};
    }

    @computed
    get advertiser_details_id() {
        return this.props?.selected_advert.advertiser_details.id;
    }

    @computed
    get advertiser_details_name() {
        return this.props?.selected_advert.advertiser_details.name;
    }

    @computed
    get advertiser_full_name() {
        return `${this.advertiser_first_name} ${this.advertiser_last_name}`;
    }

    @computed
    get modal_title() {
        if (this.counterparty_type === buy_sell.BUY) {
            return localize('Buy {{ currency }}', { currency: this.account_currency });
        } else {
            return localize('Sell {{ currency }}', { currency: this.account_currency });
        }
    }

    @computed
    get short_name() {
        return getShortNickname(this.advertiser_details_name);
    }

    @action.bound
    getAdvertiserAdverts() {
        requestWS({
            p2p_advert_list: 1,
            counterparty_type: this.counterparty_type,
            advertiser_id: this.advertiser_details_id,
        }).then(response => {
            if (!response.error) {
                const { list } = response.p2p_advert_list;
                this.setAdverts(list);
            } else {
                this.setErrorMessage(response.error);
            }
        });
    }

    @action.bound
    getAdvertiserInfo() {
        this.setIsLoading(true);

        requestWS({
            p2p_advertiser_info: 1,
            id: this.advertiser_details_id,
        }).then(response => {
            if (!response.error) {
                const { p2p_advertiser_info } = response;

                this.setAdvertiserInfo(p2p_advertiser_info);
                this.setAdvertiserFirstName(p2p_advertiser_info.first_name);
                this.setAdvertiserLastName(p2p_advertiser_info.last_name);
            } else {
                this.setErrorMessage(response.error);
            }
            this.setIsLoading(false);
        });
    }

    @action.bound
    handleTabItemClick(idx) {
        this.setActiveIndex(idx);
        if (idx === 0) {
            this.setCounterpartyType(buy_sell.BUY);
        } else {
            this.setCounterpartyType(buy_sell.SELL);
        }
    }

    @action.bound
    onCancelClick() {
        this.setShowAdPopup(false);
    }

    @action.bound
    onConfirmClick(order_info) {
        const nav = { location: 'buy_sell' };
        this.props.navigate('orders', { order_info, nav });
    }

    @action.bound
    onMount() {
        this.getAdvertiserAdverts();
        this.getAdvertiserInfo();
    }

    @action.bound
    onTabChange() {
        this.getAdvertiserAdverts();
    }

    @action.bound
    setActiveIndex(active_index) {
        this.active_index = active_index;
    }

    @action.bound
    setAd(ad) {
        this.ad = ad;
    }

    @action.bound
    setAdvertiserFirstName(advertiser_first_name) {
        this.advertiser_first_name = advertiser_first_name;
    }

    @action.bound
    setAdvertiserLastName(advertiser_last_name) {
        this.advertiser_last_name = advertiser_last_name;
    }

    @action.bound
    setAdvertiserInfo(advertiser_info) {
        this.advertiser_info = advertiser_info;
    }

    setAdvertiserPageProps(props) {
        this.props = props;
    }

    @action.bound
    setAdverts(adverts) {
        this.adverts = adverts;
    }

    @action.bound
    setCounterpartyType(counterparty_type) {
        this.counterparty_type = counterparty_type;
    }

    @action.bound
    setErrorMessage(api_error_message) {
        this.api_error_message = api_error_message;
    }

    @action.bound
    setFormErrorMessage(form_error_message) {
        this.form_error_message = form_error_message;
    }

    @action.bound
    setIsLoading(is_loading) {
        this.is_loading = is_loading;
    }

    @action.bound
    setIsSubmitDisabled(is_submit_disabled) {
        this.is_submit_disabled = is_submit_disabled;
    }

    @action.bound
    setShowAdPopup(show_ad_popup) {
        this.show_ad_popup = show_ad_popup;
    }

    @action.bound
    setSubmitForm(submitFormFn) {
        this.submitForm = submitFormFn;
    }

    @action.bound
    showAdPopup(advert) {
        if (!this.general_store.is_advertiser) {
            this.props.showVerification();
        } else {
            this.setAd(advert);
            this.setShowAdPopup(true);
        }
    }
}
