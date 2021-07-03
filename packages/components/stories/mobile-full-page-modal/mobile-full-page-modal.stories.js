import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import Wrapper from '../shared/wrapper';
import MobileFullPageModal from 'Components/mobile-full-page-modal';
import Button from 'Components/button';
import React from 'react';
import notes from './README.md';

storiesOf('Data Display|Mobile Full Page Modal', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            const [visibility, setVisibility] = React.useState(false);
            const toogleVisibility = () => setVisibility(!visibility);

            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <Button onClick={toogleVisibility} text={'Click Me!'} primary medium />
                    <MobileFullPageModal
                        is_modal_open={visibility}
                        header={'This is the header'}
                        onClickClose={toogleVisibility}
                    >
                        <div
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                            }}
                        >
                            <p style={{ textAlign: 'center' }}>This is the content</p>
                        </div>
                    </MobileFullPageModal>
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
