import React from 'react';
import PropTypes from 'prop-types';
import { Field, Form, Formik } from 'formik';
import {
    Button,
    Icon,
    Input,
    LineSeparatedComponents,
    Loading,
    PopoverMobile,
    Table,
    ThemedScrollbars,
    Text,
    ToggleSwitch,
    Money,
} from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { localize, Localize } from 'Components/i18next';
import { generateHexColourFromNickname, getShortNickname } from 'Utils/string';
import { useStores } from 'Stores';
import FormError from '../form/error.jsx';
import './my-profile.scss';

const MyProfile = observer(() => {
    const { general_store, my_profile_store } = useStores();
    const { currency } = general_store.client;
    const [has_on_screen_keyboard, setHasOnScreenKeyboard] = React.useState(false);
    const [is_balance_tooltip_open, setIsBalanceTooltipOpen] = React.useState(false);
    const [is_statistics_tooltip_open, setIsStatisticsTooltipOpen] = React.useState(false);

    const setCurrentFocus = target => setHasOnScreenKeyboard(isMobile() && target);

    const {
        balance_available,
        daily_buy,
        daily_buy_limit,
        daily_sell,
        daily_sell_limit,
        total_orders_count,
    } = my_profile_store.advertiser_info;

    React.useEffect(() => {
        my_profile_store.getSettings();
        my_profile_store.getAdvertiserInfo();
    }, []);

    if (my_profile_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (my_profile_store.error_message) {
        return (
            <div className='my-profile__error'>
                <Text size='xs' font='loss-danger'>
                    {my_profile_store.error_message}
                </Text>
            </div>
        );
    }

    return (
        <div className='my-profile'>
            <ThemedScrollbars className='my-profile__scrollbar'>
                <div className='my-profile__header'>
                    <div className='my-profile__header-details'>
                        <div
                            className='my-profile__header-avatar'
                            style={{ backgroundColor: generateHexColourFromNickname(general_store.nickname) }}
                        >
                            <Text size='xs' color='colored-background'>
                                {getShortNickname(general_store.nickname)}
                            </Text>
                        </div>
                        <div className='my-profile__header-name'>
                            <Text color='prominent' weight='bold'>
                                {general_store.nickname}
                            </Text>
                        </div>
                    </div>
                </div>
                <LineSeparatedComponents className='my-profile__balance-wrapper' is_invisible_line={isMobile()}>
                    <Text size='xs' line_height='m' color='less-prominent'>
                        <Localize i18n_default_text='Available DP2P balance' />
                    </Text>
                    <div className='my-profile__balance'>
                        <Text
                            className='my-profile__balance-amount'
                            color='prominent'
                            line_height='m'
                            size={isMobile() ? 'xs' : 's'}
                            weight='bold'
                        >
                            <Money amount={balance_available} currency={currency} show_currency />
                        </Text>
                        <PopoverMobile
                            button_text={localize('Got it')}
                            is_open={is_balance_tooltip_open}
                            message={localize(
                                'DP2P balance = deposits that can’t be reversed (bank transfers, etc.) + a portion of deposits that might be reversed (credit card payments, etc.)'
                            )}
                            setIsOpen={setIsBalanceTooltipOpen}
                            title={localize('Available DP2P balance')}
                        >
                            <Icon icon='IcInfoOutline' size={16} />
                        </PopoverMobile>
                    </div>
                </LineSeparatedComponents>
                <Table>
                    <Table.Row className='my-profile__stats'>
                        <Table.Cell className='my-profile__stats-cell'>
                            <Text size={isMobile() ? 'xxxs' : 'xs'} color='less-prominent' line_height='m' as='p'>
                                {localize('Total orders')}
                            </Text>
                            <Text color='prominent' weight='bold' line_height='l' as='p'>
                                {total_orders_count || '-'}
                            </Text>
                        </Table.Cell>
                        <div className='my-profile__stats-cell-separator' />
                        {isMobile() ? (
                            <Table.Cell className='my-profile__stats-cell'>
                                <Text size={isMobile() ? 'xxxs' : 'xs'} color='less-prominent' line_height='m' as='p'>
                                    {localize('Buy / Sell ({{currency}})', {
                                        currency,
                                    })}
                                </Text>
                                <Text color='prominent' weight='bold' line_height='l' as='p'>
                                    {daily_buy || '-'}/{daily_sell || '-'}
                                </Text>
                            </Table.Cell>
                        ) : (
                            <React.Fragment>
                                <Table.Cell className='my-profile__stats-cell'>
                                    <Text
                                        size={isMobile() ? 'xxxs' : 'xs'}
                                        color='less-prominent'
                                        line_height='m'
                                        as='p'
                                    >
                                        {localize('Buy ({{currency}})', {
                                            currency,
                                        })}
                                    </Text>
                                    <Text color='prominent' weight='bold' line_height='l' as='p'>
                                        {daily_buy || '-'}
                                    </Text>
                                </Table.Cell>
                                <div className='my-profile__stats-cell-separator' />
                                <Table.Cell className='my-profile__stats-cell'>
                                    <Text
                                        size={isMobile() ? 'xxxs' : 'xs'}
                                        color='less-prominent'
                                        line_height='m'
                                        as='p'
                                    >
                                        {localize('Sell ({{currency}})', {
                                            currency,
                                        })}
                                    </Text>
                                    <Text color='prominent' weight='bold' line_height='l' as='p'>
                                        {daily_sell || '-'}
                                    </Text>
                                </Table.Cell>
                            </React.Fragment>
                        )}
                        <div className='my-profile__stats-cell-separator' />
                        <Table.Cell className='my-profile__stats-cell'>
                            <Text size={isMobile() ? 'xxxs' : 'xs'} color='less-prominent' line_height='m' as='p'>
                                {localize('Buy / Sell limit ({{currency}})', {
                                    currency,
                                })}
                            </Text>
                            <Text color='prominent' weight='bold' line_height='l' as='p'>
                                {daily_buy_limit && daily_sell_limit
                                    ? `${Math.floor(daily_buy_limit)} / ${Math.floor(daily_sell_limit)}`
                                    : '-'}
                            </Text>
                        </Table.Cell>
                        {!isMobile() && <div className='my-profile__stats-cell-separator' />}
                        <Table.Cell>
                            <div className='my-profile__popover-container'>
                                <PopoverMobile
                                    button_text={localize('Got it')}
                                    is_open={is_statistics_tooltip_open}
                                    message={localize(
                                        "These fields are based on the last 24 hours' activity: Buy, Sell, and Limit."
                                    )}
                                    setIsOpen={setIsStatisticsTooltipOpen}
                                >
                                    <Icon icon='IcInfoOutline' size={16} />
                                </PopoverMobile>
                            </div>
                        </Table.Cell>
                    </Table.Row>
                </Table>
                <LineSeparatedComponents className='my-profile__privacy-setting-wrapper'>
                    <div className='my-profile__separator-text--privacy'>
                        <Text size='xs' color='prominent' weight='bold'>
                            <Localize i18n_default_text={'Privacy setting'} />
                        </Text>
                    </div>
                </LineSeparatedComponents>
                <div className='my-profile__toggle-container'>
                    <ToggleSwitch
                        id='p2p-toggle-name'
                        classNameLabel='p2p-toggle-name__switch'
                        is_enabled={general_store.should_show_real_name}
                        handleToggle={my_profile_store.handleToggle}
                    />
                    <Text size='xs' line_height='m' color='prominent' className='my-profile__toggle-name'>
                        <Localize
                            i18n_default_text={'Show my real name ({{full_name}})'}
                            values={{ full_name: my_profile_store.full_name }}
                        />
                    </Text>
                </div>
                <LineSeparatedComponents className='my-profile__ad-template-wrapper'>
                    <Text size='xs' color='prominent' weight='bold'>
                        <Localize i18n_default_text='Ad template' />
                    </Text>
                </LineSeparatedComponents>
                <Formik
                    enableReinitialize
                    initialValues={{
                        contact_info: my_profile_store.contact_info,
                        default_advert_description: my_profile_store.default_advert_description,
                        payment_info: my_profile_store.payment_info,
                    }}
                    onSubmit={my_profile_store.handleSubmit}
                    validate={my_profile_store.validateForm}
                >
                    {({ dirty, errors, isSubmitting, isValid }) => {
                        return (
                            <Form
                                className={classNames('my-profile__form', {
                                    'my-profile__form--active-keyboard': has_on_screen_keyboard,
                                })}
                            >
                                <React.Fragment>
                                    <Field name='payment_info'>
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                type='textarea'
                                                label={localize('Payment details')}
                                                error={errors.payment_info}
                                                hint={localize('e.g. your bank/e-wallet account details')}
                                                className='my-profile__form-textarea'
                                                has_character_counter
                                                initial_character_count={my_profile_store.payment_info.length}
                                                max_characters={300}
                                                onFocus={e => setCurrentFocus(e.currentTarget.name)}
                                                onBlur={() => setCurrentFocus(null)}
                                            />
                                        )}
                                    </Field>
                                    <Field name='contact_info'>
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                type='textarea'
                                                label={localize('Contact details')}
                                                error={errors.contact_info}
                                                className='my-profile__form-textarea'
                                                has_character_counter
                                                initial_character_count={my_profile_store.contact_info.length}
                                                max_characters={300}
                                                onFocus={e => setCurrentFocus(e.currentTarget.name)}
                                                onBlur={() => setCurrentFocus(null)}
                                            />
                                        )}
                                    </Field>
                                    <Field name='default_advert_description'>
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                type='textarea'
                                                label={localize('Instructions')}
                                                error={errors.default_advert_description}
                                                hint={localize('This information will be visible to everyone.')}
                                                className='my-profile__form-textarea'
                                                has_character_counter
                                                initial_character_count={
                                                    my_profile_store.default_advert_description.length
                                                }
                                                max_characters={300}
                                                onFocus={e => setCurrentFocus(e.currentTarget.name)}
                                                onBlur={() => setCurrentFocus(null)}
                                            />
                                        )}
                                    </Field>
                                    <div
                                        className={classNames('my-profile__footer', {
                                            'my-profile__footer--active-keyboard': has_on_screen_keyboard,
                                        })}
                                    >
                                        <FormError message={my_profile_store.form_error} />

                                        <Button
                                            className={classNames('my-profile__footer-button', {
                                                'dc-btn--green': my_profile_store.is_submit_success,
                                            })}
                                            is_disabled={!dirty || isSubmitting || !isValid}
                                            is_loading={my_profile_store.is_button_loading}
                                            is_submit_success={my_profile_store.is_submit_success}
                                            text={localize('Save')}
                                            has_effect
                                            primary
                                            large
                                        />
                                    </div>
                                </React.Fragment>
                            </Form>
                        );
                    }}
                </Formik>
            </ThemedScrollbars>
        </div>
    );
});

MyProfile.propTypes = {
    advertiser_info: PropTypes.object,
    contact_info: PropTypes.string,
    default_advert_description: PropTypes.string,
    error_message: PropTypes.string,
    form_error: PropTypes.string,
    getAdvertiserInfo: PropTypes.func,
    handleSubmit: PropTypes.func,
    is_button_loading: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_submit_success: PropTypes.bool,
    payment_info: PropTypes.string,
    validateForm: PropTypes.func,
};

export default MyProfile;
