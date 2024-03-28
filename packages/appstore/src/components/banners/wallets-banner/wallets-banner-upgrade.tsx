import React from 'react';
import WalletsImage from 'Assets/svgs/wallets';
import { Button, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { TWalletsImagesListKey } from 'Assets/svgs/wallets/image-types';
import { observer, useStore } from '@deriv/stores';

const WalletsBannerUpgrade = observer(() => {
    const { traders_hub, ui } = useStore();
    const { toggleWalletsUpgrade } = traders_hub;
    const { is_mobile } = ui;

    const image: TWalletsImagesListKey = is_mobile ? 'upgrade_mobile' : 'upgrade_desktop';
    const size: string = is_mobile ? 'xs' : 'm';

    return (
        <div className='wallets-banner__container wallets-banner__upgrade-banner'>
            <div className='wallets-banner__upgrade-banner-description'>
                <div>
                    <Localize
                        i18n_default_text='<0>Wallets</0><1> — A smarter way to manage your funds</1>'
                        components={[<Text key={0} weight='bold' size={size} />, <Text key={1} size={size} />]}
                    />
                </div>
                <Button
                    className='wallets-banner__upgrade-banner-button'
                    text={localize('Upgrade now')}
                    primary
                    large
                    onClick={() => {
                        // TODO: Uncomment this when wallet migration modal ready
                        // toggleWalletsUpgrade(true)
                    }}
                />
            </div>
            <WalletsImage image={image} className='wallets-banner__image' />
        </div>
    );
});

export default WalletsBannerUpgrade;
