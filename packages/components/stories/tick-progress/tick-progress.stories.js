import React from 'react';
import { storiesOf } from '@storybook/react';
import notes from './README.md';
import TickProgress from '../../src/components/tick-progress/index';
import Theme from '../shared/theme';
import { useInterval } from '../../src/hooks';

const tick_progresses = [
    {
        value: 2,
        size: 10,
        rows: 2,
        columns: 5,
        is_dark: false,
    },
    {
        value: 15,
        size: 30,
        rows: 5,
        columns: 6,
        is_dark: true,
    },
    {
        value: 18,
        size: 20,
        rows: 4,
        columns: 5,
        is_dark: false,
    },
];

storiesOf('Tick Progress', module)
    .add(
        'Basic usage',
        () => (
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
                {tick_progresses.map((item, index) => {
                    return (
                        <Theme is_dark={item.is_dark} key={index}>
                            <TickProgress value={item.value} rows={item.rows} columns={item.columns} size={item.size} />
                        </Theme>
                    );
                })}
            </div>
        ),
        { notes }
    )
    .add(
        'Dynamic',
        () => {
            const [value, setValue] = React.useState(0);
            const size = 10;

            useInterval(() => {
                if (value < size) {
                    setValue(value + 1);
                }
            }, 1500);

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
                        <p
                            style={{
                                fontSize: '16px',
                                paddingBottom: '10px',
                            }}
                        >
                            {`Tick ${value}`}
                        </p>
                        <TickProgress value={value} rows={2} columns={5} size={size} />
                    </Theme>
                </div>
            );
        },
        { notes }
    );
