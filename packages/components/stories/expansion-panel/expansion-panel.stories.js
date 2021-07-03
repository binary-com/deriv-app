import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import ExpansionPanel from 'Components/expansion-panel';
import notes from './README.md';
import Wrapper from '../shared/wrapper';

storiesOf('Platform UI|BotExpansionPanel', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            const message = {
                header: 'Airplains',
                content: [
                    {
                        id: 'boeing',
                        value: [
                            { id: 1, value: 'Boeing 777' },
                            { id: 2, value: 'Boeing 750' },
                        ],
                    },
                    {
                        id: 'Airbus',
                        value: [
                            { id: 1, value: 'Airbus A380' },
                            { id: 2, value: 'Airbus A320' },
                            { id: 3, value: 'Airbus A330' },
                        ],
                    },
                    { id: 'Embraer', value: 'Embrear 190' },
                ],
            };

            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <div style={{ width: '100%' }}>
                        <ExpansionPanel message={message} />
                    </div>
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
