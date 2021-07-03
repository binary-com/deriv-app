import React from 'react';
import { storiesOf } from '@storybook/react';
import Numpad from 'Components/numpad';
import { boolean, text, number, withKnobs } from '@storybook/addon-knobs';
import Theme from '../shared/theme';

storiesOf('Platform UI|Numpad', module)
    .add('Basic usage (Duration)', () => {
        const [value, setValue] = React.useState(100);
        return (
            <div
                style={{
                    padding: '24px',
                }}
            >
                <Theme is_dark={boolean('Dark theme', false)}>
                    <div>Value: {value}</div>
                    <Numpad
                        value={value}
                        onSubmit={setValue}
                        min={number('min', 100)}
                        max={number('max', 124)}
                        submit_label={text('Submit Label', 'OK!')}
                        render={({ value: v, className }) => {
                            return <div className={className}>{v}</div>;
                        }}
                    />
                </Theme>
            </div>
        );
    })
    .add('With currencies (Amount)', () => {
        const [value, setValue] = React.useState(100);
        return (
            <div
                style={{
                    padding: '24px',
                }}
            >
                <Theme is_dark={boolean('Dark theme', false)}>
                    <div>Value: {value}</div>
                    <Numpad
                        value={value}
                        onSubmit={setValue}
                        is_currency
                        render={({ value: v, className }) => {
                            return <div className={className}>{v}</div>;
                        }}
                        pip_size={number('pip_size', 2)}
                        currency='USD'
                        submit_label={text('Submit Label', 'OK!')}
                        min={number('min', 100)}
                        max={number('max', 124)}
                    />
                </Theme>
            </div>
        );
    })
    .addDecorator(withKnobs);
