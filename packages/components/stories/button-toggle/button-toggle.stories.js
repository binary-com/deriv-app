import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import Wrapper from '../shared/wrapper';
import ButtonToggle from 'Components/button-toggle';
import React from 'react';
import notes from './README.md';

storiesOf('Data Display|ButtonToggle', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            const [selected, setSelected] = React.useState('BUY');

            const buttons_list = [
                {
                    text: 'Buy',
                    value: 'BUY',
                    count: 5,
                },
                {
                    text: 'Sell',
                    value: 'SELL',
                },
            ];

            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <ButtonToggle
                        buttons_arr={buttons_list}
                        is_animated
                        name='type'
                        onChange={item => {
                            setSelected(item.target.value);
                        }}
                        value={selected}
                        has_rounded_button
                    />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
