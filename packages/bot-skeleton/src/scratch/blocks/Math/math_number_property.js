import { localize } from '@deriv/translations';
import { modifyContextMenu } from '../../utils';

Blockly.Blocks.math_number_property = {
    init() {
        this.jsonInit(this.definition());

        this.setOnChange(event => {
            if (event.name === 'PROPERTY') {
                const hasDivisorInput = this.getFieldValue('PROPERTY') === 'DIVISIBLE_BY';
                this.updateShape(hasDivisorInput);
            }
        });
    },
    definition() {
        return {
            message0: localize('{{ number }} is {{ type }}', {
                number: '%1',
                type: '%2',
            }),
            args0: [
                {
                    type: 'input_value',
                    name: 'NUMBER_TO_CHECK',
                },
                {
                    type: 'field_dropdown',
                    name: 'PROPERTY',
                    options: [
                        [localize('even'), 'EVEN'],
                        [localize('odd'), 'ODD'],
                        [localize('prime'), 'PRIME'],
                        [localize('whole'), 'WHOLE'],
                        [localize('positive'), 'POSITIVE'],
                        [localize('negative'), 'NEGATIVE'],
                        [localize('divisible by'), 'DIVISIBLE_BY'],
                    ],
                },
            ],
            output: 'Boolean',
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            toolip: localize('This block tests a given number according to the selection'),
            category: Blockly.Categories.Mathematical,
        };
    },
    meta() {
        return {
            display_name: localize('Test a number'),
            description: localize(
                'This block tests a given number according to the selection and it returns a value of “True” or “False”. Available options: Even, Odd, Prime, Whole, Positive, Negative, Divisible'
            ),
        };
    },
    domToMutation(xmlElement) {
        const hasDivisorInput = xmlElement.getAttribute('divisor_input') === 'true';
        this.updateShape(hasDivisorInput);
    },
    mutationToDom() {
        const container = document.createElement('mutation');
        const divisorInput = this.getFieldValue('PROPERTY') === 'DIVISIBLE_BY';
        container.setAttribute('divisor_input', divisorInput);
        return container;
    },
    updateShape(hasDivisorInput) {
        const inputExists = this.getInput('DIVISOR');

        if (hasDivisorInput) {
            if (!inputExists) {
                this.appendValueInput('DIVISOR').setCheck('Number');
                this.initSvg();
                //commented this line breaks the backward compatibility
                //this.render(false);
            }
        } else {
            //commented this line breaks the backward compatibiliy
            //this.removeInput('DIVISOR');
        }
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
    getRequiredValueInputs() {
        return {
            NUMBER_TO_CHECK: null,
        };
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.math_number_property = block => {
    const argument0 =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'NUMBER_TO_CHECK',
            Blockly.JavaScript.javascriptGenerator.ORDER_MODULUS
        ) || '0';
    const property = block.getFieldValue('PROPERTY');

    let code;

    if (property === 'PRIME') {
        // eslint-disable-next-line no-underscore-dangle
        const functionName = Blockly.JavaScript.javascriptGenerator.provideFunction_('mathIsPrime', [
            // eslint-disable-next-line no-underscore-dangle
            `function ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_}(n) {
                // https://en.wikipedia.org/wiki/Primality_test#Naive_methods
                if (n == 2 || n == 3) {
                    return true;
                }

                // False if n is NaN, negative, is 1, or not whole.
                // And false if n is divisible by 2 or 3.
                if (isNaN(n) || n <= 1 || n % 1 != 0 || n % 2 == 0 || n % 3 == 0) {
                    return false;
                }

                // Check all the numbers of form 6k +/- 1, up to sqrt(n).
                for (var x  = 6; x <= Math.sqrt(n) + 1; x += 6) {
                    if (n % (x - 1) == 0 || n % (x + 1) == 0) {
                        return false;
                    }
                }
                return true;
            }`,
        ]);
        code = `${functionName}(${argument0})`;
        return [code, Blockly.JavaScript.javascriptGenerator.ORDER_FUNCTION_CALL];
    } else if (property === 'EVEN') {
        code = `${argument0} % 2 === 0`;
    } else if (property === 'ODD') {
        code = `${argument0} % 2 === 1`;
    } else if (property === 'WHOLE') {
        code = `${argument0} % 1 === 0`;
    } else if (property === 'POSITIVE') {
        code = `${argument0} > 0`;
    } else if (property === 'NEGATIVE') {
        code = `${argument0} < 0`;
    } else if (property === 'DIVISIBLE_BY') {
        const divisor =
            Blockly.JavaScript.javascriptGenerator.valueToCode(
                block,
                'DIVISOR',
                Blockly.JavaScript.javascriptGenerator.ORDER_MODULUS
            ) || '0';
        code = `${argument0} % ${divisor} == 0`;
    }

    return [code, Blockly.JavaScript.javascriptGenerator.ORDER_EQUALITY];
};
