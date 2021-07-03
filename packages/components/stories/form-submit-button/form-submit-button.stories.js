import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import FormSubmitButton from 'Components/form-submit-button';
import notes from './README.md';
import Wrapper from '../shared/wrapper';

storiesOf('Data Entry|Form Wizard/FormSubmit.Button', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <FormSubmitButton
                        is_disabled={false}
                        label={'Submit'}
                        is_center
                        has_cancel
                        cancel_label={'Back'}
                        onCancel={() => {}}
                        onClick={() => {}}
                    />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
