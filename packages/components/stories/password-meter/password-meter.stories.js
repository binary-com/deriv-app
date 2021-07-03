import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Basic from './stories/basic';
import HasError from './stories/has-error';
import notes from './README.md';
import './styles.scss';

const stories = storiesOf('Data Entry|Password.Meter', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add('Basic usage', Basic, { notes });
stories.add('Has Error', HasError, { notes });
