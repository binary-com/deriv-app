import goog from './goog.js';
import * as BlocklyJavaScript from 'blockly/javascript';
import { setColors } from './hooks/colours.js';

window.goog = goog;

export const loadBlockly = async isDarkMode => {
    const BlocklyModule = await import('blockly');
    window.Blockly = BlocklyModule.default;
    window.Blockly.Colours = {};
    const BlocklyGenerator = new Blockly.Generator('code');
    const BlocklyJavaScriptGenerator = {
        ...BlocklyJavaScript,
        ...BlocklyGenerator,
    };
    window.Blockly.JavaScript = BlocklyJavaScriptGenerator;
    window.Blockly.Themes.zelos_renderer = Blockly.Theme.defineTheme('zelos_renderer', {
        base: Blockly.Themes.Zelos,
        componentStyles: {},
    });
    const exclude_item = ['blockInline'];
    exclude_item.forEach(item_id => {
        const option = Blockly.ContextMenuRegistry.registry.getItem(item_id);
        option.preconditionFn = () => 'hidden';
    });
    setColors(isDarkMode);
    await import('./hooks');
    await import('./blocks');
};
