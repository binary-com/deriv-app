import * as React from 'react';
import { Formik, Form } from 'formik';
import { Button, Div100vhContainer, Modal, Text, ThemedScrollbars } from '@deriv/components';
import { useP2PSettings } from '@deriv/hooks';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { api_error_codes } from 'Constants/api-error-codes';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores';
import { ad_type } from 'Constants/floating-rate';
import { generateErrorDialogTitle, generateErrorDialogBody } from 'Utils/adverts';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import AdWizard from './ad-wizard';
import './edit-ad-form.scss';

const EditAdFormWrapper = ({ children }) => {
    if (isMobile()) {
        return <Div100vhContainer height_offset='auto'>{children}</Div100vhContainer>;
    }

    return children;
};

const EditAdForm = () => {
    const { my_ads_store, my_profile_store } = useStores();
    const steps = [
        { header: { title: 'Edit ad type and amount' } },
        { header: { title: 'Edit payment details' } },
        { header: { title: 'Edit ad conditions' } },
    ];

    const {
        amount_display,
        contact_info,
        description,
        max_order_amount_display,
        min_order_amount_display,
        order_expiry_period,
        payment_method_names,
        payment_method_details,
        rate_display,
        type,
        is_active,
        rate_type,
    } = my_ads_store.p2p_advert_information;

    const is_buy_advert = type === buy_sell.BUY;
    const [selected_methods, setSelectedMethods] = React.useState([]);
    const { useRegisterModalProps } = useModalManagerContext();
    const { p2p_settings } = useP2PSettings();

    // when editing payment methods in creating an ad, once user declines to save their payment method, flow is to close all add payment method modals
    useRegisterModalProps({
        key: 'CancelAddPaymentMethodModal',
        props: {
            should_hide_all_modals_on_cancel: true,
        },
    });

    const setInitialAdRate = () => {
        if (my_ads_store.required_ad_type !== my_ads_store.selected_ad_type) {
            if (my_ads_store.required_ad_type === ad_type.FLOAT) {
                return is_buy_advert ? '-0.01' : '+0.01';
            }
            return '';
        }
        return rate_display;
    };

    const is_api_error = [api_error_codes.ADVERT_SAME_LIMITS, api_error_codes.DUPLICATE_ADVERT].includes(
        my_ads_store.error_code
    );

    React.useEffect(() => {
        my_profile_store.getAdvertiserPaymentMethods();
        my_ads_store.setIsEditAdErrorModalVisible(false);
        my_ads_store.setEditAdFormError('');

        if (payment_method_names && !payment_method_details) {
            const selected_payment_method_values = [];
            payment_method_names?.forEach(pm => {
                my_profile_store.getPaymentMethodValue(pm);
                if (my_profile_store.payment_method_value) {
                    selected_payment_method_values.push(my_profile_store.payment_method_value);
                    my_ads_store.payment_method_names.push(my_profile_store.payment_method_value);
                }
            });
            setSelectedMethods(selected_payment_method_values);
        }
        if (payment_method_details) {
            Object.entries(payment_method_details)?.map(pm => {
                selected_methods.push(pm[0]);
                my_ads_store.payment_method_ids.push(pm[0]);
            });
        }
        return () => {
            my_ads_store.setApiErrorCode(null);
            my_ads_store.setShowEditAdForm(false);
            my_ads_store.payment_method_ids = [];
            my_ads_store.payment_method_names = [];
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    contact_info,
                    description,
                    float_rate_offset_limit: p2p_settings.float_rate_offset_limit_string,
                    is_active: rate_type !== p2p_settings.rate_type && p2p_settings.reached_target_date ? 1 : is_active,
                    max_transaction: max_order_amount_display,
                    min_transaction: min_order_amount_display,
                    offer_amount: amount_display,
                    // set a max of 1 hour if expiry period is more than 1 hour
                    order_completion_time: order_expiry_period > 3600 ? '3600' : order_expiry_period.toString(),
                    rate_type: setInitialAdRate(),
                    reached_target_date: p2p_settings.reached_target_date,
                    type,
                }}
                onSubmit={my_ads_store.onClickSaveEditAd}
                validate={my_ads_store.validateEditAdForm}
                validateOnMount
            >
                {() => {
                    return (
                        <div className='edit-ad-form'>
                            <Form noValidate>
                                <ThemedScrollbars className='edit-ad-form__scrollbar' is_scrollbar_hidden={isMobile()}>
                                    <EditAdFormWrapper>
                                        <AdWizard
                                            action='edit'
                                            float_rate_offset_limit_string={p2p_settings.float_rate_offset_limit_string}
                                            rate_type={p2p_settings.rate_type}
                                            steps={steps}
                                        />
                                    </EditAdFormWrapper>
                                </ThemedScrollbars>
                            </Form>
                        </div>
                    );
                }}
            </Formik>
            <Modal
                className='edit-ad-form__modal'
                is_open={my_ads_store.is_edit_ad_error_modal_visible}
                small
                has_close_icon={false}
                title={generateErrorDialogTitle(my_ads_store.error_code)}
            >
                <Modal.Body>
                    <Text as='p' size='xs' color='prominent' className='ad-create-edit-error-modal__message'>
                        {generateErrorDialogBody(my_ads_store.error_code, my_ads_store.edit_ad_form_error)}
                    </Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        has_effect
                        text={localize('{{text}}', { text: is_api_error ? 'Update ad' : 'Ok' })}
                        onClick={() => my_ads_store.setIsEditAdErrorModalVisible(false)}
                        primary
                        large
                    />
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default observer(EditAdForm);
