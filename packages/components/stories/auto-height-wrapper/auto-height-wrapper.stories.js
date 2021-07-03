import { storiesOf } from '@storybook/react';
import AutoHeightWrapper from 'Components/auto-height-wrapper';
import ThemedScrollbars from 'Components/themed-scrollbars';
import React from 'react';
import notes from './README.md';

storiesOf('Layout|AutoHeightWrapper', module).add(
    'Main function',
    () => {
        return (
            <React.Fragment>
                <AutoHeightWrapper default_height={300} height_offset={50}>
                    {({ setRef, height }) => (
                        <div ref={setRef}>
                            <ThemedScrollbars height={height}>
                                {Array.from(new Array(15)).map((_, index) => {
                                    return <p>This is the text number {index}</p>;
                                })}
                            </ThemedScrollbars>
                        </div>
                    )}
                </AutoHeightWrapper>
            </React.Fragment>
        );
    },
    {
        notes,
    }
);
