import { TMt5TradeAccountProp } from 'src/types';
import { OSDetectionUtils } from '@deriv-com/utils';
import { DESKTOP_PLATFORMS, MOBILE_PLATFORMS } from '../../../constants';
import { whiteLabelLinks } from './urlConfig';

const { mobileOSDetectAsync } = OSDetectionUtils;

export const getPlatformMt5DownloadLink = (platform: string) => {
    switch (platform) {
        case DESKTOP_PLATFORMS.LINUX:
            return whiteLabelLinks?.linux;
        case DESKTOP_PLATFORMS.MACOS:
            return whiteLabelLinks?.macos;
        case MOBILE_PLATFORMS.HAUWEI:
            return whiteLabelLinks?.huawei;
        default:
            return '';
    }
};

export const getMobileAppInstallerURL = async ({ mt5TradeAccount }: TMt5TradeAccountProp) => {
    const os = await mobileOSDetectAsync();

    if (os === 'iOS') {
        return mt5TradeAccount?.white_label_links?.ios;
    } else if (os === 'huawei') {
        return getPlatformMt5DownloadLink('huawei');
    }
    return mt5TradeAccount?.white_label_links?.android;
};

export const getDesktopDownloadOptions = ({ mt5TradeAccount }: TMt5TradeAccountProp) => {
    const downloadOptions = [
        {
            button_text: 'Open',
            href: getWebtraderUrl({ mt5TradeAccount }),
            icon: 'IcRebrandingMt5Logo',
            text: 'MetaTrader 5 web',
        },
        {
            button_text: 'Download',
            href: mt5TradeAccount?.white_label_links?.windows,
            icon: 'IcWindowsLogo',
            text: 'MetaTrader 5 Windows app',
        },
        {
            button_text: 'Download',
            href: getPlatformMt5DownloadLink('macos'),
            icon: 'IcMacosLogo',
            text: 'MetaTrader 5 MacOS app',
        },
        {
            button_text: 'Learn more',
            href: getPlatformMt5DownloadLink('linux'),
            icon: 'IcLinuxLogo',
            text: 'MetaTrader 5 Linux app',
        },
    ];

    return downloadOptions;
};

export const getMobileDownloadOptions = ({ mt5TradeAccount }: TMt5TradeAccountProp) => [
    {
        href: mt5TradeAccount?.white_label_links?.ios,
        icon: 'IcInstallationApple',
    },
    {
        href: mt5TradeAccount?.white_label_links?.android,
        icon: 'IcInstallationGoogle',
    },
    {
        href: getPlatformMt5DownloadLink('huawei'),
        icon: 'IcInstallationHuawei',
    },
];

export const getWebtraderUrl = ({ mt5TradeAccount }: TMt5TradeAccountProp) => {
    return `${mt5TradeAccount?.white_label_links?.webtrader_url}?login=${mt5TradeAccount?.display_login}&server=${mt5TradeAccount?.server_info?.environment}`;
};

export const getDeeplinkUrl = ({ mt5TradeAccount }: TMt5TradeAccountProp) => {
    return `metatrader5://account?login=${mt5TradeAccount?.display_login}&server=${mt5TradeAccount?.server_info?.environment}`;
};

export const getMobileAppInstallerUrl = async ({ mt5TradeAccount }: TMt5TradeAccountProp) => {
    const os = await mobileOSDetectAsync();

    if (os === 'iOS') {
        return mt5TradeAccount?.white_label_links?.ios;
    } else if (os === 'huawei') {
        return whiteLabelLinks?.huawei;
    }
    return mt5TradeAccount?.white_label_links?.android;
};
