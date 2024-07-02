import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Text } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { Localize } from 'Components/i18next';
import { base64_images } from 'Constants/base64-images';
import { buy_sell } from 'Constants/buy-sell';
import { ad_type } from 'Constants/floating-rate';
import { TAdvertProps } from 'Types';

type TShareMyAdsCardProps = {
    advert: Partial<TAdvertProps>;
    advert_url: string;
    div_ref: React.MutableRefObject<HTMLDivElement> | React.MutableRefObject<null>;
};

const ShareMyAdsCard = ({ advert, advert_url, div_ref }: TShareMyAdsCardProps) => {
    const { isDesktop } = useDevice();
    const {
        account_currency,
        id,
        local_currency,
        max_order_amount_limit_display,
        min_order_amount_limit_display,
        rate_display,
        rate_type,
        type,
    } = advert;

    const advert_type = type === buy_sell.BUY ? 'Buy' : 'Sell';

    return (
        <div className='share-my-ads-card' ref={div_ref}>
            <img alt='deriv_p2p' className='share-my-ads-card__icon' src={base64_images.deriv_p2p} />
            <Text className='share-my-ads-card__title' weight='bold' size='m'>
                <Localize
                    i18n_default_text='{{type}} {{account_currency}}'
                    values={{ type: advert_type, account_currency }}
                />
            </Text>
            <div className='share-my-ads-card__numbers'>
                <div className='share-my-ads-card__numbers-text'>
                    <Text color='colored-background' size='xs'>
                        <Localize i18n_default_text='ID number' />
                    </Text>
                    <Text color='colored-background' size='xs'>
                        <Localize i18n_default_text='Limits' />
                    </Text>
                    <Text color='colored-background' size='xs'>
                        <Localize i18n_default_text='Rate' />
                    </Text>
                </div>
                <div className='share-my-ads-card__numbers-text'>
                    <Text color='colored-background' size='xs' weight='bold'>
                        {id}
                    </Text>
                    <Text color='colored-background' size='xs' weight='bold'>
                        {min_order_amount_limit_display} - {max_order_amount_limit_display} {account_currency}
                    </Text>
                    <Text color='colored-background' size='xs' weight='bold'>
                        {rate_display}
                        {rate_type === ad_type.FIXED ? ` ${local_currency}` : '%'}
                    </Text>
                </div>
            </div>
            <div className='share-my-ads-card__qr'>
                <div className='share-my-ads-card__qr-container'>
                    <QRCodeSVG
                        value={advert_url}
                        size={isDesktop ? 140 : 120}
                        imageSettings={{
                            src: '',
                            height: 25,
                            width: 25,
                            excavate: true,
                        }}
                    />
                    <img
                        alt='dp2p_logo'
                        className='share-my-ads-card__qr-icon'
                        src={base64_images.dp2p_logo}
                        height='25'
                        width='25'
                    />
                </div>
                <Text className='share-my-ads-card__qr-text' color='less-prominent' size='xxs'>
                    <Localize i18n_default_text='Scan this code to order via Deriv P2P' />
                </Text>
            </div>
        </div>
    );
};

export default ShareMyAdsCard;
