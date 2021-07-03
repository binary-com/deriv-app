import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Basic from './stories/basic';
import HasError from './stories/has-error';
import notes from './README.md';

const stories = storiesOf('Data Entry|Password.Input', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add('Basic usage', Basic, { notes });
stories.add('Has error', HasError, { notes });
