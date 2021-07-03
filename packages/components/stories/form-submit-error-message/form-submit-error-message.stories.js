import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import notes from './README.md';
import Wrapper from '../shared/wrapper';
import FormSubmitErrorMessage from 'Components/form-submit-error-message';

storiesOf('Data Entry|Form Wizard/FormSubmit.ErrorMessage', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <FormSubmitErrorMessage message={'This is a form  submit error message!'} />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
