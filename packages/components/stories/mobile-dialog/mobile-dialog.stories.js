import { storiesOf } from '@storybook/react';
import MobileDialog from 'Components/mobile-dialog';
import React, { useEffect, useState } from 'react';
import notes from './README.md';
import Button from 'Components/button';
import './mobile-dialog.stories.scss';

storiesOf('Data Display|Mobile Dialog', module).add(
    'Main function',
    () => {
        const [is_visible, set_is_visible] = useState(false);
        const [loaded, set_loaded] = useState(false);

        useEffect(() => {
            set_loaded(true);
        }, []);

        const showModal = () => set_is_visible(true);

        const renderModal = () => {
            return (
                <MobileDialog
                    portal_element_id='modal_root'
                    title={'This is the title of dialog'}
                    visible={is_visible}
                    has_content_scroll
                    onClose={() => set_is_visible(!is_visible)}
                    footer={<p>This is the footer of dialog</p>}
                    wrapper_classname={'wrapper'}
                >
                    <p>This is the main part of dialog</p>
                </MobileDialog>
            );
        };

        return (
            <React.Fragment>
                <div id='modal_root' />
                {loaded && renderModal()}
                <Button onClick={showModal} text={'Click Me!'} primary medium />
            </React.Fragment>
        );
    },
    {
        notes,
    }
);
