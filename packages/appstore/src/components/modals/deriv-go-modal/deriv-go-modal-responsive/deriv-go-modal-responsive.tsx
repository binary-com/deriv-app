import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { MobileDialog, Text, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getUrlBase, isSafariBrowser } from '@deriv/shared';
import { DERIVGO_OPEN_APP_URL, DERIV_PLATFORM_NAMES, getMobileDerivGoAppInstallerURL } from 'Constants/platform-config';
import TradingPlatformIconProps from 'Assets/svgs/trading-platform';
import './deriv-go-modal-responsive.scss';

export const DerivGoModalResponsive = observer(() => {
    const { traders_hub } = useStore();
    const { is_deriv_go_modal_visible, setIsDerivGoModalVisible } = traders_hub;

    let mobile_url;
    const mobileURLSet = () => {
        mobile_url = window.location.replace(DERIVGO_OPEN_APP_URL);

        const timeout = setTimeout(() => {
            mobile_url = window.location.replace(getMobileDerivGoAppInstallerURL());
        }, 1500);

        if (!isSafariBrowser()) {
            window.onblur = () => {
                clearTimeout(timeout);
            };
        }
    };

    const handleModalClose = () => {
        setIsDerivGoModalVisible(false);
    };

    return (
        <MobileDialog portal_element_id='modal_root' visible={is_deriv_go_modal_visible} onClose={handleModalClose}>
            <div className='deriv-go-modal-responsive'>
                <div className='deriv-go-modal-responsive__logo'>
                    <TradingPlatformIconProps icon='DerivGo' size={24} />
                    <Text as='h5' weight='bold'>
                        {DERIV_PLATFORM_NAMES.GO}
                    </Text>
                </div>
                <div className='deriv-go-modal-responsive__content'>
                    <img
                        alt='deriv GO image'
                        src={getUrlBase('/public/images/common/appstore/deriv_go_image.png')}
                        width={'72%'}
                    />

                    <div className='deriv-go-modal-responsive__app-with-note'>
                        <a
                            className='deriv-go-modal-responsive__app-with-note--option'
                            onClick={mobileURLSet}
                            href={mobile_url}
                        >
                            <div className='full-row'>
                                <Icon icon='IcMobileOutline' size={16} custom_color='var(--text-prominent)' />
                                <Text align='left' size='xxs' weight='bold' className='title'>
                                    <Localize
                                        i18n_default_text='Trade with {{platform}} mobile app'
                                        values={{
                                            platform: DERIV_PLATFORM_NAMES.GO,
                                        }}
                                    />
                                </Text>
                                <Icon icon='IcChevronRight' size={16} />
                            </div>
                        </a>

                        <Text as='p' size='xxs'>
                            <Localize
                                i18n_default_text="Note: Don't have {{platform}} app? Tap the <0>Trade with {{platform}} mobile app</0> button to download. Once you have installed the app, it’ll launch automatically. "
                                components={[<strong key={0} />]}
                                values={{
                                    platform: DERIV_PLATFORM_NAMES.GO,
                                }}
                            />
                        </Text>
                    </div>
                </div>
            </div>
        </MobileDialog>
    );
});
