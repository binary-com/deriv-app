import classNames from 'classnames';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Icon, Money, Button, Text, DesktopWrapper, MobileWrapper } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { Mt5AccountCopy } from './mt5-account-copy.jsx';
import { getMT5WebTerminalLink } from '../Helpers/constants';

const account_icons = {
    synthetic: 'IcMt5SyntheticPlatform',
    financial: 'IcMt5FinancialPlatform',
    financial_stp: 'IcMt5FinancialStpPlatform',
};

const AddTradeServerButton = React.forwardRef(({ onSelectAccount, is_disabled }, ref) => {
    return (
        <div
            onClick={is_disabled ? null : onSelectAccount}
            className={classNames('mt5-account-card__add-server', {
                'mt5-account-card__add-server--disabled': is_disabled,
            })}
            ref={ref}
        >
            <span className='mt5-account-card__add-server--icon'>+</span>
            <Localize i18n_default_text='Add region' />
        </div>
    );
});

AddTradeServerButton.displayName = 'AddTradeServerButton';

const SpecBox = ({ value }) => (
    <div className='mt5-account-card__spec-box'>
        <span className='mt5-account-card__spec-text'>{value}</span>
        <Mt5AccountCopy text={value} className='mt5-account-card__spec-copy' />
    </div>
);

const MT5AccountCardSpecification = ({ children, height }) => {
    const [is_collapsed, setCollapsed] = React.useState(false);
    const content_ref = React.useRef();
    React.useEffect(() => {
        if (content_ref.current) {
            if (is_collapsed) {
                content_ref.current.style.height = `${height ?? content_ref.current.scrollHeight}px`;
            } else {
                content_ref.current.style.height = null;
            }
        }
    }, [is_collapsed, content_ref, height]);
    return (
        <div className='mt5-account-card__specification'>
            <Text
                className='mt5-account-card__specification-title'
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
                    className={classNames('mt5-account-card__specification-icon', {
                        'mt5-account-card__specification-icon--collapsed': is_collapsed,
                    })}
                    icon='IcChevronDown'
                    color='secondary'
                    size={12}
                />
            </Text>
            <div ref={content_ref} className='mt5-account-card__specification-content'>
                {children}
            </div>
        </div>
    );
};

const MT5AccountCardAction = ({
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
            <div className='mt5-account-card__action-wrapper'>
                <Localize
                    i18n_default_text='<0>Switch to your real account</0><1> to create a DMT5 Financial STP account.</1>'
                    components={[
                        <a
                            className={classNames('mt5-account-card__action-wrapper__link link link--orange', {
                                'mt5-account-card__action-wrapper__link--disabled': is_accounts_switcher_on,
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
            className='mt5-account-card__account-selection'
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

const MT5AccountCard = ({
    button_label,
    commission_message,
    descriptor,
    is_hovered,
    existing_data,
    has_mt5_account,
    has_real_account,
    is_accounts_switcher_on,
    is_button_primary,
    is_disabled,
    is_logged_in,
    is_virtual,
    onHover,
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
    const icon = type.type ? <Icon icon={account_icons[type.type]} size={64} /> : null;
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

    return (
        <div ref={wrapper_ref} className={'mt5-account-card__wrapper'}>
            <div
                className={classNames('mt5-account-card', { 'mt5-account-card__logged-out': !is_logged_in })}
                ref={ref}
            >
                {has_popular_banner && (
                    <div className='mt5-account-card__banner'>
                        <Localize i18n_default_text='Most popular' />
                    </div>
                )}
                {has_demo_banner && (
                    <div className='mt5-account-card__banner mt5-account-card__banner--demo'>
                        <Localize i18n_default_text='DEMO' />
                    </div>
                )}
                {has_server_banner && (
                    <div className='mt5-account-card__banner mt5-account-card__banner--server'>
                        {getServerName(existing_data)}
                    </div>
                )}
                <div
                    className={classNames('mt5-account-card__type', {
                        'mt5-account-card__type--has-banner':
                            has_popular_banner || has_demo_banner || has_server_banner,
                    })}
                    id={`mt5_${type.category}_${type.type}`}
                >
                    {icon}
                    <div className='mt5-account-card__type--description'>
                        <h1 className='mt5-account-card--heading'>{title}</h1>
                        {(!existing_data || !is_logged_in) && (
                            <p className='mt5-account-card--paragraph'>{descriptor}</p>
                        )}
                        {existing_data && existing_data.display_balance && is_logged_in && (
                            <p className='mt5-account-card--balance'>
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

                <div className='mt5-account-card__cta'>
                    {existing_data?.login && is_logged_in ? (
                        <>
                            <MT5AccountCardSpecification height={272}>
                                <p className='mt5-account-card__specification-description'>{descriptor}</p>
                                <table className='mt5-account-card__specs-table mt5-account-card__specification-table'>
                                    <tbody>
                                        {Object.keys(specs).map((spec_attribute, idx) => (
                                            <tr key={idx} className='mt5-account-card__specs-table-row'>
                                                <td className='mt5-account-card__specs-table-attribute'>
                                                    <p className='mt5-account-card--paragraph'>{spec_attribute}</p>
                                                </td>
                                                <td className='mt5-account-card__specs-table-data'>
                                                    <p className='mt5-account-card--paragraph'>
                                                        {specs[spec_attribute]}
                                                    </p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </MT5AccountCardSpecification>
                            <div className='mt5-account-card__login-specs'>
                                <Text as='p' color='less-prominent' size='xxxs' align='left'>
                                    {localize('Use below credential to login')}
                                </Text>
                                <table className='mt5-account-card__login-specs-table'>
                                    <tbody>
                                        <tr className='mt5-account-card__login-specs-table-row'>
                                            <td className='mt5-account-card__login-specs-table-attribute'>
                                                <div className='mt5-account-card--paragraph'>{localize('Broker')}</div>
                                            </td>
                                            <td className='mt5-account-card__login-specs-table-data'>
                                                <div className='mt5-account-card--paragraph'>
                                                    <SpecBox value={'Deriv Limited'} />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='mt5-account-card__login-specs-table-row'>
                                            <td className='mt5-account-card__login-specs-table-attribute'>
                                                <div className='mt5-account-card--paragraph'>{localize('Server')}</div>
                                            </td>
                                            <td className='mt5-account-card__login-specs-table-data'>
                                                <div className='mt5-account-card--paragraph'>
                                                    <SpecBox value={existing_data.server_info.environment} />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className='mt5-account-card__login-specs-table-row'>
                                            <td className='mt5-account-card__login-specs-table-attribute'>
                                                <div className='mt5-account-card--paragraph'>
                                                    {localize('Login ID')}
                                                </div>
                                            </td>
                                            <td className='mt5-account-card__login-specs-table-data'>
                                                <div className='mt5-account-card--paragraph'>
                                                    <SpecBox value={existing_data.display_login} />
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className='mt5-account-card__specs'>
                            <table className='mt5-account-card__specs-table'>
                                <tbody>
                                    {Object.keys(specs).map((spec_attribute, idx) => (
                                        <tr key={idx} className='mt5-account-card__specs-table-row'>
                                            <td className='mt5-account-card__specs-table-attribute'>
                                                <p className='mt5-account-card--paragraph'>{spec_attribute}</p>
                                            </td>
                                            <td className='mt5-account-card__specs-table-data'>
                                                <p className='mt5-account-card--paragraph'>{specs[spec_attribute]}</p>
                                            </td>
                                        </tr>
                                    ))}
                                    {has_server_banner &&
                                        existing_data &&
                                        type.type === 'synthetic' &&
                                        type.category === 'real' && (
                                            <tr
                                                key={existing_data.server}
                                                className='mt5-account-card__specs-table-row'
                                            >
                                                <td className='mt5-account-card__specs-table-attribute'>
                                                    <p className='mt5-account-card--paragraph'>
                                                        <Localize i18n_default_text='Trade server: ' />
                                                    </p>
                                                </td>
                                                <td className='mt5-account-card__specs-table-data'>
                                                    <p className='mt5-account-card--paragraph'>
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
                        <div className='mt5-account-card__commission'>
                            <Text as='p' color='general' size='xs' styles={{ margin: '1.6rem auto' }}>
                                {commission_message}
                            </Text>
                        </div>
                    )}
                    {existing_data && is_logged_in && (
                        <div className='mt5-account-card__manage'>
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
                    {!existing_data && has_mt5_account && (
                        <Button className='mt5-account-card__account-selection' onClick={onSelectAccount} type='button'>
                            <Localize i18n_default_text='Select' />
                        </Button>
                    )}
                    {existing_data && is_logged_in && (
                        <a
                            className='dc-btn mt5-account-card__account-selection mt5-account-card__account-selection--primary'
                            type='button'
                            href={getMT5WebTerminalLink({
                                category: type.category,
                                loginid: existing_data.display_login,
                                server_name: existing_data.server_info.environment,
                            })}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <Localize i18n_default_text='Trade on web terminal' />
                        </a>
                    )}
                    {!existing_data && !has_mt5_account && is_logged_in && (
                        <MT5AccountCardAction
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
                <React.Fragment>
                    {should_show_trade_servers && (
                        <MobileWrapper>
                            <AddTradeServerButton ref={button_ref} onSelectAccount={onSelectAccount} />
                        </MobileWrapper>
                    )}
                </React.Fragment>
            </div>
            <DesktopWrapper>
                <CSSTransition
                    in={is_hovered && should_show_trade_servers}
                    timeout={0}
                    classNames='mt5-account-card__add-server'
                    unmountOnExit
                >
                    <AddTradeServerButton ref={button_ref} onSelectAccount={onSelectAccount} />
                </CSSTransition>
            </DesktopWrapper>
        </div>
    );
};

export { MT5AccountCard };
