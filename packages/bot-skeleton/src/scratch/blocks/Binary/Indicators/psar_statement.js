import { localize } from '@deriv/translations';

Blockly.Blocks.psar_statement = {
    protected_statements: ['STATEMENT'],
    required_child_blocks: ['candle_list'],
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('set {{ variable }} to Parabolic SAR {{ dummy }}', {
                variable: '%1',
                dummy: '%2',
            }),
            message1: '%1',
            args0: [
                {
                    type: 'field_variable',
                    name: 'VARIABLE',
                    variable: 'psar',
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
            tooltip: localize('Parabolic SAR from a list with a period'),
            previousStatement: null,
            nextStatement: null,
            category: Blockly.Categories.Indicators,
        };
    },
    meta() {
        return {
            display_name: localize('Parabolic SAR (PSAR)'),
            description: localize('Parabolic SAR description text'),
        };
    },
    onchange: Blockly.Blocks.bb_statement.onchange,
};

Blockly.JavaScript.psar_statement = block => {
    // eslint-disable-next-line no-underscore-dangle
    const var_name = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('VARIABLE'),
        Blockly.Variables.NAME_TYPE
    );
    const input = block.childValueToCode('candle_list', 'CANDLE_LIST');
    const code = `${var_name} = Bot.psar(${input});\n`;

    return code;
};
