import * as React from 'react';
import classNames from 'classnames';
import { Formik, Field, Form } from 'formik';
import { Button, Div100vhContainer, Input, Modal, Text, ThemedScrollbars } from '@deriv/components';
import { formatMoney, isDesktop, isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { Localize, localize } from 'Components/i18next';
import PageReturn from 'Components/page-return';
import { api_error_codes } from 'Constants/api-error-codes';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores';
import { ad_type } from 'Constants/floating-rate';
import FloatingRate from 'Components/floating-rate';
import { generateErrorDialogTitle, generateErrorDialogBody } from 'Utils/adverts';
import EditAdFormPaymentMethods from './edit-ad-form-payment-methods.jsx';
import EditAdSummary from './edit-ad-summary.jsx';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import OrderTimeSelection from './order-time-selection';
import './edit-ad-form.scss';

const EditAdFormWrapper = ({ children }) => {
    if (isMobile()) {
        return <Div100vhContainer height_offset='auto'>{children}</Div100vhContainer>;
    }

    return children;
};

const EditAdForm = () => {
    const { floating_rate_store, general_store, my_ads_store, my_profile_store } = useStores();

    const {
        account_currency,
        amount_display,
        contact_info,
        description,
        local_currency,
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
    const [is_payment_method_touched, setIsPaymentMethodTouched] = React.useState(false);
    const { useRegisterModalProps } = useModalManagerContext();

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

    const payment_methods_changed = is_buy_advert
        ? !(
              !!payment_method_names &&
              selected_methods?.every(pm => {
                  const method = my_profile_store.getPaymentMethodDisplayName(pm);
                  return payment_method_names.includes(method);
              }) &&
              selected_methods.length === payment_method_names.length
          )
        : !(
              !!payment_method_details &&
              selected_methods.every(pm => Object.keys(payment_method_details).includes(pm)) &&
              selected_methods.length === Object.keys(payment_method_details).length
          );

    const handleEditAdFormCancel = is_form_edited => {
        if (is_form_edited || payment_methods_changed) {
            general_store.showModal({
                key: 'AdCancelModal',
                props: {
                    confirm_label: localize("Don't cancel"),
                    message: localize('If you choose to cancel, the edited details will be lost.'),
                    onConfirm: () => my_ads_store.setShowEditAdForm(false),
                    title: localize('Cancel your edits?'),
                },
            });
        } else {
            my_ads_store.setShowEditAdForm(false);
        }
    };

    const is_api_error = [api_error_codes.ADVERT_SAME_LIMITS, api_error_codes.DUPLICATE_ADVERT].includes(
        my_ads_store.error_code
    );

    React.useEffect(() => {
        my_profile_store.getAdvertiserPaymentMethods();
        my_ads_store.setIsEditAdErrorModalVisible(false);
        my_ads_store.setEditAdFormError('');
        floating_rate_store.setApiErrorMessage('');
        // P2P configuration is not subscribed. Hence need to fetch it on demand
        general_store.setP2PConfig();

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
        if (my_ads_store.required_ad_type !== rate_type) {
            const is_payment_method_available =
                !!Object.keys({ ...payment_method_details }).length ||
                !!Object.values({ ...payment_method_names }).length;
            setIsPaymentMethodTouched(is_payment_method_available);
        }
        return () => {
            my_ads_store.setApiErrorCode(null);
            my_ads_store.setShowEditAdForm(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <PageReturn
                onClick={() => my_ads_store.setShowEditAdForm(false)}
                page_title={localize('Edit {{ad_type}} ad', { ad_type: type })}
            />
            <Formik
                initialValues={{
                    contact_info,
                    description,
                    max_transaction: max_order_amount_display,
                    min_transaction: min_order_amount_display,
                    offer_amount: amount_display,
                    // set a max of 1 hour if expiry period is more than 1 hour
                    order_completion_time: order_expiry_period > 3600 ? '3600' : order_expiry_period.toString(),
                    rate_type: setInitialAdRate(),
                    type,
                    is_active:
                        rate_type !== floating_rate_store.rate_type && floating_rate_store.reached_target_date
                            ? 1
                            : is_active,
                }}
                onSubmit={my_ads_store.onClickSaveEditAd}
                validate={my_ads_store.validateEditAdForm}
                validateOnMount
            >
                {({ dirty, errors, handleChange, isSubmitting, isValid, setFieldTouched, touched, values }) => {
                    const is_sell_advert = values.type === buy_sell.SELL;
                    // Form should not be checked for value change when ad switch is triggered
                    const check_dirty =
                        my_ads_store.required_ad_type === rate_type
                            ? dirty || is_payment_method_touched
                            : is_payment_method_touched;
                    return (
                        <div className='edit-ad-form'>
                            <Form noValidate>
                                <ThemedScrollbars className='edit-ad-form__scrollbar' is_scrollbar_hidden={isMobile()}>
                                    <EditAdFormWrapper>
                                        <div className='edit-ad-form__scrollbar-container'>
                                            <div className='edit-ad-form__summary'>
                                                <EditAdSummary
                                                    offer_amount={errors.offer_amount ? '' : values.offer_amount}
                                                    price_rate={values.rate_type}
                                                    type={values.type}
                                                />
                                            </div>
                                            <div className='edit-ad-form__container'>
                                                <Field name='offer_amount'>
                                                    {({ field }) => (
                                                        <Input
                                                            {...field}
                                                            data-testid='offer_amount'
                                                            data-lpignore='true'
                                                            type='text'
                                                            error={touched.offer_amount && errors.offer_amount}
                                                            label={localize('Total amount')}
                                                            className={classNames(
                                                                'edit-ad-form__field',
                                                                'edit-ad-form__offer-amt'
                                                            )}
                                                            trailing_icon={
                                                                <Text
                                                                    color={isDesktop() ? 'less-prominent' : 'prominent'}
                                                                    size={isDesktop() ? 'xxs' : 's'}
                                                                >
                                                                    {account_currency}
                                                                </Text>
                                                            }
                                                            onChange={e => {
                                                                my_ads_store.restrictLength(e, handleChange);
                                                            }}
                                                            onFocus={() => setFieldTouched('offer_amount', true)}
                                                            hint={
                                                                // Using two "==" is intentional as we're checking for nullish
                                                                // rather than falsy values.
                                                                !is_sell_advert ||
                                                                general_store.advertiser_info.balance_available == null
                                                                    ? undefined
                                                                    : localize(
                                                                          'Your DP2P balance is {{ dp2p_balance }}',
                                                                          {
                                                                              dp2p_balance: `${formatMoney(
                                                                                  account_currency,
                                                                                  general_store.advertiser_info
                                                                                      .balance_available,
                                                                                  true
                                                                              )} ${account_currency}`,
                                                                          }
                                                                      )
                                                            }
                                                            is_relative_hint
                                                            disabled
                                                        />
                                                    )}
                                                </Field>
                                                <Field name='rate_type'>
                                                    {({ field }) =>
                                                        my_ads_store.required_ad_type === ad_type.FLOAT ? (
                                                            <FloatingRate
                                                                className='edit-ad-form__field'
                                                                data_testid='float_rate_type'
                                                                error_messages={errors.rate_type}
                                                                fiat_currency={account_currency}
                                                                local_currency={local_currency}
                                                                offset={{
                                                                    upper_limit:
                                                                        // eslint-disable-next-line max-len
                                                                        floating_rate_store.float_rate_offset_limit,
                                                                    lower_limit:
                                                                        // eslint-disable-next-line max-len
                                                                        floating_rate_store.float_rate_offset_limit *
                                                                        -1,
                                                                }}
                                                                onFocus={() => setFieldTouched('rate_type', true)}
                                                                required
                                                                change_handler={e => {
                                                                    my_ads_store.restrictDecimalPlace(e, handleChange);
                                                                }}
                                                                place_holder='Floating rate'
                                                                {...field}
                                                            />
                                                        ) : (
                                                            <Input
                                                                {...field}
                                                                data-testid='fixed_rate_type'
                                                                data-lpignore='true'
                                                                type='text'
                                                                error={touched.rate_type && errors.rate_type}
                                                                label={localize('Fixed rate (1 {{account_currency}})', {
                                                                    account_currency,
                                                                })}
                                                                label_className='edit-ad-form__label--focused'
                                                                className='edit-ad-form__field'
                                                                trailing_icon={
                                                                    <Text
                                                                        color={
                                                                            isDesktop() ? 'less-prominent' : 'prominent'
                                                                        }
                                                                        size={isDesktop() ? 'xxs' : 's'}
                                                                    >
                                                                        {local_currency}
                                                                    </Text>
                                                                }
                                                                onChange={e => {
                                                                    my_ads_store.restrictLength(e, handleChange);
                                                                }}
                                                                onFocus={() => setFieldTouched('rate_type', true)}
                                                                required
                                                            />
                                                        )
                                                    }
                                                </Field>
                                            </div>
                                            <div className='edit-ad-form__container'>
                                                <Field name='min_transaction'>
                                                    {({ field }) => (
                                                        <Input
                                                            {...field}
                                                            data-lpignore='true'
                                                            data-testid='min_transaction'
                                                            type='text'
                                                            error={touched.min_transaction && errors.min_transaction}
                                                            label={localize('Min order')}
                                                            className='edit-ad-form__field'
                                                            trailing_icon={
                                                                <Text
                                                                    color={isDesktop() ? 'less-prominent' : 'prominent'}
                                                                    size={isDesktop() ? 'xxs' : 's'}
                                                                >
                                                                    {account_currency}
                                                                </Text>
                                                            }
                                                            onChange={e => {
                                                                my_ads_store.restrictLength(e, handleChange);
                                                            }}
                                                            onFocus={() => setFieldTouched('min_transaction', true)}
                                                            required
                                                        />
                                                    )}
                                                </Field>
                                                <Field name='max_transaction'>
                                                    {({ field }) => (
                                                        <Input
                                                            {...field}
                                                            data-lpignore='true'
                                                            data-testid='max_transaction'
                                                            type='text'
                                                            error={touched.max_transaction && errors.max_transaction}
                                                            label={localize('Max order')}
                                                            className='edit-ad-form__field'
                                                            trailing_icon={
                                                                <Text
                                                                    color={isDesktop() ? 'less-prominent' : 'prominent'}
                                                                    size={isDesktop() ? 'xxs' : 's'}
                                                                >
                                                                    {account_currency}
                                                                </Text>
                                                            }
                                                            onChange={e => {
                                                                my_ads_store.restrictLength(e, handleChange);
                                                            }}
                                                            onFocus={() => setFieldTouched('max_transaction', true)}
                                                            required
                                                        />
                                                    )}
                                                </Field>
                                            </div>
                                            {is_sell_advert && (
                                                <React.Fragment>
                                                    <Field name='contact_info'>
                                                        {({ field }) => (
                                                            <Input
                                                                {...field}
                                                                data-lpignore='true'
                                                                data-testid='contact_info'
                                                                type='textarea'
                                                                label={
                                                                    <Text color='less-prominent' size='xs'>
                                                                        <Localize i18n_default_text='Your contact details' />
                                                                    </Text>
                                                                }
                                                                error={touched.contact_info && errors.contact_info}
                                                                className='edit-ad-form__field edit-ad-form__field--textarea'
                                                                initial_character_count={contact_info.length}
                                                                required
                                                                has_character_counter
                                                                max_characters={300}
                                                                onFocus={() => setFieldTouched('contact_info', true)}
                                                            />
                                                        )}
                                                    </Field>
                                                </React.Fragment>
                                            )}
                                            <Field name='description'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        data-testid='description'
                                                        type='textarea'
                                                        error={touched.description && errors.description}
                                                        label={
                                                            <Text color='less-prominent' size='xs'>
                                                                <Localize i18n_default_text='Instructions (optional)' />
                                                            </Text>
                                                        }
                                                        hint={localize('This information will be visible to everyone.')}
                                                        className='edit-ad-form__field edit-ad-form__field--textarea'
                                                        initial_character_count={description ? description.length : 0}
                                                        has_character_counter
                                                        max_characters={300}
                                                        onFocus={() => setFieldTouched('description', true)}
                                                    />
                                                )}
                                            </Field>
                                            <Field name='order_completion_time'>
                                                {({ field }) => (
                                                    <OrderTimeSelection
                                                        classNameDisplay='edit-ad-form__dropdown-display'
                                                        {...field}
                                                    />
                                                )}
                                            </Field>
                                            <div className='edit-ad-form__payment-methods--text'>
                                                <Text color='prominent'>
                                                    <Localize i18n_default_text='Payment methods' />
                                                </Text>
                                                <Text color='less-prominent'>
                                                    {is_sell_advert ? (
                                                        <Localize i18n_default_text='You may tap and choose up to 3.' />
                                                    ) : (
                                                        <Localize i18n_default_text='You may choose up to 3.' />
                                                    )}
                                                </Text>
                                            </div>
                                            <EditAdFormPaymentMethods
                                                is_sell_advert={is_sell_advert}
                                                payment_method_names={payment_method_names}
                                                selected_methods={[...selected_methods]}
                                                setSelectedMethods={setSelectedMethods}
                                                touched={setIsPaymentMethodTouched}
                                            />
                                        </div>
                                        <div className='edit-ad-form__container edit-ad-form__footer'>
                                            <Button
                                                className='edit-ad-form__button'
                                                secondary
                                                large
                                                onClick={() => handleEditAdFormCancel(dirty)}
                                                type='button'
                                            >
                                                <Localize i18n_default_text='Cancel' />
                                            </Button>
                                            <Button
                                                className='edit-ad-form__button'
                                                has_effect
                                                primary
                                                large
                                                is_disabled={
                                                    isSubmitting ||
                                                    !isValid ||
                                                    !check_dirty ||
                                                    selected_methods.length === 0 ||
                                                    !(!!payment_method_names || !!payment_method_details) ||
                                                    my_ads_store.current_method.is_deleted
                                                }
                                            >
                                                <Localize i18n_default_text='Save changes' />
                                            </Button>
                                        </div>
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
