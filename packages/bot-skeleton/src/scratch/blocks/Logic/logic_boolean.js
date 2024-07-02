import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../utils';

Blockly.Blocks.logic_boolean = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: '%1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'BOOL',
                    options: [
                        [localize('true'), 'TRUE'],
                        [localize('false'), 'FALSE'],
                    ],
                },
            ],
            inputsInline: true,
            output: 'Boolean',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns either True or False'),
            category: Blockly.Categories.Logic,
        };
    },
    meta() {
        return {
            display_name: localize('True-False'),
            description: localize('This is a single block that returns a boolean value, either true or false.'),
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.logic_boolean = block => {
    const code = block.getFieldValue('BOOL') === 'TRUE' ? 'true' : 'false';
    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
