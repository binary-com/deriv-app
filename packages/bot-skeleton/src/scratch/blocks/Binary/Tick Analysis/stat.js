import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../../utils';

Blockly.Blocks.stat = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Current Stat'),
            output: 'Number',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns the Current Stat'),
            category: Blockly.Categories.Tick_Analysis,
        };
    },
    meta() {
        return {
            display_name: localize('Current Stat'),
            description: localize('This block gives you the Current Stat value.'),
        };
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.stat = () => [
    'Bot.getCurrentStat()',
    Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC,
];
