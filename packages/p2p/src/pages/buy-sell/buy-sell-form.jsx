import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { Input, Text, Tooltip } from '@deriv/components';
import { useP2PAdvertiserPaymentMethods, useP2PExchangeRate } from '@deriv/hooks';
import { getDecimalPlaces, isDesktop, isMobile } from '@deriv/shared';
import { reaction } from 'mobx';
import { observer, Observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { ad_type } from 'Constants/floating-rate';
import { useStores } from 'Stores';
import BuySellFormReceiveAmount from './buy-sell-form-receive-amount.jsx';
import PaymentMethodCard from 'Components/payment-method-card';
import { floatingPointValidator } from 'Utils/validations';
import { countDecimalPlaces } from 'Utils/string';
import { formatTime } from 'Utils/orders';
import { generateEffectiveRate, setDecimalPlaces, roundOffDecimal, removeTrailingZeros } from 'Utils/format-value';
import PaymentMethodIcon from 'Components/payment-method-icon';
import './buy-sell-form.scss';

const BuySellForm = props => {
    const { advertiser_page_store, buy_sell_store, general_store, my_profile_store } = useStores();
    const [selected_methods, setSelectedMethods] = React.useState([]);
    const { data: p2p_advertiser_payment_methods } = useP2PAdvertiserPaymentMethods();
    const { stacked_modal } = useModalManagerContext();

    const { advert, has_rate_changed, setHasRateChanged, setPageFooterParent } = props;
    const {
        advertiser_details,
        description,
        effective_rate: market_rate,
        local_currency,
        max_order_amount_limit_display,
        min_order_amount_limit,
        min_order_amount_limit_display,
        order_expiry_period,
        payment_method_names,
        price,
        rate,
        rate_type,
    } = advert || {};

    const exchange_rate = useP2PExchangeRate(local_currency);
    const order_completion_time = order_expiry_period / 60;
    const [input_amount, setInputAmount] = React.useState(min_order_amount_limit);
    const [current_effective_rate, setCurrentEffectiveRate] = React.useState(0);
    const [changed_rate, setChangedRate] = React.useState(undefined);

    React.useEffect(() => {
        buy_sell_store.setFormProps({ ...props, input_amount });
    }, [props, buy_sell_store, input_amount]);

    const { effective_rate, display_effective_rate } = generateEffectiveRate({
        price,
        rate_type,
        rate,
        local_currency,
        exchange_rate,
        market_rate,
    });

    const { advertiser_buy_limit, advertiser_sell_limit, balance } = general_store;

    const should_disable_field =
        !buy_sell_store.is_buy_advert && (parseFloat(balance) === 0 || parseFloat(balance) < min_order_amount_limit);

    const style = {
        borderColor: 'var(--brand-secondary)',
        borderWidth: '2px',
        cursor: should_disable_field ? 'not-allowed' : 'pointer',
    };

    const calculated_rate = removeTrailingZeros(roundOffDecimal(effective_rate, setDecimalPlaces(effective_rate, 6)));

    const is_float = rate_type === ad_type.FLOAT;

    React.useEffect(
        () => {
            my_profile_store.setShouldShowAddPaymentMethodForm(false);
            my_profile_store.setSelectedPaymentMethod('');
            my_profile_store.setSelectedPaymentMethodDisplayName('');
            buy_sell_store.setHasPaymentMethods(!!payment_method_names);
            setCurrentEffectiveRate(effective_rate);

            const disposeReceiveAmountReaction = reaction(
                () => buy_sell_store.receive_amount,
                () => {
                    if (isMobile() && typeof setPageFooterParent === 'function') {
                        setPageFooterParent(<BuySellFormReceiveAmount />);
                    }
                }
            );

            if (!my_profile_store.advertiser_has_payment_methods) {
                my_profile_store.getPaymentMethodsList();
            }

            advertiser_page_store.setFormErrorMessage('');
            buy_sell_store.setInitialReceiveAmount(calculated_rate);

            return () => {
                disposeReceiveAmountReaction();
            };
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    );

    React.useEffect(() => {
        const receive_amount = input_amount * calculated_rate;
        buy_sell_store.setReceiveAmount(receive_amount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input_amount, calculated_rate]);

    // This is to prevent the rate from changing when the MarketRateChangeErrorModal is shown on mobile and counterparty
    // changes the rate. This is to ensure that the rate is not changed when the user is in the middle of placing an order.
    React.useEffect(() => {
        if (
            isMobile() &&
            has_rate_changed &&
            current_effective_rate !== effective_rate &&
            stacked_modal?.key !== 'MarketRateChangeErrorModal'
        ) {
            setChangedRate(effective_rate);
        }
    }, [current_effective_rate, effective_rate, has_rate_changed, stacked_modal]);

    React.useEffect(() => {
        if (current_effective_rate !== effective_rate && current_effective_rate !== 0) setHasRateChanged(true);
    }, [current_effective_rate, effective_rate, setHasRateChanged]);

    const default_effective_rate = changed_rate ?? effective_rate;

    const onClickPaymentMethodCard = payment_method => {
        if (!should_disable_field) {
            if (!buy_sell_store.payment_method_ids.includes(payment_method.id)) {
                if (buy_sell_store.payment_method_ids.length < 3) {
                    buy_sell_store.payment_method_ids.push(payment_method.id);
                    setSelectedMethods([...selected_methods, payment_method.id]);
                }
            } else {
                buy_sell_store.payment_method_ids = buy_sell_store.payment_method_ids.filter(
                    payment_method_id => payment_method_id !== payment_method.id
                );
                setSelectedMethods(selected_methods.filter(i => i !== payment_method.id));
            }
        }
    };

    const { errors, getFieldProps, isSubmitting, isValid, validateForm, setFieldValue, submitForm, touched } =
        useFormik({
            enableReinitialize: true,
            validate: buy_sell_store.validatePopup,
            validateOnMount: !should_disable_field,
            initialValues: {
                amount: min_order_amount_limit,
                contact_info: buy_sell_store.temp_contact_info || general_store.contact_info,
                payment_info: buy_sell_store.temp_payment_info || general_store.payment_info,
                rate: is_float ? default_effective_rate : null,
            },
            initialErrors: buy_sell_store.is_sell_advert ? { contact_info: true } : {},
            onSubmit: (...args) => buy_sell_store.handleSubmit(...args),
        });

    const getAdvertiserMaxLimit = () => {
        if (buy_sell_store.is_buy_advert) {
            if (advertiser_buy_limit < max_order_amount_limit_display) return roundOffDecimal(advertiser_buy_limit);
        } else if (advertiser_sell_limit < max_order_amount_limit_display)
            return roundOffDecimal(advertiser_sell_limit);
        return max_order_amount_limit_display;
    };

    React.useEffect(() => {
        buy_sell_store.form_props.setIsSubmitDisabled(
            !isValid ||
                isSubmitting ||
                (buy_sell_store.is_sell_advert && payment_method_names && selected_methods.length < 1)
        );
    }, [
        isValid,
        isSubmitting,
        selected_methods.length,
        buy_sell_store.is_sell_advert,
        payment_method_names,
        buy_sell_store.form_props,
    ]);

    React.useEffect(() => {
        buy_sell_store.setSubmitForm(submitForm);
    }, [submitForm]);

    return (
        <React.Fragment>
            <form noValidate onSubmit={submitForm}>
                <div className='buy-sell-form__content'>
                    <div className='buy-sell-form__field-wrapper'>
                        <div className='buy-sell-form__field'>
                            <Text as='p' color='less-prominent' size='xxs'>
                                {buy_sell_store.is_buy_advert ? (
                                    <Localize i18n_default_text='Seller' />
                                ) : (
                                    <Localize i18n_default_text='Buyer' />
                                )}
                            </Text>
                            <Text as='p' size='xs'>
                                {advertiser_details?.name}
                            </Text>
                        </div>
                        <div className='buy-sell-form__field'>
                            <div
                                className={classNames('buy-sell-form__field-rate', {
                                    'buy-sell-form__field-rate--floating': is_float,
                                })}
                            >
                                <Text as='p' color='less-prominent' size='xxs'>
                                    <Localize
                                        i18n_default_text='Rate (1 {{ currency }})'
                                        values={{ currency: buy_sell_store.account_currency }}
                                    />
                                </Text>
                                {is_float && (
                                    <Tooltip
                                        alignment='top'
                                        message={localize('Floating exchange rate shifts with market fluctuations.')}
                                    >
                                        <Text as='p' className='buy-sell-form__field-rate--float' size='xxs'>
                                            <Localize i18n_default_text='Floating' />
                                        </Text>
                                    </Tooltip>
                                )}
                            </div>
                            <Text
                                as='p'
                                className={classNames({ 'buy-sell-form__field--floating': is_float })}
                                size='xs'
                            >
                                {display_effective_rate} {local_currency}
                            </Text>
                        </div>
                    </div>
                    <div className='buy-sell-form-payment-method--container'>
                        {payment_method_names && (
                            <Text
                                as='p'
                                className='buy-sell-form-payment-method--title'
                                color='less-prominent'
                                size='xxs'
                            >
                                <Localize i18n_default_text='Payment methods' />
                            </Text>
                        )}
                        {payment_method_names &&
                            payment_method_names.map((payment_method, key) => (
                                <div className='buy-sell-form-payment-method--row' key={key}>
                                    <PaymentMethodIcon
                                        className='buy-sell-form-payment-method--icon'
                                        display_name={payment_method}
                                    />
                                    <Text as='p' size='xs'>
                                        {payment_method}
                                    </Text>
                                </div>
                            ))}
                    </div>
                    <div className='buy-sell-form__field-wrapper'>
                        <div className='buy-sell-form__field'>
                            <Text as='p' color='less-prominent' size='xxs'>
                                {buy_sell_store.is_buy_advert ? (
                                    <Localize i18n_default_text="Seller's instructions" />
                                ) : (
                                    <Localize i18n_default_text="Buyer's instructions" />
                                )}
                            </Text>
                            {description &&
                                description
                                    .trim()
                                    .replace(/([\r\n]){2,}/g, '\n\n')
                                    .split('\n')
                                    .map((text, idx) => (
                                        <Text key={idx} as='p' size='xs'>
                                            {text || '-'}
                                        </Text>
                                    ))}
                        </div>
                    </div>
                    <div className='buy-sell-form__field-wrapper'>
                        <div className='buy-sell-form-field'>
                            <Text as='p' color='less-prominent' size='xxs'>
                                <Localize i18n_default_text='Orders must be completed in' />
                            </Text>
                            <Text as='p' color='general' size='xs'>
                                {formatTime(order_completion_time)}
                            </Text>
                        </div>
                    </div>
                    <div className='buy-sell-form-line' />
                    {buy_sell_store.is_sell_advert && payment_method_names && (
                        <React.Fragment>
                            <div className='buy-sell-form-payment-method'>
                                <Text
                                    as='p'
                                    className='buy-sell-form-payment-method--title'
                                    color='less-prominent'
                                    size='xxs'
                                >
                                    <Localize i18n_default_text='Receive payment to' />
                                </Text>
                                <Text as='p' color='prominent' size='xxs'>
                                    {my_profile_store.advertiser_has_payment_methods ? (
                                        <Localize i18n_default_text='You may choose up to 3.' />
                                    ) : (
                                        <Localize i18n_default_text="To place an order, add one of the advertiser's preferred payment methods:" />
                                    )}
                                </Text>
                                <Observer>
                                    {() => (
                                        <div
                                            className={classNames('buy-sell-form--sell-payment-methods', {
                                                'buy-sell-form--sell-payment-methods--disable': should_disable_field,
                                            })}
                                        >
                                            {payment_method_names
                                                ?.map((add_payment_method, key) => {
                                                    const {
                                                        setSelectedPaymentMethodDisplayName,
                                                        setShouldShowAddPaymentMethodForm,
                                                    } = my_profile_store;
                                                    const matching_payment_methods =
                                                        p2p_advertiser_payment_methods?.filter(
                                                            advertiser_payment_method =>
                                                                advertiser_payment_method.display_name ===
                                                                add_payment_method
                                                        );

                                                    return matching_payment_methods?.length > 0 ? (
                                                        matching_payment_methods.map(payment_method => (
                                                            <PaymentMethodCard
                                                                is_vertical_ellipsis_visible={false}
                                                                key={key}
                                                                medium
                                                                onClick={async () => {
                                                                    onClickPaymentMethodCard(payment_method);
                                                                    await validateForm();
                                                                }}
                                                                payment_method={payment_method}
                                                                style={
                                                                    selected_methods.includes(payment_method.id)
                                                                        ? style
                                                                        : {}
                                                                }
                                                                disabled={should_disable_field}
                                                            />
                                                        ))
                                                    ) : (
                                                        <PaymentMethodCard
                                                            add_payment_method={add_payment_method}
                                                            is_add
                                                            key={key}
                                                            medium
                                                            onClickAdd={() => {
                                                                if (!should_disable_field) {
                                                                    setSelectedPaymentMethodDisplayName(
                                                                        add_payment_method
                                                                    );
                                                                    setShouldShowAddPaymentMethodForm(true);
                                                                }
                                                            }}
                                                            disabled={should_disable_field}
                                                            style={{
                                                                cursor: should_disable_field
                                                                    ? 'not-allowed'
                                                                    : 'pointer',
                                                            }}
                                                        />
                                                    );
                                                })
                                                .sort(payment_method_card_node =>
                                                    Array.isArray(payment_method_card_node) &&
                                                    !payment_method_card_node[0].props?.is_add
                                                        ? -1
                                                        : 1
                                                )}
                                        </div>
                                    )}
                                </Observer>
                            </div>
                            <div className='buy-sell-form-line' />
                        </React.Fragment>
                    )}

                    <div className='buy-sell-form--input'>
                        <Text color='less-prominent' size='xxs'>
                            {localize('Enter {{transaction_type}} amount', {
                                transaction_type: buy_sell_store.is_buy_advert ? 'buy' : 'sell',
                            })}
                        </Text>
                        <section className='buy-sell-form--input-field'>
                            <Input
                                {...getFieldProps('amount')}
                                data-lpignore='true'
                                type='number'
                                error={errors.amount}
                                label={localize('{{ad_type}}', {
                                    ad_type: buy_sell_store.is_buy_advert ? 'Buy amount' : 'Sell amount',
                                })}
                                hint={
                                    <Localize
                                        i18n_default_text='Limit: {{min}}–{{max}} {{currency}}'
                                        values={{
                                            min: min_order_amount_limit_display,
                                            max: getAdvertiserMaxLimit(),
                                            currency: buy_sell_store.account_currency,
                                        }}
                                    />
                                }
                                is_relative_hint
                                className='buy-sell-form__field'
                                trailing_icon={
                                    <Text color='less-prominent' size='xs'>
                                        {buy_sell_store.account_currency}
                                    </Text>
                                }
                                onKeyDown={event => {
                                    if (!floatingPointValidator(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                                onChange={event => {
                                    const { value } = event.target;

                                    if (countDecimalPlaces(value) > getDecimalPlaces(buy_sell_store.account_currency)) {
                                        setFieldValue('amount', parseFloat(input_amount));
                                    } else {
                                        setFieldValue('amount', parseFloat(value));
                                        setInputAmount(value);
                                    }
                                }}
                                required
                                value={input_amount}
                                disabled={should_disable_field}
                            />
                            {isDesktop() && (
                                <div
                                    className={classNames('buy-sell-form__field', {
                                        'buy-sell-form__field--disable': should_disable_field,
                                    })}
                                >
                                    <BuySellFormReceiveAmount />
                                </div>
                            )}
                        </section>
                    </div>
                    {buy_sell_store.is_sell_advert && (
                        <React.Fragment>
                            {!payment_method_names && (
                                <div className='buy-sell-form__field--textarea'>
                                    <Input
                                        {...getFieldProps('payment_info')}
                                        data-lpignore='true'
                                        type='textarea'
                                        error={touched.payment_info && errors.payment_info}
                                        hint={localize('Bank name, account number, beneficiary name')}
                                        is_relative_hint
                                        label={localize('Your bank details')}
                                        required
                                        has_character_counter
                                        initial_character_count={general_store.payment_info.length}
                                        max_characters={300}
                                        disabled={should_disable_field}
                                        onChange={event => buy_sell_store.setTempPaymentInfo(event.target.value)}
                                    />
                                </div>
                            )}
                            <div className='buy-sell-form__field--textarea'>
                                <Input
                                    {...getFieldProps('contact_info')}
                                    data-lpignore='true'
                                    type='textarea'
                                    error={touched.contact_info && errors.contact_info}
                                    label={localize('Your contact details')}
                                    required
                                    has_character_counter
                                    initial_character_count={general_store.contact_info.length}
                                    max_characters={300}
                                    disabled={should_disable_field}
                                    onChange={event => buy_sell_store.setTempContactInfo(event.target.value)}
                                />
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </form>
        </React.Fragment>
    );
};

BuySellForm.propTypes = {
    advert: PropTypes.object,
    contact_info: PropTypes.string,
    form_props: PropTypes.object,
    has_rate_changed: PropTypes.bool,
    setIsSubmitDisabled: PropTypes.func,
    setPageFooterParent: PropTypes.func,
    has_payment_info: PropTypes.bool,
    is_buy_advert: PropTypes.bool,
    is_sell_advert: PropTypes.bool,
    payment_info: PropTypes.string,
    receive_amount: PropTypes.number,
    setFormProps: PropTypes.func,
    setHasRateChanged: PropTypes.func,
    setInitialReceiveAmount: PropTypes.func,
    setReceiveAmount: PropTypes.func,
    validatePopup: PropTypes.func,
};

export default observer(BuySellForm);
