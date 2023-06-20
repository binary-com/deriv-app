import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { useIsRealAccountNeededForCashier } from '@deriv/hooks';
import { isExternalLink, isMobile, routes, getStaticUrl } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { BinaryLink } from 'App/Components/Routes';

type TMenuLink = {
    data_testid: string;
    icon: string;
    is_active: boolean;
    is_disabled: boolean;
    is_hidden: boolean;
    link_to: string;
    onClickLink: () => void;
    suffix_icon: string;
    text: string;
};

const MenuLink = observer(
    ({
        data_testid,
        icon = '',
        is_active,
        is_disabled,
        is_hidden,
        link_to = '',
        onClickLink,
        suffix_icon = '',
        text,
    }: Partial<TMenuLink>) => {
        if (is_hidden) return null;

        const { common, ui, client } = useStore();
        const { setMobileLanguageMenuOpen } = common;
        const deriv_static_url = getStaticUrl(link_to);
        const history = useHistory();
        const { has_any_real_account, is_virtual } = client;
        const { toggleReadyToDepositModal, toggleNeedRealAccountForCashierModal } = ui;
        const real_account_needed_for_cashier = useIsRealAccountNeededForCashier();

        const is_cashier_link = [
            routes.cashier_deposit,
            routes.cashier_withdrawal,
            routes.cashier_acc_transfer,
        ].includes(link_to);

        const traders_hub_path = window.location.pathname === routes.traders_hub;

        if (isMobile() && link_to === routes.languages) {
            return (
                <div
                    className={classNames('header__menu-mobile-link', {
                        'header__menu-mobile-link--disabled': is_disabled,
                    })}
                    onClick={() => setMobileLanguageMenuOpen(true)}
                    data-testid={data_testid}
                >
                    <Icon className='header__menu-mobile-link-icon' icon={icon} />
                    <span className='header__menu-mobile-link-text'>{text}</span>
                    {suffix_icon && <Icon className='header__menu-mobile-link-suffix-icon' icon={suffix_icon} />}
                </div>
            );
        }
        if (real_account_needed_for_cashier && is_cashier_link && traders_hub_path) {
            const handleClickCashier = () => {
                onClickLink?.();
                toggleNeedRealAccountForCashierModal();
            };
            return (
                <div
                    className={classNames('header__menu-mobile-link', {
                        'header__menu-mobile-link--disabled': is_disabled,
                    })}
                    onClick={handleClickCashier}
                    data-testid={data_testid}
                >
                    <Icon className='header__menu-mobile-link-icon' icon={icon} />
                    <span className='header__menu-mobile-link-text'>{text}</span>
                    {suffix_icon && <Icon className='header__menu-mobile-link-suffix-icon' icon={suffix_icon} />}
                </div>
            );
        }

        if (is_cashier_link && is_virtual && !has_any_real_account) {
            const toggle_modal_routes =
                window.location.pathname === routes.root || window.location.pathname === routes.traders_hub;

            const handleClickCashier = () => {
                if (toggle_modal_routes) {
                    toggleReadyToDepositModal();
                }
                onClickLink?.();
            };
            return (
                <div
                    className={classNames('header__menu-mobile-link', {
                        'header__menu-mobile-link--disabled': is_disabled,
                    })}
                    onClick={handleClickCashier}
                    data-testid={data_testid}
                >
                    <Icon className='header__menu-mobile-link-icon' icon={icon} />
                    <span className='header__menu-mobile-link-text'>{text}</span>
                    {suffix_icon && <Icon className='header__menu-mobile-link-suffix-icon' icon={suffix_icon} />}
                </div>
            );
        }

        if (!link_to) {
            return (
                <div
                    className={classNames('header__menu-mobile-link', {
                        'header__menu-mobile-link--disabled': is_disabled,
                    })}
                    data-testid={data_testid}
                >
                    <Icon className='header__menu-mobile-link-icon' icon={icon} />
                    <span className='header__menu-mobile-link-text'>{text}</span>
                    {suffix_icon && <Icon className='header__menu-mobile-link-suffix-icon' icon={suffix_icon} />}
                </div>
            );
        } else if (deriv_static_url && isExternalLink(link_to)) {
            return (
                <a
                    className={classNames('header__menu-mobile-link', {
                        'header__menu-mobile-link--disabled': is_disabled,
                        'header__menu-mobile-link--active': is_active,
                    })}
                    href={link_to}
                    data-testid={data_testid}
                >
                    <Icon className='header__menu-mobile-link-icon' icon={icon} />
                    <Text
                        className={text === localize('Trade') ? '' : 'header__menu-mobile-link-text'}
                        as='h3'
                        size='xs'
                        weight={window.location.pathname === '/' && text === localize('Trade') ? 'bold' : undefined}
                    >
                        {text}
                    </Text>
                    {suffix_icon && <Icon className='header__menu-mobile-link-suffix-icon' icon={suffix_icon} />}
                </a>
            );
        }

        return (
            <BinaryLink
                to={link_to}
                className={classNames('header__menu-mobile-link', {
                    'header__menu-mobile-link--disabled': is_disabled,
                    'header__menu-mobile-link--active': is_active,
                })}
                active_class='header__menu-mobile-link--active'
                onClick={onClickLink}
                data-testid={data_testid}
            >
                <Icon className='header__menu-mobile-link-icon' icon={icon} />
                <Text
                    className={text === localize('Trade') ? '' : 'header__menu-mobile-link-text'}
                    as='h3'
                    size='xs'
                    weight={window.location.pathname === '/' && text === localize('Trade') ? 'bold' : undefined}
                >
                    {text}
                </Text>
                {suffix_icon && <Icon className='header__menu-mobile-link-suffix-icon' icon={suffix_icon} />}
            </BinaryLink>
        );
    }
);

export { MenuLink };
