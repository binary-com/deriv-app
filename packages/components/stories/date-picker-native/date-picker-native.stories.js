import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Basic from './stories/basic';
import HasMinMax from './stories/has-min-max';
import HasError from './stories/has-error';
import Disabled from './stories/disabled';
import notes from './README.md';

const stories = storiesOf('Data Entry|Date/DatePickerNative', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);
stories.addParameters({ viewport: { defaultViewport: 'mobile2' } });

stories.add('Basic usage', Basic, { notes });
stories.add('Has min and max', HasMinMax, { notes });
stories.add('Has error', HasError, { notes });
stories.add('Disabled', Disabled, { notes });
