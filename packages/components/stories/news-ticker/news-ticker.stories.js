import React from 'react';
import { withInfo } from '@storybook/addon-info';
import { number, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Icon from 'Components/icon';
import Text from 'Components/text';
import NewsTicker from 'Components/news-ticker';

const flags = ['de', 'en', 'es', 'fr', 'id', 'it', 'pl', 'pt', 'ru', 'th', 'uk', 'vi', 'zh-cn', 'zh-tw'];
const stories = storiesOf('Data Display|News Ticker', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);
stories.add('Basic usage', () => {
    return (
        <div
            style={{
                padding: '3.2rem',
                backgroundColor: 'var(--general-main-1)',
                fontSize: '18px',
            }}
        >
            <div style={{ margin: '25px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <Text size='m'>A simple news ticker</Text>
                </div>
                <NewsTicker speed={number('speed', 25)}>
                    <div style={{ marginRight: '10px' }}>Will Trump win 2020 election? 🇺🇸</div>
                    <div style={{ marginRight: '10px' }}>No, Biden wins 2020 election. 🇺🇸</div>
                    <div style={{ marginRight: '10px' }}>But maybe Trump wins 2020 election? 🇺🇸</div>
                    <div style={{ marginRight: '10px' }}>Biden wins 2020 election. 🇺🇸</div>
                    <div style={{ marginRight: '10px' }}>Trump wins 2020 election. 🇺🇸</div>
                    <div style={{ marginRight: '10px' }}>Biden wins 2020 election. 🇺🇸</div>
                    <div style={{ marginRight: '10px' }}>
                        <span style={{ color: 'red' }}>Breaking news</span>: Nobody wins 2020 election.
                    </div>
                </NewsTicker>
            </div>

            <div style={{ margin: '25px' }}>
                <Text size='m'>One with icons</Text>
                <NewsTicker speed={number('speed', 25)}>
                    {flags
                        .map(flag =>
                            flag
                                .split('-')
                                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                                .join('')
                        )
                        .map(flag => (
                            <div key={flag} style={{ marginRight: '10px' }}>
                                <Icon icon={`IcFlag${flag}`} size={128} />
                            </div>
                        ))}
                </NewsTicker>
            </div>
        </div>
    );
});
