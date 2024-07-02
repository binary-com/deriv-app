import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST, TERM, parseContractDescription } from 'AppV2/Utils/trade-types-utils';

const AccumulatorsTradeDescription = ({ onTermClick }: { onTermClick: (term: string) => void }) => {
    const content = [
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Accumulators allow you to express a view on the range of movement of an index and grow your stake exponentially at a fixed <0>growth rate</0>.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(TERM.GROWTH_RATE)}
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
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Your stake will continue to grow as long as the current spot price remains within a specified <0>range</0> from the <1>previous spot price</1>. Otherwise, you lose your stake and the trade is terminated.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(TERM.RANGE)}
                        />,
                        <button
                            className='description__content--definition'
                            key={1}
                            onClick={() => onTermClick(TERM.PREVIOUS_SPOT_PRICE)}
                        />,
                    ]}
                />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='Your <0>payout</0> is the sum of your initial stake and profit.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(TERM.PAYOUT)}
                        />,
                    ]}
                />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='<0>Take profit</0> is an additional feature that lets you manage your risk by automatically closing the trade when your profit reaches the target amount. This feature is unavailable for ongoing accumulator contracts.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(TERM.TAKE_PROFIT)}
                        />,
                    ]}
                />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='You can close your trade anytime. However, be aware of <0>slippage risk</0>.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(TERM.SLIPPAGE_RISK)}
                        />,
                    ]}
                />
            ),
        },
    ];

    return <React.Fragment>{parseContractDescription(content)}</React.Fragment>;
};

export default AccumulatorsTradeDescription;
