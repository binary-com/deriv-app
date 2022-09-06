import classNames from 'classnames';
import React from 'react';
import { isMobile } from '@deriv/shared';
import RealAppCardBackground from './app-card-items/real-app-card-background';
import AppCardHeader from './app-card-items/app-card-header';
import AppCardBody from './app-card-items/app-card-body';
import AppCardActions from './app-card-items/app-card-actions';
import AppCardFooter from './app-card-items/app-card-footer';
import { useHover } from '../../hooks/use-hover';
import { TCardLables, TVariant } from '../../types';

type TAppCardProps = {
    amount: string;
    app_icon: string;
    app_name: string;
    broker: string;
    currency: string;
    getCardLabels: () => TCardLables;
    is_swap_free: boolean;
    is_virtual: boolean;
    linked_wallet: string;
    login_id: string;
    onAddRealClick: () => void;
    onDepositClick: () => void;
    onPlayClick: () => void;
    onSettingsClick: () => void;
    onTransactionsClick: () => void;
    onWithdrawClick: () => void;
    server: string;
    show_footer: boolean;
    show_hover_actions: boolean;
    variant: TVariant;
};

const AppCard = ({
    amount,
    app_icon,
    app_name,
    broker,
    currency,
    getCardLabels,
    is_swap_free,
    is_virtual,
    linked_wallet,
    login_id,
    onAddRealClick,
    onDepositClick,
    onPlayClick,
    onSettingsClick,
    onTransactionsClick,
    onWithdrawClick,
    server,
    show_footer,
    show_hover_actions,
    variant = 'default',
}: TAppCardProps) => {
    const [card_ref, is_hovered] = useHover(null, true);
    const getFontColor = () => {
        if (is_virtual) return 'colored-background';
        return 'general';
    };
    const card_labels = getCardLabels();

    return (
        <div
            className={classNames('dc-app-card__wrapper', {
                'dc-app-card__wrapper--virtual': is_virtual,
                'dc-app-card__wrapper--real': !is_virtual,
                'dc-app-card__wrapper--default': variant === 'default',
                'dc-app-card__wrapper--mini': variant === 'mini',
                'dc-app-card__wrapper--micro': variant === 'micro',
                'dc-app-card__wrapper--virtual-swap-free': is_virtual && is_swap_free,
            })}
            ref={isMobile() || !show_hover_actions ? null : card_ref}
        >
            {!is_virtual && <RealAppCardBackground is_swap_free={is_swap_free} variant={variant} />}
            {is_virtual && variant === 'default' && (
                <AppCardHeader card_labels={card_labels} is_swap_free={is_swap_free} onAddRealClick={onAddRealClick} />
            )}
            <AppCardBody
                amount={amount}
                app_icon={app_icon}
                app_name={app_name}
                currency={currency}
                card_labels={card_labels}
                getFontColor={getFontColor}
                is_swap_free={is_swap_free}
                is_virtual={is_virtual}
                linked_wallet={linked_wallet}
                onPlayClick={onPlayClick}
                show_footer={show_footer}
                show_hover_actions={show_hover_actions}
                variant={variant}
            />
            {show_footer && variant !== 'micro' && !is_hovered && (
                <AppCardFooter
                    broker={broker}
                    card_labels={card_labels}
                    getFontColor={getFontColor}
                    login_id={login_id}
                    server={server}
                    variant={variant}
                />
            )}
            {show_hover_actions && variant !== 'micro' && !isMobile() && is_hovered && (
                <AppCardActions
                    card_labels={card_labels}
                    is_virtual={is_virtual}
                    onDepositClick={onDepositClick}
                    onPlayClick={onPlayClick}
                    onSettingsClick={onSettingsClick}
                    onTransactionsClick={onTransactionsClick}
                    onWithdrawClick={onWithdrawClick}
                />
            )}
        </div>
    );
};

export default AppCard;
