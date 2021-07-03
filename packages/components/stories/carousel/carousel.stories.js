import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Carousel from 'Components/carousel';
import Button from 'Components/button';
import Theme from '../shared/theme';

const stories = storiesOf('Data Display|Carousel', module);

const FlexWrapper = ({ children, justifyContent = 'center' }) => (
    <div
        style={{
            display: 'flex',
            padding: '36px',
            justifyContent,
        }}
    >
        {children}
    </div>
);

const demo_slides = [
    <div
        className='slide1'
        style={{
            border: '1px solid var(--text-prominent)',
            borderRadius: '5px',
            margin: '0.5rem',
            color: 'var(--text-prominent)',
        }}
    >
        <p
            style={{
                fontSize: '1.8rem',
                textAlign: 'center',
                marginTop: '2rem',
            }}
        >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum sed, et asperiores error sunt soluta autem
            nobis sapiente corporis animi voluptate exercitationem repellendus quo quae accusantium nulla adipisci optio
            quasi.
        </p>
        <Button
            primary
            style={{
                margin: '2rem auto',
                display: 'block',
            }}
        >
            Button 1
        </Button>
    </div>,
    <div
        className='slide2'
        style={{
            border: '1px solid var(--text-prominent)',
            borderRadius: '5px',
            margin: '0.5rem',
            color: 'var(--text-prominent)',
        }}
    >
        <p
            style={{
                fontSize: '1.8rem',
                textAlign: 'center',
                marginTop: '2rem',
            }}
        >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum sed, et asperiores error sunt soluta autem
            nobis sapiente corporis animi voluptate exercitationem repellendus quo quae accusantium nulla adipisci optio
            quasi.
        </p>
        <Button
            primary
            style={{
                margin: '2rem auto',
                display: 'block',
            }}
        >
            Button 2
        </Button>
    </div>,
    <div
        className='slide3'
        style={{
            border: '1px solid var(--text-prominent)',
            borderRadius: '5px',
            margin: '0.5rem',
            color: 'var(--text-prominent)',
        }}
    >
        <p
            style={{
                fontSize: '1.8rem',
                textAlign: 'center',
                marginTop: '2rem',
            }}
        >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum sed, et asperiores error sunt soluta autem
            nobis sapiente corporis animi voluptate exercitationem repellendus quo quae accusantium nulla adipisci optio
            quasi.
        </p>
        <Button
            primary
            style={{
                margin: '2rem auto',
                display: 'block',
            }}
        >
            Button 3
        </Button>
    </div>,
];

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add('basic', () => (
    <Theme is_dark={boolean('Theme', false)}>
        <FlexWrapper>
            <Carousel list={demo_slides} active_index={0} />
        </FlexWrapper>
    </Theme>
));

stories.add('Middle nav', () => (
    <Theme is_dark={boolean('Theme', false)}>
        <FlexWrapper>
            <Carousel list={demo_slides} active_index={0} nav_position='middle' />
        </FlexWrapper>
    </Theme>
));

stories.add('Middle nav (no bullets)', () => (
    <Theme is_dark={boolean('Theme', false)}>
        <FlexWrapper>
            <Carousel list={demo_slides} active_index={0} nav_position='middle' show_bullet={false} />
        </FlexWrapper>
    </Theme>
));

stories.add('Upper nav', () => (
    <Theme is_dark={boolean('Theme', false)}>
        <FlexWrapper>
            <Carousel list={demo_slides} active_index={0} nav_position='top' bullet_position='top' />
        </FlexWrapper>
    </Theme>
));

stories.add('2 items per window', () => (
    <Theme is_dark={boolean('Theme', false)}>
        <FlexWrapper>
            <Carousel item_per_window={2} list={demo_slides} active_index={0} />
        </FlexWrapper>
    </Theme>
));

stories.add('Auto play', () => (
    <Theme is_dark={boolean('Theme', false)}>
        <FlexWrapper>
            <Carousel list={demo_slides} active_index={0} autoplay_time={2000} />
        </FlexWrapper>
    </Theme>
));
