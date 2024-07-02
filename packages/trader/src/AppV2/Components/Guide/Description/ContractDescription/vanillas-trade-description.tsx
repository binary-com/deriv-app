import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST, TERM, parseContractDescription } from 'AppV2/Utils/trade-types-utils';

const VanillasTradeDescription = ({ onTermClick }: { onTermClick: (term: string) => void }) => {
    const content = [
        {
            type: 'general',
            text: (
                <Localize i18n_default_text='Vanilla options allow you to predict an upward (bullish) or downward (bearish) direction of the underlying asset by purchasing a “Call” or a “Put”.' />
            ),
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Call' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select “<0>Call</0>”, you’ll earn a <1>payout</1> if the <2>final price</2> is above the <3>strike price</3> at <4>expiry</4>. Otherwise, you won’t receive a payout.'
                    components={[
                        <span className='description__content--bold' key={0} />,
                        <button
                            className='description__content--definition'
                            key={1}
                            onClick={() => onTermClick(TERM.PAYOUT)}
                        />,
                        <button
                            className='description__content--definition'
                            key={2}
                            onClick={() => onTermClick(TERM.FINAL_PRICE)}
                        />,
                        <button
                            className='description__content--definition'
                            key={3}
                            onClick={() => onTermClick(TERM.STRIKE_PRICE)}
                        />,
                        <button
                            className='description__content--definition'
                            key={4}
                            onClick={() => onTermClick(TERM.EXPIRY)}
                        />,
                    ]}
                />
            ),
        },
        {
            type: 'video',
            text: CONTRACT_LIST.ACCUMULATORS,
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Put' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select “<0>Put</0>”, you’ll earn a payout if the final price is below the strike price at expiry. Otherwise, you won’t receive a payout.'
                    components={[<span className='description__content--bold' key={0} />]}
                />
            ),
        },
        {
            type: 'video',
            text: CONTRACT_LIST.ACCUMULATORS,
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Additional Information' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Your payout is equal to the <0>payout per point</0> multiplied by the difference between the final price and the strike price. You will only earn a profit if your payout is higher than your initial stake.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(TERM.PAYOUT_PER_POINT)}
                        />,
                    ]}
                />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='You may sell the contract up to 60 seconds before expiry. If you do, we’ll pay you the <0>contract value</0>.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(TERM.CONTRACT_VALUE)}
                        />,
                    ]}
                />
            ),
        },
    ];

    return <React.Fragment>{parseContractDescription(content)}</React.Fragment>;
};

export default VanillasTradeDescription;
