import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST, parseContractDescription } from 'AppV2/Utils/trade-types-utils';

const HigherLowerTradeDescription = () => {
    const content = [
        { type: 'heading', text: <Localize i18n_default_text='Higher' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select “<0>Higher</0>”, you win the payout if the exit spot is strictly higher than the barrier.'
                    components={[<span className='description__content--bold' key={0} />]}
                />
            ),
        },
        {
            type: 'video',
            text: CONTRACT_LIST.ACCUMULATORS,
        },
        { type: 'heading', text: <Localize i18n_default_text='Lower' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select “<0>Lower</0>”, you win the payout if the exit spot is strictly lower than the barrier.'
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
            text: <Localize i18n_default_text='If the exit spot is equal to the barrier, you don’t win the payout.' />,
        },
    ];
    return <React.Fragment>{parseContractDescription(content)}</React.Fragment>;
};

export default HigherLowerTradeDescription;
