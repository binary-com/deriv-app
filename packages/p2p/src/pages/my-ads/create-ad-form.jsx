import * as React from 'react';
import { Formik, Form } from 'formik';
import { Div100vhContainer, ThemedScrollbars } from '@deriv/components';
import { useP2PSettings } from '@deriv/hooks';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { ad_type } from 'Constants/floating-rate';
import { useStores } from 'Stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import AdWizard from './ad-wizard';
import './create-ad-form.scss';

const CreateAdFormWrapper = ({ children }) => {
    if (isMobile()) {
        return <Div100vhContainer height_offset='auto'>{children}</Div100vhContainer>;
    }
    return children;
};

const CreateAdForm = ({ country_list }) => {
    const { buy_sell_store, general_store, my_ads_store, my_profile_store } = useStores();
    const {
        p2p_settings: {
            adverts_archive_period,
            float_rate_offset_limit_string,
            order_payment_period_string,
            rate_type,
        },
    } = useP2PSettings();
    const { useRegisterModalProps } = useModalManagerContext();
    const steps = [
        { header: { title: localize('Set ad type and amount') } },
        { header: { title: localize('Set payment details') } },
        { header: { title: localize('Set ad conditions') } },
    ];

    // when adding payment methods in creating an ad, once user declines to save their payment method, flow is to close all add payment method modals
    useRegisterModalProps({
        key: 'CancelAddPaymentMethodModal',
        props: {
            should_hide_all_modals_on_cancel: true,
        },
    });

    const onCleanup = () => {
        my_ads_store.setApiErrorMessage('');
        my_ads_store.setShowAdForm(false);
        buy_sell_store.setCreateSellAdFromNoAds(false);
        my_ads_store.payment_method_ids = [];
        my_ads_store.payment_method_names = [];
        my_ads_store.setMinJoinDays(0);
        my_ads_store.setMinCompletionRate(0);
    };

    const onSubmit = (values, { setSubmitting }) => {
        my_ads_store.handleSubmit(values, { setSubmitting }, false, adverts_archive_period);
    };

    React.useEffect(() => {
        my_ads_store.setCurrentMethod({ key: null, is_deleted: false });
        my_profile_store.getPaymentMethodsList();
        my_profile_store.getAdvertiserPaymentMethods();

        return () => {
            onCleanup();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <Formik
                enableReinitialize
                initialValues={{
                    contact_info: general_store.contact_info,
                    default_advert_description: general_store.default_advert_description,
                    eligible_countries: country_list ? Object.keys(country_list) : [],
                    float_rate_offset_limit: float_rate_offset_limit_string,
                    max_transaction: '',
                    min_transaction: '',
                    offer_amount: '',
                    order_completion_time: order_payment_period_string,
                    payment_info: my_ads_store.payment_info,
                    rate_type_string: rate_type,
                    rate_type: rate_type === ad_type.FLOAT ? '-0.01' : '',
                    type: buy_sell_store.create_sell_ad_from_no_ads ? buy_sell.SELL : buy_sell.BUY,
                }}
                onSubmit={onSubmit}
                validate={my_ads_store.validateCreateAdForm}
            >
                {() => {
                    return (
                        <div className='create-ad-form' data-testid='dp2p-create-ad-form_container'>
                            <Form noValidate>
                                <ThemedScrollbars
                                    className='create-ad-form__scrollbar'
                                    is_scrollbar_hidden={isMobile()}
                                >
                                    <CreateAdFormWrapper>
                                        <AdWizard
                                            country_list={country_list}
                                            float_rate_offset_limit_string={float_rate_offset_limit_string}
                                            onClose={() => {
                                                my_ads_store.setShowAdForm(false);
                                            }}
                                            rate_type={rate_type}
                                            steps={steps}
                                        />
                                    </CreateAdFormWrapper>
                                </ThemedScrollbars>
                            </Form>
                        </div>
                    );
                }}
            </Formik>
        </React.Fragment>
    );
};

export default observer(CreateAdForm);
