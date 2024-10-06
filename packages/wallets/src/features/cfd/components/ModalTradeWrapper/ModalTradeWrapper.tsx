import React, { FC, PropsWithChildren } from 'react';
import QRCode from 'qrcode.react';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../components/Base/ModalStepWrapper';
import InstallationAppleIcon from '../../../../public/images/ic-installation-apple.svg';
import InstallationGoogleIcon from '../../../../public/images/ic-installation-google.svg';
import InstallationHuaweiIcon from '../../../../public/images/ic-installation-huawei.svg';
import { TPlatforms } from '../../../../types';
import { PlatformDetails } from '../../constants';
import { ctraderLinks, dxtradeLinks, whiteLabelLinks } from '../../screens/MT5TradeScreen/MT5TradeLink/urlConfig';
import './ModalTradeWrapper.scss';

type TAppLinks = {
    android: string;
    huawei?: string;
    ios: string;
};

const LinksMapper: Record<TPlatforms.All, TAppLinks> = {
    ctrader: {
        android: ctraderLinks.android,
        ios: ctraderLinks.ios,
    },
    dxtrade: {
        android: dxtradeLinks.android,
        huawei: dxtradeLinks.huawei,
        ios: dxtradeLinks.ios,
    },
    mt5: {
        android: whiteLabelLinks.android,
        huawei: whiteLabelLinks.huawei,
        ios: whiteLabelLinks.ios,
    },
};

// TODO: Implement App Icon once icons are available.
const AppToIconMapper = {
    android: InstallationGoogleIcon,
    huawei: InstallationHuaweiIcon,
    ios: InstallationAppleIcon,
} as const;

type TModalTradeWrapper = {
    platform: TPlatforms.All;
};

const ModalTradeWrapper: FC<PropsWithChildren<TModalTradeWrapper>> = ({ children, platform }) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    const appOrder = ['ios', 'android', 'huawei'];
    const { link, title } = PlatformDetails[platform];

    return (
        <ModalStepWrapper
            renderFooter={() => {
                return (
                    <div className='wallets-modal-trade-wrapper__footer'>
                        <Text align='center' size='sm' weight='bold'>
                            <Localize
                                i18n_default_text='Download {{title}} on your phone to trade with the {{title}} account'
                                values={{ title }}
                            />
                        </Text>
                        <div className='wallets-modal-trade-wrapper__footer-installations'>
                            <div className='wallets-modal-trade-wrapper__footer-installations-icons'>
                                {appOrder.map(app => {
                                    const AppsLinkMapper = LinksMapper[platform][app as keyof TAppLinks];
                                    if (AppsLinkMapper) {
                                        const AppIcon = AppToIconMapper[app as keyof typeof AppToIconMapper];
                                        const appLink = AppsLinkMapper;
                                        return <AppIcon key={app} onClick={() => window.open(appLink)} />;
                                    }
                                    return null;
                                })}
                            </div>

                            <div className='wallets-modal-trade-wrapper__footer-installations-qr'>
                                <QRCode size={80} value={link} />
                                <Text align='center' size='xs'>
                                    <Localize
                                        i18n_default_text='Scan the QR code to download {{title}}'
                                        values={{ title }}
                                    />
                                </Text>
                            </div>
                        </div>
                    </div>
                );
            }}
            shouldFixedFooter={isDesktop}
            shouldHideFooter={!isDesktop}
            title={localize('Trade')}
        >
            {children}
        </ModalStepWrapper>
    );
};

export default ModalTradeWrapper;
