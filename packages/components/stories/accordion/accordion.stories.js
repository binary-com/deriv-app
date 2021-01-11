import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import Wrapper from '../shared/wrapper';
import Accordion from 'Components/accordion';
import React from 'react';
import notes from './README.md';

storiesOf('Accordion', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            const data = [
                {
                    header: 'Apple',
                    content:
                        'An apple is an edible fruit produced by an apple tree. Apple trees are cultivated worldwide and are the most widely grown species in the genus Malus. The tree originated in Central Asia, where its wild ancestor, Malus sieversii, is still found today.',
                },
                {
                    header: 'Orange',
                    content:
                        'The orange is the fruit of various citrus species in the family Rutaceae; it primarily refers to Citrus × sinensis, which is also called sweet orange, to distinguish it from the related Citrus × aurantium, referred to as bitter orange.',
                },
                {
                    header: 'Banana',
                    content:
                        'A banana is an elongated, edible fruit – botanically a berry – produced by several kinds of large herbaceous flowering plants in the genus Musa. In some countries, bananas used for cooking may be called "plantains", distinguishing them from dessert bananas.',
                },
                {
                    header: 'Kiwifruit',
                    content: `Kiwifruit or Chinese gooseberry is the edible berry of several species of woody vines in the genus Actinidia. The most common cultivar group of kiwifruit is oval, about the size of a large hen's egg: 5–8 centimetres in length and 4.5–5.5 cm in diameter.`,
                },
            ];

            return (
                <Wrapper is_dark={boolean('Dark Theme', false)} is_block>
                    <Accordion style={{ width: '100%' }} list={data} />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
