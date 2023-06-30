import React from 'react';
import classNames from 'classnames';
import { Checkbox, Dropdown, Icon, Text } from '@deriv/components';
import { isEmptyObject } from '@deriv/shared';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { TPaymentMethod } from 'Types';

type TPaymentMethodCardProps = {
    add_payment_method?: string;
    disabled?: boolean;
    is_add?: boolean;
    is_vertical_ellipsis_visible?: boolean;
    label?: string | undefined;
    large?: boolean;
    medium?: boolean;
    onClick?: () => void;
    onClickAdd?: () => void;
    payment_method?: TPaymentMethod;
    show_payment_method_name?: boolean;
    small?: boolean;
    style?: object;
};

const PaymentMethodCard = ({
    add_payment_method,
    disabled,
    is_add = false,
    is_vertical_ellipsis_visible = true,
    label = undefined,
    large,
    medium,
    onClick = () => {
        // do nothing
    },
    onClickAdd = () => {
        // do nothing
    },
    payment_method,
    show_payment_method_name = true,
    small,
    style,
}: TPaymentMethodCardProps) => {
    const { general_store, my_ads_store, my_profile_store } = useStores();
    const method = !is_add && payment_method?.display_name ? payment_method?.display_name.replace(/\s|-/gm, '') : '';
    const payment_account = payment_method?.fields?.account?.value;
    const payment_account_name = payment_method?.display_name;
    const payment_bank_name = payment_method?.fields?.bank_name?.value;
    const payment_name = payment_method?.fields?.name?.value;
    const payment_method_name = payment_method?.display_name.replace(/\s|-/gm, '');
    const icon_method =
        payment_method_name === 'BankTransfer' || payment_method_name === 'Other'
            ? `IcCashier${payment_method_name}`
            : 'IcCashierEwallet';

    if (is_add) {
        return (
            <div
                className={classNames('payment-method-card--add', {
                    'payment-method-card--large': large,
                    'payment-method-card--medium': medium,
                    'payment-method-card--small': small,
                })}
                onClick={onClickAdd}
                style={style}
            >
                <Icon
                    icon='IcAddCircle'
                    className='payment-method-card--add-icon'
                    custom_color='var(--brand-red-coral)'
                    data_testid='dt_payment_method_card_add_icon'
                    size={32}
                />
                <Text align='center' color={disabled ? 'less-prominent' : 'prominent'} size='xs'>
                    {label || add_payment_method}
                </Text>
            </div>
        );
    }

    return (
        <div
            className={classNames('payment-method-card', {
                'payment-method-card--large': large,
                'payment-method-card--medium': medium,
                'payment-method-card--small': small,
            })}
            onClick={onClick}
            style={style}
        >
            <div className='payment-method-card__header'>
                <Icon className='payment-method-card__icon' icon={icon_method} size={medium || small ? 16 : 24} />
                {is_vertical_ellipsis_visible && (
                    <Dropdown
                        is_align_text_left
                        list={[
                            {
                                text: localize('Edit'),
                                value: 'edit',
                            },
                            {
                                text: localize('Delete'),
                                value: 'delete',
                            },
                        ]}
                        onChange={e => my_profile_store.onEditDeletePaymentMethodCard(e, payment_method)}
                        suffix_icon='IcCashierVerticalEllipsis'
                    />
                )}
                {(general_store.active_index === 2 || general_store.active_index === 0) && (
                    <Checkbox
                        className='payment-method-card__checkbox'
                        disabled={
                            my_ads_store.payment_method_ids.length === 3 &&
                            !my_ads_store.payment_method_ids.includes(payment_method.ID)
                        }
                        label=''
                        onChange={onClick}
                        value={!isEmptyObject(style)}
                    />
                )}
            </div>
            <div className='payment-method-card__body'>
                <Text color='prominent' size={large ? 'xs' : 'xxs'}>
                    {!['BankTransfer', 'Other'].includes(method)
                        ? payment_account_name
                        : show_payment_method_name && payment_method?.display_name}
                </Text>
                <Text color='prominent' size={large ? 'xs' : 'xxs'}>
                    {payment_bank_name || payment_name}
                </Text>
                <Text color='prominent' size={large ? 'xs' : 'xxs'}>
                    {payment_account}
                </Text>
            </div>
        </div>
    );
};

export default PaymentMethodCard;
