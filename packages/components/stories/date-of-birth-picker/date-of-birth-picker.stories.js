import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import Wrapper from '../shared/wrapper';
import DateOfBirthPicker from 'Components/date-of-birth-picker';
import { toMoment } from '@deriv/shared';
import React from 'react';
import notes from './README.md';

storiesOf('Data Entry|Date/DateOfBirthPicker', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <DateOfBirthPicker
                        name='date_of_birth'
                        label={'Date of birth*'}
                        onChange={({ target }) => console.log(toMoment(target.value).format('YYYY-MM-DD'))}
                    />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
