import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';

import React from 'react';
import MobileCarousel from 'Components/mobile-carousel';
import notes from './README.md';
import Wrapper from '../shared/wrapper';

storiesOf('Data Display|Mobile Carousel', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            const imageSrc = [
                'https://deriv.com/static/3639002b61fa26dbb1b750e3accd2256/a8378/deriv-platform-banner.png',
                'https://deriv.com/static/5a5bf305b3f0897d6fefea4e3ff9b3f0/49510/dtrader_trade_home.webp',
                'https://deriv.com/static/f7d4a3f38aef426fc9d8dbe671471ed9/49510/dmt5_trade_home.webp',
                'https://deriv.com/static/9dff0486a0699058bcb1abcd4b91b8a5/49510/dbot_trade_home.webp',
                'https://deriv.com/static/3639002b61fa26dbb1b750e3accd2256/a8378/deriv-platform-banner.png',
                'https://deriv.com/static/5a5bf305b3f0897d6fefea4e3ff9b3f0/49510/dtrader_trade_home.webp',
                'https://deriv.com/static/f7d4a3f38aef426fc9d8dbe671471ed9/49510/dmt5_trade_home.webp',
                'https://deriv.com/static/9dff0486a0699058bcb1abcd4b91b8a5/49510/dbot_trade_home.webp',
                'https://deriv.com/static/3639002b61fa26dbb1b750e3accd2256/a8378/deriv-platform-banner.png',
                'https://deriv.com/static/5a5bf305b3f0897d6fefea4e3ff9b3f0/49510/dtrader_trade_home.webp',
            ];
            const items = [];
            Array.from(new Array(10)).map((item, index) => items.push(<img width={'100%'} src={imageSrc[index]} />));

            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <MobileCarousel>{items}</MobileCarousel>
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
