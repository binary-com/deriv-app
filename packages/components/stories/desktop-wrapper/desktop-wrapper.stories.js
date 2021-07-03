import { storiesOf } from '@storybook/react';
import DesktopWrapper from 'Components/desktop-wrapper';
import React from 'react';
import notes from './README.md';

storiesOf('Layout|DesktopWrapper', module).add(
    'Main function',
    () => {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <p style={{ margin: 20, fontSize: 24 }}>This text is just visible in desktop!</p>
                </DesktopWrapper>
                <p style={{ margin: 20, fontSize: 24 }}>This text is always visible!</p>
            </React.Fragment>
        );
    },
    {
        notes,
    }
);
