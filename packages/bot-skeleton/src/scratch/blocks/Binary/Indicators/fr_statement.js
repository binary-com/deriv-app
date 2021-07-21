import { localize } from '@deriv/translations';
import { config } from '../../../../constants/config';

Blockly.Blocks.fr_statement = {
    protected_statements: ['STATEMENT'],
    required_child_blocks: ['candle_list'],
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('set {{ variable }} to Fractal {{ list }} {{ dummy }}', {
                variable: '%1',
                list: '%2',
                dummy: '%3',
            }),
            message1: '%1',
            args0: [
                {
                    type: 'field_variable',
                    name: 'VARIABLE',
                    variable: 'fr',
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
            tooltip: localize('Fractal from a list with a period'),
            previousStatement: null,
            nextStatement: null,
            category: Blockly.Categories.Indicators,
        };
    },
    meta() {
        return {
            display_name: localize('Fractal'),
            description: localize('Fractal description'),
        };
    },
    onchange: Blockly.Blocks.bb_statement.onchange,
};

Blockly.JavaScript.fr_statement = block => {
    // eslint-disable-next-line no-underscore-dangle
    const var_name = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VARIABLE'),
        Blockly.Variables.NAME_TYPE
    );
    const fr_result = block.getFieldValue('FRACTAL_RESULT');
    const input = block.childValueToCode('candle_list', 'CANDLE_LIST');
    const code = `${var_name} = Bot.fr(${input}, ${fr_result});\n`;

    return code;
};
