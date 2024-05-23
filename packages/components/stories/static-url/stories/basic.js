import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import StaticUrl from 'Components/static-url';
import Wrapper from '../../shared/wrapper';

const Basic = () => (
    <Wrapper is_dark={boolean('Dark Theme', false)}>
        <StaticUrl href={'about'}>Link to the about page on deriv.com.</StaticUrl>
    </Wrapper>
);

export default Basic;
