import { storiesOf } from '@storybook/react';
import Div100vhContainer from 'Components/div100vh-container';
import React from 'react';
import notes from './README.md';

storiesOf('Layout|Div100vhContainer', module).add(
    'Main function',
    () => {
        return (
            <React.Fragment>
                <Div100vhContainer>
                    <p style={{ margin: 20, fontSize: 24 }}>My parent has correct `100vh` style!</p>
                </Div100vhContainer>
            </React.Fragment>
        );
    },
    {
        notes,
    }
);
