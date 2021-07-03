import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import React from 'react';
import Button from 'Components/button';
import { FlexWrapper, GroupWrapper, ButtonWrapper, Text } from './shared-style';
import Theme from '../shared/theme';

const stories = storiesOf('Data Entry|Button.Button', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

const getButtonObject = type => ({
    small: [
        {
            text: `${type} small`,
            is_disabled: false,
            has_effect: false,
        },
        {
            text: `${type} small disabled`,
            is_disabled: true,
            has_effect: false,
        },
        {
            text: `${type} small effect`,
            is_disabled: false,
            has_effect: true,
        },
    ],
    medium: [
        {
            text: `${type} medium`,
            is_disabled: false,
            has_effect: false,
        },
        {
            text: `${type} medium disabled`,
            is_disabled: true,
            has_effect: false,
        },
        {
            text: `${type} medium effect`,
            is_disabled: false,
            has_effect: true,
        },
    ],
    large: [
        {
            text: `${type} large`,
            is_disabled: false,
            has_effect: false,
        },
        {
            text: `${type} large disabled`,
            is_disabled: true,
            has_effect: false,
        },
        {
            text: `${type} large effect`,
            is_disabled: false,
            has_effect: true,
        },
    ],
});

stories
    .add('primary', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                {Object.keys(getButtonObject('primary')).map((size, idx) => (
                    <GroupWrapper key={idx}>
                        <Text size='1.6rem'>{size}</Text>
                        {getButtonObject('primary')[size].map((item, index) => (
                            <ButtonWrapper key={index}>
                                <Button
                                    onClick={action('clicked')}
                                    text={item.text}
                                    primary
                                    is_disabled={item.is_disabled}
                                    has_effect={item.has_effect}
                                    small={size === 'small'}
                                    medium={size === 'medium'}
                                    large={size === 'large'}
                                />
                            </ButtonWrapper>
                        ))}
                    </GroupWrapper>
                ))}
            </FlexWrapper>
        </Theme>
    ))
    .add('secondary', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                {Object.keys(getButtonObject('secondary')).map((size, idx) => (
                    <GroupWrapper key={idx}>
                        <Text size='1.6rem'>{size}</Text>
                        {getButtonObject('secondary')[size].map((item, index) => (
                            <ButtonWrapper key={index}>
                                <Button
                                    onClick={action('clicked')}
                                    text={item.text}
                                    secondary
                                    is_disabled={item.is_disabled}
                                    has_effect={item.has_effect}
                                    small={size === 'small'}
                                    medium={size === 'medium'}
                                    large={size === 'large'}
                                />
                            </ButtonWrapper>
                        ))}
                    </GroupWrapper>
                ))}
            </FlexWrapper>
        </Theme>
    ))
    .add('tertiary', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                {Object.keys(getButtonObject('tertiary')).map((size, idx) => (
                    <GroupWrapper key={idx}>
                        <Text size='1.6rem'>{size}</Text>
                        {getButtonObject('tertiary')[size].map((item, index) => (
                            <ButtonWrapper key={index}>
                                <Button
                                    onClick={action('clicked')}
                                    text={item.text}
                                    tertiary
                                    is_disabled={item.is_disabled}
                                    has_effect={item.has_effect}
                                    small={size === 'small'}
                                    medium={size === 'medium'}
                                    large={size === 'large'}
                                />
                            </ButtonWrapper>
                        ))}
                    </GroupWrapper>
                ))}
            </FlexWrapper>
        </Theme>
    ))
    .add('primary_light', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                {Object.keys(getButtonObject('primary_light')).map((size, idx) => (
                    <GroupWrapper key={idx}>
                        <Text size='1.6rem'>{size}</Text>
                        {getButtonObject('primary_light')[size].map((item, index) => (
                            <ButtonWrapper key={index}>
                                <Button
                                    onClick={action('clicked')}
                                    text={item.text}
                                    primary_light
                                    is_disabled={item.is_disabled}
                                    has_effect={item.has_effect}
                                    small={size === 'small'}
                                    medium={size === 'medium'}
                                    large={size === 'large'}
                                />
                            </ButtonWrapper>
                        ))}
                    </GroupWrapper>
                ))}
            </FlexWrapper>
        </Theme>
    ));
