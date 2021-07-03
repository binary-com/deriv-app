import React from 'react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Icon from 'Components/icon';
import VerticalTab from 'Components/vertical-tab/vertical-tab';
import 'Components/vertical-tab/vertical-tab.scss';
import Theme from '../shared/theme';

const TextComponent = props => (
    <div
        style={{
            margin: '16px',
            fontSize: '14px',
            lineHeight: '1.5',
            color: 'var(--text-prominent)',
        }}
    >
        {props.children}
    </div>
);

const action_bar_items = [
    {
        onClick: () => {},
        icon: 'IcCross',
        title: 'Close',
    },
    {
        component: () => (
            <div
                style={{
                    color: 'var(--text-prominent)',
                    fontSize: '14px',
                }}
            >
                Lorem ipsum dolor sit amet
            </div>
        ),
        title: 'Test',
    },
    {
        component: () => (
            <div style={{ marginRight: '8px' }}>
                <Icon icon='IcInfoBlue' />
            </div>
        ),
        title: '',
    },
];

const list = [
    {
        default: true,
        icon: 'IcBrandDtrader',
        label: 'Option 1',
        value: () => (
            <TextComponent>
                Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
                aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                laborum.
            </TextComponent>
        ),
    },
    {
        default: false,
        icon: 'IcBrandDbot',
        label: 'Option 2',
        value: () => (
            <TextComponent>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam
                rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
                dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora
                incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
                exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem
                vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum
                qui dolorem eum fugiat quo voluptas nulla pariatur?
            </TextComponent>
        ),
    },
];

const stories = storiesOf('Data Display|Vertical Tabs', module);
stories.addDecorator(withKnobs);
stories.add('Basic usage', () => {
    const [vertical_tab_index, setVerticalTabIndex] = React.useState(0);

    return (
        <Theme is_dark={boolean('Dark theme?', false)}>
            <div
                style={{
                    padding: '3.2rem',
                    backgroundColor: 'var(--overlay-outside-dialog)',
                }}
            >
                <VerticalTab
                    header_title='Header'
                    action_bar={action_bar_items}
                    alignment='center'
                    current_path='/'
                    is_routed={false}
                    is_full_width={boolean('Full screen?', true)}
                    list={list}
                    vertical_tab_index={vertical_tab_index}
                    setVerticalTabIndex={setVerticalTabIndex}
                />
            </div>
        </Theme>
    );
});
