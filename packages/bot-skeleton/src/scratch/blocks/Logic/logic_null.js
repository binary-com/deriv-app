import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../utils';

Blockly.Blocks.logic_null = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            inputsInline: true,
            message0: 'null',
            output: null,
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block assigns a null value to an item or statement.'),
            category: Blockly.Categories.Logic,
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
    meta() {
        return {
            display_name: localize('Null'),
            description: localize('This block assigns a null value to an item or statement.'),
        };
    },
};
Blockly.JavaScript.javascriptGenerator.forBlock.logic_null = () => [
    'null',
    Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC,
];
