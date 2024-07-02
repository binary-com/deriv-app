import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../utils';

Blockly.Blocks.text = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: '%1',
            args0: [
                {
                    type: 'field_input',
                    name: 'TEXT',
                },
            ],
            inputsInline: true,
            output: 'String',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Enter some text here'),
            category: Blockly.Categories.Text,
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
    meta() {
        return {
            display_name: localize('Text'),
            description: localize('A  block that can contain text.'),
        };
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.text = block => {
    // eslint-disable-next-line no-underscore-dangle
    const code = Blockly.JavaScript.javascriptGenerator.quote_(block.getFieldValue('TEXT'));
    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
