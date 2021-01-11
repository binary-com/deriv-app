import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Card from 'Components/card';
import Button from 'Components/button';
import { Text } from '../button/shared-style';
import notes from './README.md';
import Theme from '../shared/theme';
import './card.stories.scss';

const stories = storiesOf('Card', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories
    .add(
        'Basic Usage',
        () => (
            <Theme is_dark={boolean('Theme', false)}>
                <Card header='HEADER' content='CONTENT' footer='FOOTER' />
            </Theme>
        ),
        { notes }
    )
    .add(
        'Rendered',
        () => {
            const renderHeader = () => {
                return <Text size='1.6rem'>Rendered Card Header</Text>;
            };

            const renderContent = () => {
                return (
                    <table className='card-story__table'>
                        <thead>
                            <tr>
                                <th>Header 1</th>
                                <th>Header 2</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>test data 1</td>
                                <td>t1</td>
                            </tr>
                            <tr>
                                <td>test data 2</td>
                                <td>t2</td>
                            </tr>
                        </tbody>
                    </table>
                );
            };

            const renderFooter = () => {
                return (
                    <Button primary has_effect type='button'>
                        Test Button
                    </Button>
                );
            };

            return (
                <Theme is_dark={boolean('Theme', false)}>
                    <Card
                        renderHeader={renderHeader}
                        renderContent={renderContent}
                        renderFooter={renderFooter}
                        className='card-story__container'
                    />
                </Theme>
            );
        },
        { notes }
    );
