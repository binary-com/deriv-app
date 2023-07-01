import React, { HTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import { Icon } from '@deriv/components';
import CurrencyIcon, { Currency } from 'Assets/svgs/currency';
import { useStore, observer } from '@deriv/stores';
import TradingPlatformIcon from 'Assets/svgs/trading-platform';
import './currency-switcher-container.scss';

interface CurrentSwitcherContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    actions?: ReactNode;
    has_interaction?: boolean;
    icon: Currency | 'Options';
    title: ReactNode;
    show_dropdown?: boolean;
}

const CurrentSwitcherContainer = observer(
    ({
        actions,
        children,
        className,
        has_interaction = false,
        icon,
        title,
        show_dropdown = true,
        ...props
    }: CurrentSwitcherContainerProps) => {
        const store = useStore();
        const { client, modules, traders_hub } = store;

        const { document_status } = client.authentication_status;
        const { is_eu_user, is_demo } = traders_hub;
        const { current_list } = modules.cfd;

        const has_mf_mt5_account = Object.keys(current_list)
            .map(key => current_list[key])
            .some(account => account.landing_company_short === 'maltainvest');

        const Dropdown = () => {
            const icon_dropdown = (
                <div
                    data-testid='dt_currency-switcher__arrow'
                    className='currency-switcher-container__arrow'
                    {...props}
                >
                    <Icon icon='IcChevronDownBold' />
                </div>
            );

            if ((is_eu_user && has_mf_mt5_account) || is_demo) {
                return null;
            }
            return icon_dropdown;
        };

        const CurrencyPlatformIcon = () =>
            icon === 'Options' ? (
                <TradingPlatformIcon icon={icon} size={32} className='currency-switcher__currency--icon' />
            ) : (
                <CurrencyIcon icon={icon} size={32} className='currency-switcher__currency--icon' />
            );

        return (
            <div
                className={classNames(className, 'currency-switcher-container', {
                    'currency-switcher-container--has-interaction': has_interaction,
                })}
            >
                <div className='currency-switcher-container--left'>
                    <CurrencyPlatformIcon />
                    <div
                        className={classNames(
                            'currency-switcher-container__content',
                            `currency-switcher-container--${document_status || 'failed' || 'pending' || 'default'}`
                        )}
                    >
                        <div
                            className={classNames(
                                'currency-switcher-container__content--text',
                                `currency-switcher-container__content--text--${
                                    document_status || 'failed' || 'pending' || 'default'
                                }`
                            )}
                        >
                            {title}
                        </div>
                        {children}
                    </div>
                </div>
                <div className='currency-switcher-container--right'>
                    {actions}
                    {show_dropdown && <Dropdown />}
                </div>
            </div>
        );
    }
);

export default CurrentSwitcherContainer;
