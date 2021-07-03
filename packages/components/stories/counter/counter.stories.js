import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import Counter from 'Components/counter';
import notes from './README.md';
import Wrapper from '../shared/wrapper';

storiesOf('Data Display|Counter', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <Counter count={5} className='counter' />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
