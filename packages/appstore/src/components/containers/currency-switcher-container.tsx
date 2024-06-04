import * as React from 'react';
import clsx from 'clsx';
import { Icon } from '@deriv/components';
import { Jurisdiction } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import CurrencyIcon, { Currency } from 'Assets/svgs/currency';
import TradingPlatformIcon from 'Assets/svgs/trading-platform';
import './currency-switcher-container.scss';

interface CurrentSwitcherContainerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    actions?: React.ReactNode;
    has_interaction?: boolean;
    icon: Currency | 'Options' | 'Unknown';
    title?: React.ReactNode;
    show_dropdown?: boolean;
}
type CurrencyPlatformIconProps = {
    icon: Currency | 'Options';
};

type DropdownProps = Omit<
    CurrentSwitcherContainerProps,
    'actions' | 'children' | 'className' | 'has_interaction' | 'icon' | 'title' | 'show_dropdown'
>;

const CurrencyPlatformIcon = ({ icon }: CurrencyPlatformIconProps) =>
    icon === 'Options' ? (
        <TradingPlatformIcon icon={icon} size={32} className='currency-switcher__currency--icon' />
    ) : (
        <CurrencyIcon icon={icon} size={32} className='currency-switcher__currency--icon' />
    );

const Dropdown = observer(({ ...props }: DropdownProps) => {
    const store = useStore();
    const { modules, traders_hub } = store;
    const { is_eu_user, is_demo } = traders_hub;
    const { current_list } = modules.cfd;

    const has_mf_mt5_account = Object.keys(current_list)
        .map(key => current_list[key])
        .some(account => account.landing_company_short === Jurisdiction.MALTA_INVEST);

    if ((is_eu_user && has_mf_mt5_account) || is_demo) {
        return null;
    }
    return (
        <div data-testid='dt_currency-switcher__arrow' className='currency-switcher-container__arrow' {...props}>
            <Icon icon='IcChevronDownBold' />
        </div>
    );
});

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
        const { client } = store;

        const { document_status } = client.authentication_status;

        return (
            <div
                className={clsx(className, 'currency-switcher-container', {
                    'currency-switcher-container--has-interaction': has_interaction,
                })}
            >
                <div className='currency-switcher-container--left'>
                    <CurrencyPlatformIcon icon={icon} />
                    <div
                        className={clsx(
                            'currency-switcher-container__content',
                            `currency-switcher-container--${document_status || 'failed' || 'pending' || 'default'}`
                        )}
                    >
                        <div
                            className={clsx(
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
                    {show_dropdown && <Dropdown {...props} />}
                </div>
            </div>
        );
    }
);

export default CurrentSwitcherContainer;
