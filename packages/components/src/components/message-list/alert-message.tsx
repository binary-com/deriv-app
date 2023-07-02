import React from 'react';
import { isMobile } from '@deriv/shared';
import Button from '../button';
import Icon from '../icon';
import Text from '../text';

const type_mapper = {
    info: {
        icon: 'IcWalletInfoMessageWithThreeDots',
        color: 'status-info-blue',
    },
    error: {
        icon: 'IcWalletErrorMessageWithCross',
        color: 'loss-danger',
    },
    success: {
        icon: 'IcWalletSuccessMessage',
        color: 'profit-success',
    },
};

type TAlertMessageProps = {
    button_label?: string;
    message: string | JSX.Element;
    onClickHandler?: VoidFunction;
    type: 'info' | 'error' | 'success';
};

const AlertMessage = ({ button_label, message, onClickHandler, type }: TAlertMessageProps) => {
    const icon = type_mapper[type].icon;
    const color = type_mapper[type].color;

    return (
        <div className='alert-message'>
            <div className='alert-message__icon-container'>
                <div className='alert-message__icon-container__line' />
                <div className='alert-message__icon-container__icon'>
                    <Icon icon={icon} custom_color={`var(--text-${color})`} />
                </div>
            </div>
            <div className='alert-message__message-container'>
                <Text size={isMobile() ? 'xxxs' : 'xxs'} color={color}>
                    {message}
                </Text>
            </div>
            {button_label && (
                <div className='alert-message__button-container'>
                    <Button primary small onClick={onClickHandler}>
                        {button_label}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AlertMessage;
