import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../utils';

Blockly.Blocks.math_constrain = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('constrain {{ number }} low {{ low_number }} high {{ high_number }}', {
                number: '%1',
                low_number: '%2',
                high_number: '%3',
            }),
            args0: [
                {
                    type: 'input_value',
                    name: 'VALUE',
                    check: 'Number',
                },
                {
                    type: 'input_value',
                    name: 'LOW',
                    check: 'Number',
                },
                {
                    type: 'input_value',
                    name: 'HIGH',
                    check: 'Number',
                },
            ],
            inputsInline: true,
            output: 'Number',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block constrains a given number so that it is within a set range.'),
            category: Blockly.Categories.Mathematical,
        };
    },
    meta() {
        return {
            display_name: localize('Constrain within a range'),
            description: localize('This block constrains a given number so that it is within a set range.'),
        };
    },
    getRequiredValueInputs() {
        return {
            VALUE: null,
            LOW: null,
            HIGH: null,
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.math_constrain = block => {
    const argument0 =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'VALUE',
            Blockly.JavaScript.javascriptGenerator.ORDER_COMMA
        ) || '0';
    const argument1 =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'LOW',
            Blockly.JavaScript.javascriptGenerator.ORDER_COMMA
        ) || '0';
    const argument2 =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'HIGH',
            Blockly.JavaScript.javascriptGenerator.ORDER_COMMA
        ) || '0';

    const code = `Math.min(Math.max(${argument0}, ${argument1}), ${argument2})`;
    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
};
