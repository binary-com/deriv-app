import { addons } from '@storybook/addons';
import '@storybook/addon-actions/register';
import '@storybook/addon-links/register';
import '@storybook/addon-notes/register';
import '@storybook/addon-knobs/register';
import '@storybook/addon-viewport/register';
import DerivTheme from './deriv';
import { addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

addDecorator(withInfo);
addons.setConfig({
    hierarchySeparator: /\//,
    hierarchyRootSeparator: /\|/,
    theme: DerivTheme,
});
