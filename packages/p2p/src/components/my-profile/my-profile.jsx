import React from 'react';
import { Field, Form, Formik } from 'formik';
import {
    Button,
    Icon,
    Input,
    Loading,
    Popover,
    Table,
    ThemedScrollbars,
    Text,
    Div100vhContainer,
} from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { localize, Localize } from 'Components/i18next';
import FormError from 'Components/form/error.jsx';
import UserAvatar from 'Components/user/user-avatar/user-avatar.jsx';
import { useStores } from 'Stores';
import './my-profile.scss';

const ContentWrapper = ({ children, className }) => {
    if (isMobile()) {
        // (core header + tab header + tabs) = 120px + (floating footer) = 74px
        const content_height = 120 + 74;

        return (
            <Div100vhContainer className={className} height_offset={`${content_height}px`}>
                {children}
            </Div100vhContainer>
        );
    }

    return (
        <ThemedScrollbars height='calc(100% - 16rem)' className={className}>
            {children}
        </ThemedScrollbars>
    );
};

const MyProfile = observer(() => {
    const { general_store, my_profile_store } = useStores();

    const {
        basic_verification,
        daily_buy,
        daily_buy_limit,
        daily_sell,
        daily_sell_limit,
        full_verification,
        total_orders_count,
    } = my_profile_store.advertiser_info;

    React.useEffect(() => {
        my_profile_store.getAdvertiserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <ContentWrapper className='my-profile'>
            <div className='my-profile__header'>
                <div className='my-profile__header-details'>
                    <UserAvatar
                        className='my-profile__header-avatar'
                        nickname={general_store.nickname}
                        size={32}
                        text_size={isMobile() ? 's' : 'xs'}
                    />
                    <div className='my-profile__header-name'>
                        <Text color='prominent' weight='bold' size='s' line_height='m'>
                            {general_store.nickname}
                        </Text>
                    </div>
                </div>
                {isDesktop() && (
                    <div className='my-profile__header-verification'>
                        {basic_verification && (
                            <div className='my-profile__header-verification-status'>
                                <Text color='less-prominent' size='xs' line_height='m'>
                                    <Localize i18n_default_text='ID verified' />
                                </Text>
                                <Icon
                                    className='my-profile__header-verification-icon'
                                    icon='IcCashierVerificationBadge'
                                    size={16}
                                />
                            </div>
                        )}
                        {full_verification && (
                            <div className='my-profile__header-verification-status'>
                                <Text color='less-prominent' size='xs' line_height='m'>
                                    <Localize i18n_default_text='Address verified' />
                                </Text>
                                <Icon
                                    className='my-profile__header-verification-icon'
                                    icon='IcCashierVerificationBadge'
                                    size={16}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Table>
                <Table.Row className='my-profile__stats'>
                    <div className='my-profile__stats-cell-separator' />
                    <Table.Cell className='my-profile__stats-cell'>
                        <Text size={isMobile() ? 'xxxs' : 'xs'} color='less-prominent' line_height='m' as='p'>
                            <Localize i18n_default_text='Total orders' />
                        </Text>
                        <Text color='prominent' weight='bold' line_height='m' as='p' size={isMobile() ? 'xs' : 's'}>
                            {total_orders_count || '-'}
                        </Text>
                    </Table.Cell>
                    <div className='my-profile__stats-cell-separator' />
                    {isMobile() ? (
                        <Table.Cell className='my-profile__stats-cell'>
                            <Text size={isMobile() ? 'xxxs' : 'xs'} color='less-prominent' line_height='m' as='p'>
                                <Localize
                                    i18n_default_text='Buy / Sell ({{currency}})'
                                    values={{ currency: general_store.client.currency }}
                                />
                            </Text>
                            <Text color='prominent' weight='bold' line_height='m' as='p' size={isMobile() ? 'xs' : 's'}>
                                {daily_buy || '-'}/{daily_sell || '-'}
                            </Text>
                        </Table.Cell>
                    ) : (
                        <React.Fragment>
                            <Table.Cell className='my-profile__stats-cell'>
                                <Text size={isMobile() ? 'xxxs' : 'xs'} color='less-prominent' line_height='m' as='p'>
                                    <Localize
                                        i18n_default_text='Buy ({{currency}})'
                                        values={{ currency: general_store.client.currency }}
                                    />
                                </Text>
                                <Text
                                    color='prominent'
                                    weight='bold'
                                    line_height='m'
                                    as='p'
                                    size={isMobile() ? 'xs' : 's'}
                                >
                                    {daily_buy || '-'}
                                </Text>
                            </Table.Cell>
                            <div className='my-profile__stats-cell-separator' />
                            <Table.Cell className='my-profile__stats-cell'>
                                <Text size={isMobile() ? 'xxxs' : 'xs'} color='less-prominent' line_height='m' as='p'>
                                    <Localize
                                        i18n_default_text='Sell ({{currency}})'
                                        values={{ currency: general_store.client.currency }}
                                    />
                                </Text>
                                <Text
                                    color='prominent'
                                    weight='bold'
                                    line_height='m'
                                    as='p'
                                    size={isMobile() ? 'xs' : 's'}
                                >
                                    {daily_sell || '-'}
                                </Text>
                            </Table.Cell>
                        </React.Fragment>
                    )}
                    <div className='my-profile__stats-cell-separator' />
                    <Table.Cell className='my-profile__stats-cell'>
                        <Text size={isMobile() ? 'xxxs' : 'xs'} color='less-prominent' line_height='m' as='p'>
                            <Localize
                                i18n_default_text='Buy / Sell limit ({{currency}})'
                                values={{ currency: general_store.client.currency }}
                            />
                        </Text>
                        <Text color='prominent' weight='bold' line_height='m' as='p' size={isMobile() ? 'xs' : 's'}>
                            {daily_buy_limit && daily_sell_limit
                                ? `${Math.floor(daily_buy_limit)} / ${Math.floor(daily_sell_limit)}`
                                : '-'}
                        </Text>
                    </Table.Cell>
                    {isDesktop() && <div className='my-profile__stats-cell-separator' />}
                    <Table.Cell>
                        <Popover
                            classNameBubble='my-profile__popover-text'
                            alignment='top'
                            message={localize(
                                "These fields are based on the last 24 hours' activity: Buy, Sell, and Limit."
                            )}
                            zIndex={2}
                        >
                            <Icon className='my-profile__popover-icon' icon='IcInfoOutline' size={16} />
                        </Popover>
                    </Table.Cell>
                </Table.Row>
            </Table>
            <div className='my-profile__separator'>
                <div className='my-profile__separator-text'>
                    <Text size='xs' color='prominent' weight='bold'>
                        <Localize i18n_default_text='Ad template' />
                    </Text>
                </div>
                <div className='my-profile__separator-horizontal_line' />
            </div>
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
                        <Form className='my-profile__form'>
                            <React.Fragment>
                                <Field name='payment_info'>
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            type='textarea'
                                            label={localize('Payment details')}
                                            error={errors.payment_info}
                                            hint={localize('e.g. your bank/e-wallet account details')}
                                            is_relative_hint
                                            className='my-profile__form-textarea'
                                            has_character_counter
                                            initial_character_count={my_profile_store.payment_info.length}
                                            max_characters={300}
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
                                            is_relative_hint
                                            className='my-profile__form-textarea'
                                            has_character_counter
                                            initial_character_count={my_profile_store.default_advert_description.length}
                                            max_characters={300}
                                        />
                                    )}
                                </Field>
                                <div className='my-profile__footer'>
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
        </ContentWrapper>
    );
});

export default MyProfile;
