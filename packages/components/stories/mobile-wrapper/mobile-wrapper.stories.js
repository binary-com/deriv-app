import { storiesOf } from '@storybook/react';
import MobileWrapper from 'Components/mobile-wrapper';
import React from 'react';
import notes from './README.md';

storiesOf('Layout|Mobile Wrapper', module).add(
    'Main function',
    () => {
        return (
            <React.Fragment>
                <MobileWrapper>
                    <p style={{ margin: 20, fontSize: 24 }}>This text is just visible in Mobile!</p>
                </MobileWrapper>
                <p style={{ margin: 20, fontSize: 24 }}>This text is always visible!</p>
            </React.Fragment>
        );
    },
    {
        notes,
    }
);
