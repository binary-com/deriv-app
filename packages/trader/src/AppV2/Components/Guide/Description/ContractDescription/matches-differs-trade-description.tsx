import React from 'react';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST, parseContractDescription } from 'AppV2/Utils/trade-types-utils';

const MatchesDiffersTradeDescription = () => {
    const content = [
        { type: 'heading', text: <Localize i18n_default_text='Matches' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select “<0>Matches</0>”, you will win the payout if the last digit of the last tick is the same as your prediction.'
                    components={[<span className='description__content--bold' key={0} />]}
                />
            ),
        },
        {
            type: 'video',
            text: CONTRACT_LIST.ACCUMULATORS,
        },
        { type: 'heading', text: <Localize i18n_default_text='Differs' /> },
        {
            type: 'paragraph',
            text: (
                <Localize
                    i18n_default_text='If you select “<0>Differs</0>”, you will win the payout if the last digit of the last tick is not the same as your prediction.'
                    components={[<span className='description__content--bold' key={0} />]}
                />
            ),
        },
        {
            type: 'video',
            text: CONTRACT_LIST.ACCUMULATORS,
        },
    ];
    return <React.Fragment>{parseContractDescription(content)}</React.Fragment>;
};

export default MatchesDiffersTradeDescription;
