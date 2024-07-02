import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../utils';

Blockly.Blocks.math_random_int = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('random integer from {{ start_number }} to {{ end_number }}', {
                start_number: '%1',
                end_number: '%2',
            }),
            args0: [
                {
                    type: 'input_value',
                    name: 'FROM',
                    check: 'Number',
                },
                {
                    type: 'input_value',
                    name: 'TO',
                    check: 'Number',
                },
            ],
            inputsInline: true,
            output: 'Number',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block gives you a random number from within a set range'),
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
            display_name: localize('Random integer'),
            description: localize('This block gives you a random number from within a set range.'),
        };
    },
    getRequiredValueInputs() {
        return {
            FROM: null,
            TO: null,
        };
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.math_random_int = block => {
    const argument0 =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'FROM',
            Blockly.JavaScript.javascriptGenerator.ORDER_COMMA
        ) || '0';
    const argument1 =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'TO',
            Blockly.JavaScript.javascriptGenerator.ORDER_COMMA
        ) || '0';

    // eslint-disable-next-line no-underscore-dangle
    const functionName = Blockly.JavaScript.javascriptGenerator.provideFunction_('mathRandomInt', [
        // eslint-disable-next-line no-underscore-dangle
        `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(a, b) {
            if (a > b) {
                // Swap a and b to ensure a is smaller.
                var c = a;
                a = b;
                b = c;
            }
            return Math.floor(Math.random() * (b - a + 1) + a);
        }`,
    ]);

    const code = `${functionName}(${argument0}, ${argument1})`;
    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
};
