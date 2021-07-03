import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import React, { useState } from 'react';
import DropdownList from 'Components/dropdown-list';
import notes from './README.md';
import Wrapper from '../shared/wrapper';
import './dropdown-list.stories.scss';

storiesOf('Data Entry|Select/DropdownList', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            const [visibility, setVisibility] = useState(false);
            const [selected, setSelected] = useState(null);

            const toggleVisibility = () => setVisibility(!visibility);
            const selectItem = value => {
                setVisibility(!visibility);
                setSelected(value.value);
            };
            const dropdown_ref = React.createRef();

            const items = [
                { text: 'Apple', value: 'The apple is selected' },
                { text: 'Orange', value: 'The orange is selected' },
                { text: 'Banana', value: 'The banana is selected' },
                { text: 'Pears', value: 'The pears is selected' },
            ];

            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <React.Fragment>
                        <div className={'selected-item'} onClick={toggleVisibility}>
                            {selected || 'Choose from the list'}
                        </div>
                        <DropdownList
                            ref={{ dropdown_ref }}
                            active_index={2}
                            style={{ width: '240px', marginTop: '40px' }}
                            is_visible={visibility}
                            list_items={items}
                            onItemSelection={selectItem}
                        />
                    </React.Fragment>
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
