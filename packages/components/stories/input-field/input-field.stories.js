import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import notes from './README.md';
import Wrapper from '../shared/wrapper';
import InputField from 'Components/input-field';

storiesOf('Data Entry|InputField', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            const [value0, setValue0] = React.useState('');
            const [value1, setValue1] = React.useState('');
            const [value2, setValue2] = React.useState('');
            const [value3, setValue3] = React.useState(0);
            const [value4, setValue4] = React.useState(0);
            const [value5, setValue5] = React.useState(0);
            const [value6, setValue6] = React.useState(true);

            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <div>
                        <InputField
                            type='text'
                            value={value0}
                            onChange={e => setValue0(e.target.value)}
                            label={'A simple string'}
                            placeholder={'First name'}
                        />
                        <br />
                        <br />
                        <hr />
                        <br /> <br />
                        <InputField
                            type='text'
                            error_messages={['The fiest name could not be empty']}
                            value={value1}
                            onChange={e => setValue1(e.target.value)}
                            label={'A simple string with error'}
                            placeholder={'First name'}
                        />
                        <br />
                        <br />
                        <hr />
                        <br /> <br />
                        <InputField
                            type='text'
                            helper={'please enter your name'}
                            value={value2}
                            onChange={e => setValue2(e.target.value)}
                            label={'A simple string with helper'}
                            placeholder={'First name'}
                        />
                        <br />
                        <br />
                        <hr />
                        <br /> <br />
                        <InputField
                            type='number'
                            value={value3}
                            onChange={e => setValue3(e.target.value)}
                            name={'name'}
                            label={'Number field'}
                            placeholder={'Postal code'}
                        />
                        <br />
                        <br />
                        <hr />
                        <br /> <br />
                        <InputField
                            type='number'
                            is_incrementable
                            value={value4}
                            onChange={e => setValue4(e.target.value)}
                            label={'Incrementable number field'}
                            placeholder={'placeHolder'}
                        />
                        <br />
                        <br />
                        <hr />
                        <br /> <br />
                        <InputField
                            type='number'
                            is_incrementable
                            is_incrementable_on_long_press
                            is_negative_disabled
                            value={value5}
                            onChange={e => setValue5(e.target.value)}
                            unit={'kg'}
                            is_unit_at_right
                            label={'Number field with unit'}
                            placeholder={'Weight'}
                        />
                        <br />
                        <br />
                        <hr />
                        <br /> <br />
                        <InputField
                            type='checkbox'
                            checked={value6}
                            value={value6}
                            onChange={() => setValue6(!value6)}
                            unit={'kg'}
                            is_unit_at_right
                            label={'A simple checkbox'}
                            placeholder={'Weight'}
                        />
                    </div>
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
