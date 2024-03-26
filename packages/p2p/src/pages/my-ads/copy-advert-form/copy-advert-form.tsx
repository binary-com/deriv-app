import React from 'react';
import { Formik, Field, FieldProps, Form } from 'formik';
import { Button, InlineMessage, Input, Text } from '@deriv/components';
import { useStore } from '@deriv/stores';
import FloatingRate from 'Components/floating-rate';
import { Localize, localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { ad_type } from 'Constants/floating-rate';
import OrderTimeSelection from 'Pages/my-ads/order-time-selection';
import { useStores } from 'Stores';
import { TAdvertProps } from 'Types';
import CopyAdvertFormTrailingIcon from './copy-advert-from-trailing-icon';

type TCopyAdvertFormProps = {
    advert: TAdvertProps;
    onCancel: () => void;
};

const CopyAdvertForm = ({ advert, onCancel }: TCopyAdvertFormProps) => {
    const {
        client: { currency, local_currency_config },
    } = useStore();
    const local_currency = local_currency_config.currency;
    const { floating_rate_store, general_store, my_ads_store, my_profile_store } = useStores();
    const {
        contact_info,
        description,
        amount_display,
        order_expiry_period,
        payment_method_details,
        payment_method_names,
        rate_display,
        rate_type,
        type,
    } = advert;
    const onClickCancel = () => {
        general_store.showModal({
            key: 'AdCancelModal',
            props: {
                confirm_label: localize('Go back'),
                message: localize("If you choose to cancel, the details you've entered will be lost."),
                onConfirm: onCancel,
                title: localize('Cancel ad creation?'),
            },
        });
    };
    const onSubmit = (values, { setSubmitting }) => {
        my_ads_store.handleSubmit(values, { setSubmitting }, true);
    };

    React.useEffect(() => {
        if (type === buy_sell.SELL) {
            Object.entries(payment_method_details).map(payment_method_detail => {
                my_ads_store.payment_method_ids.push(payment_method_detail[0]);
            });
        } else {
            my_profile_store.payment_methods_list.map(({ text, value }) => {
                if (payment_method_names.includes(text)) my_ads_store.payment_method_names.push(value);
            });
        }

        return () => {
            my_ads_store.payment_method_names = [];
            my_ads_store.payment_method_ids = [];
        };
    }, []);

    return (
        <div className='copy-advert-form'>
            <InlineMessage
                message={
                    <Localize i18n_default_text='Review your settings and create a new ad. Every ad must have unique limits and rates.' />
                }
                type='information'
            />
            <Formik
                initialValues={{
                    contact_info,
                    default_advert_description: description,
                    max_transaction: '',
                    min_transaction: '',
                    offer_amount: amount_display,
                    order_completion_time: order_expiry_period > 3600 ? '3600' : order_expiry_period.toString(),
                    payment_method_names,
                    rate_type: '',
                    type,
                }}
                onSubmit={onSubmit}
                validate={my_ads_store.validateCreateAdForm}
                validateOnMount
            >
                {({ errors, handleChange, isSubmitting, isValid, touched }) => {
                    return (
                        <Form noValidate>
                            <Text color='less-prominent' size='xxs'>
                                <Localize i18n_default_text='Ad type' />
                            </Text>
                            <Text as='div' className='copy-advert-form__field' size='xs'>
                                {type === buy_sell.BUY ? localize('Buy') : localize('Sell')}
                            </Text>
                            <Field name='offer_amount'>
                                {({ field }: FieldProps) => (
                                    <Input
                                        {...field}
                                        data-testid='offer_amount'
                                        data-lpignore='true'
                                        type='text'
                                        error={touched.offer_amount && errors.offer_amount}
                                        label={localize('Total amount')}
                                        trailing_icon={<CopyAdvertFormTrailingIcon label={currency} />}
                                        is_relative_hint
                                    />
                                )}
                            </Field>
                            <Field name='rate_type'>
                                {({ field }: FieldProps) =>
                                    rate_type === ad_type.FLOAT ? (
                                        <FloatingRate
                                            className='copy-advert-form__floating-rate'
                                            data_testid='float_rate_type'
                                            error_messages={errors.rate_type}
                                            fiat_currency={currency}
                                            local_currency={local_currency}
                                            onChange={handleChange}
                                            offset={{
                                                upper_limit: parseInt(floating_rate_store.float_rate_offset_limit),
                                                lower_limit: parseInt(floating_rate_store.float_rate_offset_limit) * -1,
                                            }}
                                            required
                                            change_handler={e => {
                                                my_ads_store.restrictDecimalPlace(e, handleChange);
                                            }}
                                            {...field}
                                        />
                                    ) : (
                                        <Input
                                            {...field}
                                            data-testid='fixed_rate_type'
                                            data-lpignore='true'
                                            type='text'
                                            error={touched.rate_type && errors.rate_type}
                                            label={localize('Fixed Rate')}
                                            trailing_icon={<CopyAdvertFormTrailingIcon label={local_currency} />}
                                            required
                                        />
                                    )
                                }
                            </Field>
                            <Field name='min_transaction'>
                                {({ field }: FieldProps) => (
                                    <Input
                                        {...field}
                                        data-lpignore='true'
                                        data-testid='min_transaction'
                                        label={localize('Min order')}
                                        type='text'
                                        error={touched.min_transaction && errors.min_transaction}
                                        trailing_icon={<CopyAdvertFormTrailingIcon label={currency} />}
                                        required
                                    />
                                )}
                            </Field>
                            <Field name='max_transaction'>
                                {({ field }: FieldProps) => (
                                    <Input
                                        {...field}
                                        data-testid='max_transaction'
                                        data-lpignore='true'
                                        label={localize('Max order')}
                                        type='text'
                                        error={touched.max_transaction && errors.max_transaction}
                                        trailing_icon={<CopyAdvertFormTrailingIcon label={currency} />}
                                        required
                                    />
                                )}
                            </Field>
                            <Text color='less-prominent' size='xxs'>
                                <Localize i18n_default_text='Instructions' />
                            </Text>
                            <Field name='default_advert_description'>
                                {({ field }: FieldProps) => (
                                    <Input {...field} className='copy-advert-form__field' type='text' readOnly />
                                )}
                            </Field>
                            <Text color='less-prominent' size='xxs'>
                                <Localize i18n_default_text='Order must be completed in' />
                            </Text>
                            <Field name='order_completion_time'>
                                {({ field }: FieldProps) => (
                                    <OrderTimeSelection
                                        {...field}
                                        classNameDisplay='copy-advert-form__dropdown-display'
                                        classNameIcon='copy-advert-form__dropdown-icon'
                                        is_label_hidden
                                    />
                                )}
                            </Field>
                            <Text color='less-prominent' size='xxs'>
                                <Localize i18n_default_text='Payment methods' />
                            </Text>
                            <Text as='div' className='copy-advert-form__field' size='xs'>
                                {payment_method_names.join(', ')}
                            </Text>
                            <div className='copy-advert-form__container'>
                                <Button type='button' has_effect onClick={onClickCancel} secondary large>
                                    <Localize i18n_default_text='Cancel' />
                                </Button>
                                <Button has_effect is_disabled={isSubmitting || !isValid} primary large>
                                    <Localize i18n_default_text='Create ad' />
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

export default CopyAdvertForm;
