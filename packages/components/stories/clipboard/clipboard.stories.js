import React from 'react';
import { storiesOf } from '@storybook/react';
import Clipboard from 'Components/clipboard';
import notes from './README.md';

storiesOf('Other|Clipboard', module).add(
    'Main function',
    () => (
        <Clipboard text_copy='Helloo' info_message="Click this to copy 'Helloo'" success_message="'Helloo' copied!" />
    ),
    {
        notes,
    }
);
