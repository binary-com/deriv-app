import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import notes from './README.md';
import notMultiplierCompleted from './stories/notMultiplier-completed';
import notMultiplierOpen from './stories/notMultiplier-open';
import multiplierOpen from './stories/multiplier-open';
import multiplierCompleted from './stories/multiplier-completed';

const stories = storiesOf('Platform UI|ContractCard', module);

stories.addDecorator(withInfo);
// stories.addDecorator(withKnobs);

stories.add('Multiplier Open', multiplierOpen, { notes });
stories.add('Multiplier Completed', multiplierCompleted, { notes });
stories.add('Not-Multiplier Open', notMultiplierOpen, { notes });
stories.add('Not-Multiplier Completed', notMultiplierCompleted, { notes });
