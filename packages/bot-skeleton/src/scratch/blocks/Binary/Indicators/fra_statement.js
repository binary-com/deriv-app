import { localize } from '@deriv/translations';
import { config } from '../../../../constants/config';

Blockly.Blocks.fra_statement = {
    protected_statements: ['STATEMENT'],
    required_child_blocks: ['input_list', 'period'],
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('set %1 to Fractal Array %2 %3'),
            message1: '%1',
            args0: [
                {
                    type: 'field_variable',
                    name: 'VARIABLE',
                    variable: 'fra',
                },
                {
                    type: 'field_dropdown',
                    name: 'FRACTAL_RESULT',
                    options: config.fractalResult,
                },
                {
                    type: 'input_dummy',
                },
            ],
            args1: [
                {
                    type: 'input_statement',
                    name: 'STATEMENT',
                    check: null,
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Fractal Array from a list with a period'),
            previousStatement: null,
            nextStatement: null,
            category: Blockly.Categories.Indicators,
        };
    },
    meta() {
        return {
            display_name: localize('Fractal Array'),
            description: localize('Fractal Array description'),
        };
    },
    onchange: Blockly.Blocks.bb_statement.onchange,
};

Blockly.JavaScript.fra_statement = block => {
    // eslint-disable-next-line no-underscore-dangle
    const var_name = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VARIABLE'),
        Blockly.Variables.NAME_TYPE
    );
    const fr_result = block.getFieldValue('FRACTAL_RESULT');
    const input = block.childValueToCode('input_list', 'INPUT_LIST');
    const period = block.childValueToCode('period', 'PERIOD');
    const code = `${var_name} = Bot.fra(${input}, ${period}, ${fr_result});\n`;

    return code;
};
