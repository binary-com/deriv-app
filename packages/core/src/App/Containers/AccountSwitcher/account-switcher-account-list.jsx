import classNames from 'classnames';
import React from 'react';
import { Icon, Money, Button, Text } from '@deriv/components';
import { formatMoney, getCurrencyName, getCFDAccountDisplay, getCurrencyDisplayCode, isBot } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';

const AccountList = ({
    balance,
    currency,
    currency_icon,
    display_type,
    has_balance,
    has_error,
    has_reset_balance,
    is_dark_mode_on,
    is_disabled,
    is_virtual,
    is_eu,
    loginid,
    market_type,
    redirectAccount,
    onClickResetVirtualBalance,
    selected_loginid,
    server,
    shortcode,
    sub_account_type,
    platform,
    should_show_server_name,
}) => {
    const currency_badge = currency ? currency_icon : 'IcCurrencyUnknown';
    return (
        <React.Fragment>
            <div
                id={`dt_${loginid}`}
                className={classNames('acc-switcher__account', {
                    'acc-switcher__account--selected': loginid === selected_loginid,
                    'acc-switcher__account--disabled': is_disabled,
                })}
                onClick={() => {
                    if (!is_disabled) redirectAccount();
                }}
            >
                <span className='acc-switcher__id'>
                    <Icon
                        icon={is_virtual ? 'IcCurrencyVirtual' : currency_badge}
                        className={'acc-switcher__id-icon'}
                        size={24}
                    />
                    <span>
                        {display_type === 'currency' ? (
                            <CurrencyDisplay currency={currency} loginid={loginid} is_virtual={is_virtual} />
                        ) : (
                            <AccountDisplay
                                is_eu={is_eu}
                                market_type={market_type}
                                server={server}
                                sub_account_type={sub_account_type}
                                has_error={has_error}
                                platform={platform}
                                is_dark_mode_on={is_dark_mode_on}
                                shortcode={shortcode}
                                should_show_server_name={should_show_server_name}
                            />
                        )}
                        <div
                            className={classNames('acc-switcher__loginid-text', {
                                'acc-switcher__loginid-text--disabled': has_error,
                            })}
                        >
                            {loginid}
                        </div>
                    </span>
                    {has_reset_balance ? (
                        <Button
                            is_disabled={is_disabled}
                            onClick={e => {
                                e.stopPropagation();
                                onClickResetVirtualBalance();
                            }}
                            className='acc-switcher__reset-account-btn'
                            secondary
                            small
                        >
                            {localize('Reset balance')}
                        </Button>
                    ) : (
                        has_balance && (
                            <Text
                                size='xs'
                                color='prominent'
                                styles={{ fontWeight: 'inherit' }}
                                className='acc-switcher__balance'
                            >
                                {currency && (
                                    <Money
                                        currency={getCurrencyDisplayCode(currency)}
                                        amount={formatMoney(currency, balance, true)}
                                        should_format={false}
                                        show_currency
                                    />
                                )}
                            </Text>
                        )
                    )}
                </span>
            </div>
        </React.Fragment>
    );
};

const CurrencyDisplay = ({ currency, loginid, is_virtual }) => {
    const account_type = loginid.replace(/\d/g, '');

    if (account_type === 'MF') {
        return <Localize i18n_default_text='Multipliers' />;
    }

    if (is_virtual) {
        return <Localize i18n_default_text='Demo' />;
    }

    if (!currency) {
        return <Localize i18n_default_text='No currency assigned' />;
    }

    return getCurrencyName(currency);
};

const AccountDisplay = ({
    has_error,
    market_type,
    sub_account_type,
    platform,
    server,
    is_dark_mode_on,
    is_eu,
    shortcode,
    should_show_server_name,
}) => {
    const account_title = getCFDAccountDisplay({ market_type, sub_account_type, platform, is_eu, shortcode });
    // TODO: Remove once account with error has market_type and sub_account_type in details response
    const getServerName = React.useCallback(account => {
        if (account) {
            const server_region = account.server_info?.geolocation?.region;
            if (server_region) {
                return `${server_region} ${
                    account?.server_info?.geolocation?.sequence === 1 ? '' : account?.server_info?.geolocation?.sequence
                }`;
            }
        }
        return '';
    }, []);
    if (has_error)
        return (
            <div>
                <Text color='disabled' size='xs'>
                    <Localize i18n_default_text='Unavailable' />
                </Text>
                {server?.server_info?.geolocation &&
                    should_show_server_name &&
                    market_type === 'synthetic' &&
                    shortcode === 'svg' && (
                        <Text color='less-prominent' size='xxs' className='badge-server badge-server--disabled'>
                            {getServerName(server)}
                        </Text>
                    )}
            </div>
        );

    const is_bot = isBot();
    return (
        <div>
            {/* TODO: Remove below condition once deriv x changes are completed */}
            {platform === 'dxtrade' && account_title === localize('Derived') ? localize('Synthetic') : account_title}
            {server?.server_info?.geolocation &&
                should_show_server_name &&
                market_type === 'synthetic' &&
                shortcode === 'svg' && (
                    <Text
                        color={is_dark_mode_on ? 'general' : 'colored-background'}
                        size='xxs'
                        className={classNames('badge-server', {
                            'badge-server-bot': is_bot,
                        })}
                    >
                        {getServerName(server)}
                    </Text>
                )}
        </div>
    );
};

export default AccountList;
