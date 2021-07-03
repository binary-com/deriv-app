import React from 'react';
import { storiesOf } from '@storybook/react';
import ProgressBar from '../../src/components/progress-bar/index';
import Theme from '../shared/theme';

const progress_bars = [
    {
        value: 0.2,
        label: `Danger`,
        is_dark: false,
    },
    {
        value: 0.5,
        label: 'Warning',
        is_dark: false,
    },
    {
        value: 0.8,
        label: 'Success',
        is_dark: false,
    },
    {
        value: 0.2,
        label: 'Danger',
        is_dark: true,
    },
    {
        value: 0.5,
        label: 'Warning',
        is_dark: true,
    },
    {
        value: 0.8,
        label: 'Success',
        is_dark: true,
    },
];

storiesOf('Feedback|Progress Bar', module).add('Basic usage', () => (
    <div
        style={{
            display: 'grid',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gridGap: '10px',
            paddingTop: '10px',
        }}
    >
        {progress_bars.map((item, index) => {
            return (
                <Theme is_dark={item.is_dark} key={index}>
                    <ProgressBar value={item.value} label={item.label} />
                </Theme>
            );
        })}
    </div>
));
