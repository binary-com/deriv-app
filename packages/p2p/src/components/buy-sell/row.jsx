import React from 'react';
import PropTypes from 'prop-types';
import ContentLoader from 'react-content-loader';
import { Table, Button } from '@deriv/components';
import Dp2pContext from 'Components/context/dp2p-context';
import { localize } from 'Components/i18next';
import { generateHexColourFromNickname, getShortNickname } from 'Utils/string';

export const BuySellRowLoader = () => (
    <ContentLoader
        height={64}
        width={900}
        speed={2}
        primaryColor={'var(--general-hover)'}
        secondaryColor={'var(--general-active)'}
    >
        <rect x='1' y='20' rx='5' ry='5' width='90' height='10' />
        <rect x='150' y='20' rx='5' ry='5' width='90' height='10' />
        <rect x='300' y='20' rx='5' ry='5' width='90' height='10' />
        <rect x='446' y='20' rx='5' ry='5' width='90' height='10' />
        <rect x='600' y='20' rx='5' ry='5' width='90' height='10' />
        <rect x='750' y='15' rx='5' ry='5' width='45' height='18' />
    </ContentLoader>
);

BuySellRowLoader.propTypes = {
    width: PropTypes.number,
};

export const RowComponent = React.memo(({ advert, setSelectedAdvert, style }) => {
    const {
        account_currency,
        min_order_amount_limit_display,
        max_order_amount_limit_display,
        local_currency,
        price_display,
        type,
    } = advert;
    const { advertiser_id } = React.useContext(Dp2pContext);
    const is_my_ad = advert.advertiser_details.id === advertiser_id;
    const is_buy_ad = type === 'buy';
    const { name: advertiser_name } = advert.advertiser_details;
    const advertiser_short_name = getShortNickname(advertiser_name);

    return (
        <div style={style}>
            <Table.Row className='buy-sell__table-row'>
                <Table.Cell>
                    <div
                        className='buy-sell__icon'
                        style={{ backgroundColor: generateHexColourFromNickname(advertiser_name) }}
                    >
                        {advertiser_short_name}
                    </div>
                    {advertiser_name}
                </Table.Cell>
                <Table.Cell>
                    {min_order_amount_limit_display}&ndash;{max_order_amount_limit_display} {account_currency}
                </Table.Cell>
                <Table.Cell className='buy-sell__price' flex='2fr'>
                    {price_display} {local_currency}
                </Table.Cell>
                {is_my_ad ? (
                    <Table.Cell />
                ) : (
                    <Table.Cell className='buy-sell__button'>
                        <Button primary small onClick={() => setSelectedAdvert(advert)}>
                            {is_buy_ad ? localize('Buy') : localize('Sell')} {account_currency}
                        </Button>
                    </Table.Cell>
                )}
            </Table.Row>
        </div>
    );
});

RowComponent.propTypes = {
    advert: PropTypes.object,
    is_buy: PropTypes.bool,
    setSelectedAdvert: PropTypes.func,
    style: PropTypes.object,
};

RowComponent.displayName = 'RowComponent';
