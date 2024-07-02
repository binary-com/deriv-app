import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../utils';

Blockly.Blocks.math_number = {
    init() {
        this.jsonInit(this.definition());

        const fieldInput = this.getField('NUM');
        fieldInput.setValidator(input => this.numberValidator(input));
    },
    definition() {
        return {
            message0: '%1',
            args0: [
                {
                    type: 'field_number',
                    name: 'NUM',
                    value: 0,
                },
            ],
            output: 'Number',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Please use `.` as a decimal separator for fractional numbers.'),
            category: Blockly.Categories.Mathematical,
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
    meta() {
        return {
            display_name: localize('Number'),
            description: localize(
                'Enter an integer or fractional number into this block. Please use `.` as a decimal separator for fractional numbers.'
            ),
        };
    },
    numberValidator(input) {
        if (/^-?([0][.]|[0-9]+[.])?([0]|[1-9]){1,}$/.test(input) && input < Number.MAX_SAFE_INTEGER) {
            return undefined;
        }
        return null;
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.math_number = block => {
    const code = block.getFieldValue('NUM');
    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC];
};
