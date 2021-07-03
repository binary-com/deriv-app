import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import notes from './README.md';
import Wrapper from '../shared/wrapper';
import Input from 'Components/input';

storiesOf('Data Entry|Input', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            const [value, setValue] = React.useState('');
            const onChangeText = e => setValue(e.target.value);

            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <Input
                        type='text'
                        name='first_name'
                        label={'First name'}
                        value={value}
                        onChange={onChangeText}
                        has_character_counter
                        initial_character_count={0}
                        max_characters={20}
                        hint={'Please enter your first name'}
                    />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
