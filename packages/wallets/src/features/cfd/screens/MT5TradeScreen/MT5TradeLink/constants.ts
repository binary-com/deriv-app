import { OSDetectionUtils } from '@deriv-com/utils';
import { THooks } from '../../../../../types';
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

export const getMobileAppInstallerURL = async ({ mt5TradeAccount }: { mt5TradeAccount: THooks.MT5AccountsList }) => {
    const os = await mobileOSDetectAsync();

    if (os === 'iOS') {
        return mt5TradeAccount?.white_label_links?.ios;
    } else if (os === 'huawei') {
        return getPlatformMt5DownloadLink('huawei');
    }
    return mt5TradeAccount?.white_label_links?.android;
};

export const getWebtraderUrl = ({ mt5TradeAccount }: { mt5TradeAccount: THooks.MT5AccountsList }) => {
    return `${mt5TradeAccount?.white_label_links?.webtrader_url}?login=${mt5TradeAccount?.display_login}&server=${mt5TradeAccount?.server_info?.environment}`;
};

export const getDeeplinkUrl = ({ mt5TradeAccount }: { mt5TradeAccount: THooks.MT5AccountsList }) => {
    return `metatrader5://account?login=${mt5TradeAccount?.display_login}&server=${mt5TradeAccount?.server_info?.environment}`;
};

export const getMobileAppInstallerUrl = async ({ mt5TradeAccount }: { mt5TradeAccount: THooks.MT5AccountsList }) => {
    const os = await mobileOSDetectAsync();

    if (os === 'iOS') {
        return mt5TradeAccount?.white_label_links?.ios;
    } else if (os === 'huawei') {
        return whiteLabelLinks?.huawei;
    }
    return mt5TradeAccount?.white_label_links?.android;
};
