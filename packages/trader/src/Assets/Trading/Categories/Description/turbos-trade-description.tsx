import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';

const TurbosTradeDescription = ({
    onClick,
}: {
    onClick: (e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
}) => {
    const content = [
        {
            text: (
                <Localize i18n_default_text='Turbo options allow you to predict the direction of the underlying asset’s movements.' />
            ),
        },
        {
            text: (
                <Localize
                    i18n_default_text='You receive a <0>payout</0> at <0>expiry</0> if the spot price never touches or breaches the <0>barrier</0> during the contract period. If it does, your contract will be terminated early.'
                    components={[
                        <span
                            className='contract-type-info__content-definition'
                            onClick={onClick}
                            onKeyDown={onClick}
                            key={0}
                        />,
                    ]}
                />
            ),
        },
        {
            text: (
                <Localize
                    i18n_default_text='If you select <0>"Up"</0>, you’ll earn a payout if the spot price never drops below the barrier.'
                    components={[<strong key={0} />]}
                />
            ),
        },
        {
            text: (
                <Localize
                    i18n_default_text='If you select <0>"Down"</0>, you’ll earn a payout if the spot price never rises above the barrier.'
                    components={[<strong key={0} />]}
                />
            ),
        },
        {
            text: (
                <Localize
                    i18n_default_text='Your payout is equal to the <0>payout per point</0> multiplied by the difference between the <0>final price</0> and the barrier. You will only earn a profit if your payout is higher than your initial stake.'
                    components={[
                        <span
                            className='contract-type-info__content-definition'
                            onClick={onClick}
                            onKeyDown={onClick}
                            key={0}
                        />,
                    ]}
                />
            ),
        },
        {
            text: (
                <Localize
                    i18n_default_text='You may sell the contract up to 15 seconds before expiry. If you do, we’ll pay you the <0>contract value</0>.'
                    components={[
                        <span
                            className='contract-type-info__content-definition'
                            onClick={onClick}
                            onKeyDown={onClick}
                            key={0}
                        />,
                    ]}
                />
            ),
        },
        {
            text: (
                <Localize i18n_default_text='If you choose your duration in number of ticks, you won’t be able to terminate your contract early.' />
            ),
        },
    ];

    return (
        <React.Fragment>
            {content.map(({ text }, index) => (
                <Text as='p' key={index.toString() + text}>
                    {text}
                </Text>
            ))}
        </React.Fragment>
    );
};

export default TurbosTradeDescription;
