import { storiesOf } from '@storybook/react';
import notes from './README.md';
import React from 'react';
import RelativeDatepicker from 'Components/relative-datepicker';

storiesOf('Data Entry|Date/Relative-DatePicker', module).add(
    'Main function',
    () => {
        return (
            <RelativeDatepicker
                onChange={date => {
                    alert(`selected date: ${date}`);
                }}
                min={0}
                max={5}
                title={'Pick a date'}
            />
        );
    },
    {
        notes,
    }
);
