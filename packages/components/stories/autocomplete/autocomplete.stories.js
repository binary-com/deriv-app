import { Formik, Field } from 'formik';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import Wrapper from '../shared/wrapper';
import Autocomplete from 'Components/autocomplete';
import React from 'react';
import notes from './README.md';

storiesOf('Data Entry|AutoComplete', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            const data = [
                { text: 'Malaysia', value: 'ML' },
                { text: 'China', value: 'CH' },
                { text: 'USA', value: 'US' },
                { text: 'Canada', value: 'CA' },
                { text: 'Sweden', value: 'SE' },
                { text: 'Norway', value: 'NO' },
            ];
            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <Formik initialValues={{ citizen: '' }}>
                        {({ setFieldValue }) => (
                            <Field name='citizen'>
                                {({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        type='text'
                                        label={'Place of birth'}
                                        list_items={data}
                                        onItemSelection={({ value, text }) => {
                                            setFieldValue('citizen', value ? text : '');
                                        }}
                                        required
                                    />
                                )}
                            </Field>
                        )}
                    </Formik>
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
