import { localize } from '@deriv/translations';

Blockly.Blocks.controls_repeat_ext = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('repeat {{ number }} times', { number: '%1' }),
            args0: [
                {
                    type: 'input_value',
                    name: 'TIMES',
                    check: 'Number',
                },
            ],
            message1: localize('do %1'),
            args1: [
                {
                    type: 'input_statement',
                    name: 'DO',
                },
            ],
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            inputsInline: true,
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Repeats inside instructions specified number of times'),
            category: Blockly.Categories.Loop,
        };
    },
    meta() {
        return {
            display_name: localize('Repeat (2)'),
            description: localize(
                'This block is similar to the block above, except that the number of times it repeats is determined by a given variable.'
            ),
        };
    },
    getRequiredValueInputs() {
        return {
            TIMES: null,
        };
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.controls_repeat_ext = block => {
    let repeats;
    if (block.getField('TIMES')) {
        repeats = String(Number(block.getFieldValue('TIMES')));
    } else {
        repeats =
            Blockly.JavaScript.javascriptGenerator.valueToCode(
                block,
                'TIMES',
                Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
            ) || '0';
    }

    const branch = Blockly.JavaScript.javascriptGenerator.statementToCode(block, 'DO');
    let code = '';

    // eslint-disable-next-line no-underscore-dangle
    const loopVar = Blockly.JavaScript.variableDB_.getDistinctName('count', Blockly.Variables.CATEGORY_NAME);
    let endVar = repeats;

    if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
        // eslint-disable-next-line no-underscore-dangle
        endVar = Blockly.JavaScript.variableDB_.getDistinctName('repeat_end', Blockly.Variables.CATEGORY_NAME);
        code += `var ${endVar} = ${repeats};\n`;
    }

    code += `
    for (var ${loopVar} = 0; ${loopVar} < ${endVar}; ${loopVar}++) {
        ${branch}
    }\n`;
    return code;
};
