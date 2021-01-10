import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { isMobile } from '@deriv/shared';
import AppCardHeader from './app-card-items/app-card-header.jsx';
import AppCardBody from './app-card-items/app-card-body.jsx';
import AppCardActions from './app-card-items/app-card-actions.jsx';
import AppCardFooter from './app-card-items/app-card-footer.jsx';
import { useHover } from './hooks/use-hover';

const RealAppCardBAckground = ({ is_swap_free, variant }) => (
    <svg className='dc-app-card__wrapper--real-background'>
        <path
            d={
                variant === 'default'
                    ? isMobile()
                        ? 'M0 0h272v12L0 44V0z'
                        : 'M0 0h280v16L0 60V0z'
                    : 'M0 0h216v9L0 32V0z'
            }
            fill={is_swap_free ? '#D8E4E6' : '#F0F0F0'}
        />
        <path
            d={
                variant === 'default'
                    ? isMobile()
                        ? 'M0 0h272v12L0 30V0z'
                        : 'M0 0h280v16L0 40V0z'
                    : 'M0 0h216v9L0 21V0z'
            }
            fill={is_swap_free ? '#BDD2D5' : '#F9F9F9'}
        />
    </svg>
);

const AppCard = ({
    amount,
    app_icon,
    app_name,
    broker,
    currency,
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
}) => {
    const [card_ref, is_hovered] = useHover();
    const getFontColor = () => {
        if (is_virtual) return 'colored-background';
        return 'general';
    };
    return (
        <React.Fragment>
            <div
                className={classNames('dc-app-card__wrapper', {
                    'dc-app-card__wrapper--virtual': is_virtual,
                    'dc-app-card__wrapper--real': !is_virtual,
                    [`dc-app-card__wrapper--${variant}`]: true,
                    'dc-app-card__wrapper--virtual-swap-free': is_virtual && is_swap_free,
                })}
                ref={isMobile() || !show_hover_actions ? null : card_ref}
            >
                {!is_virtual && <RealAppCardBAckground is_swap_free={is_swap_free} variant={variant} />}
                {is_virtual && variant === 'default' && (
                    <AppCardHeader is_swap_free={is_swap_free} onAddRealClick={onAddRealClick} />
                )}
                <AppCardBody
                    amount={amount}
                    app_icon={app_icon}
                    app_name={app_name}
                    currency={currency}
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
                        getFontColor={getFontColor}
                        login_id={login_id}
                        server={server}
                        variant={variant}
                    />
                )}
                {show_hover_actions && variant !== 'micro' && !isMobile() && is_hovered && (
                    <AppCardActions
                        is_virtual={is_virtual}
                        onDepositClick={onDepositClick}
                        onPlayClick={onPlayClick}
                        onSettingsClick={onSettingsClick}
                        onTransactionsClick={onTransactionsClick}
                        onWithdrawClick={onWithdrawClick}
                    />
                )}
            </div>
        </React.Fragment>
    );
};

AppCard.propTypes = {
    amount: PropTypes.string,
    app_icon: PropTypes.string,
    app_name: PropTypes.string,
    broker: PropTypes.string,
    currency: PropTypes.string,
    is_swap_free: PropTypes.bool,
    is_virtual: PropTypes.bool,
    linked_wallet: PropTypes.string,
    login_id: PropTypes.string,
    onAddRealClick: PropTypes.func,
    onDepositClick: PropTypes.func,
    onPlayClick: PropTypes.func,
    onSettingsClick: PropTypes.func,
    onTransactionsClick: PropTypes.func,
    onWithdrawClick: PropTypes.func,
    server: PropTypes.string,
    show_footer: PropTypes.bool,
    show_hover_actions: PropTypes.bool,
    variant: PropTypes.oneOf(['default', 'mini', 'micro']),
};

export default AppCard;
