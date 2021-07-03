import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Basic from './stories/basic';
import IsDisabled from './stories/is-disabled';
import notes from './README.md';
import './styles.scss';

const stories = storiesOf('Other|SwipeableWrapper', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);
stories.addParameters({ viewport: { defaultViewport: 'mobile2' } });

stories.add('Basic usage', Basic, { notes });
stories.add('Is disabled', IsDisabled, { notes });
