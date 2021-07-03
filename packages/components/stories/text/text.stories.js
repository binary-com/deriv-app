import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Text from 'Components/text';
import Theme from '../shared/theme';

const stories = storiesOf('Typography|Text', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add('basic usage', () => (
    <Theme is_dark={boolean('Theme', false)}>
        <div>
            <Text size='xl' align='right' weight='bold' color='loss-danger'>
                Test Text Components
            </Text>
            {/* Adding Paragraph */}
            <Text as='p' size='xl' align='right' weight='bold' color='loss-danger'>
                Test Paragraph Components
            </Text>
            {/* Adding Header */}
            <Text as='h1' size='xl' align='right' weight='bold' color='loss-danger'>
                Test Header Components
            </Text>
        </div>
    </Theme>
));
