import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import LinearProgress from 'Components/linear-progress';
import notes from './README.md';
import Wrapper from '../shared/wrapper';

storiesOf('Feedback|Progress/Linear Progress', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <LinearProgress
                        timeout={5000}
                        action={() => {}}
                        render={remaining => {
                            return <p>{remaining}</p>;
                        }}
                    />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
