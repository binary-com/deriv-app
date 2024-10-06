import React, { ReactNode } from 'react';
import { LegacyLossIcon, LegacySettlementFillIcon, LegacyWarningIcon, LegacyWonIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import './WalletAlertMessage.scss';

const typeMapper = {
    error: {
        color: 'error',
        fill: '#EC3F3F',
        icon: LegacyLossIcon,
    },
    info: {
        color: 'blue',
        fill: '#377CFC',
        icon: LegacySettlementFillIcon,
    },
    success: {
        color: 'success',
        fill: '#4BB4B3',
        icon: LegacyWonIcon,
    },
    warning: {
        color: 'warning',
        fill: '#FFD166',
        icon: LegacyWarningIcon,
    },
} as const;

type TProps = {
    children?: ReactNode;
    message: ReactNode;
    type: 'error' | 'info' | 'success' | 'warning';
};

const WalletAlertMessage: React.FC<TProps> = ({ children, message, type }) => {
    const Icon = typeMapper[type].icon;
    const color = typeMapper[type].color;
    const fill = typeMapper[type].fill;

    return (
        <div className='wallets-alert-message' data-testid='dt_wallet-alert-message'>
            <div className='wallets-alert-message__icon-container'>
                <div className='wallets-alert-message__icon-container__line' />
                <Icon className='wallets-alert-message__icon-container__icon' fill={fill} iconSize='xs' />
            </div>
            <div className='wallets-alert-message__message-container'>
                <Text align='start' color={color} size='xs'>
                    {message}
                </Text>
            </div>
            {children && <>{children}</>}
        </div>
    );
};

export default WalletAlertMessage;
