import React from 'react';
import { useHistory } from 'react-router';
import { routes, isTabletOs } from '@deriv/shared';
import { Button, Icon, Popover } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { LoginButton } from '../login-button.jsx';
import { SignupButton } from '../signup-button.jsx';
import { BinaryLink } from '../../../Routes/index.js';
import ToggleNotifications from '../toggle-notifications.jsx';
import AccountInfoWallets from './account-info-wallets';
import 'Sass/app/_common/components/account-switcher.scss';

const AccountActionsWallets = observer(() => {
    const { client, ui, notifications } = useStore();
    const { is_logged_in, accounts, loginid } = client;
    const { openRealAccountSignup, toggleAccountsDialog, is_mobile_or_tablet, is_accounts_switcher_on } = ui;
    const { is_notifications_visible, notifications: notificationsArray, toggleNotificationsModal } = notifications;

    const notifications_count = notificationsArray?.length;

    const active_account = accounts?.[loginid ?? ''];
    const is_virtual = active_account?.is_virtual;
    const currency = active_account?.currency;

    const history = useHistory();

    const handleManageFundsRedirect = () => {
        history.push(routes.wallets_transfer, { toAccountLoginId: loginid });
    };

    const accountSettings = (
        <BinaryLink className='account-settings-toggle' to={routes.personal_details}>
            <Icon icon='IcUserOutline' />
        </BinaryLink>
    );

    if (!is_logged_in) {
        return (
            <React.Fragment>
                <LoginButton className='acc-info__button' />
                <SignupButton className='acc-info__button' />
            </React.Fragment>
        );
    }

    if (is_mobile_or_tablet) {
        return (
            <React.Fragment>
                <AccountInfoWallets is_dialog_on={is_accounts_switcher_on} toggleDialog={toggleAccountsDialog} />
                <div className='acc-info__wallets-notification-icon'>
                    <ToggleNotifications
                        count={notifications_count}
                        is_visible={is_notifications_visible}
                        toggleDialog={toggleNotificationsModal}
                        tooltip_message={undefined}
                    />
                </div>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <ToggleNotifications
                count={notifications_count}
                is_visible={is_notifications_visible}
                toggleDialog={toggleNotificationsModal}
                tooltip_message={<Localize i18n_default_text='View notifications' />}
                should_disable_pointer_events
                showPopover={!isTabletOs}
            />
            {isTabletOs ? (
                accountSettings
            ) : (
                <Popover
                    classNameBubble='account-settings-toggle__tooltip'
                    alignment='bottom'
                    message={<Localize i18n_default_text='Manage account settings' />}
                    should_disable_pointer_events
                    zIndex='9999'
                >
                    {accountSettings}
                </Popover>
            )}
            <AccountInfoWallets is_dialog_on={is_accounts_switcher_on} toggleDialog={toggleAccountsDialog} />
            {!is_virtual && !currency && (
                <div className='set-currency'>
                    <Button
                        onClick={() => openRealAccountSignup('set_currency')}
                        has_effect
                        type='button'
                        text={localize('Set currency')}
                        primary
                    />
                </div>
            )}
            {currency && (
                <Button
                    className='acc-info__button'
                    has_effect
                    text={localize('Manage funds')}
                    onClick={handleManageFundsRedirect}
                    primary
                />
            )}
        </React.Fragment>
    );
});

export { AccountActionsWallets };
