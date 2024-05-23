import React from 'react';
import { QRCode } from 'react-qrcode';

import { Icon, Text, Button } from '@deriv/components';
import { TCFDsPlatformType, TMobilePlatforms } from 'Components/props.types';
import {
    getPlatformDXTradeDownloadLink,
    getPlatformCTraderDownloadLink,
    getDXTradeWebTerminalLink,
    getCTraderWebTerminalLink,
    platformsIcons,
    platformsText,
    CTRADER_URL,
} from './constants';
import { isMobile } from '@deriv/shared';
import { Localize } from '@deriv/translations';

import { TCFDDashboardContainer } from 'Containers/props.types';
import { CATEGORY, CFD_PLATFORMS } from './cfd-config';

export const mobileDownloadLink = (platform: TCFDsPlatformType, type: TMobilePlatforms) => {
    switch (platform) {
        case CFD_PLATFORMS.DXTRADE:
            return getPlatformDXTradeDownloadLink(type);
        case CFD_PLATFORMS.CTRADER:
            return getPlatformCTraderDownloadLink(type);
        default:
            return getPlatformDXTradeDownloadLink(type);
    }
};

export const getPlatformQRCode = (acc_type: TCFDsPlatformType) => {
    const qr_code_mobile = isMobile() ? '100%' : '80%';

    const QRCodeLinks = () => {
        switch (acc_type) {
            case CFD_PLATFORMS.DXTRADE:
                return 'https://onelink.to/grmtyx';
            case CFD_PLATFORMS.CTRADER:
                return 'https://onelink.to/5jgj8z';
            default:
                return 'https://onelink.to/grmtyx';
        }
    };

    return (
        <React.Fragment>
            <QRCode
                value={QRCodeLinks()}
                size={5}
                style={{ height: 'auto', maxWidth: '100%', width: qr_code_mobile }}
            />
            <Text align='center' size='xxs'>
                <Localize
                    i18n_default_text='Scan the QR code to download Deriv {{ platform }}.'
                    values={{ platform: platformsText(acc_type) }}
                />
            </Text>
        </React.Fragment>
    );
};

type TPlatformsDesktopDownload = {
    platform: TCFDsPlatformType;
    dxtrade_tokens: TCFDDashboardContainer['dxtrade_tokens'];
    ctrader_tokens: TCFDDashboardContainer['ctrader_tokens'];
    is_demo: string;
    ctraderTokenCall: (url: string, account_type: 'real' | 'demo') => void;
};

export const PlatformsDesktopDownload = ({
    platform,
    dxtrade_tokens,
    ctrader_tokens,
    ctraderTokenCall,
    is_demo,
}: TPlatformsDesktopDownload) => {
    const PlatformsDesktopDownloadLinks = () => {
        switch (platform) {
            case CFD_PLATFORMS.CTRADER:
                return getCTraderWebTerminalLink(
                    ctrader_tokens && ctrader_tokens[is_demo ? CATEGORY.DEMO : CATEGORY.REAL]
                );
            case CFD_PLATFORMS.DXTRADE:
                return getDXTradeWebTerminalLink(
                    is_demo ? 'demo' : 'real',
                    dxtrade_tokens && dxtrade_tokens[is_demo ? CATEGORY.DEMO : CATEGORY.REAL]
                );
            default:
                return '';
        }
    };

    return (
        <React.Fragment>
            <Button
                className='cfd-trade-modal__platform-button'
                onClick={() => {
                    if (platform === CFD_PLATFORMS.CTRADER) {
                        ctraderTokenCall(CTRADER_URL, is_demo ? 'demo' : 'real');
                    } else {
                        window.open(PlatformsDesktopDownloadLinks());
                    }
                }}
            >
                {platform === CFD_PLATFORMS.CTRADER ? (
                    <Icon
                        className='cfd-trade-modal__platform-button-icon'
                        icon={`IcBrand${platformsIcons(platform)}Wordmark`}
                        width={60}
                        height={30}
                    />
                ) : (
                    <Icon
                        className='cfd-trade-modal__platform-button-icon'
                        icon={`IcBrand${platformsIcons(platform)}Wordmark`}
                        width={36}
                        height={30}
                    />
                )}
                <div className='cfd-trade-modal__platform-button-text'>
                    <Text color='colored-background' size='xxs' weight='bold'>
                        <Localize i18n_default_text='Web terminal' />
                    </Text>
                </div>
            </Button>
        </React.Fragment>
    );
};
