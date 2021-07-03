import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Basic from './stories/basic';
import CenteredTabs from './stories/centered-tabs';
import FitedTabs from './stories/fited-tabs';
import HeaderFitedContent from './stories/header-fited-content';
import SingleTabNoLabel from './stories/single-tab-no-label';
import TabsOnBottom from './stories/tabs-on-bottom';
import TabsOnTop from './stories/tabs-on-top';
import notes from './README.md';
import './styles.scss';

const stories = storiesOf('Data Display|Tabs', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add('Basic usage', Basic, { notes });
stories.add('Tabs on top', TabsOnTop, { notes });
stories.add('Tabs on bottom', TabsOnBottom, { notes });
stories.add('Centered tabs', CenteredTabs, { notes });
stories.add('Fited tabs', FitedTabs, { notes });
stories.add('Header fited content', HeaderFitedContent, { notes });
stories.add('Single tab has no label', SingleTabNoLabel, { notes });
