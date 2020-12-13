import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import MarketCountdownTimer from './market-countdown-timer.jsx';

const MarketIsClosedOverlay = ({ is_eu, is_market_available, is_market_close_overlay_loading, onClick }) => {
    let message = null;
    let button = null;
    if (is_eu) {
        button = (
            <Button
                className='market-is-closed-overlay__button'
                onClick={onClick}
                text={localize('See open markets')}
                primary
            />
        );
    } else {
        button = (
            <Button
                className='market-is-closed-overlay__button'
                onClick={onClick}
                text={localize('Try Synthetic Indices')}
                primary
            />
        );
        message = (
            <Localize i18n_default_text='In the meantime, try our synthetic indices. They simulate real-market volatility and are open 24/7.' />
        );
    }

    return (
        <div
            className={classNames('market-is-closed-overlay', {
                'market-is-closed-overlay--loading': is_market_close_overlay_loading,
            })}
        >
            <Text as='p' className='market-is-closed-overlay__main-heading' color='prominent' weight='bold'>
                <Localize i18n_default_text='This market is closed' />
            </Text>
            <MarketCountdownTimer is_main_page />
            {message && (
                <Text align='center' as='p' className='market-is-closed-overlay__main-message' size='xs'>
                    {message}
                </Text>
            )}
            {(!is_eu || (is_eu && is_market_available)) && button}
        </div>
    );
};

MarketIsClosedOverlay.propTypes = {
    is_eu: PropTypes.bool,
    is_market_close_overlay_loading: PropTypes.bool,
    onClick: PropTypes.func,
};

export default MarketIsClosedOverlay;
