import React, { Fragment } from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getDesktopDownloadOptions, getMobileDownloadOptions } from '../Helpers/constants';
import { CFD_PLATFORMS, getCFDPlatformLabel, getPlatformSettings, getUrlBase } from '@deriv/shared';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import './mt5-mobile-redirect-option.scss';

type TMT5DesktopRedirectOptionProps = {
    account_title: string;
    mt5_trade_account: DetailsOfEachMT5Loginid;
};

const MT5DesktopRedirectOption = ({ account_title, mt5_trade_account }: TMT5DesktopRedirectOptionProps) => {
    const desktopDownloadOptions = getDesktopDownloadOptions({ mt5_trade_account });
    const mobileDownloadOptions = getMobileDownloadOptions({ mt5_trade_account });

    return (
        <Fragment>
            <div className='cfd-trade-modal__download-center-app'>
                {desktopDownloadOptions.map(option => (
                    <div key={option.icon} className='cfd-trade-modal__download-center-app--option'>
                        <Icon icon={option.icon} size={32} />
                        <Text className='cfd-trade-modal__download-center-app--option-item' size='xs'>
                            {option.text}
                        </Text>
                        <a
                            className='cfd-trade-modal__download-center-app--option-link'
                            type='button'
                            href={option.href as string}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <Text size='xxs' weight='bold' color='prominent'>
                                {option.button_text}
                            </Text>
                        </a>
                    </div>
                ))}
            </div>
            <Text align='center' as='div' className='cfd-trade-modal__download-center-text' size='xxs' weight='bold'>
                {localize(
                    'Download {{ platform }} on your phone to trade with the {{ platform }} {{ account }} account',
                    {
                        platform: getCFDPlatformLabel(CFD_PLATFORMS.MT5),
                        account: account_title,
                    }
                )}
            </Text>
            <div className='cfd-trade-modal__download-center-options'>
                <div className='cfd-trade-modal__download-center-options--mobile-links'>
                    {mobileDownloadOptions.map(({ href, icon }) => (
                        <a key={href} href={href} target='_blank' rel='noopener noreferrer'>
                            {icon}
                        </a>
                    ))}
                </div>

                <div className='cfd-trade-modal__download-center-options--qrcode'>
                    <img
                        alt='mt5 download qr'
                        src={getUrlBase('/public/images/common/mt5_download.png')}
                        width={80}
                        height={80}
                    />
                    <Text align='center' size='xxs'>
                        {localize('Scan the QR code to download {{ platform }}.', {
                            platform: getPlatformSettings(CFD_PLATFORMS.MT5).name,
                        })}
                    </Text>
                </div>
            </div>
        </Fragment>
    );
};

export default MT5DesktopRedirectOption;
