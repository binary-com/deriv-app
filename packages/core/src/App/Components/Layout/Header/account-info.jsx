import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { DesktopWrapper, Icon, MobileWrapper, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getCurrencyDisplayCode } from '@deriv/shared';
import AccountSwitcher from 'App/Containers/AccountSwitcher';
import AccountSwitcherMobile from 'App/Containers/AccountSwitcher/account-switcher-mobile';
import AccountInfoWrapper from './account-info-wrapper';
import AccountInfoIcon from './account-info-icon';
import DisplayAccountType from './display-account-type';

const AccountInfo = ({
    acc_switcher_disabled_message,
    account_type = '',
    balance,
    currency,
    disableApp,
    enableApp,
    is_dialog_on,
    is_eu,
    is_virtual,
    toggleDialog,
    is_disabled,
    is_mobile,
}) => {
    const currency_lower = currency?.toLowerCase();

    return (
        <div className='acc-info__wrapper'>
            <div className='acc-info__separator' />
            <AccountInfoWrapper
                is_disabled={is_disabled}
                disabled_message={acc_switcher_disabled_message}
                is_mobile={is_mobile}
            >
                <div
                    data-testid='dt_acc_info'
                    id='dt_core_account-info_acc-info'
                    className={classNames('acc-info', {
                        'acc-info--show': is_dialog_on,
                        'acc-info--is-virtual': is_virtual,
                        'acc-info--is-disabled': is_disabled,
                    })}
                    onClick={is_disabled ? undefined : () => toggleDialog()}
                >
                    <span className='acc-info__id'>
                        <DesktopWrapper>
                            <AccountInfoIcon is_virtual={is_virtual} currency={currency_lower} />
                        </DesktopWrapper>
                        <MobileWrapper>
                            {(is_virtual || currency) && (
                                <AccountInfoIcon is_virtual={is_virtual} currency={currency_lower} />
                            )}
                        </MobileWrapper>
                    </span>
                    {(typeof balance !== 'undefined' || !currency) && (
                        <div className='acc-info__account-type-and-balance'>
                            <p
                                data-testid='dt_balance'
                                className={classNames('acc-info__balance', {
                                    'acc-info__balance--no-currency': !currency && !is_virtual,
                                })}
                            >
                                {!currency ? (
                                    <Localize i18n_default_text='No currency assigned' />
                                ) : (
                                    `${balance} ${getCurrencyDisplayCode(currency)}`
                                )}
                            </p>
                            <Text size='xxxs' line_height='s'>
                                <DisplayAccountType account_type={account_type} is_eu={is_eu} />
                            </Text>
                        </div>
                    )}
                    {is_disabled ? (
                        <Icon data_testid='dt_lock_icon' icon='IcLock' />
                    ) : (
                        <Icon
                            data_testid='dt_select_arrow'
                            icon='IcChevronDownBold'
                            className='acc-info__select-arrow'
                        />
                    )}
                </div>
            </AccountInfoWrapper>
            <MobileWrapper>
                <AccountSwitcherMobile
                    is_visible={is_dialog_on}
                    disableApp={disableApp}
                    enableApp={enableApp}
                    toggle={toggleDialog}
                />
            </MobileWrapper>
            <DesktopWrapper>
                <CSSTransition
                    in={is_dialog_on}
                    timeout={200}
                    classNames={{
                        enter: 'acc-switcher__wrapper--enter',
                        enterDone: 'acc-switcher__wrapper--enter-done',
                        exit: 'acc-switcher__wrapper--exit',
                    }}
                    unmountOnExit
                >
                    <div className='acc-switcher__wrapper'>
                        <AccountSwitcher is_visible={is_dialog_on} toggle={toggleDialog} />
                    </div>
                </CSSTransition>
            </DesktopWrapper>
        </div>
    );
};

AccountInfo.propTypes = {
    acc_switcher_disabled_message: PropTypes.string,
    account_type: PropTypes.string,
    balance: PropTypes.string,
    currency: PropTypes.string,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_dialog_on: PropTypes.bool,
    is_disabled: PropTypes.bool,
    is_eu: PropTypes.bool,
    is_virtual: PropTypes.bool,
    is_mobile: PropTypes.bool,
    loginid: PropTypes.string,
    toggleDialog: PropTypes.func,
};

export default AccountInfo;
