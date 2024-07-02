import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../utils';

Blockly.Blocks.math_arithmetic = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: '%1 %2 %3',
            args0: [
                {
                    type: 'input_value',
                    name: 'A',
                    check: 'Number',
                },
                {
                    type: 'field_dropdown',
                    name: 'OP',
                    options: [
                        ['+', 'ADD'],
                        ['-', 'MINUS'],
                        ['*', 'MULTIPLY'],
                        ['/', 'DIVIDE'],
                        ['^', 'POWER'],
                    ],
                },
                {
                    type: 'input_value',
                    name: 'B',
                    check: 'Number',
                },
            ],
            output: 'Number',
            inputsInline: true,
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block performs arithmetic operations between two numbers.'),
            category: Blockly.Categories.Mathematical,
        };
    },
    meta() {
        return {
            display_name: localize('Arithmetical operations'),
            description: localize('This block performs arithmetic operations between two numbers.'),
        };
    },
    getRequiredValueInputs() {
        return {
            A: null,
            B: null,
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.math_arithmetic = block => {
    const operators = {
        ADD: ['+', Blockly.JavaScript.javascriptGenerator.ORDER_ADDITION],
        MINUS: ['-', Blockly.JavaScript.javascriptGenerator.ORDER_SUBTRACTION],
        MULTIPLY: ['*', Blockly.JavaScript.javascriptGenerator.ORDER_MULTIPLICATION],
        DIVIDE: ['/', Blockly.JavaScript.javascriptGenerator.ORDER_DIVISION],
        POWER: [null, Blockly.JavaScript.javascriptGenerator.ORDER_COMMA], // Handle power separately.
    };

    const tuple = operators[block.getFieldValue('OP')];
    const operator = tuple[0];
    const order = tuple[1];

    const argument0 = Blockly.JavaScript.javascriptGenerator.valueToCode(block, 'A', order) || '0';
    const argument1 = Blockly.JavaScript.javascriptGenerator.valueToCode(block, 'B', order) || '0';

    let code;

    // Power in JavaScript requires a special case since it has no operator.
    if (!operator) {
        code = `Math.pow(${argument0}, ${argument1})`;
        return [code, Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
    }

    code = `${argument0} ${operator} ${argument1}`;
    return [code, order];
};
