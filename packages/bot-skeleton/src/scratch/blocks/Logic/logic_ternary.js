import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../utils';

Blockly.Blocks.logic_ternary = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('test {{ condition }}', { condition: '%1' }),
            message1: localize('if true {{ return_value }}', { return_value: '%1' }),
            message2: localize('if false {{ return_value }}', { return_value: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'IF',
                    check: 'Boolean',
                },
            ],
            args1: [
                {
                    type: 'input_value',
                    name: 'THEN',
                },
            ],
            args2: [
                {
                    type: 'input_value',
                    name: 'ELSE',
                },
            ],
            inputsInline: true,
            output: null,
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize(
                'This block tests if a given value is true or false and returns “True” or “False” accordingly.'
            ),
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
            display_name: localize('Test value'),
            description: localize(
                'This block tests if a given value is true or false and returns “True” or “False” accordingly.'
            ),
        };
    },
    getRequiredValueInputs() {
        return {
            IF: null,
            THEN: null,
            ELSE: null,
        };
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.logic_ternary = block => {
    const valueIf =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'IF',
            Blockly.JavaScript.javascriptGenerator.ORDER_CONDITIONAL
        ) || 'false';
    const valueThen =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'THEN',
            Blockly.JavaScript.javascriptGenerator.ORDER_CONDITIONAL
        ) || 'null';
    const valueElse =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'ELSE',
            Blockly.JavaScript.javascriptGenerator.ORDER_CONDITIONAL
        ) || 'null';

    const code = `(${valueIf} ? ${valueThen} : ${valueElse})`;
    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_CONDITIONAL];
};
