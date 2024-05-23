import React from 'react';
import { Text, Icon, Money } from '@deriv/components';
import { TTradingPlatformAccounts, TCFDDashboardContainer, TCFDsPlatformType } from 'Components/props.types';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { getCFDAccountKey, isMobile, mobileOSDetect } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { getPlatformQRCode, PlatformsDesktopDownload, mobileDownloadLink } from '../../Helpers/config';
import { getTitle, platformsText, CTRADER_DESKTOP_WINDOWS_DOWNLOAD } from '../../Helpers/constants';
import { CFD_PLATFORMS, MOBILE_PLATFORMS } from '../../Helpers/cfd-config';
import SpecBox from '../../Components/specbox';
import PasswordBox from '../../Components/passwordbox';
import { TCFDPasswordReset } from '../../Containers/props.types';

type TOtherCFDsTradeModalProps = {
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
    ctraderTokenCall: (url: string, account_type: 'real' | 'demo') => void;
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

const OtherCFDsTradeModal = ({
    mt5_trade_account,
    is_eu_user,
    onPasswordManager,
    toggleModal,
    dxtrade_tokens,
    ctrader_tokens,
    ctraderTokenCall,
    is_demo,
    platform,
    is_mobile,
}: TOtherCFDsTradeModalProps) => {
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
        } else if (platform_type === CFD_PLATFORMS.CTRADER && !is_mobile) {
            app_title = localize('Run cTrader on your browser');
        } else if (platform_type === CFD_PLATFORMS.CTRADER && is_mobile) {
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
                    ctraderTokenCall={ctraderTokenCall}
                />
            </div>
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
                                            mt5_trade_account?.server
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
                    )}
                    {is_mobile && mobileOSDetect() === 'iOS' && (
                        <div className='cfd-trade-modal__download-center-app-ctrader-container'>
                            <Text
                                className='cfd-trade-modal__download-center-app-ctrader__banner-text'
                                align='center'
                                size='xs'
                                weight='bold'
                            >
                                <Localize i18n_default_text='Coming soon on IOS' />
                            </Text>
                            <Text
                                className='cfd-trade-modal__download-center-app-ctrader__banner-text'
                                align='center'
                                size='xxs'
                            >
                                <Localize i18n_default_text='cTrader is only available on desktop for now.' />
                            </Text>
                        </div>
                    )}
                </React.Fragment>
            )}
            {mobileOSDetect() !== 'iOS' && (
                <div className='cfd-trade-modal__download-center-description'>{downloadCenterDescription()}</div>
            )}

            <div className='cfd-trade-modal__download-center-options'>
                <div className='cfd-trade-modal__download-center-options--mobile-links'>
                    {platform !== CFD_PLATFORMS.CTRADER && (
                        <div className='cfd-trade-modal__download-center-options--mobile-links--apple'>
                            <a
                                href={mobileDownloadLink(platform, MOBILE_PLATFORMS.IOS)}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <Icon icon='IcInstallationApple' width={isMobile() ? '160' : '130'} height={40} />
                            </a>
                        </div>
                    )}
                    {platform === CFD_PLATFORMS.CTRADER && mobileOSDetect() !== 'iOS' && (
                        <a
                            href={mobileDownloadLink(platform, MOBILE_PLATFORMS.ANDROID)}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <Icon icon='IcInstallationGoogle' width={135} height={40} />
                        </a>
                    )}
                    {platform !== CFD_PLATFORMS.CTRADER && (
                        <React.Fragment>
                            <a
                                href={mobileDownloadLink(platform, MOBILE_PLATFORMS.ANDROID)}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <Icon icon='IcInstallationGoogle' width={135} height={40} />
                            </a>

                            <a
                                href={mobileDownloadLink(platform, MOBILE_PLATFORMS.HAUWEI)}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <Icon icon='IcInstallationHuawei' width={135} height={40} />
                            </a>
                        </React.Fragment>
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

export default OtherCFDsTradeModal;
