import { storiesOf } from '@storybook/react';
import { boolean, color, number, select, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import React from 'react';
import Icon from 'Components/icon';
import { icons } from './icons.js';
import notes from './README.md';
import Theme from '../shared/theme';
import { Text } from '../button/shared-style';

const stories = storiesOf('Assets|Icon', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

const grid_style = {
    display: 'grid',
    gridAutoRows: 'auto',
    gridAutoColumns: 'max-content',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gridColumnGap: '0.8rem',
    gridRowGap: '0.8rem',
};

stories
    .addDecorator(story => <div>{story()}</div>)
    .add(
        'Deriv Icons',
        () => (
            <Theme is_dark={boolean('Theme', false)}>
                <div style={{ padding: '3.2rem' }}>
                    {Object.keys(icons).map((sprite, idx) => {
                        return (
                            <React.Fragment key={idx}>
                                <Text size='2.4rem'>{sprite}</Text>
                                <ul style={grid_style}>
                                    {icons[sprite].map((icon, index) => (
                                        <li
                                            key={index}
                                            style={{
                                                textAlign: 'center',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    padding: '16px',
                                                    borderRadius: '8px',
                                                    boxShadow:
                                                        '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06)',
                                                    backgroundColor: 'var(--general-main-1)',
                                                }}
                                            >
                                                <Icon
                                                    icon={icon}
                                                    size={48}
                                                    color={select('color', {
                                                        default: undefined,
                                                        active: 'active',
                                                        disabled: 'disabled',
                                                        secondary: 'secondary',
                                                        green: 'green',
                                                        red: 'red',
                                                        brand: 'brand',
                                                    })}
                                                    custom_color={color('custom_color', undefined)}
                                                    size={number('size', 36, {
                                                        range: true,
                                                        min: 2,
                                                        max: 300,
                                                        step: 1,
                                                    })}
                                                    onClick={action('on click')}
                                                    onMouseEnter={action('on hover')}
                                                />
                                            </div>
                                            <Text size='1.4rem'>{icon}</Text>
                                        </li>
                                    ))}
                                </ul>
                            </React.Fragment>
                        );
                    })}
                </div>
            </Theme>
        ),
        {
            notes: { markDown: notes },
        }
    );
