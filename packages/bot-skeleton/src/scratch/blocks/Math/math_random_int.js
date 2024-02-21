import { localize } from '@deriv/translations';

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
            output: 'Number',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('This block gives you a random number from within a set range'),
            category: Blockly.Categories.Mathematical,
        };
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

Blockly.JavaScript.math_random_int = block => {
    const argument0 = Blockly.JavaScript.valueToCode(block, 'FROM', Blockly.JavaScript.Order['COMMA']) || '0';
    const argument1 = Blockly.JavaScript.valueToCode(block, 'TO', Blockly.JavaScript.Order['COMMA']) || '0';
    
    // eslint-disable-next-line no-underscore-dangle
    const functionName = Blockly.JavaScript.provideFunction_('mathRandomInt', [`function ${'mathRandomInt'?.replace(/{|}/g, '')
        }(a, b) {
            if (a > b) {
                var c = a;
                a = b;
                b = c;
            }
            return Math.floor(Math.random() * (b - a + 1) + a);
        }`]);

    const code = `${functionName}(${argument0}, ${argument1})`;
    return [code, Blockly.JavaScript.Order['FUNCTION_CALL']];
};