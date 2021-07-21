import * as React from 'react';
import classNames from 'classnames';
import { Formik, Field, Form } from 'formik';
import {
    Button,
    Checkbox,
    Div100vhContainer,
    Input,
    Modal,
    RadioGroup,
    Text,
    ThemedScrollbars,
} from '@deriv/components';
import { formatMoney, isDesktop, isMobile, mobileOSDetect } from '@deriv/shared';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Localize, localize } from 'Components/i18next';
import { useUpdatingAvailableBalance } from 'Components/hooks';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores';
import CreateAdSummary from './create-ad-summary.jsx';

const CreateAdFormWrapper = ({ children }) => {
    if (isMobile()) {
        return <Div100vhContainer height_offset='auto'>{children}</Div100vhContainer>;
    }

    return children;
};

const CreateAdForm = () => {
    const { general_store, my_ads_store } = useStores();
    const available_balance = useUpdatingAvailableBalance();
    const os = mobileOSDetect();

    const { currency, local_currency_config } = general_store.client;

    const should_not_show_auto_archive_message_again = React.useRef(false);

    const onCheckboxChange = () =>
        (should_not_show_auto_archive_message_again.current = !should_not_show_auto_archive_message_again.current);

    const onClickOkCreatedAd = () => {
        localStorage.setItem(
            'should_not_show_auto_archive_message',
            JSON.stringify(should_not_show_auto_archive_message_again.current)
        );
        my_ads_store.setIsAdCreatedModalVisible(false);
        my_ads_store.setShowAdForm(false);
    };

    React.useEffect(() => {
        const disposeApiErrorReaction = reaction(
            () => my_ads_store.api_error_message,
            () => my_ads_store.setIsApiErrorModalVisible(!!my_ads_store.api_error_message)
        );

        return () => {
            disposeApiErrorReaction();
            my_ads_store.setApiErrorMessage('');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const ad_website_status = setInterval(() => {
            if (my_ads_store.is_ad_created_modal_visible) {
                my_ads_store.getWebsiteStatus();
            }
        }, 10000);

        return () => {
            clearInterval(ad_website_status);
        };
    }, [my_ads_store.is_ad_created_modal_visible]);

    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    contact_info: my_ads_store.contact_info,
                    default_advert_description: my_ads_store.default_advert_description,
                    max_transaction: '',
                    min_transaction: '',
                    offer_amount: '',
                    payment_info: my_ads_store.payment_info,
                    price_rate: '',
                    type: buy_sell.BUY,
                }}
                onSubmit={my_ads_store.handleSubmit}
                validate={my_ads_store.validateCreateAdForm}
                initialErrors={{
                    // Pass one error to ensure Post ad button is disabled initially.
                    offer_amount: true,
                }}
            >
                {({ errors, handleChange, isSubmitting, isValid, setFieldValue, touched, values }) => {
                    const is_sell_advert = values.type === buy_sell.SELL;

                    return (
                        <div className='p2p-my-ads__form'>
                            <Form
                                className={classNames('p2p-my-ads__form-element', {
                                    'p2p-my-ads__form-element--ios': is_sell_advert && os === 'iOS',
                                })}
                                noValidate
                            >
                                <ThemedScrollbars
                                    className='p2p-my-ads__form-scrollbar'
                                    is_scrollbar_hidden={isMobile()}
                                >
                                    <CreateAdFormWrapper>
                                        <Field name='type'>
                                            {({ field }) => (
                                                <RadioGroup
                                                    {...field}
                                                    className='p2p-my-ads__form-radio-group'
                                                    name='type'
                                                    onToggle={event => setFieldValue('type', event.target.value)}
                                                    selected={values.type}
                                                    required
                                                >
                                                    <RadioGroup.Item
                                                        value={buy_sell.BUY}
                                                        label={localize('Buy {{currency}}', { currency })}
                                                    />
                                                    <RadioGroup.Item
                                                        value={buy_sell.SELL}
                                                        label={localize('Sell {{currency}}', { currency })}
                                                    />
                                                </RadioGroup>
                                            )}
                                        </Field>
                                        <div className='p2p-my-ads__form-summary'>
                                            <CreateAdSummary
                                                offer_amount={errors.offer_amount ? '' : values.offer_amount}
                                                price_rate={errors.price_rate ? '' : values.price_rate}
                                                type={values.type}
                                            />
                                        </div>
                                        <div className='p2p-my-ads__form-container'>
                                            <Field name='offer_amount'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        type='text'
                                                        error={touched.offer_amount && errors.offer_amount}
                                                        label={localize('Total amount')}
                                                        className='p2p-my-ads__form-field'
                                                        trailing_icon={
                                                            <Text
                                                                color={isDesktop() ? 'less-prominent' : 'prominent'}
                                                                line_height='m'
                                                                size={isDesktop() ? 'xxs' : 's'}
                                                            >
                                                                {currency}
                                                            </Text>
                                                        }
                                                        onChange={e => {
                                                            my_ads_store.restrictLength(e, handleChange);
                                                        }}
                                                        hint={
                                                            // Using two "==" is intentional as we're checking for nullish
                                                            // rather than falsy values.
                                                            !is_sell_advert || available_balance == null
                                                                ? undefined
                                                                : localize(
                                                                      'Your Deriv P2P balance is {{ dp2p_balance }}',
                                                                      {
                                                                          dp2p_balance: `${formatMoney(
                                                                              currency,
                                                                              available_balance,
                                                                              true
                                                                          )} ${currency}`,
                                                                      }
                                                                  )
                                                        }
                                                        is_relative_hint
                                                        required
                                                    />
                                                )}
                                            </Field>
                                            <Field name='price_rate'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        type='text'
                                                        error={touched.price_rate && errors.price_rate}
                                                        label={localize('Fixed rate (1 {{currency}})', {
                                                            currency,
                                                        })}
                                                        className='p2p-my-ads__form-field'
                                                        trailing_icon={
                                                            <Text
                                                                color={isDesktop() ? 'less-prominent' : 'prominent'}
                                                                line_height='m'
                                                                size={isDesktop() ? 'xxs' : 's'}
                                                            >
                                                                {local_currency_config.currency}
                                                            </Text>
                                                        }
                                                        onChange={e => {
                                                            my_ads_store.restrictLength(e, handleChange);
                                                        }}
                                                        required
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                        <div className='p2p-my-ads__form-container'>
                                            <Field name='min_transaction'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        type='text'
                                                        error={touched.min_transaction && errors.min_transaction}
                                                        label={localize('Min order')}
                                                        className='p2p-my-ads__form-field'
                                                        trailing_icon={
                                                            <Text
                                                                color={isDesktop() ? 'less-prominent' : 'prominent'}
                                                                line_height='m'
                                                                size={isDesktop() ? 'xxs' : 's'}
                                                            >
                                                                {currency}
                                                            </Text>
                                                        }
                                                        onChange={e => {
                                                            my_ads_store.restrictLength(e, handleChange);
                                                        }}
                                                        required
                                                    />
                                                )}
                                            </Field>
                                            <Field name='max_transaction'>
                                                {({ field }) => (
                                                    <Input
                                                        {...field}
                                                        data-lpignore='true'
                                                        type='text'
                                                        error={touched.max_transaction && errors.max_transaction}
                                                        label={localize('Max order')}
                                                        className='p2p-my-ads__form-field'
                                                        trailing_icon={
                                                            <Text
                                                                color={isDesktop() ? 'less-prominent' : 'prominent'}
                                                                line_height='m'
                                                                size={isDesktop() ? 'xxs' : 's'}
                                                            >
                                                                {currency}
                                                            </Text>
                                                        }
                                                        onChange={e => {
                                                            my_ads_store.restrictLength(e, handleChange);
                                                        }}
                                                        required
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                        {is_sell_advert && (
                                            <React.Fragment>
                                                <Field name='payment_info'>
                                                    {({ field }) => (
                                                        <Input
                                                            {...field}
                                                            data-lpignore='true'
                                                            type='textarea'
                                                            label={
                                                                <Text color='less-prominent' size='xs'>
                                                                    <Localize i18n_default_text='Your payment details' />
                                                                </Text>
                                                            }
                                                            error={touched.payment_info && errors.payment_info}
                                                            hint={localize('e.g. your bank/e-wallet account details')}
                                                            className='p2p-my-ads__form-field p2p-my-ads__form-field--textarea'
                                                            initial_character_count={my_ads_store.payment_info.length}
                                                            required
                                                            has_character_counter
                                                            max_characters={300}
                                                        />
                                                    )}
                                                </Field>
                                                <Field name='contact_info'>
                                                    {({ field }) => (
                                                        <Input
                                                            {...field}
                                                            data-lpignore='true'
                                                            type='textarea'
                                                            label={
                                                                <Text color='less-prominent' size='xs'>
                                                                    <Localize i18n_default_text='Your contact details' />
                                                                </Text>
                                                            }
                                                            error={touched.contact_info && errors.contact_info}
                                                            className='p2p-my-ads__form-field p2p-my-ads__form-field--textarea'
                                                            initial_character_count={my_ads_store.contact_info.length}
                                                            required
                                                            has_character_counter
                                                            max_characters={300}
                                                        />
                                                    )}
                                                </Field>
                                            </React.Fragment>
                                        )}
                                        <Field name='default_advert_description'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    data-lpignore='true'
                                                    type='textarea'
                                                    error={
                                                        touched.default_advert_description &&
                                                        errors.default_advert_description
                                                    }
                                                    label={
                                                        <Text color='less-prominent' size='xs'>
                                                            <Localize i18n_default_text='Instructions (optional)' />
                                                        </Text>
                                                    }
                                                    hint={localize('This information will be visible to everyone.')}
                                                    className='p2p-my-ads__form-field p2p-my-ads__form-field--textarea'
                                                    initial_character_count={
                                                        my_ads_store.default_advert_description.length
                                                    }
                                                    has_character_counter
                                                    max_characters={300}
                                                    required
                                                />
                                            )}
                                        </Field>
                                        <div className='p2p-my-ads__form-container p2p-my-ads__form-footer'>
                                            <Button
                                                className='p2p-my-ads__form-button'
                                                secondary
                                                large
                                                onClick={() => my_ads_store.setShowAdForm(false)}
                                                type='button'
                                            >
                                                <Localize i18n_default_text='Cancel' />
                                            </Button>
                                            <Button
                                                className='p2p-my-ads__form-button'
                                                primary
                                                large
                                                is_disabled={isSubmitting || !isValid}
                                            >
                                                <Localize i18n_default_text='Post ad' />
                                            </Button>
                                        </div>
                                    </CreateAdFormWrapper>
                                </ThemedScrollbars>
                            </Form>
                        </div>
                    );
                }}
            </Formik>
            <Modal
                className='p2p-my-ads__modal-error'
                is_open={my_ads_store.is_api_error_modal_visible}
                small
                has_close_icon={false}
                title={localize('Something’s not right')}
            >
                <Modal.Body>
                    <Text as='p' size='xs' color='prominent'>
                        {my_ads_store.api_error_message}
                    </Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        has_effect
                        text={localize('Ok')}
                        onClick={() => my_ads_store.setIsApiErrorModalVisible(false)}
                        primary
                        large
                    />
                </Modal.Footer>
            </Modal>

            <Modal
                className='p2p-my-ads__ad-created'
                has_close_icon={false}
                is_open={my_ads_store.is_ad_created_modal_visible}
                small
                title={localize("You've created an ad")}
            >
                <Modal.Body>
                    <Text as='p' size='xs' color='prominent'>
                        <Localize
                            i18n_default_text="If the ad doesn't receive an order for {{adverts_archive_period}} days, it will be deactivated."
                            values={{ adverts_archive_period: my_ads_store.adverts_archive_period }}
                        />
                    </Text>
                    <br />
                    <Checkbox
                        label={localize('Don’t show this message again.')}
                        onChange={onCheckboxChange}
                        value={should_not_show_auto_archive_message_again.current}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button has_effect text={localize('Ok')} onClick={onClickOkCreatedAd} primary large />
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default observer(CreateAdForm);
