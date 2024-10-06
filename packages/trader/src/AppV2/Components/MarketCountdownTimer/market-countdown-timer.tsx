import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import { LabelPairedStopwatchMdBoldIcon } from '@deriv/quill-icons';

type TMarketCountDownTimer = {
    time_left: {
        days?: number;
        hours?: number;
        minutes?: number;
        seconds?: number;
    };
};

const MarketCountdownTimer = ({ time_left }: TMarketCountDownTimer) => {
    let timer_components = '';

    if (Object.keys(time_left).length) {
        const hours = (Number(time_left.days) * 24 + Number(time_left.hours)).toString().padStart(2, '0');
        const minutes = Number(time_left.minutes).toString().padStart(2, '0');
        const seconds = Number(time_left.seconds).toString().padStart(2, '0');
        timer_components = `${hours}:${minutes}:${seconds}`;
    }

    return (
        <div className='market-countdown-timer'>
            <LabelPairedStopwatchMdBoldIcon fill='var(--component-textIcon-static-prominentDark)' />
            <Text bold size='md' className='market-countdown-timer-text'>
                {timer_components}
            </Text>
        </div>
    );
};

export default MarketCountdownTimer;
