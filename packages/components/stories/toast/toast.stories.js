import { storiesOf } from '@storybook/react';
import { boolean, number, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import React from 'react';
import Toast from 'Components/toast';
import Theme from '../shared/theme';

const stories = storiesOf('Data Display|Toast', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories
    .add('static', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <Toast>Message to be shown!</Toast>
        </Theme>
    ))
    .add('with timeout', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <Toast
                is_open={boolean('is open?', true)}
                timeout={number('Timeout', 3000)}
                onClose={console.log('Closed')}
            >
                Message
            </Toast>
        </Theme>
    ));
