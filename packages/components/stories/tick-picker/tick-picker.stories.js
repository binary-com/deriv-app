import { storiesOf } from '@storybook/react';
import { text, boolean, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import React from 'react';
import TickPicker from 'Components/tick-picker';
import Theme from '../shared/theme';

const stories = storiesOf('Data Entry|Tick picker', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add('basic usage', () => (
    <Theme is_dark={boolean('Theme', true)}>
        <div style={{ backgroundColor: 'var(--general-section-1)', width: '300px' }}>
            <TickPicker
                min_value={text('min value', '2')}
                max_value={text('max value', '7')}
                onSubmit={action(e => e.target.value)}
                submit_label='OK'
                singular_label='Tick'
                plural_label='Ticks'
            />
        </div>
    </Theme>
));
