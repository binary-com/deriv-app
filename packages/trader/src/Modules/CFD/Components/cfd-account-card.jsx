import classNames from 'classnames';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Icon, Money, Button, Text, DesktopWrapper, MobileWrapper } from '@deriv/components';
import { isMobile, mobileOSDetect, CFD_PLATFORMS } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { CFDAccountCopy } from './cfd-account-copy.jsx';
import { getDXTradeWebTerminalLink, getMT5WebTerminalLink, getPlatformDXTradeDownloadLink } from '../Helpers/constants';

const account_icons = {
    mt5: {
        synthetic: 'IcMt5SyntheticPlatform',
        financial: 'IcMt5FinancialPlatform',
        financial_stp: 'IcMt5FinancialStpPlatform',
    },
    dxtrade: {
        synthetic: 'IcDxtradeSyntheticPlatform',
        financial: 'IcDxtradeFinancialPlatform',
    },
};

const AddTradeServerButton = React.forwardRef(({ onSelectAccount, is_disabled }, ref) => {
    return (
        <div
            onClick={is_disabled ? null : onSelectAccount}
            className={classNames('cfd-account-card__add-server', {
                'cfd-account-card__add-server--disabled': is_disabled,
            })}
            ref={ref}
        >
            <span className='cfd-account-card__add-server--icon'>+</span>
            <Localize i18n_default_text='Add region' />
        </div>
    );
});

AddTradeServerButton.displayName = 'AddTradeServerButton';

const SpecBox = ({ value, is_bold }) => (
    <div className='cfd-account-card__spec-box'>
        <Text size='xs' weight={is_bold ? 'bold' : ''} className='cfd-account-card__spec-text'>
            {value}
        </Text>
        <CFDAccountCopy text={value} className='cfd-account-card__spec-copy' />
    </div>
);

const CFDAccountCardSpecificationTitle = ({ is_collapsed, setCollapsed }) => {
    return (
        <div className='cfd-account-card__specification-title-wrapper'>
            <Text
                className='cfd-account-card__specification-title'
                size='xxs'
                as='div'
                align='center'
                color='less-prominent'
                onClick={() => {
                    setCollapsed(prev => !prev);
                }}
            >
                {localize('Specification')}
                <Icon
                    className={classNames('cfd-account-card__specification-icon', {
                        'cfd-account-card__specification-icon--collapsed': is_collapsed,
                    })}
                    icon='IcChevronDown'
                    color='secondary'
                    size={12}
                />
            </Text>
        </div>
    );
};

const CFDAccountCardAction = ({
    button_label,
    handleClickSwitchAccount,
    has_real_account,
    is_accounts_switcher_on,
    is_button_primary,
    is_disabled,
    is_virtual,
    onSelectAccount,
    type,
}) => {
    if (
        is_virtual &&
        has_real_account &&
        type.category === 'real' &&
        type.type === 'financial_stp' &&
        typeof handleClickSwitchAccount === 'function'
    ) {
        return (
            <div className='cfd-account-card__action-wrapper'>
                <Localize
                    i18n_default_text='<0>Switch to your real account</0><1> to create a DMT5 Financial STP account.</1>'
                    components={[
                        <a
                            className={classNames('cfd-account-card__action-wrapper__link link link--orange', {
                                'cfd-account-card__action-wrapper__link--disabled': is_accounts_switcher_on,
                            })}
                            key={0}
                            onClick={handleClickSwitchAccount}
                        />,
                        <Text key={1} line_height='s' size='xxs' />,
                    ]}
                />
            </div>
        );
    }
    const lbl_add_account =
        type.category === 'real' ? (
            <Localize i18n_default_text='Add real account' />
        ) : (
            <Localize i18n_default_text='Add demo account' />
        );
    const cta_label = button_label || lbl_add_account;
    return (
        <Button
            className='cfd-account-card__account-selection'
            onClick={onSelectAccount}
            type='button'
            is_disabled={is_disabled}
            primary={is_button_primary}
            secondary={!is_button_primary}
            large
        >
            {cta_label}
        </Button>
    );
};

const CFDAccountCard = ({
    button_label,
    commission_message,
    descriptor,
    is_hovered,
    existing_data,
    has_banner,
    has_cfd_account,
    has_cfd_account_error,
    has_real_account,
    is_accounts_switcher_on,
    is_button_primary,
    is_disabled,
    is_logged_in,
    is_virtual,
    onHover,
    platform,
    specs,
    title,
    type,
    onSelectAccount,
    onClickFund,
    onPasswordManager,
    should_show_trade_servers,
    toggleAccountsDialog,
    toggleShouldShowRealAccountsList,
}) => {
    const icon = type.type ? <Icon icon={account_icons[type.platform][type.type]} size={64} /> : null;
    const has_popular_banner = type.type === 'synthetic' && type.category === 'real' && !existing_data;
    const has_demo_banner = type.category === 'demo';
    const has_server_banner =
        is_logged_in &&
        existing_data &&
        type.category === 'real' &&
        type.type === 'synthetic' &&
        existing_data?.server_info;

    const ref = React.useRef();
    const wrapper_ref = React.useRef();
    const button_ref = React.useRef();
    const [is_collapsed, setCollapsed] = React.useState(true);

    React.useEffect(() => {
        if (existing_data) {
            const show = () => {
                onHover?.(existing_data.group);
            };

            ref.current.addEventListener('mouseenter', show);
            button_ref?.current?.addEventListener('mouseenter', show);

            return () => {
                ref.current.removeEventListener('mouseenter', show);
                button_ref?.current?.removeEventListener('mouseenter', () => show);
            };
        }
        return () => {};
    }, [onHover]);

    const getServerName = React.useCallback(
        server => {
            if (server) {
                return `${server.server_info.geolocation.region} ${
                    server.server_info.geolocation.sequence === 1 ? '' : server.server_info.geolocation.sequence
                }`;
            }

            return '';
        },
        [existing_data]
    );

    const handleClickSwitchAccount = () => {
        toggleShouldShowRealAccountsList(true);
        toggleAccountsDialog(true);
    };

    const getDxtradeDownloadLink = () => {
        const os = mobileOSDetect();
        if (os === 'iOS') {
            return getPlatformDXTradeDownloadLink('ios');
        }
        return getPlatformDXTradeDownloadLink('android');
    };

    const is_web_terminal_unsupported = isMobile() && platform === CFD_PLATFORMS.DXTRADE;

    return (
        <div ref={wrapper_ref} className='cfd-account-card__wrapper'>
            <div
                className={classNames('cfd-account-card', { 'cfd-account-card__logged-out': !is_logged_in })}
                ref={ref}
                id={`${type.category}-${type.type}`}
            >
                {has_popular_banner && (
                    <div className='cfd-account-card__banner'>
                        <Localize i18n_default_text='Most popular' />
                    </div>
                )}
                {has_demo_banner && (
                    <div className='cfd-account-card__banner cfd-account-card__banner--demo'>
                        <Localize i18n_default_text='DEMO' />
                    </div>
                )}
                {has_server_banner && (
                    <div className='cfd-account-card__banner cfd-account-card__banner--server'>
                        {getServerName(existing_data)}
                    </div>
                )}
                <div
                    className={classNames('cfd-account-card__type', {
                        'cfd-account-card__type--has-banner': has_banner || has_popular_banner || has_server_banner,
                    })}
                    id={`${platform === CFD_PLATFORMS.DXTRADE ? CFD_PLATFORMS.DXTRADE : CFD_PLATFORMS.MT5}_${
                        type.category
                    }_${type.type}`}
                >
                    {icon}
                    <div className='cfd-account-card__type--description'>
                        <h1 className='cfd-account-card--heading'>{title}</h1>
                        {(!existing_data || !is_logged_in) && (
                            <p className='cfd-account-card--paragraph'>{descriptor}</p>
                        )}
                        {existing_data && existing_data.display_balance && is_logged_in && (
                            <p className='cfd-account-card--balance'>
                                <Money
                                    amount={existing_data.display_balance}
                                    currency={existing_data.currency}
                                    has_sign={existing_data.balance < 0}
                                    show_currency
                                />
                            </p>
                        )}
                    </div>
                </div>
                <div className='cfd-account-card__cta'>
                    {existing_data?.login && is_logged_in && (
                        <CFDAccountCardSpecificationTitle is_collapsed={is_collapsed} setCollapsed={setCollapsed} />
                    )}
                    <div className='cfd-account-card__cta-wrapper'>
                        {existing_data?.login && is_logged_in ? (
                            <React.Fragment>
                                <div
                                    className={classNames('cfd-account-card__specification-content', {
                                        'cfd-account-card__specification-content--is-collapsed': is_collapsed,
                                    })}
                                >
                                    <p className='cfd-account-card__specification-description'>{descriptor}</p>
                                    <table className='cfd-account-card__specs-table cfd-account-card__specification-table'>
                                        <tbody>
                                            {Object.keys(specs).map((spec_attribute, idx) => (
                                                <tr key={idx} className='cfd-account-card__specs-table-row'>
                                                    <td className='cfd-account-card__specs-table-attribute'>
                                                        <p className='cfd-account-card--paragraph'>{spec_attribute}</p>
                                                    </td>
                                                    <td className='cfd-account-card__specs-table-data'>
                                                        <p className='cfd-account-card--paragraph'>
                                                            {specs[spec_attribute]}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className='cfd-account-card__login-specs'>
                                    <Text as='p' color='less-prominent' size='xxxs' align='left'>
                                        {platform === CFD_PLATFORMS.MT5
                                            ? localize('Use below credential to login')
                                            : localize('Log in with this username and your trading password.')}
                                    </Text>
                                    <table className='cfd-account-card__login-specs-table'>
                                        <tbody>
                                            {platform === CFD_PLATFORMS.MT5 ? (
                                                <React.Fragment>
                                                    <tr className='cfd-account-card__login-specs-table-row'>
                                                        <td className='cfd-account-card__login-specs-table-attribute'>
                                                            <div className='cfd-account-card--paragraph'>
                                                                {localize('Broker')}
                                                            </div>
                                                        </td>
                                                        <td className='cfd-account-card__login-specs-table-data'>
                                                            <div className='cfd-account-card--paragraph'>
                                                                <SpecBox value={'Deriv Limited'} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr className='cfd-account-card__login-specs-table-row'>
                                                        <td className='cfd-account-card__login-specs-table-attribute'>
                                                            <div className='cfd-account-card--paragraph'>
                                                                {localize('Server')}
                                                            </div>
                                                        </td>
                                                        <td className='cfd-account-card__login-specs-table-data'>
                                                            <div className='cfd-account-card--paragraph'>
                                                                <SpecBox
                                                                    value={existing_data.server_info.environment}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr className='cfd-account-card__login-specs-table-row'>
                                                        <td className='cfd-account-card__login-specs-table-attribute'>
                                                            <div className='cfd-account-card--paragraph'>
                                                                {localize('Login ID')}
                                                            </div>
                                                        </td>
                                                        <td className='cfd-account-card__login-specs-table-data'>
                                                            <div className='cfd-account-card--paragraph'>
                                                                <SpecBox value={existing_data.display_login} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            ) : (
                                                <React.Fragment>
                                                    <tr className='cfd-account-card__login-specs-table-row'>
                                                        <td className='cfd-account-card__login-specs-table-attribute'>
                                                            <div className='cfd-account-card--paragraph'>
                                                                {localize('Username')}
                                                            </div>
                                                        </td>
                                                        <td className='cfd-account-card__login-specs-table-data'>
                                                            <div className='cfd-account-card--paragraph'>
                                                                <SpecBox value={existing_data.login} is_bold />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr className='cfd-account-card__login-specs-table-row cfd-account-card__login-specs-table-row--account-id'>
                                                        <td className='cfd-account-card__login-specs-table-attribute'>
                                                            <div className='cfd-account-card--paragraph'>
                                                                {localize('Account ID:')}
                                                            </div>
                                                        </td>
                                                        <td className='cfd-account-card__login-specs-table-data'>
                                                            <div className='cfd-account-card--paragraph'>
                                                                <Text size='xxs' weight='bold'>
                                                                    {existing_data.display_login}
                                                                </Text>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </React.Fragment>
                        ) : (
                            <div className='cfd-account-card__specs'>
                                <table className='cfd-account-card__specs-table'>
                                    <tbody>
                                        {Object.keys(specs).map((spec_attribute, idx) => (
                                            <tr key={idx} className='cfd-account-card__specs-table-row'>
                                                <td className='cfd-account-card__specs-table-attribute'>
                                                    <p className='cfd-account-card--paragraph'>{spec_attribute}</p>
                                                </td>
                                                <td className='cfd-account-card__specs-table-data'>
                                                    <p className='cfd-account-card--paragraph'>
                                                        {specs[spec_attribute]}
                                                    </p>
                                                </td>
                                            </tr>
                                        ))}
                                        {has_server_banner &&
                                            existing_data &&
                                            type.type === 'synthetic' &&
                                            type.category === 'real' && (
                                                <tr
                                                    key={existing_data.server}
                                                    className='cfd-account-card__specs-table-row'
                                                >
                                                    <td className='cfd-account-card__specs-table-attribute'>
                                                        <p className='cfd-account-card--paragraph'>
                                                            <Localize i18n_default_text='Trade server: ' />
                                                        </p>
                                                    </td>
                                                    <td className='cfd-account-card__specs-table-data'>
                                                        <p className='cfd-account-card--paragraph'>
                                                            {getServerName(existing_data)}
                                                        </p>
                                                    </td>
                                                </tr>
                                            )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {((!existing_data && commission_message) || !is_logged_in) && (
                            <div className='cfd-account-card__commission'>
                                <Text as='p' color='general' size='xs' styles={{ margin: '1.6rem auto' }}>
                                    {commission_message}
                                </Text>
                            </div>
                        )}
                        {existing_data && is_logged_in && (
                            <div className='cfd-account-card__manage'>
                                <Button onClick={() => onClickFund(existing_data)} type='button' secondary>
                                    {type.category === 'real' && <Localize i18n_default_text='Fund transfer' />}
                                    {type.category === 'demo' && <Localize i18n_default_text='Fund top up' />}
                                </Button>
                                <Button
                                    onClick={() => {
                                        onPasswordManager(
                                            existing_data.login,
                                            title,
                                            type.category,
                                            type.type,
                                            existing_data.server
                                        );
                                    }}
                                    type='button'
                                    secondary
                                >
                                    <Localize i18n_default_text='Password' />
                                </Button>
                            </div>
                        )}
                        {!existing_data && has_cfd_account && (
                            <Button
                                className='cfd-account-card__account-selection'
                                onClick={onSelectAccount}
                                type='button'
                            >
                                <Localize i18n_default_text='Select' />
                            </Button>
                        )}
                        {existing_data && is_logged_in && !is_web_terminal_unsupported && (
                            <a
                                className='dc-btn cfd-account-card__account-selection cfd-account-card__account-selection--primary'
                                type='button'
                                href={
                                    platform === CFD_PLATFORMS.DXTRADE
                                        ? getDXTradeWebTerminalLink(type.category)
                                        : getMT5WebTerminalLink({
                                              category: type.category,
                                              loginid: existing_data.display_login,
                                              server_name: existing_data.server_info.environment,
                                          })
                                }
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <Localize i18n_default_text='Trade on web terminal' />
                            </a>
                        )}
                        {existing_data && is_logged_in && is_web_terminal_unsupported && (
                            <a
                                className='dc-btn cfd-account-card__account-selection cfd-account-card__account-selection--primary'
                                type='button'
                                href={getDxtradeDownloadLink()}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <Localize i18n_default_text='Download the app' />
                            </a>
                        )}
                        {!existing_data && !has_cfd_account && is_logged_in && (
                            <CFDAccountCardAction
                                button_label={button_label}
                                handleClickSwitchAccount={handleClickSwitchAccount}
                                has_real_account={has_real_account}
                                is_accounts_switcher_on={is_accounts_switcher_on}
                                is_button_primary={is_button_primary}
                                is_disabled={is_disabled}
                                is_virtual={is_virtual}
                                onSelectAccount={onSelectAccount}
                                type={type}
                            />
                        )}
                    </div>
                </div>
                <React.Fragment>
                    {should_show_trade_servers && (
                        <MobileWrapper>
                            <AddTradeServerButton
                                ref={button_ref}
                                onSelectAccount={onSelectAccount}
                                is_disabled={has_cfd_account_error}
                            />
                        </MobileWrapper>
                    )}
                </React.Fragment>
            </div>
            <DesktopWrapper>
                <CSSTransition
                    in={is_hovered && should_show_trade_servers}
                    timeout={0}
                    classNames='cfd-account-card__add-server'
                    unmountOnExit
                >
                    <AddTradeServerButton
                        ref={button_ref}
                        onSelectAccount={onSelectAccount}
                        is_disabled={has_cfd_account_error}
                    />
                </CSSTransition>
            </DesktopWrapper>
        </div>
    );
};

export { CFDAccountCard };
