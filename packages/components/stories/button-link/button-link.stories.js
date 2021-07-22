import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import Wrapper from '../shared/wrapper';
import ButtonLink from 'Components/button-link';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import notes from './README.md';

storiesOf('ButtonLink', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <BrowserRouter>
                        <ButtonLink to='#' onClick={action('clicked')} size='medium'>
                            <p>This is a button link</p>
                        </ButtonLink>
                    </BrowserRouter>
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
