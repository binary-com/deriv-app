import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import RadioGroup from 'Components/radio-group';
import Theme from '../shared/theme';

const stories = storiesOf('Data Entry|Radio Group', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add('basic usage', () => (
    <Theme is_dark={boolean('Theme', false)}>
        <div style={{ display: 'flex' }}>
            <RadioGroup
                name='testRadio'
                onToggle={e => {
                    e.persist();
                    console.log(e.target.value);
                }}
                items={[
                    { id: 'test1', label: 'test1', value: 'test1' },
                    { id: 'test2', label: 'test2', value: 'test2' },
                ]}
            />
        </div>
    </Theme>
));
