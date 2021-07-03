import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import FadeWrapper from 'Components/fade-wrapper';
import Button from 'Components/button';
import notes from './README.md';
import Wrapper from '../shared/wrapper';
import './fade-wrapper.stories.scss';

storiesOf('Animation|Transitions/FadeWrapper', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            const [visibility, setVisibility] = React.useState(false);
            const [type, setType] = React.useState('');
            const toggleVisibility = type => {
                setType(type);
                setTimeout(() => {
                    setVisibility(!visibility);
                }, 100);
            };

            return (
                <Wrapper
                    inner_styles={{ width: '100%', justifyContent: 'center' }}
                    is_dark={boolean('Dark Theme', false)}
                >
                    <Button className={'button'} onClick={() => toggleVisibility('')} text={'Fade!'} primary medium />
                    <Button
                        className={'button'}
                        onClick={() => toggleVisibility('top')}
                        text={'Fade top!'}
                        primary
                        medium
                    />
                    <Button
                        className={'button'}
                        onClick={() => toggleVisibility('bottom')}
                        text={'Fade bottom!'}
                        primary
                        medium
                    />
                    <FadeWrapper keyname={'key'} is_visible={visibility} type={type}>
                        <p className={'fade-wrapper__content'}>This text is inside the fade wrapper</p>
                    </FadeWrapper>
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
