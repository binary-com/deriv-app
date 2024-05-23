import React from 'react';
import { Field, FormikValues, useFormikContext } from 'formik';
import { Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import AdFormController from 'Pages/my-ads/ad-form-controller';
import { useStores } from 'Stores';
import CreateAdFormPaymentMethods from '../create-ad-form-payment-methods.jsx';
import CreateAdSummary from '../create-ad-summary.jsx';
import OrderTimeSelection from '../order-time-selection';

type TAdPaymentDetailsSection = {
    setIsFormDirty: React.Dispatch<React.SetStateAction<boolean>>;
};

const AdPaymentDetailsSection = ({ setIsFormDirty, ...props }: TAdPaymentDetailsSection) => {
    const { my_ads_store, my_profile_store } = useStores();
    const { errors, isValid, values } = useFormikContext<FormikValues>();
    const [selected_payment_methods, setSelectedPaymentMethods] = React.useState([]);
    const [is_next_btn_disabled, setIsNextBtnDisabled] = React.useState(true);
    const is_sell_advert = values.type === buy_sell.SELL;
    const { payment_method_details, payment_method_names } = my_ads_store.p2p_advert_information;

    React.useEffect(() => {
        const payment_methods_changed = is_sell_advert
            ? !(
                  !!payment_method_details &&
                  selected_payment_methods.every(pm => Object.keys(payment_method_details).includes(pm)) &&
                  selected_payment_methods.length === Object.keys(payment_method_details).length
              )
            : !(
                  !!payment_method_names &&
                  selected_payment_methods?.every(pm => {
                      const method = my_profile_store.getPaymentMethodDisplayName(pm);
                      return payment_method_names.includes(method);
                  }) &&
                  selected_payment_methods.length === payment_method_names.length
              );

        setIsFormDirty(payment_methods_changed);
        setIsNextBtnDisabled(!isValid || !selected_payment_methods?.length);
    }, [selected_payment_methods]);

    return (
        <>
            <CreateAdSummary
                offer_amount={errors.offer_amount ? '' : values.offer_amount}
                price_rate={values.rate_type}
                type={values.type}
            />
            <Field name='order_completion_time'>{({ field }) => <OrderTimeSelection {...field} />}</Field>
            <div className='ad-payment-details-section__label'>
                <Text color='prominent' size='xs'>
                    <Localize i18n_default_text='Payment methods' />
                </Text>
                <Text color='less-prominent' size='xs'>
                    {is_sell_advert ? (
                        <Localize i18n_default_text='You may tap and choose up to 3.' />
                    ) : (
                        <Localize i18n_default_text='You may choose up to 3.' />
                    )}
                </Text>
            </div>
            <CreateAdFormPaymentMethods
                is_sell_advert={is_sell_advert}
                onSelectPaymentMethods={setSelectedPaymentMethods}
            />
            <AdFormController {...props} is_next_btn_disabled={is_next_btn_disabled} />
        </>
    );
};

export default observer(AdPaymentDetailsSection);
