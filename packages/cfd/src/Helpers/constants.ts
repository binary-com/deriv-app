import {
    OSDetect,
    getPlatformFromUrl,
    getErrorMessages,
    validLength,
    validPassword,
    validMT5Password,
    mobileOSDetectAsync,
} from '@deriv/shared';
import { localize } from '@deriv/translations';
import { TCFDsPlatformType, TDetailsOfEachMT5Loginid, TMobilePlatforms } from 'Components/props.types';
import { CFD_PLATFORMS, MOBILE_PLATFORMS, DESKTOP_PLATFORMS, CATEGORY } from './cfd-config';

const platformsText = (platform: TCFDsPlatformType) => {
    switch (platform) {
        case CFD_PLATFORMS.CTRADER:
            return 'cTrader';
        case CFD_PLATFORMS.DXTRADE:
            return 'X';
        default:
            return '';
    }
};

const platformsIcons = (platform: TCFDsPlatformType) => {
    switch (platform) {
        case CFD_PLATFORMS.DXTRADE:
            return 'Dxtrade';
        case CFD_PLATFORMS.CTRADER:
            return 'Ctrader';
        default:
            return '';
    }
};

const getTitle = (market_type: string, is_eu_user: boolean) => {
    if (is_eu_user) localize('MT5 CFDs');
    return market_type;
};

const { is_staging, is_test_link } = getPlatformFromUrl();

const DEEP_LINK = ({ mt5_trade_account }: { mt5_trade_account: TDetailsOfEachMT5Loginid }) =>
    `metatrader5://account?login=${mt5_trade_account?.display_login}&server=${mt5_trade_account?.server_info?.environment}`;

const STRATEGY_PROVIDER_NOTES = [
    'When setting up a strategy, you have the option to impose fees.',
    'For strategies where you impose fees, you must assign one of your existing accounts to process these fees. The same ‘Account For Fees’ can support multiple fee-based strategies.',
    'Free strategies do not require an ‘Account For Fees’.',
    'An account designated as a strategy provider is irreversible unless it remains inactive for 30 days.',
    'An account cannot simultaneously be a strategy provider and serve as an ‘Account For Fees’.',
];

const WEBTRADER_URL = ({ mt5_trade_account }: { mt5_trade_account: TDetailsOfEachMT5Loginid }) =>
    `${mt5_trade_account.white_label_links?.webtrader_url}?login=${mt5_trade_account?.display_login}&server=${mt5_trade_account?.server_info?.environment}`;

const REAL_DXTRADE_URL = 'https://dx.deriv.com';
const DEMO_DXTRADE_URL = 'https://dx-demo.deriv.com';

const CTRADER_DOWNLOAD_LINK = 'https://ctrader.com/download/';
const CTRADER_DESKTOP_MAC_DOWNLOAD = 'https://getctradermac.com/deriv/ctrader-deriv-setup.dmg';
const CTRADER_DESKTOP_WINDOWS_DOWNLOAD = 'https://getctrader.com/deriv/ctrader-deriv-setup.exe';

const CTRADER_UAT_URL = 'https://ct-uat.deriv.com/';
const CTRADER_PRODUCTION_URL = 'https://ct.deriv.com/';

const DXTRADE_IOS_APP_URL = 'https://apps.apple.com/us/app/deriv-x/id1563337503';
const DXTRADE_ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.deriv.dx';
const DXTRADE_HUAWEI_APP_URL = 'https://appgallery.huawei.com/app/C104633219';

const CTRADER_IOS_APP_URL = 'https://apps.apple.com/us/app/deriv-ctrader/id6466996509';
const CTRADER_ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.deriv.ct';

const CTRADER_URL = is_staging || is_test_link ? CTRADER_UAT_URL : CTRADER_PRODUCTION_URL;

const getTopUpConfig = () => {
    return {
        minimum_amount: 1000,
        additional_amount: 10000,
    };
};

const getPlatformDXTradeDownloadLink = (platform?: TMobilePlatforms) => {
    switch (platform) {
        case MOBILE_PLATFORMS.IOS:
            return DXTRADE_IOS_APP_URL;
        case MOBILE_PLATFORMS.HAUWEI:
            return DXTRADE_HUAWEI_APP_URL;
        case MOBILE_PLATFORMS.ANDROID:
            return DXTRADE_ANDROID_APP_URL;
        default:
            return '';
    }
};

const getPlatformCTraderDownloadLink = (platform: TMobilePlatforms) => {
    switch (platform) {
        case MOBILE_PLATFORMS.IOS:
            return CTRADER_IOS_APP_URL;
        case MOBILE_PLATFORMS.ANDROID:
            return CTRADER_ANDROID_APP_URL;
        case MOBILE_PLATFORMS.HAUWEI:
            return '';
        default:
            return CTRADER_ANDROID_APP_URL;
    }
};

const getPlatformMt5DownloadLink = (platform: string | undefined = undefined) => {
    switch (platform || OSDetect()) {
        case DESKTOP_PLATFORMS.LINUX:
            return 'https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux';
        case DESKTOP_PLATFORMS.MACOS:
            return 'https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/MetaTrader5.dmg';
        case MOBILE_PLATFORMS.HAUWEI:
            return 'https://appgallery.huawei.com/#/app/C102015329';
        default:
            return '';
    }
};

const getDXTradeWebTerminalLink = (category: string, token?: string) => {
    let url = category === CATEGORY.REAL ? REAL_DXTRADE_URL : DEMO_DXTRADE_URL;

    if (token) {
        url += `?token=${token}`;
    }

    return url;
};

const getCTraderWebTerminalLink = (token?: string) => {
    return `${CTRADER_URL}${token && `?token=${token}`}`;
};

const validatePassword = (password: string): string | undefined => {
    if (
        !validLength(password, {
            min: 8,
            max: 16,
        })
    ) {
        return localize('You should enter {{min_number}}-{{max_number}} characters.', {
            min_number: 8,
            max_number: 16,
        });
    } else if (!validPassword(password)) {
        return getErrorMessages().password();
    } else if (!validMT5Password(password)) {
        return localize('Please include at least 1 special character such as ( _ @ ? ! / # ) in your password.');
    }
};

const getMobileAppInstallerURL = async ({ mt5_trade_account }: { mt5_trade_account: TDetailsOfEachMT5Loginid }) => {
    const os = await mobileOSDetectAsync();

    if (os === 'iOS') {
        return mt5_trade_account?.white_label_links?.ios;
    } else if (os === 'huawei') {
        return getPlatformMt5DownloadLink('huawei');
    }
    return mt5_trade_account?.white_label_links?.android;
};

const getDesktopDownloadOptions = ({ mt5_trade_account }: { mt5_trade_account: TDetailsOfEachMT5Loginid }) => {
    const downloadOptions = [
        {
            icon: 'IcRebrandingMt5Logo',
            text: 'MetaTrader 5 web',
            button_text: 'Open',
            href: WEBTRADER_URL({ mt5_trade_account }),
        },
        {
            icon: 'IcWindowsLogo',
            text: localize('MetaTrader 5 Windows app'),
            button_text: 'Download',
            href: mt5_trade_account?.white_label_links?.windows,
        },
        {
            icon: 'IcMacosLogo',
            text: localize('MetaTrader 5 MacOS app'),
            button_text: 'Download',
            href: getPlatformMt5DownloadLink('macos'),
        },
        {
            icon: 'IcLinuxLogo',
            text: localize('MetaTrader 5 Linux app'),
            button_text: 'Learn more',
            href: getPlatformMt5DownloadLink('linux'),
        },
    ];

    return downloadOptions;
};

const getMobileDownloadOptions = ({ mt5_trade_account }: { mt5_trade_account: TDetailsOfEachMT5Loginid }) => [
    {
        href: mt5_trade_account?.white_label_links?.ios,
        icon: 'IcInstallationApple',
    },
    {
        href: mt5_trade_account?.white_label_links?.android,
        icon: 'IcInstallationGoogle',
    },
    {
        href: getPlatformMt5DownloadLink('huawei'),
        icon: 'IcInstallationHuawei',
    },
];

export {
    DEEP_LINK,
    REAL_DXTRADE_URL,
    DEMO_DXTRADE_URL,
    CTRADER_URL,
    CTRADER_DOWNLOAD_LINK,
    platformsText,
    STRATEGY_PROVIDER_NOTES,
    getPlatformDXTradeDownloadLink,
    getPlatformCTraderDownloadLink,
    getPlatformMt5DownloadLink,
    CTRADER_DESKTOP_MAC_DOWNLOAD,
    CTRADER_DESKTOP_WINDOWS_DOWNLOAD,
    getDXTradeWebTerminalLink,
    getCTraderWebTerminalLink,
    platformsIcons,
    getTitle,
    getTopUpConfig,
    validatePassword,
    getMobileAppInstallerURL,
    WEBTRADER_URL,
    getDesktopDownloadOptions,
    getMobileDownloadOptions,
};
