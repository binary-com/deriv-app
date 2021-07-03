import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Basic from './stories/basic';
import NoEmpty from './stories/no-empty';
import WithHelper from './stories/with-helper';
import HasError from './stories/has-error';
import Disabled from './stories/disabled';
import notes from './README.md';

const stories = storiesOf('Data Entry|Select/SelectNative', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories
    .add('Basic usage', Basic, { notes })
    .add('No empty option', NoEmpty, { notes })
    .add('With helper text', WithHelper, { notes })
    .add('Has Error', HasError, { notes })
    .add('Disabled', Disabled, { notes });
