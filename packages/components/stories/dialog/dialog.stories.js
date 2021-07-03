import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import Wrapper from '../shared/wrapper';
import Dialog from 'Components/dialog';
import Button from 'Components/button';
import React, { useState } from 'react';
import notes from './README.md';

storiesOf('Feedback|Dialog', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            const [visibility, setVisibility] = useState(false);
            const toggleVisibility = () => setVisibility(!visibility);

            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <Button onClick={toggleVisibility} text={'Click Me!'} primary medium />
                    <Dialog
                        is_visible={visibility}
                        title={'title'}
                        is_mobile_full_width={false}
                        has_close_icon
                        cancel_button_text={'Cancel'}
                        confirm_button_text={'Confirm'}
                        onCancel={toggleVisibility}
                        onConfirm={toggleVisibility}
                    >
                        <p>This is the main part of the Modal</p>
                    </Dialog>
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
