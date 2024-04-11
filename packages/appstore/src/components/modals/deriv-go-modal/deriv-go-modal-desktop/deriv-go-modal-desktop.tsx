import React from 'react';
import QRCode from 'qrcode.react';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { Modal, Text, Icon } from '@deriv/components';
import { getUrlBase } from '@deriv/shared';
import {
    DERIV_PLATFORM_NAMES,
    getPlatformDerivGoDownloadLink,
    MOBILE_PLATFORMS,
    DERIVGO_QRCODE_APP_URL,
} from 'Constants/platform-config';
import TradingPlatformIconProps from 'Assets/svgs/trading-platform';
import './deriv-go-modal-desktop.scss';

export const DerivGoModalDesktop = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_deriv_go_modal_visible, setIsDerivGoModalVisible } = traders_hub;
    const { is_dark_mode_on } = ui;

    const handleModalClose = () => {
        setIsDerivGoModalVisible(false);
    };

    return (
        <Modal
            is_open={is_deriv_go_modal_visible}
            toggleModal={handleModalClose}
            width='701px'
            should_header_stick_body={false}
            has_close_icon
            title={
                <Localize
                    i18n_default_text='Trade with {{platform}}'
                    values={{
                        platform: DERIV_PLATFORM_NAMES.GO,
                    }}
                />
            }
        >
            <div className='deriv-go-modal-desktop'>
                <div className='deriv-go-modal-desktop__logo'>
                    <TradingPlatformIconProps icon='DerivGo' size={24} />
                    <Text as='h5' weight='bold'>
                        {DERIV_PLATFORM_NAMES.GO}
                    </Text>
                </div>
                <div className='deriv-go-modal-desktop__content'>
                    <img
                        alt='deriv GO image'
                        src={getUrlBase('/public/images/common/appstore/deriv_go_image.png')}
                        width={316}
                    />
                    <div className='deriv-go-modal-desktop__description-and-links'>
                        <Text as='p' size='xs'>
                            <Localize
                                i18n_default_text='Download {{platform}} and dive into trading on your mobile.'
                                components={[<strong key={0} />]}
                                values={{
                                    platform: DERIV_PLATFORM_NAMES.GO,
                                }}
                            />
                        </Text>
                        <div className='deriv-go-modal-desktop__links'>
                            <div className='deriv-go-modal-desktop__qr'>
                                <div className='deriv-go-modal-desktop__qr--image'>
                                    <QRCode size={80} value={DERIVGO_QRCODE_APP_URL} />
                                </div>
                                <Text as='p' size='xxs' className='deriv-go-modal-desktop__qr--description'>
                                    <Localize
                                        i18n_default_text='Scan the QR code to download {{platform}}'
                                        values={{
                                            platform: DERIV_PLATFORM_NAMES.GO,
                                        }}
                                    />
                                </Text>
                            </div>
                            <div className='deriv-go-modal-desktop__apps'>
                                <a
                                    href={getPlatformDerivGoDownloadLink(MOBILE_PLATFORMS.ANDROID)}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    <Icon
                                        icon={is_dark_mode_on ? 'IcInstallationGoogle' : 'IcInstallationGoogleLight'}
                                        width={139}
                                        height={46}
                                    />
                                </a>
                                <a
                                    href={getPlatformDerivGoDownloadLink(MOBILE_PLATFORMS.IOS)}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    <Icon
                                        icon={is_dark_mode_on ? 'IcInstallationApple' : 'IcInstallationAppleLight'}
                                        width={139}
                                        height={46}
                                    />
                                </a>
                                <a
                                    href={getPlatformDerivGoDownloadLink(MOBILE_PLATFORMS.HAUWEI)}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    <Icon
                                        icon={is_dark_mode_on ? 'IcInstallationHuawei' : 'IcInstallationHuaweiLight'}
                                        width={139}
                                        height={46}
                                    />
                                </a>
                            </div>
                        </div>
                        <Text as='p' size='xxs' className='deriv-go-modal-desktop__note'>
                            <Localize
                                i18n_default_text='<0>Note:</0> Already have Deriv GO? Open the app and trade now.'
                                components={[<strong key={0} />]}
                            />
                        </Text>
                    </div>
                </div>
            </div>
        </Modal>
    );
});
