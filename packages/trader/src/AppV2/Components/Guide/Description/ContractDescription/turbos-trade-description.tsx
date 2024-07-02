import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST, TERM, parseContractDescription } from 'AppV2/Utils/trade-types-utils';

const TurbosTradeDescription = ({ onTermClick }: { onTermClick: (term: string) => void }) => {
    const content = [
        {
            type: 'general',
            text: (
                <Localize i18n_default_text='Turbo options allow you to predict the direction of the underlying asset’s movements.' />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='You receive a <0>payout</0> at <1>expiry</1> if the spot price never touches or breaches the <2>barrier</2> during the contract period. If it does, your contract will be terminated early.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(TERM.PAYOUT)}
                        />,
                        <button
                            className='description__content--definition'
                            key={1}
                            onClick={() => onTermClick(TERM.EXPIRY)}
                        />,
                        <button
                            className='description__content--definition'
                            key={2}
                            onClick={() => onTermClick(TERM.BARRIER)}
                        />,
                    ]}
                />
            ),
        },
        {
            type: 'heading',
            text: <Localize i18n_default_text='Up' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select “<0>Up</0>”, you’ll earn a payout if the spot price never drops below the barrier.'
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
            text: <Localize i18n_default_text='Down' />,
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select “<0>Down</0>”, you’ll earn a payout if the spot price never rises above the barrier.'
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
                    i18n_default_text='Your payout is equal to the <0>payout per point</0> multiplied by the difference between the <1>final price</1> and the barrier. You will only earn a profit if your payout is higher than your initial stake.'
                    components={[
                        <button
                            className='description__content--definition'
                            key={0}
                            onClick={() => onTermClick(TERM.PAYOUT_PER_POINT)}
                        />,
                        <button
                            className='description__content--definition'
                            key={1}
                            onClick={() => onTermClick(TERM.FINAL_PRICE)}
                        />,
                    ]}
                />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='You may sell the contract up to 15 seconds before expiry. If you do, we’ll pay you the <0>contract value</0>.'
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
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='If you choose your duration in number of ticks, you won’t be able to terminate your contract early.' />
            ),
        },
        {
            type: 'paragraph',
            text: (
                <Localize i18n_default_text='If you select the take profit feature, your trade will be closed automatically at the nearest available asset price when your profit reaches or exceeds the take profit amount throughout the contract duration. Your profit may be more than the amount you entered depending on the market price at closing. You may change your take profit amount up to 15 seconds before expiry.' />
            ),
        },
    ];

    return <React.Fragment>{parseContractDescription(content)}</React.Fragment>;
};

export default TurbosTradeDescription;
