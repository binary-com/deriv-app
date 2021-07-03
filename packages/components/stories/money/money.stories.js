import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import React from 'react';
import Money from 'Components/money';
import notes from './README.md';
import Wrapper from '../shared/wrapper';

storiesOf('Other|Money', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <Money amount={1423602.2} currency={'USD'} should_format show_currency />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
