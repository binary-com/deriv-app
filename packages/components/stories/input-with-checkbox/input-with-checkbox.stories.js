import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import Wrapper from '../shared/wrapper';
import InputWithCheckbox from 'Components/input-wth-checkbox';
import React, { useState } from 'react';
import notes from './README.md';

storiesOf('Data Entry|Input With Checkbox', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            const [value, setValue] = React.useState(0);
            const [selected, setSelected] = useState(false);

            const onChange = e => {
                if (e.target.name === 'use_credit') setValue(e.target.value);
                else setSelected(e.target.value);
            };

            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <InputWithCheckbox
                        is_single_currency={true}
                        is_negative_disabled={true}
                        defaultChecked={selected}
                        is_input_hidden={!selected}
                        label={'Use Credit'}
                        name='use_credit'
                        onChange={onChange}
                        value={value}
                    />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
