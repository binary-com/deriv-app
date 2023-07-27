import React from 'react';
import { Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';

const ContractTypeGlossary = ({ category }: { category: string }) => {
    let content;
    if (category) {
        switch (category) {
            case 'accumulator':
                content = [
                    { type: 'heading', text: localize('Growth rate') },
                    {
                        type: 'paragraph',
                        text: localize('You can choose a growth rate with values of 1%, 2%, 3%, 4%, and 5%.'),
                    },
                    { type: 'heading', text: localize('Payout') },
                    {
                        type: 'paragraph',
                        text: localize('Payout is the sum of your initial stake and profit.'),
                    },
                    { type: 'heading', text: localize('Range') },
                    {
                        type: 'paragraph',
                        text: localize(
                            'It is a percentage of the previous spot price. The percentage rate is based on your choice of the index and the growth rate.'
                        ),
                    },
                    { type: 'heading', text: localize('Previous spot price') },
                    {
                        type: 'paragraph',
                        text: localize('Spot price on the previous tick.'),
                    },
                    { type: 'heading', text: localize('Slippage risk') },
                    {
                        type: 'paragraph',
                        text: localize(
                            'The spot price may change by the time your order reaches our servers. When this happens, your payout maybe affected.'
                        ),
                    },
                ];
                break;
            case 'vanilla':
                content = [
                    { type: 'heading', text: localize('Strike price') },
                    {
                        type: 'paragraph',
                        text: localize('You must select the strike price before entering the contract.'),
                    },
                    {
                        type: 'list',
                        text: [
                            localize(
                                'If you select "Call", you’ll earn a payout if the final price is above the strike price at expiry. Otherwise, you won’t receive a payout.'
                            ),
                            localize(
                                'If you select "Put", you’ll earn a payout if the final price is below the strike price at expiry. Otherwise, you won’t receive a payout.'
                            ),
                        ],
                    },
                    { type: 'heading', text: localize('Payout') },
                    {
                        type: 'paragraph',
                        text: (
                            <Localize
                                i18n_default_text='Your payout is equal to the payout per pip multiplied by the difference, <0>in pips</0>, between the final price and the strike price.'
                                components={[<strong key={0} />]}
                            />
                        ),
                    },
                    { type: 'heading', text: localize('Payout per pip') },
                    {
                        type: 'paragraph',
                        text: localize('We calculate this based on the strike price and duration you’ve selected.'),
                    },
                    { type: 'heading', text: localize('Final price') },
                    {
                        type: 'paragraph',
                        text: localize('This is the spot price of the last tick at expiry.'),
                    },

                    { type: 'heading', text: localize('Expiry') },
                    {
                        type: 'paragraph',
                        text: localize(
                            'This is when your contract will expire based on the Duration or End time you’ve selected.'
                        ),
                    },
                    {
                        type: 'list',
                        text: [
                            localize(
                                'If the duration is more than 24 hours, the Cut-off time and Expiry date will apply instead.'
                            ),
                        ],
                    },
                    { type: 'heading', text: localize('Cut-off time') },
                    {
                        type: 'paragraph',
                        text: localize('Contracts will expire at exactly 14:00:00 GMT on your selected expiry date.'),
                    },
                    { type: 'heading', text: localize('Expiry date') },
                    {
                        type: 'paragraph',
                        text: localize(
                            'Your contract will expire on this date (in GMT), based on the End time you’ve selected.'
                        ),
                    },
                    { type: 'heading', text: localize('Contract value') },
                    {
                        type: 'paragraph',
                        text: localize(
                            'We’ll offer to buy your contract at this price should you choose to sell it before its expiry. This is based on several factors, such as the current spot price, duration, etc. However, we won’t offer a contract value if the remaining duration is below 24 hours.'
                        ),
                    },
                ];
                break;
            default:
                content = [];
                break;
        }
    }
    return (
        <React.Fragment>
            {content?.map(({ type, text }: { type: string; text: string | string[] | JSX.Element }) => {
                if (type === 'heading' && typeof text === 'string') {
                    return (
                        <Text
                            as='h2'
                            key={text.substring(0, 10)}
                            weight='bold'
                            className='contract-type-info__content-glossary--heading'
                        >
                            {text}
                        </Text>
                    );
                }
                if (type === 'paragraph') {
                    return (
                        <Text as='p' key={typeof text === 'string' ? text.substring(0, 10) : typeof text}>
                            {text}
                        </Text>
                    );
                }
                if (type === 'list' && Array.isArray(text)) {
                    return (
                        <ul key={text[0].substring(0, 15)}>
                            {text.map(list_item_text => (
                                <li key={list_item_text.substring(0, 20)}>{list_item_text}</li>
                            ))}
                        </ul>
                    );
                }
                return null;
            })}
        </React.Fragment>
    );
};

export default ContractTypeGlossary;
