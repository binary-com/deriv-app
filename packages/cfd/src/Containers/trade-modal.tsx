import React from 'react';

import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { Icon, Money, Text } from '@deriv/components';
import { getCFDAccountKey, isMobile } from '@deriv/shared';
import { TCFDDashboardContainer, TCFDsPlatformType, TTradingPlatformAccounts } from 'Components/props.types';
import { localize, Localize } from '@deriv/translations';
import { CFD_PLATFORMS } from '../Helpers/cfd-config';
import PasswordBox from '../Components/passwordbox';
import SpecBox from '../Components/specbox';
import { getPlatformQRCode, mobileDownloadLink, PlatformsDesktopDownload } from '../Helpers/config';
import {
    CTRADER_DESKTOP_MAC_DOWNLOAD,
    CTRADER_DESKTOP_WINDOWS_DOWNLOAD,
    getTitle,
    platformsText,
} from '../Helpers/constants';

import { TCFDPasswordReset } from './props.types';

type TTradeModalProps = {
    mt5_trade_account: Required<DetailsOfEachMT5Loginid>;
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
    mt5_trade_account: Required<DetailsOfEachMT5Loginid>
) => {
    return (
        <React.Fragment>
            <Icon icon={`IcRebranding${platform.charAt(0).toUpperCase()}${platform.slice(1)}Dashboard`} size={24} />
            <div className='cfd-trade-modal__desc'>
                <Text size='xs' line_height='l' className='cfd-trade-modal__desc-heading'>
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
                {(mt5_trade_account as TTradingPlatformAccounts)?.display_login && (
                    <Text color='less-prominent' size='xxxs' line_height='xxxs'>
                        {(mt5_trade_account as TTradingPlatformAccounts)?.display_login}
                    </Text>
                )}
            </div>
        </React.Fragment>
    );
};

const TradeModal = ({
    mt5_trade_account,
    is_eu_user,
    onPasswordManager,
    toggleModal,
    dxtrade_tokens,
    ctrader_tokens,
    is_demo,
    platform,
    is_mobile,
}: TTradeModalProps) => {
    const CTraderDescription = () => {
        const platform_name = 'cTrader';
        return (
            <div className='cfd-trade-modal__login-specs-item'>
                <Text className='cfd-trade-modal--paragraph'>
                    <Localize
                        i18n_default_text='Use your Deriv account email and password to login into the {{ platform }} platform.'
                        values={{ platform: platform_name }}
                    />
                </Text>
            </div>
        );
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
            <React.Fragment>
                <div className='cfd-trade-modal__download-center-app--option'>
                    <Text className='cfd-trade-modal__download-center-app--option-item' size='xs'>
                        {app_title}
                    </Text>
                    <PlatformsDesktopDownload
                        platform={platform}
                        is_demo={is_demo}
                        dxtrade_tokens={dxtrade_tokens}
                        ctrader_tokens={ctrader_tokens}
                    />
                </div>
            </React.Fragment>
        );
    };

    return (
        <div className='cfd-trade-modal-container'>
            <div className='cfd-trade-modal'>
                {PlatformIconsAndDescriptions(platform, is_demo, mt5_trade_account)}
                {mt5_trade_account?.display_balance && (
                    <Text
                        size='xs'
                        color={platform !== CFD_PLATFORMS.CTRADER ? 'profit-success' : 'prominent'}
                        className='cfd-trade-modal__desc-balance'
                        weight='bold'
                    >
                        <Money
                            amount={mt5_trade_account.display_balance}
                            currency={mt5_trade_account.currency}
                            has_sign={!!mt5_trade_account.balance && mt5_trade_account.balance < 0}
                            show_currency
                        />
                    </Text>
                )}
            </div>
            <div className='cfd-trade-modal__login-specs'>
                {platform !== CFD_PLATFORMS.DXTRADE && <CTraderDescription />}
                {platform === CFD_PLATFORMS.DXTRADE && (
                    <React.Fragment>
                        <div className='cfd-trade-modal__login-specs-item'>
                            <Text className='cfd-trade-modal--paragraph'>{localize('Username')}</Text>
                            <SpecBox is_bold value={(mt5_trade_account as TTradingPlatformAccounts)?.login} />
                        </div>
                        <div className='cfd-trade-modal__login-specs-item'>
                            <Text className='cfd-trade-modal--paragraph'>{localize('Password')}</Text>
                            <div className='cfd-trade-modal--paragraph'>
                                <PasswordBox
                                    platform='dxtrade'
                                    onClick={() => {
                                        const account_type = getCFDAccountKey({
                                            market_type: mt5_trade_account.market_type,
                                            sub_account_type: mt5_trade_account.sub_account_type,
                                            platform: CFD_PLATFORMS.MT5,
                                            shortcode: mt5_trade_account.landing_company_short,
                                        });
                                        onPasswordManager(
                                            mt5_trade_account?.login,
                                            getTitle(mt5_trade_account.market_type, is_eu_user),
                                            mt5_trade_account.account_type,
                                            account_type,
                                            (mt5_trade_account as DetailsOfEachMT5Loginid)?.server
                                        );
                                        toggleModal();
                                    }}
                                />
                            </div>
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

export default TradeModal;
