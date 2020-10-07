import { observable, action } from 'mobx';
import { requestWS } from 'Utils/websocket';
import { localize } from 'Components/i18next';
import { textValidator } from 'Utils/validations';

export default class MyProfileStore {
    @observable advertiser_info = {};
    @observable contact_info = '';
    @observable default_advert_description = '';
    @observable error_message = '';
    @observable form_error = '';
    @observable is_button_loading = false;
    @observable is_loading = true;
    @observable is_submit_success = false;
    @observable nickname = '';
    @observable payment_info = '';

    @action.bound
    getAdvertiserInfo() {
        return new Promise(resolve => {
            requestWS({
                p2p_advertiser_info: 1,
            }).then(response => {
                if (!response.error) {
                    const { p2p_advertiser_info } = response;
                    this.setAdvertiserInfo(p2p_advertiser_info);
                    this.setNickname(p2p_advertiser_info.name);
                    this.setContactInfo(p2p_advertiser_info.contact_info);
                    this.setDefaultAdvertDescription(p2p_advertiser_info.default_advert_description);
                    this.setPaymentInfo(p2p_advertiser_info.payment_info);
                } else {
                    this.setErrorMessage(response.error);
                }
                this.setIsLoading(false);
                resolve();
            });
        });
    }

    @action.bound
    handleSubmit(values) {
        this.setIsButtonLoading(true);

        return new Promise(resolve => {
            requestWS({
                p2p_advertiser_update: 1,
                contact_info: values.contact_info,
                payment_info: values.payment_info,
                default_advert_description: values.default_advert_description,
            }).then(response => {
                if (!response.error) {
                    const { p2p_advertiser_update } = response;
                    this.setContactInfo(p2p_advertiser_update.contact_info);
                    this.setDefaultAdvertDescription(p2p_advertiser_update.default_advert_description);
                    this.setPaymentInfo(p2p_advertiser_update.payment_info);
                    this.setIsSubmitSuccess(true);
                } else {
                    this.setFormError(response.error);
                }
                this.setIsButtonLoading(false);

                setTimeout(() => {
                    this.setIsSubmitSuccess(false);
                }, 3000);

                resolve();
            });
        });
    }

    @action.bound
    setAdvertiserInfo(advertiser_info) {
        this.advertiser_info = advertiser_info;
    }

    @action.bound
    setContactInfo(contact_info) {
        this.contact_info = contact_info;
    }

    @action.bound
    setDefaultAdvertDescription(default_advert_description) {
        this.default_advert_description = default_advert_description;
    }

    @action.bound
    setErrorMessage(error_message) {
        this.error_message = error_message;
    }

    @action.bound
    setFormError(form_error) {
        this.form_error = form_error;
    }

    @action.bound
    setIsButtonLoading(is_button_loading) {
        this.is_button_loading = is_button_loading;
    }

    @action.bound
    setIsLoading(is_loading) {
        this.is_loading = is_loading;
    }

    @action.bound
    setIsSubmitSuccess(is_submit_success) {
        this.is_submit_success = is_submit_success;
    }

    @action.bound
    setNickname(nickname) {
        this.nickname = nickname;
    }

    @action.bound
    setPaymentInfo(payment_info) {
        this.payment_info = payment_info;
    }

    @action.bound
    validateForm(values) {
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
    }
}
