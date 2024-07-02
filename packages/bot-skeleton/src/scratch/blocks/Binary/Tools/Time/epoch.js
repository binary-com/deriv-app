import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../../../utils';

Blockly.Blocks.epoch = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Seconds Since Epoch'),
            output: 'Number',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns the number of seconds since January 1st, 1970'),
            category: Blockly.Categories.Time,
        };
    },
    meta() {
        return {
            display_name: localize('Second Since Epoch'),
            description: localize('This block returns the number of seconds since January 1st, 1970.'),
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.epoch = () => [
    'Bot.getTime()',
    Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC,
];
