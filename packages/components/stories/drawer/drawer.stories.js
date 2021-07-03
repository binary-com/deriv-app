import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { boolean } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Wrapper from '../shared/wrapper';
import Drawer from 'Components/drawer';
import React, { useState } from 'react';
import notes from './README.md';
import './drawer.stories.scss';

storiesOf('Platform UI|BotDrawer', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            const [visibility, setVisibility] = useState(false);
            const toggleVisibility = () => setVisibility(!visibility);

            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <p className='simple-text'>
                        Change isMobile property from Knobs to see the Drawer for mobile and desktop.
                    </p>
                    <Drawer
                        clear_stat_button_text={'Reset'}
                        is_clear_stat_disabled={false}
                        is_mobile={boolean('isMobile', false)}
                        is_open={visibility}
                        onClearStatClick={() => {}}
                        toggleDrawer={toggleVisibility}
                        footer={<p className='simple-text'>This is Footer</p>}
                        zIndex={1}
                    >
                        <p className='simple-text'>This is the content of drawer</p>
                    </Drawer>
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
