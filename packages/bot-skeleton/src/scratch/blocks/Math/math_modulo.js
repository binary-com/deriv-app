import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../utils';

Blockly.Blocks.math_modulo = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('remainder of {{ number1 }} ÷ {{ number2 }}', {
                number1: '%1',
                number2: '%2',
            }),
            args0: [
                {
                    type: 'input_value',
                    name: 'DIVIDEND',
                    check: 'Number',
                },
                {
                    type: 'input_value',
                    name: 'DIVISOR',
                    check: 'Number',
                },
            ],
            inputsInline: true,
            output: 'Number',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Returns the remainder after a division'),
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
            display_name: localize('Remainder after division'),
            description: localize('Returns the remainder after the division of the given numbers.'),
        };
    },
    getRequiredValueInputs() {
        return {
            DIVIDEND: null,
            DIVISOR: null,
        };
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.math_modulo = block => {
    const argument0 =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'DIVIDEND',
            Blockly.JavaScript.javascriptGenerator.ORDER_MODULUS
        ) || '0';
    const argument1 =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'DIVISOR',
            Blockly.JavaScript.javascriptGenerator.ORDER_MODULUS
        ) || '0';

    const code = `${argument0} % ${argument1}`;
    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_MODULUS];
};
