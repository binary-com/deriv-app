import React from 'react';
import { localize } from '@deriv/translations';

export const AccumulatorTradeDescription = () => {
    const content = [
        {
            type: 'paragraph',
            text: localize(
                'When you open a position, barriers will be created around the asset price. For each new tick, the upper and lower barriers are automatically calculated based on the asset and accumulator value you choose. You will earn a profit if you close your position before the asset price hits either of the barriers.'
            ),
        },
        {
            type: 'paragraph',
            text: localize(
                'As long as the price change for each tick is within the barrier, your payout will grow at every tick, based on the accumulator value you’ve selected.'
            ),
        },
        { type: 'heading', text: localize('Take profit') },
        {
            type: 'paragraph',
            text: localize(
                'If you select “Take profit” and specify an amount that you’d like to earn, your position will be closed automatically when your profit is more than or equal to this amount. Your profit may be more than the amount you entered depending on the market price (and accumulator value) at closing.'
            ),
        },
        { type: 'heading', text: localize('Maximum payout') },
        {
            type: 'paragraph',
            text: localize(
                'We’ve limited the maximum payout for every contract, and it differs for every asset. Your contract will be closed automatically when the maximum payout is reached.'
            ),
        },
        { type: 'heading', text: localize('Maximum duration') },
        {
            type: 'paragraph',
            text: localize(
                'We’ve also limited the maximum duration for every contract, and it differs according to the accumulator value that you choose. Your contract will be closed automatically when the maximum duration is reached.'
            ),
        },
    ];

    return (
        <React.Fragment>
            {content.map(({ type, text }, index) =>
                type === 'heading' ? (
                    <h2 key={index}>
                        <strong>{text}</strong>
                    </h2>
                ) : (
                    <p key={index}>{text}</p>
                )
            )}
        </React.Fragment>
    );
};
