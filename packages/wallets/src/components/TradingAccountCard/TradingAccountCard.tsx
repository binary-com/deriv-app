import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';
import TradingAccountCardButton from './TradingAccountCardButton';
import TradingAccountCardContent from './TradingAccountCardContent';
import TradingAccountCardIcon from './TradingAccountCardIcon';
import TradingAccountCardSection from './TradingAccountCardSection';
import './TradingAccountCard.scss';

export type TCommonProps = {
    children: React.ReactNode;
    className?: string;
    'data-testid'?: string;
};

type TProps = {
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
};

const TradingAccountCard = ({ children, className, disabled, onClick }: PropsWithChildren<TProps>) => {
    const handleClick = () => {
        if (!disabled && onClick) {
            onClick();
        }
    };

    return (
        <div
            aria-disabled={disabled}
            className={classNames('wallets-trading-account-card', className, {
                'wallets-trading-account-card--disabled': disabled,
            })}
            data-testid='dt_wallets_trading_account_card'
            onClick={handleClick}
            onKeyDown={handleClick}
            tabIndex={disabled ? -1 : 0} // Remove focusability if disabled
        >
            {children}
        </div>
    );
};

TradingAccountCard.Icon = TradingAccountCardIcon;
TradingAccountCard.Content = TradingAccountCardContent;
TradingAccountCard.Button = TradingAccountCardButton;
TradingAccountCard.Section = TradingAccountCardSection;

export default TradingAccountCard;
