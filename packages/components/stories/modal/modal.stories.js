import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import Wrapper from '../shared/wrapper';
import Modal from 'Components/modal';
import Button from 'Components/button';
import React from 'react';
import notes from './README.md';

storiesOf('Data Display|Modal', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            const [visibility, setVisibility] = React.useState(false);
            const toggleVisibility = () => setVisibility(!visibility);

            return (
                <Wrapper is_block is_dark={boolean('Dark Theme', false)}>
                    <Button onClick={toggleVisibility} text={'Click Me!'} primary medium />
                    <div id='modal_root' />
                    <Modal title={'Modal Title'} is_open={visibility} toggleModal={toggleVisibility}>
                        <Modal.Body>
                            <p>This is the modal body</p>
                        </Modal.Body>
                        <Modal.Footer has_separator>
                            <p style={{ color: 'var(--text-prominent)' }}>This is the modal footer</p>
                        </Modal.Footer>
                    </Modal>
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
