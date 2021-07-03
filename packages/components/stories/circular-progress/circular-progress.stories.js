import React from 'react';
import { storiesOf } from '@storybook/react';
import CircularProgress from '../../src/components/circular-progress/index';
import Theme from '../shared/theme';
import { useInterval } from '../../src/hooks';

function formatTime(seconds) {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const remaining_seconds = String(seconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${remaining_seconds}`;
}

const progresses = [
    {
        icon: 'IcInfo',
        is_clockwise: true,
        is_dark: false,
        value: 75,
    },
    {
        icon: 'IcBrandDtrader',
        is_clockwise: true,
        is_dark: false,
        value: 20,
    },
    {
        icon: 'IcLock',
        is_clockwise: true,
        is_dark: true,
        value: 50,
    },
    {
        icon: 'IcTrade',
        is_clockwise: true,
        is_dark: true,
        value: 100,
    },
];

storiesOf('Feedback|Progress/Circular Progress', module)
    .add('Basic usage', () => (
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
            {progresses.map((item, index) => {
                return (
                    <Theme is_dark={item.is_dark} key={index}>
                        <CircularProgress progress={item.value} icon={item.icon} />
                    </Theme>
                );
            })}
        </div>
    ))
    .add('Timer', () => {
        const initial_time = 120; // 3600 seconds == 1 hour
        const [remaining_time, setRemainingTime] = React.useState(initial_time);
        useInterval(() => {
            if (remaining_time > 0) {
                setRemainingTime(remaining_time - 1);
            }
        }, 1000);
        return (
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
                <Theme>
                    <CircularProgress progress={(remaining_time / initial_time) * 100} />
                    <p
                        style={{
                            fontSize: '14px',
                            paddingTop: '10px',
                            textAlign: 'center',
                        }}
                    >
                        {formatTime(remaining_time)}
                    </p>
                </Theme>
            </div>
        );
    });
