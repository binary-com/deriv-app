import PropTypes from 'prop-types';
import React from 'react';
import { extractInfoFromShortcode, isHighLow } from '@deriv/shared';
import { Icon, Popover, IconTradeTypes } from '@deriv/components';
import { getMarketName, getTradeTypeName } from '../Helpers/market-underlying';

const MarketSymbolIconRow = ({
    icon,
    payload,
    show_description,
    should_show_multiplier = true,
    should_show_accumulator = true,
}) => {
    const should_show_category_icon = typeof payload.shortcode === 'string';
    const info_from_shortcode = extractInfoFromShortcode(payload.shortcode);
    const is_high_low = isHighLow({ shortcode_info: info_from_shortcode });

    if (should_show_category_icon && info_from_shortcode) {
        return (
            <div className='market-symbol-icon'>
                <div className='market-symbol-icon-name'>
                    <Popover
                        classNameTarget='market-symbol-icon__popover'
                        classNameBubble='market-symbol-icon__popover-bubble'
                        alignment='top'
                        message={getMarketName(info_from_shortcode.underlying)}
                        is_bubble_hover_enabled
                        disable_target_icon
                    >
                        <Icon
                            icon={
                                info_from_shortcode.underlying
                                    ? `IcUnderlying${info_from_shortcode.underlying}`
                                    : 'IcUnknown'
                            }
                            size={32}
                        />
                    </Popover>
                    {show_description && payload.display_name}
                </div>

                <div className='market-symbol-icon-category'>
                    <Popover
                        classNameTarget='category-type-icon__popover'
                        classNameBubble='category-type-icon__popover-bubble'
                        alignment='top'
                        message={getTradeTypeName(info_from_shortcode.category, is_high_low)}
                        is_bubble_hover_enabled
                        disable_target_icon
                    >
                        <IconTradeTypes
                            type={
                                is_high_low
                                    ? `${info_from_shortcode.category.toLowerCase()}_barrier`
                                    : info_from_shortcode.category.toLowerCase()
                            }
                            color='brand'
                        />
                    </Popover>
                    {show_description && info_from_shortcode.category}
                </div>
                {should_show_multiplier && info_from_shortcode.multiplier && (
                    <div className='market-symbol-icon__multiplier'>x{info_from_shortcode.multiplier}</div>
                )}
                {should_show_accumulator && info_from_shortcode.growth_rate && (
                    <div className='market-symbol-icon__multiplier'>{info_from_shortcode.growth_rate * 100}%</div>
                )}
            </div>
        );
    } else if (['deposit', 'hold', 'release', 'withdrawal', 'transfer'].includes(payload.action_type)) {
        return (
            <div className='market-symbol-icon'>
                {payload.action_type === 'deposit' && <Icon icon={icon || 'IcCashierDeposit'} size={32} />}
                {payload.action_type === 'withdrawal' && <Icon icon='IcCashierWithdrawal' size={32} />}
                {payload.action_type === 'transfer' && <Icon icon='IcAccountTransferColored' size={32} />}
                {(payload.action_type === 'hold' || payload.action_type === 'release') && (
                    <Icon icon='IcCashierDp2p' size={32} />
                )}
            </div>
        );
    } else if (['adjustment'].includes(payload.action_type)) {
        return (
            <div className='market-symbol-icon'>
                <Icon icon='IcAdjustment' size={32} />
            </div>
        );
    }

    return (
        <svg width='32' height='32' className='unknown-icon'>
            <rect width='32' height='32' />
        </svg>
    );
};

MarketSymbolIconRow.propTypes = {
    action: PropTypes.string,
    icon: PropTypes.node,
    payload: PropTypes.object,
    show_description: PropTypes.bool,
    should_show_multiplier: PropTypes.bool,
    should_show_accumulator: PropTypes.bool,
};

export default MarketSymbolIconRow;
