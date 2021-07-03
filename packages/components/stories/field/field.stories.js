import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import notes from './README.md';
import Wrapper from '../shared/wrapper';
import Field from 'Components/field';
import RadioGroup from 'Components/radio-group';

storiesOf('Feedback|FieldErrorMessage', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            const [selected, setSelected] = React.useState('normal');

            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <RadioGroup
                        name='Choose type of the Field'
                        onToggle={e => setSelected(e.target.value)}
                        selected={selected}
                        items={[
                            { id: 'radio1', label: 'Normal', value: 'normal' },
                            { id: 'radio2', label: 'Warning', value: 'warn' },
                            { id: 'radio3', label: 'Error', value: 'error' },
                        ]}
                    />
                    <div style={{ position: 'absolute', top: '100px', width: '100%' }}>
                        {selected === 'normal' && <Field message={'This is a simple Field'} />}
                        {selected === 'error' && <Field message={'This is an error Field'} type={'error'} />}
                        {selected === 'warn' && <Field message={'This is a warning Field'} type={'warn'} />}
                    </div>
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
