import React from 'react';
import { isMobileOrTablet } from '@deriv/shared';
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

type TAlertMessageProps =
    | {
          variant: 'with-action-button';
          button_label: string;
          message: string | JSX.Element;
          onClickHandler: VoidFunction;
          type: 'info' | 'error' | 'success';
      }
    | {
          variant: 'base';
          message: string | JSX.Element;
          type: 'info' | 'error' | 'success';
      };

const AlertMessage = (props: TAlertMessageProps) => {
    const { type, message, variant } = props;

    const icon = type_mapper[type].icon;
    const color = type_mapper[type].color;

    return (
        <div className='alert-message' data-testid='dt_alert_message'>
            <div className='alert-message__icon-container'>
                <div className='icon-container__line' />
                <div className='icon-container__icon'>
                    <Icon icon={icon} custom_color={`var(--text-${color})`} data_testid={`dt_${icon}`} />
                </div>
            </div>
            <div className='alert-message__message-container'>
                <Text size={isMobileOrTablet() ? 'xxxs' : 'xxs'} color={color}>
                    {message}
                </Text>
            </div>
            {variant === 'with-action-button' && props.button_label && (
                <div className='alert-message__button-container'>
                    <Button primary small onClick={props.onClickHandler}>
                        {props.button_label}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AlertMessage;
