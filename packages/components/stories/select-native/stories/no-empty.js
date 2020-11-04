import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import SelectNative from 'Components/select-native';
import items from '../items';
import Wrapper from '../wrapper';

const NoEmpty = () => {
    const [default_value, setDefaultValue] = React.useState('');

    return (
        <Wrapper is_dark={boolean('Dark Theme', false)}>
            <SelectNative
                placeholder='Please select'
                name='dropdown'
                label='Dropdown Label'
                list_items={items}
                value={default_value}
                onChange={e => setDefaultValue(e.target.value)}
                should_show_empty_option={false}
            />
        </Wrapper>
    );
};

export default NoEmpty;
