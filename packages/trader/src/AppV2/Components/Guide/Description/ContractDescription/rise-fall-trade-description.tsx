import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST, parseContractDescription } from 'AppV2/Utils/trade-types-utils';

const RiseFallTradeDescription = () => {
    const content = [
        { type: 'heading', text: <Localize i18n_default_text='Rise' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select "<0>Rise</0>", you win the payout if the exit spot is strictly higher than the entry spot.'
                    components={[<span className='description__content--bold' key={0} />]}
                />
            ),
        },
        {
            type: 'video',
            text: CONTRACT_LIST.ACCUMULATORS,
        },
        { type: 'heading', text: <Localize i18n_default_text='Fall' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select "<0>Fall</0>", you win the payout if the exit spot is strictly lower than the entry spot.'
                    components={[<span className='description__content--bold' key={0} />]}
                />
            ),
        },
        {
            type: 'video',
            text: CONTRACT_LIST.ACCUMULATORS,
        },
        { type: 'heading', text: <Localize i18n_default_text='Additional Information' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select "<0>Allow equals</0>", you win the payout if exit spot is higher than or equal to entry spot for "Rise". Similarly, you win the payout if exit spot is lower than or equal to entry spot for "Fall".'
                    components={[<span className='description__content--bold' key={0} />]}
                />
            ),
        },
    ];
    return <React.Fragment>{parseContractDescription(content)}</React.Fragment>;
};

export default RiseFallTradeDescription;
