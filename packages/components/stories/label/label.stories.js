import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import Wrapper from '../shared/wrapper';
import Label from 'Components/label';
import React from 'react';
import notes from './README.md';
import './label.stories.scss';

storiesOf('Data Display|Status Label', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            const available_modes = [
                'adjustment',
                'default',
                'success',
                'warn',
                'danger',
                'info',
                'default-invert',
                'success-invert',
                'warn-invert',
            ];

            return (
                <Wrapper inner_styles={{}} is_dark={boolean('Dark Theme', false)}>
                    {available_modes.map((mode, index) => {
                        return (
                            <div className={'container'}>
                                <p className={'title'}>{mode}</p>
                                <Label mode={mode} className={'label'} ley={index} size={'large'}>
                                    <p>This is a sample {mode} label</p>
                                </Label>
                            </div>
                        );
                    })}
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
