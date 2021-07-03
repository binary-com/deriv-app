import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import InfoHint from './stories/InfoHint';
import NotInfoHint from './stories/NotInfoHint';
import notes from './README.md';

const stories = storiesOf('Data Display|HintBox', module);

stories.addDecorator(withInfo);
stories.addDecorator(withKnobs);

stories.add('Info Hint', InfoHint, { notes });
stories.add('Not Info Hint', NotInfoHint, { notes });
