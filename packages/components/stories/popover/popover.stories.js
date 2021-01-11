import React from 'react';
import { storiesOf } from '@storybook/react';
import Popover from '../../src/components/popover/popover';
import notes from './README.md';

const portal_container = 'root';
storiesOf('Popover', module).add(
    'Basic usage',
    () => (
        <div
            style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Popover
                classNameBubble='network-status__tooltip'
                alignment='bottom'
                message='Network status: Connecting to server'
                has_error={true}
                portal_container={portal_container}
            >
                <p>Hover me</p>
            </Popover>
        </div>
    ),
    { notes }
);
