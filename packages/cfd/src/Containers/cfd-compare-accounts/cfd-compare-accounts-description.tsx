import React from 'react';
import classNames from 'classnames';
import { Text, Popover } from '@deriv/components';
import { TCompareAccountsCard } from 'Components/props.types';
import { useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { getJuridisctionDescription, getMarketType } from '../../Helpers/compare-accounts-config';
import { REGION, CFD_PLATFORMS, MARKET_TYPE_SHORTCODE } from '../../Helpers/cfd-config';

const CFDCompareAccountsDescription = ({ trading_platforms, is_demo }: TCompareAccountsCard) => {
    const { traders_hub } = useStore();
    const { selected_region } = traders_hub;

    const getMarketTypeShortcode = () => {
        if (
            trading_platforms.platform === CFD_PLATFORMS.DXTRADE ||
            trading_platforms.platform === CFD_PLATFORMS.CTRADER
        ) {
            return market_type.concat('_', trading_platforms.shortcode ?? '');
        } else if (trading_platforms.platform === CFD_PLATFORMS.MT5 && market_type === 'all') {
            return `${market_type}_${trading_platforms.product}_${trading_platforms.shortcode}`;
        }
        return market_type;
    };

    const market_type = getMarketType(trading_platforms);
    const market_type_shortcode = getMarketTypeShortcode();

    const juridisction_data = getJuridisctionDescription(market_type_shortcode, trading_platforms);

    const zero_spread_spread_message = localize('Commissions apply');

    return (
        <div
            className={classNames('compare-cfd-account-text-container', {
                'compare-cfd-account-text-container--demo': is_demo,
            })}
        >
            <div className='compare-cfd-account-text-container__separator'>
                <Text as='h1' weight='bold' size='m' align='center'>
                    {localize('Up to')} {juridisction_data.leverage ?? ''}
                </Text>
                <Text as='p' size='xxxs' align='center'>
                    {selected_region === REGION.NON_EU ? juridisction_data.leverage_description : localize('Leverage')}
                </Text>
            </div>
            {selected_region === REGION.NON_EU && (
                <div className='compare-cfd-account-text-container__separator'>
                    <Text as='h1' weight='bold' size='m' align='center'>
                        <div className='compare-cfd-account-spread'>
                            {juridisction_data.spread}
                            {market_type_shortcode === MARKET_TYPE_SHORTCODE.ALL_ZERO_SPREAD_BVI && (
                                <Popover
                                    alignment='top'
                                    className='compare-cfd-account-zerospread-tooltip'
                                    classNameBubble='compare-cfd-account-zerospread-tooltip--msg'
                                    icon='info'
                                    disable_message_icon
                                    is_bubble_hover_enabled
                                    message={zero_spread_spread_message}
                                    zIndex={9999}
                                />
                            )}
                        </div>
                    </Text>
                    <Text as='p' size='xxxs' align='center'>
                        {juridisction_data.spread_description}
                    </Text>
                </div>
            )}
        </div>
    );
};

export default CFDCompareAccountsDescription;
