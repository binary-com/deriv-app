import React from 'react';
import { storiesOf } from '@storybook/react';
import Dropdown from 'Components/dropdown';
// import 'Components/dropdown/dropdown.scss';
import Theme from '../shared/theme';

const items = [
    {
        text: 'Apple',
        value: 1,
        has_tooltip: false,
        tooltip: '',
        disabled: false,
    },
    {
        text: 'Orange',
        value: 2,
        has_tooltip: false,
        tooltip: '',
        disabled: false,
    },
];

const WithStateDropdown = props => {
    const [default_value, setDefaultValue] = React.useState(1);

    return (
        <Theme is_dark={!!props.is_dark} max_width={400}>
            <Dropdown
                list={items}
                value={default_value}
                name='dropdown'
                className='dropdown'
                classNameDisplay='dropdown__display'
                has_symbol={false}
                is_alignment_left={props.is_alignment_left}
                onChange={e => setDefaultValue(e.target.value)}
            />
        </Theme>
    );
};

storiesOf('Data Entry|Select/Dropdown', module).add(
    'Simple usage',
    () => (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-around',
                flexDirection: 'column',
            }}
        >
            <h2>Basic Usage</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <WithStateDropdown />
                <WithStateDropdown is_dark />
            </div>
            <h2>Drop-left!</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <WithStateDropdown is_alignment_left />
                <WithStateDropdown is_dark is_alignment_left />
            </div>
        </div>
    ),
    {
        notes: `
            This is a basic example of the dropdown component.

            The dropdown component is a fluid element, and it fills it's parent workspace.
            `,
    }
);
