import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Basic from './stories/basic';
import HasImage from './stories/has-image';
import HasRedirect from './stories/has-redirect';
import notes from './README.md';
import './styles.scss';

const stories = storiesOf('Feedback|PageError', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add('Basic usage', Basic, { notes });
stories.add('Has image', HasImage, { notes });
stories.add('Has redirect', HasRedirect, { notes });
