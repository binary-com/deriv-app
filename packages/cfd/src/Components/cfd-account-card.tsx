import classNames from 'classnames';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Icon, Money, Button, Text, DesktopWrapper, MobileWrapper, Popover } from '@deriv/components';
import { isMobile, mobileOSDetect, getCFDPlatformLabel, CFD_PLATFORMS } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { CFDAccountCopy } from './cfd-account-copy';
import { getDXTradeWebTerminalLink, getPlatformDXTradeDownloadLink } from '../Helpers/constants';
import {
    TAccountIconValues,
    TSpecBoxProps,
    TPasswordBoxProps,
    TCFDAccountCardActionProps,
    TCFDAccountCard,
    TTradingPlatformAccounts,
} from './props.types';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';

const account_icons: { [key: string]: TAccountIconValues } = {
    mt5: {
        synthetic: 'IcMt5SyntheticPlatform',
        financial: 'IcMt5FinancialPlatform',
        financial_stp: 'IcMt5FinancialStpPlatform',
        cfd: 'IcMt5CfdPlatform',
    },
    dxtrade: {
        synthetic: 'IcDxtradeSyntheticPlatform',
        financial: 'IcDxtradeFinancialPlatform',
        cfd: 'IcMt5CfdPlatform',
    },
};

const AddAccountButton = React.forwardRef<HTMLDivElement, { onSelectAccount: () => void; is_disabled?: boolean }>(
    ({ onSelectAccount, is_disabled }, ref) => {
        return (
            <div
                onClick={is_disabled ? () => undefined : onSelectAccount}
                className={classNames('cfd-account-card__add-server', {
                    'cfd-account-card__add-server--disabled': is_disabled,
                })}
                ref={ref}
            >
                <span className='cfd-account-card__add-server--icon'>+</span>
                <Localize i18n_default_text='Add account' />
            </div>
        );
    }
);

AddAccountButton.displayName = 'AddAccountButton';

const SpecBox = ({ value, is_bold }: TSpecBoxProps) => (
    <div className='cfd-account-card__spec-box'>
        <Text size='xs' weight={is_bold ? 'bold' : ''} className='cfd-account-card__spec-text'>
            {value}
        </Text>
        <CFDAccountCopy text={value} className='cfd-account-card__spec-copy' />
    </div>
);

const PasswordBox = ({ platform, onClick }: TPasswordBoxProps) => (
    <div className='cfd-account-card__password-box'>
        <div className='cfd-account-card__password-text'>
            <Popover
                alignment='right'
                message={localize(
                    'Use these credentials to log in to your {{platform}} account on the website and mobile apps.',
                    {
                        platform: getCFDPlatformLabel(platform),
                    }
                )}
                classNameBubble='cfd-account-card__password-tooltip'
            >
                <Text size='xs'>•••••••••••••••</Text>
            </Popover>
        </div>
        <Popover alignment='bottom' message={localize('Change Password')}>
            <Button
                className='cfd-account-card__password-action'
                transparent
                onClick={onClick}
                icon={
                    <Icon
                        icon='IcEdit'
                        className='da-article__learn-more-icon'
                        custom_color='var(--text-less-prominent)'
                    />
                }
            />
        </Popover>
    </div>
);

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
    platform,
    title,
}: TCFDAccountCardActionProps) => {
    if (
        is_virtual &&
        type.category === 'real' &&
        typeof handleClickSwitchAccount === 'function' &&
        (platform === CFD_PLATFORMS.MT5 ? has_real_account && type.type === 'financial_stp' : true)
    ) {
        return (
            <div className='cfd-account-card__action-wrapper'>
                <Localize
                    i18n_default_text='<0>Switch to your real account</0><1> to create a {{platform}} {{account_title}} account.</1>'
                    values={{
                        platform: getCFDPlatformLabel(platform),
                        account_title: title,
                    }}
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

const CFDAccountCardComponent = ({
    button_label,
    commission_message,
    descriptor,
    dxtrade_tokens,
    existing_accounts_data,
    has_banner,
    has_cfd_account,
    has_cfd_account_error,
    has_real_account,
    is_accounts_switcher_on,
    is_button_primary,
    is_disabled,
    is_logged_in,
    is_virtual,
    is_eu,
    platform,
    title,
    type,
    specs,
    onSelectAccount,
    onClickFund,
    onPasswordManager,
    can_have_more_real_synthetic_mt5,
    can_have_more_real_financial_mt5,
    trading_platform_available_accounts,
    toggleAccountsDialog,
    toggleMT5TradeModal,
    toggleShouldShowRealAccountsList,
    setMT5TradeAccount,
}: TCFDAccountCard) => {
    const existing_data = type.category === 'real' ? existing_accounts_data?.[0] : existing_accounts_data;
    const financial_available_accounts = trading_platform_available_accounts.filter(
        available_account => available_account.market_type === 'financial'
    );
    const synthetic_available_accounts = trading_platform_available_accounts.filter(
        available_account => available_account.market_type === 'gaming'
    );

    const available_and_existing_are_same =
        type.type === 'synthetic'
            ? synthetic_available_accounts.some(synthetic_accs =>
                  existing_accounts_data?.some(
                      existing_account => existing_account.landing_company_short === synthetic_accs.shortcode
                  )
              )
            : financial_available_accounts.some(financial_accs =>
                  existing_accounts_data?.some(
                      existing_account => existing_account.landing_company_short === financial_accs.shortcode
                  )
              );

    const should_show_extra_add_account_button =
        is_logged_in &&
        !is_eu &&
        has_real_account &&
        platform === CFD_PLATFORMS.MT5 &&
        (type.type === 'synthetic' ? can_have_more_real_synthetic_mt5 : can_have_more_real_financial_mt5);

    const platform_icon = is_eu ? 'cfd' : type.type;
    const icon: React.ReactNode | null = type.type ? (
        <Icon icon={account_icons[type.platform][platform_icon]} size={64} />
    ) : null;
    const has_popular_banner: boolean = type.type === 'synthetic';
    const has_demo_banner: boolean = type.category === 'demo' && platform !== CFD_PLATFORMS.MT5;
    const has_server_banner =
        is_logged_in &&
        existing_data &&
        type.category === 'real' &&
        type.type === 'synthetic' &&
        (existing_data as DetailsOfEachMT5Loginid)?.server_info;

    const ref = React.useRef<HTMLDivElement | null>(null);
    const wrapper_ref = React.useRef<HTMLDivElement | null>(null);
    const button_ref = React.useRef<HTMLDivElement | null>(null);

    const handleClickSwitchAccount: () => void = () => {
        toggleShouldShowRealAccountsList?.(true);
        toggleAccountsDialog?.(true);
    };

    const getDxtradeDownloadLink: () => string = () => {
        const os = mobileOSDetect();
        if (os === 'iOS') {
            return getPlatformDXTradeDownloadLink('ios');
        }
        return getPlatformDXTradeDownloadLink('android');
    };

    const is_web_terminal_unsupported = isMobile() && platform === CFD_PLATFORMS.DXTRADE;
    const tbody_content = platform === CFD_PLATFORMS.DXTRADE && (
        <React.Fragment>
            <tr className='cfd-account-card__login-specs-table-row'>
                <td className='cfd-account-card__login-specs-table-attribute'>
                    <div className='cfd-account-card--paragraph'>{localize('Username')}</div>
                </td>
                <td className='cfd-account-card__login-specs-table-data'>
                    <div className='cfd-account-card--paragraph'>
                        <SpecBox value={existing_data?.login} is_bold />
                    </div>
                </td>
            </tr>
        </React.Fragment>
    );

    return (
        <div ref={wrapper_ref} className='cfd-account-card__wrapper'>
            <div
                className={classNames('cfd-account-card', { 'cfd-account-card__logged-out': !is_logged_in })}
                ref={ref}
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
                        <Text size='xxl' className='cfd-account-card--heading'>
                            {title}
                        </Text>
                        {platform === CFD_PLATFORMS.DXTRADE ? (
                            (!existing_data || !is_logged_in) && (
                                <p className='cfd-account-card--paragraph'>{descriptor}</p>
                            )
                        ) : (
                            <p className='cfd-account-card--paragraph'>{descriptor}</p>
                        )}
                        {existing_data?.display_balance && is_logged_in && platform === CFD_PLATFORMS.DXTRADE && (
                            <Text size='xxl' className='cfd-account-card--balance'>
                                <Money
                                    amount={existing_data.display_balance}
                                    currency={existing_data.currency}
                                    has_sign={existing_data.balance ? existing_data.balance < 0 : false}
                                    show_currency
                                />
                            </Text>
                        )}
                        {(existing_data as TTradingPlatformAccounts)?.display_login &&
                            is_logged_in &&
                            platform === CFD_PLATFORMS.DXTRADE && (
                                <Text color='less-prominent' size='xxxs' line_height='s'>
                                    {(existing_data as TTradingPlatformAccounts)?.display_login}
                                </Text>
                            )}
                    </div>
                </div>
                {existing_data && <div className='cfd-account-card__divider' />}

                <div className='cfd-account-card__cta' style={!existing_data?.login ? { marginTop: 'auto' } : {}}>
                    <div className='cfd-account-card__cta-wrapper'>
                        {platform === CFD_PLATFORMS.DXTRADE && (!existing_data?.login || !is_logged_in) && (
                            <div className='cfd-account-card__specs'>
                                <table className='cfd-account-card__specs-table'>
                                    <tbody>
                                        {typeof specs !== 'undefined' &&
                                            Object.keys(specs).map((spec_attribute, idx) => (
                                                <tr key={idx} className='cfd-account-card__specs-table-row'>
                                                    <td className='cfd-account-card__specs-table-attribute'>
                                                        <p className='cfd-account-card--paragraph'>
                                                            {specs[spec_attribute].key()}
                                                        </p>
                                                    </td>
                                                    <td className='cfd-account-card__specs-table-data'>
                                                        <p className='cfd-account-card--paragraph'>
                                                            {specs[spec_attribute].value()}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {existing_data?.login &&
                            is_logged_in &&
                            platform === CFD_PLATFORMS.MT5 &&
                            type.category === 'demo' && (
                                <div className='cfd-account-card__item'>
                                    {existing_data?.display_balance && is_logged_in && (
                                        <div className='cfd-account-card__item--banner'>
                                            <Localize i18n_default_text='Demo' />
                                        </div>
                                    )}
                                    {existing_data?.display_balance && is_logged_in && (
                                        <Text size='xxl' className='cfd-account-card--balance'>
                                            <Money
                                                amount={existing_data.display_balance}
                                                currency={existing_data.currency}
                                                has_sign={!!existing_data.balance && existing_data.balance < 0}
                                                show_currency
                                            />
                                        </Text>
                                    )}
                                    <div className='cfd-account-card__manage--mt5'>
                                        {existing_data && is_logged_in && (
                                            <Button onClick={() => onClickFund(existing_data)} type='button' secondary>
                                                <Localize i18n_default_text='Top up' />
                                            </Button>
                                        )}
                                        {existing_data && is_logged_in && !is_web_terminal_unsupported && (
                                            <Button
                                                className='dc-btn cfd-account-card__account-selection cfd-account-card__account-selection--primary'
                                                type='button'
                                                onClick={() => {
                                                    toggleMT5TradeModal();
                                                    setMT5TradeAccount(existing_data);
                                                }}
                                                primary
                                                large
                                            >
                                                <Localize i18n_default_text='Trade' />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        {existing_data?.login &&
                            is_logged_in &&
                            platform === CFD_PLATFORMS.MT5 &&
                            type.category === 'real' &&
                            existing_accounts_data?.map((acc, index) => (
                                <div className='cfd-account-card__item' key={index}>
                                    {existing_data?.display_balance && is_logged_in && (
                                        <div className='cfd-account-card__item--banner'>
                                            <Localize
                                                i18n_default_text={
                                                    acc.landing_company_short &&
                                                    acc.landing_company_short !== ('svg' || 'bvi')
                                                        ? acc.landing_company_short?.charAt(0).toUpperCase() +
                                                          acc.landing_company_short.slice(1)
                                                        : acc.landing_company_short?.toUpperCase()
                                                }
                                            />
                                        </div>
                                    )}
                                    {existing_data?.display_balance && is_logged_in && (
                                        <Text size='xxl' className='cfd-account-card--balance'>
                                            <Money
                                                amount={acc.display_balance}
                                                currency={acc.currency}
                                                has_sign={!!acc.balance && acc.balance < 0}
                                                show_currency
                                            />
                                        </Text>
                                    )}
                                    <div className='cfd-account-card__manage--mt5'>
                                        {existing_data && is_logged_in && (
                                            <Button
                                                onClick={() => {
                                                    const selected_account_data = existing_accounts_data?.find(
                                                        data => data.landing_company_short === acc.landing_company_short
                                                    );
                                                    onClickFund(selected_account_data as DetailsOfEachMT5Loginid);
                                                }}
                                                type='button'
                                                secondary
                                            >
                                                <Localize i18n_default_text='Top up' />
                                            </Button>
                                        )}
                                        {existing_data && is_logged_in && !is_web_terminal_unsupported && (
                                            <Button
                                                className='dc-btn cfd-account-card__account-selection cfd-account-card__account-selection--primary'
                                                type='button'
                                                onClick={() => {
                                                    const selected_account_data = existing_accounts_data?.find(
                                                        data => data.landing_company_short === acc.landing_company_short
                                                    );
                                                    toggleMT5TradeModal();
                                                    setMT5TradeAccount(selected_account_data);
                                                }}
                                                primary
                                                large
                                            >
                                                <Localize i18n_default_text='Trade' />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        {existing_data?.login && is_logged_in && platform === CFD_PLATFORMS.DXTRADE && (
                            <React.Fragment>
                                <div className='cfd-account-card__login-specs'>
                                    <table className='cfd-account-card__login-specs-table'>
                                        <tbody>
                                            {tbody_content}
                                            <tr className='cfd-account-card__login-specs-table-row cfd-account-card__login-specs-table-row--account-id'>
                                                <td className='cfd-account-card__login-specs-table-attribute'>
                                                    <div className='cfd-account-card--paragraph'>
                                                        {localize('Password')}
                                                    </div>
                                                </td>
                                                <td className='cfd-account-card__login-specs-table-data'>
                                                    <div className='cfd-account-card--paragraph'>
                                                        <PasswordBox
                                                            platform={platform}
                                                            onClick={() => {
                                                                onPasswordManager(
                                                                    existing_data?.login,
                                                                    title,
                                                                    type.category,
                                                                    type.type,
                                                                    (existing_data as DetailsOfEachMT5Loginid)?.server
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </React.Fragment>
                        )}

                        {((!existing_data && commission_message) || !is_logged_in) &&
                            platform === CFD_PLATFORMS.DXTRADE && (
                                <div className='cfd-account-card__commission'>
                                    <Text as='p' color='general' size='xs' styles={{ margin: '1.6rem auto' }}>
                                        {commission_message}
                                    </Text>
                                </div>
                            )}
                        {existing_data && is_logged_in && platform === CFD_PLATFORMS.DXTRADE && (
                            <div className='cfd-account-card__manage'>
                                <Button onClick={() => onClickFund(existing_data)} type='button' secondary>
                                    {type.category === 'real' && <Localize i18n_default_text='Fund transfer' />}
                                    {type.category === 'demo' && <Localize i18n_default_text='Fund top up' />}
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
                        {existing_data &&
                            is_logged_in &&
                            !is_web_terminal_unsupported &&
                            platform === CFD_PLATFORMS.DXTRADE && (
                                <a
                                    className='dc-btn cfd-account-card__account-selection cfd-account-card__account-selection--primary'
                                    type='button'
                                    href={getDXTradeWebTerminalLink(
                                        type.category,
                                        dxtrade_tokens[type.category as 'demo' | 'real']
                                    )}
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
                                platform={platform}
                                title={title}
                            />
                        )}
                    </div>
                </div>
                <React.Fragment>
                    {(should_show_extra_add_account_button || (existing_data && !available_and_existing_are_same)) && (
                        <MobileWrapper>
                            <AddAccountButton
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
                    in={should_show_extra_add_account_button || (existing_data && !available_and_existing_are_same)}
                    timeout={0}
                    classNames='cfd-account-card__add-server'
                    unmountOnExit
                >
                    <AddAccountButton
                        ref={button_ref}
                        onSelectAccount={onSelectAccount}
                        is_disabled={has_cfd_account_error}
                    />
                </CSSTransition>
            </DesktopWrapper>
        </div>
    );
};

const CFDAccountCard = connect(({ modules: { cfd }, client }: RootStore) => ({
    dxtrade_tokens: cfd.dxtrade_tokens,
    can_have_more_real_synthetic_mt5: client.can_have_more_real_synthetic_mt5,
    can_have_more_real_financial_mt5: client.can_have_more_real_financial_mt5,
    trading_platform_available_accounts: client.trading_platform_available_accounts,
    setMT5TradeAccount: cfd.setMT5TradeAccount,
}))(CFDAccountCardComponent);

export { CFDAccountCard };
