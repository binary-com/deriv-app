import React from 'react';
import WalletsImage from 'Assets/svgs/wallets';
import { Button, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import { TWalletsImagesListKeys } from 'Assets/svgs/wallets/image-types';

// just for now for testing purpose, in the future 'is_eu' value will be taken from the store
type TWalletsBannerUpgrading = {
    is_eu?: boolean;
};

const WalletsBannerUpgrading = ({ is_eu }: TWalletsBannerUpgrading) => {
    const image: TWalletsImagesListKeys = isMobile()
        ? `ready_mobile${is_eu ? '_eu' : ''}`
        : `ready_desktop${is_eu ? '_eu' : ''}`;
    const size: string = isMobile() ? 'xs' : 'm';

    return (
        <div className='wallets-banner__container wallets-banner__upgrading-banner'>
            <div className='wallets-banner__upgrading-banner-description'>
                <div>
                    <Localize
                        i18n_default_text='<0>Wallets</0><1> - the best way to organise your funds</1>'
                        components={[<Text key={0} weight='bold' size={size} />, <Text key={1} size={size} />]}
                    />
                </div>
                <Button
                    className={'wallets-banner__upgrading-banner-button'}
                    has_effect
                    text={localize('Upgrade now')}
                    primary
                    large={!isMobile()}
                />
            </div>
            <WalletsImage image={image} className={'wallets-banner__image wallets-banner__upgrading-banner-image'} />
        </div>
    );
};

export default WalletsBannerUpgrading;
