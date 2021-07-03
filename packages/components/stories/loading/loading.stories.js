import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import Wrapper from '../shared/wrapper';
import Loading from 'Components/loading';
import React from 'react';
import notes from './README.md';

storiesOf('Feedback|Loading', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <Loading is_fullscreen is_slow_loading status={['Checking your balance...']} />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
