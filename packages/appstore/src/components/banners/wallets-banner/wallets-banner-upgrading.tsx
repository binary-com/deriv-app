import React from 'react';
import { Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

const WalletsBannerUpgrading = observer(() => {
    const { ui } = useStore();
    const { is_mobile_or_tablet } = ui;

    return (
        <div className='wallets-banner__container wallets-banner-upgrading'>
            <div className='wallets-banner__content wallets-banner-upgrading__content'>
                <div className='wallets-banner-upgrading__loading' data-testid='dt_wallets_loading_dots'>
                    <span className='wallets-banner-upgrading__dot' />
                    <span className='wallets-banner-upgrading__dot' />
                    <span className='wallets-banner-upgrading__dot' />
                </div>
                <Localize
                    i18n_default_text="<0>We're setting up your Wallets</0>"
                    components={[
                        <Text
                            key={0}
                            line_height={is_mobile_or_tablet ? 's' : 'm'}
                            size={is_mobile_or_tablet ? 'xs' : 'sm'}
                            weight='bold'
                        />,
                    ]}
                />
                <Localize
                    i18n_default_text='<0>This may take up to 2 minutes. During this time, some services may be unavailable.</0>'
                    components={[
                        <Text
                            className='wallets-banner-upgrading__description'
                            key={0}
                            line_height='s'
                            size={is_mobile_or_tablet ? 'xxxs' : 'xs'}
                        />,
                    ]}
                />
            </div>
            <Icon
                icon={`IcAppstoreWalletsUpgradeCoins${is_mobile_or_tablet ? '' : 'Horizontal'}`}
                width={is_mobile_or_tablet ? 220 : 448}
                height={is_mobile_or_tablet ? 220 : '100%'}
                className='wallets-banner-upgrading__image'
                data_testid={`dt_wallets_upgrade_coins${is_mobile_or_tablet ? '' : '_horizontal'}`}
            />
        </div>
    );
});

export default WalletsBannerUpgrading;
