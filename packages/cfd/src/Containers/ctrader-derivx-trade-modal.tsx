import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import { getCFDAccountKey, isMobile } from '@deriv/shared';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { Icon, Money, Text, ExpansionPanel, Button } from '@deriv/components';
import SpecBox from '../Components/specbox';
import { CFD_PLATFORMS } from '../Helpers/cfd-config';
import PasswordBox from '../Components/passwordbox';
import { getPlatformQRCode, mobileDownloadLink, PlatformsDesktopDownload } from '../Helpers/config';
import { TCFDDashboardContainer, TCFDsPlatformType, TTradingPlatformAccounts } from 'Components/props.types';
import {
    CTRADER_DESKTOP_MAC_DOWNLOAD,
    CTRADER_DESKTOP_WINDOWS_DOWNLOAD,
    getTitle,
    platformsText,
    STRATEGY_PROVIDER_NOTES,
} from '../Helpers/constants';

import { TCFDPasswordReset } from './props.types';

type TTradeModalProps = {
    ctrader_derivx_trade_account: Required<DetailsOfEachMT5Loginid>;
    is_eu_user: boolean;
    onPasswordManager: (
        arg1: string | undefined,
        arg2: string,
        group: TCFDPasswordReset['account_group'],
        arg4: string,
        arg5: string | undefined
    ) => void;
    toggleModal: () => void;
    dxtrade_tokens: TCFDDashboardContainer['dxtrade_tokens'];
    ctrader_tokens: TCFDDashboardContainer['ctrader_tokens'];
    is_demo: string;
    platform: TCFDsPlatformType;
    is_mobile?: boolean;
};

const PlatformIconsAndDescriptions = (
    platform: TCFDsPlatformType,
    is_demo: string,
    ctrader_derivx_trade_account: Required<DetailsOfEachMT5Loginid>
) => {
    return (
        <React.Fragment>
            <Icon icon={`IcRebranding${platform.charAt(0).toUpperCase()}${platform.slice(1)}Dashboard`} size={24} />
            <div className='cfd-trade-modal__desc'>
                <Text size='xs' line_height='l' weight='bold' className='cfd-trade-modal__desc-heading'>
                    <Localize
                        i18n_default_text='Deriv {{platform}} <0>{{is_demo}}</0>'
                        values={{
                            platform: platformsText(platform),
                            is_demo: is_demo ? 'Demo' : '',
                        }}
                        components={[
                            <span
                                key={0}
                                className={platform === CFD_PLATFORMS.CTRADER && is_demo ? 'cfd-trade-modal--tag' : ''}
                            />,
                        ]}
                    />
                </Text>
                {((ctrader_derivx_trade_account as TTradingPlatformAccounts)?.display_login &&
                    platform === CFD_PLATFORMS.DXTRADE) ||
                    (platform === CFD_PLATFORMS.CTRADER && is_demo && (
                        <Text color='less-prominent' size='xxxs' line_height='xxxs'>
                            {(ctrader_derivx_trade_account as TTradingPlatformAccounts)?.display_login}
                        </Text>
                    ))}
            </div>
        </React.Fragment>
    );
};

const CTraderDerivXTradeModal = ({
    ctrader_derivx_trade_account,
    is_eu_user,
    onPasswordManager,
    toggleModal,
    dxtrade_tokens,
    ctrader_tokens,
    is_demo,
    platform,
    is_mobile,
}: TTradeModalProps) => {
    const {
        ui,
        client,
        common,
        traders_hub,
        modules: { cfd },
    } = useStore();

    const { ctrader_accounts_list, ctrader_trading_platform_available_accounts, ctrader_total_balance } = client;
    const { setAccountType, toggleMT5TradeModal, is_account_being_created, loadCTraderTokens } = cfd;
    const { setAppstorePlatform } = common;
    const { openDerivRealAccountNeededModal } = ui;
    const { selected_account_type, no_CR_account, is_real, has_any_real_account, getAccount } = traders_hub;

    const message = {
        header: (
            <Text as='h2' size='xs' weight='bold' className='cfd-trade-modal__expansion-panel--header'>
                {localize('See important notes')}
            </Text>
        ),
        content: (
            <ol className='cfd-trade-modal__expansion-panel--ordered-list'>
                <Text as='li' size='xxs' line_height='l' className='cfd-trade-modal__expansion-panel--content'>
                    {localize('Use your Deriv account email and password to log in to cTrader.')}
                </Text>
                <Text as='li' size='xxs' line_height='l' className='cfd-trade-modal__expansion-panel--content'>
                    <Localize
                        i18n_default_text='Manage up to {{max_count}} Deriv cTrader accounts. While you can convert any of your Deriv cTrader accounts into a strategy account, please take note of the following:'
                        values={{
                            max_count: ctrader_trading_platform_available_accounts[0]?.max_count,
                        }}
                    />
                </Text>
                <ul className='cfd-trade-modal__expansion-panel--unordered-list'>
                    {STRATEGY_PROVIDER_NOTES.map(note => (
                        <Text
                            key={note}
                            as='li'
                            size='xxs'
                            line_height='l'
                            className='cfd-trade-modal__expansion-panel--content'
                        >
                            {localize(note)}
                        </Text>
                    ))}
                    <Text as='li' size='xxs' line_height='l' className='cfd-trade-modal__expansion-panel--content'>
                        <Localize
                            i18n_default_text='To ensure you can always create and manage strategies with fees, <0>keep at least one account free from being a strategy provider.</0> This way, you’ll always have an account ready for collecting fees, allowing you to have up to four strategies where you may impose fees.'
                            components={[<span key={0} className='cfd-trade-modal__expansion-panel--content-bold' />]}
                        />
                    </Text>
                </ul>
            </ol>
        ),
    };

    const downloadCenterDescription = () => {
        switch (platform) {
            case 'dxtrade':
                return (
                    <Text
                        align='center'
                        as='p'
                        className='cfd-trade-modal__download-center-text'
                        size={isMobile() ? 'xxxs' : 'xxs'}
                        weight='bold'
                    >
                        {localize('Download Deriv X on your phone to trade with the Deriv X account')}
                    </Text>
                );
            case 'ctrader':
                return (
                    <Text
                        align='center'
                        as='p'
                        className='cfd-trade-modal__download-center-text'
                        size={isMobile() ? 'xxxs' : 'xxs'}
                        weight='bold'
                    >
                        {localize('Download cTrader on your phone to trade with the Deriv cTrader account')}
                    </Text>
                );
            default:
                return '';
        }
    };

    const downloadCenterAppOption = (platform_type: TCFDsPlatformType) => {
        let app_title = '';
        if (platform_type === CFD_PLATFORMS.DXTRADE) {
            app_title = localize('Run Deriv X on your browser');
        } else if (platform_type === 'ctrader' && !is_mobile) {
            app_title = localize('Run cTrader on your browser');
        } else if (platform_type === 'ctrader' && is_mobile) {
            return null;
        } else {
            return null;
        }

        return (
            <div className='cfd-trade-modal__download-center-app--option'>
                <Text className='cfd-trade-modal__download-center-app--option-item' size='xs'>
                    {app_title}
                </Text>
                <PlatformsDesktopDownload
                    platform={platform}
                    is_demo={is_demo}
                    dxtrade_tokens={dxtrade_tokens}
                    ctrader_tokens={ctrader_tokens}
                    ctraderTokenCall={loadCTraderTokens}
                />
            </div>
        );
    };

    return (
        <div className='cfd-trade-modal-container'>
            <div className='cfd-trade-modal'>
                {PlatformIconsAndDescriptions(platform, is_demo, ctrader_derivx_trade_account)}
                {ctrader_derivx_trade_account?.display_balance && (
                    <div className='cfd-trade-modal__balance'>
                        {platform === CFD_PLATFORMS.CTRADER && is_real && (
                            <Text size='xxs' align='right'>
                                {localize('Total balance:')}
                            </Text>
                        )}
                        <Text
                            size='s'
                            color={platform !== CFD_PLATFORMS.CTRADER ? 'profit-success' : 'prominent'}
                            className='cfd-trade-modal__desc-balance'
                            weight='bold'
                        >
                            <Money
                                amount={
                                    is_real && platform === CFD_PLATFORMS.CTRADER
                                        ? ctrader_total_balance
                                        : ctrader_derivx_trade_account.display_balance
                                }
                                currency={ctrader_derivx_trade_account.currency}
                                has_sign={
                                    !!ctrader_derivx_trade_account.balance && ctrader_derivx_trade_account.balance < 0
                                }
                                show_currency
                            />
                        </Text>
                    </div>
                )}
            </div>
            <div className='cfd-trade-modal__login-specs'>
                {platform === CFD_PLATFORMS.DXTRADE && (
                    <React.Fragment>
                        <div className='cfd-trade-modal__login-specs-item'>
                            <Text className='cfd-trade-modal--paragraph'>{localize('Username')}</Text>
                            <SpecBox
                                is_bold
                                value={(ctrader_derivx_trade_account as TTradingPlatformAccounts)?.login}
                            />
                        </div>
                        <div className='cfd-trade-modal__login-specs-item'>
                            <Text className='cfd-trade-modal--paragraph'>{localize('Password')}</Text>
                            <div className='cfd-trade-modal--paragraph'>
                                <PasswordBox
                                    platform='dxtrade'
                                    onClick={() => {
                                        const account_type = getCFDAccountKey({
                                            market_type: ctrader_derivx_trade_account.market_type,
                                            sub_account_type: ctrader_derivx_trade_account.sub_account_type,
                                            platform: CFD_PLATFORMS.MT5,
                                            shortcode: ctrader_derivx_trade_account.landing_company_short,
                                        });
                                        onPasswordManager(
                                            ctrader_derivx_trade_account?.login,
                                            getTitle(ctrader_derivx_trade_account.market_type, is_eu_user),
                                            ctrader_derivx_trade_account.account_type,
                                            account_type,
                                            ctrader_derivx_trade_account?.server
                                        );
                                        toggleModal();
                                    }}
                                />
                            </div>
                        </div>
                    </React.Fragment>
                )}

                {platform === CFD_PLATFORMS.CTRADER && is_real && (
                    <React.Fragment>
                        {ctrader_accounts_list
                            .filter(all_ctrader_accounts => all_ctrader_accounts.account_type === 'real')
                            .map(ctrader_account => {
                                return (
                                    <div key={ctrader_account.login} className='cfd-trade-modal__list-of-accounts'>
                                        <Text size='xs'>{ctrader_account.login}</Text>
                                        <Text size='xs' weight='bold'>
                                            <Money
                                                amount={ctrader_account.balance}
                                                currency={ctrader_account.currency}
                                                has_sign={!!ctrader_account.balance && ctrader_account.balance < 0}
                                                show_currency
                                            />
                                        </Text>
                                    </div>
                                );
                            })}
                        {(ctrader_trading_platform_available_accounts[0]?.available_count ?? 1) > 0 && (
                            <div className='cfd-trade-modal__get-more-accounts'>
                                <Button
                                    onClick={() => {
                                        toggleMT5TradeModal();
                                        if ((!has_any_real_account || no_CR_account) && is_real) {
                                            openDerivRealAccountNeededModal();
                                        } else {
                                            setAccountType({
                                                category: selected_account_type,
                                                type: 'all',
                                            });
                                            setAppstorePlatform(CFD_PLATFORMS.CTRADER);
                                            getAccount();
                                        }
                                    }}
                                    transparent
                                    disabled={!!is_account_being_created}
                                >
                                    <Icon
                                        icon={'IcAppstoreGetMoreAccounts'}
                                        size={24}
                                        className='cfd-trade-modal__get-more-accounts--icon'
                                    />
                                    <div className='cfd-trade-modal__get-more-accounts--details'>
                                        <Text size='xxs' line-height='xxs'>
                                            {localize('Get another cTrader account')}
                                        </Text>
                                    </div>
                                </Button>
                            </div>
                        )}

                        <div className='cfd-trade-modal__expansion-panel'>
                            <ExpansionPanel message={message} />
                        </div>
                    </React.Fragment>
                )}

                <div className='cfd-trade-modal__maintenance'>
                    <Icon
                        icon='IcAlertWarning'
                        size={isMobile() ? 28 : 24}
                        className='cfd-trade-modal__maintenance-icon'
                    />
                    <div className='cfd-trade-modal__maintenance-text'>
                        <Text size='xxxs' className='cfd-trade-modal__maintenance-text'>
                            {platform === CFD_PLATFORMS.DXTRADE && (
                                <Localize i18n_default_text='Server maintenance starts at 06:00 GMT every Sunday and may last up to 2 hours. You may experience service disruption during this time.' />
                            )}
                            {platform === CFD_PLATFORMS.MT5 && (
                                <Localize i18n_default_text='Server maintenance starts at 01:00 GMT every Sunday, and this process may take up to 2 hours to complete. Service may be disrupted during this time.' />
                            )}
                            {platform === CFD_PLATFORMS.CTRADER && (
                                <Localize i18n_default_text='Server maintenance occurs every first Saturday of the month from 7 to 10 GMT time. You may experience service disruption during this time.' />
                            )}
                        </Text>
                    </div>
                </div>
            </div>
            <div className='cfd-trade-modal__download-center-app'>{downloadCenterAppOption(platform)}</div>
            {platform === CFD_PLATFORMS.CTRADER && (
                <React.Fragment>
                    {!is_mobile && (
                        <React.Fragment>
                            <div className='cfd-trade-modal__download-center-app--windows'>
                                <Icon icon='IcWindowsLogo' size={32} />
                                <Text className='cfd-trade-modal__download-center-app--windows-item' size='xs'>
                                    {localize('cTrader Windows app')}
                                </Text>
                                <a
                                    className='dc-btn cfd-trade-modal__download-center-app--windows-link'
                                    type='button'
                                    href={CTRADER_DESKTOP_WINDOWS_DOWNLOAD}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    <Text size='xxs' weight='bold' color='prominent'>
                                        {localize('Download')}
                                    </Text>
                                </a>
                            </div>
                            <div className='cfd-trade-modal__download-center-app--macos'>
                                <Icon icon='IcMacosLogo' size={32} />
                                <Text className='cfd-trade-modal__download-center-app--macos-item' size='xs'>
                                    {localize('cTrader MacOS app')}
                                </Text>
                                <a
                                    className='dc-btn cfd-trade-modal__download-center-app--macos-link'
                                    type='button'
                                    href={CTRADER_DESKTOP_MAC_DOWNLOAD}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    <Text size='xxs' weight='bold' color='prominent'>
                                        {localize('Download')}
                                    </Text>
                                </a>
                            </div>
                        </React.Fragment>
                    )}
                </React.Fragment>
            )}
            <div className='cfd-trade-modal__download-center-description'>{downloadCenterDescription()}</div>

            <div className='cfd-trade-modal__download-center-options'>
                <div className='cfd-trade-modal__download-center-options--mobile-links'>
                    <div className='cfd-trade-modal__download-center-options--mobile-links--apple'>
                        <a href={mobileDownloadLink(platform, 'ios')} target='_blank' rel='noopener noreferrer'>
                            <Icon icon='IcInstallationApple' width={isMobile() ? '160' : '130'} height={40} />
                        </a>
                    </div>
                    <a href={mobileDownloadLink(platform, 'android')} target='_blank' rel='noopener noreferrer'>
                        <Icon icon='IcInstallationGoogle' width={135} height={40} />
                    </a>

                    {platform !== CFD_PLATFORMS.CTRADER && (
                        <a href={mobileDownloadLink(platform, 'huawei')} target='_blank' rel='noopener noreferrer'>
                            <Icon icon='IcInstallationHuawei' width={135} height={40} />
                        </a>
                    )}
                </div>
                {!isMobile() && (
                    <div className='cfd-trade-modal__download-center-options--qrcode'>
                        {getPlatformQRCode(platform)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default observer(CTraderDerivXTradeModal);
