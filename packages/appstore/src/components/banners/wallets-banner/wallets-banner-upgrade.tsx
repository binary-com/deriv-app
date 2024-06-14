import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';

const WalletsBannerUpgrade = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_mobile_or_tablet } = ui;
    const { toggleWalletsUpgrade } = traders_hub;

    return (
        <div className='wallets-banner__container wallets-banner-upgrade'>
            <div className='wallets-banner__content wallets-banner-upgrade__content'>
                <div>
                    <Localize
                        i18n_default_text='<0>Wallets</0><1> — A smarter way to manage your funds</1>'
                        components={[
                            <Text key={0} weight='bold' size={is_mobile_or_tablet ? 'xs' : 'm'} />,
                            <Text key={1} size={is_mobile_or_tablet ? 'xs' : 'm'} />,
                        ]}
                    />
                </div>
                <Button
                    className='wallets-banner-upgrade__button'
                    text={localize('Enable now')}
                    primary
                    large
                    onClick={() => toggleWalletsUpgrade(true)}
                />
            </div>
            <Icon
                icon={`IcAppstoreWalletsUpgradeCoins${is_mobile_or_tablet ? '' : 'Horizontal'}`}
                width={is_mobile_or_tablet ? 220 : 448}
                height={is_mobile_or_tablet ? 220 : '100%'}
                className='wallets-banner-upgrade__image'
                data_testid={`dt_wallets_upgrade_coins${is_mobile_or_tablet ? '' : '_horizontal'}`}
            />
        </div>
    );
});

export default WalletsBannerUpgrade;
