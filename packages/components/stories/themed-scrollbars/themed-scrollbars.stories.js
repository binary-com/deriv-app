import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Basic from './stories/basic';
import DisabledAutoHide from './stories/disabled-auto-hide';
import DisabledCustomScrollbar from './stories/disabled-custom-scrollbar';
import HasHorizontal from './stories/has-horizontal';
import OnlyHorizontal from './stories/only-horizontal';
import OnlyHorizontalOverlay from './stories/only-horizontal-overlay';
import notes from './README.md';

const stories = storiesOf('Layout|ThemedScrollbars', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add('Basic usage', Basic, { notes });
stories.add('Disabled auto hide', DisabledAutoHide, { notes });
stories.add('Disabled custom scrollbar', DisabledCustomScrollbar, { notes });
stories.add('Only horizontal', OnlyHorizontal, { notes });
stories.add('Only horizontal overlay', OnlyHorizontalOverlay, { notes });
stories.add('Has horizontal', HasHorizontal, { notes });
